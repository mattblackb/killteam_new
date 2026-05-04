const OBJECTIVES = [
  { key: "primary", label: "Primary" },
  { key: "critOps", label: "Crit Op" },
  { key: "tacOps",  label: "Tac Op"  },
  { key: "killOps", label: "Kill Op" },
];

export default function ObjectivesWidget({ army, onUpdateCounter, size }) {
  const compact = size === "small";
  const objectiveGridClass = size === "large" ? "large" : "stacked";
  const commandPoints = army.commandPoints ?? 0;

  const applyObjectiveDelta = (field, delta) => {
    const current = army[field] ?? 0;
    const next = Math.max(0, Math.min(99, current + delta));
    const appliedDelta = next - current;

    if (appliedDelta === 0) {
      return;
    }

    onUpdateCounter(army.id, field, appliedDelta);
    onUpdateCounter(army.id, "victoryPoints", appliedDelta);
  };

  return (
    <div className="widget-content bd-objectives-widget">
      <div className="bd-objectives-header">
        <div>
          <p className="widget-eyebrow">{army.armyTypeName}</p>
          <h3 className="widget-title">{army.armyName}</h3>
        </div>
        <div className="bd-command-points" aria-label="Command points">
          <span className="bd-command-points-label">CP</span>
          <div className="bd-objective-controls">
            <button
              type="button"
              className="ghost bd-obj-btn"
              onClick={() => onUpdateCounter(army.id, "commandPoints", -1)}
              disabled={commandPoints <= 0}
              aria-label="Decrease command points"
            >
              −
            </button>
            <span className="bd-objective-score">{commandPoints}</span>
            <button
              type="button"
              className="bd-obj-btn"
              onClick={() => onUpdateCounter(army.id, "commandPoints", 1)}
              disabled={commandPoints >= 99}
              aria-label="Increase command points"
            >
              +
            </button>
          </div>
        </div>
      </div>
      <ul className={`bd-objectives-list ${objectiveGridClass}${compact ? " compact" : ""}`}>
        {OBJECTIVES.map(({ key, label }) => {
          const score = army[key] ?? 0;
          return (
            <li key={key} className="bd-objective-row">
              <span className="bd-objective-label">{label}</span>
              <div className="bd-objective-controls">
                <button
                  type="button"
                  className="ghost bd-obj-btn"
                  onClick={() => applyObjectiveDelta(key, -1)}
                  disabled={score <= 0}
                  aria-label={`Decrease ${label}`}
                >
                  −
                </button>
                <span className="bd-objective-score">{score}</span>
                <button
                  type="button"
                  className="bd-obj-btn"
                  onClick={() => applyObjectiveDelta(key, 1)}
                  disabled={score >= 99}
                  aria-label={`Increase ${label}`}
                >
                  +
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
