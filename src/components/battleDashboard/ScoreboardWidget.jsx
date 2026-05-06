const SCORE_FIELDS = [
  { key: "commandPoints", label: "CP", syncVictory: false },
  { key: "victoryPoints", label: "VP", syncVictory: false },
  { key: "primary", label: "Primary", syncVictory: true },
  { key: "critOps", label: "Crit Op", syncVictory: true },
  { key: "tacOps", label: "Tac Op", syncVictory: true },
  { key: "killOps", label: "Kill Op", syncVictory: true },
];

function clampScore(value) {
  return Math.max(0, Math.min(99, value));
}

export default function ScoreboardWidget({ battleState, onUpdateTurn, onUpdateCounter, size }) {
  const armies = battleState?.armies ?? [];
  const turnNumber = battleState?.turnNumber ?? 1;
  const compact = size === "small";
  const spacious = !compact;

  const applyDelta = (army, field, delta, syncVictory) => {
    const current = army[field] ?? 0;
    const next = clampScore(current + delta);
    const appliedDelta = next - current;

    if (appliedDelta === 0) {
      return;
    }

    onUpdateCounter(army.id, field, appliedDelta);

    if (syncVictory && field !== "victoryPoints") {
      onUpdateCounter(army.id, "victoryPoints", appliedDelta);
    }
  };

  return (
    <div className={`widget-content bd-scoreboard-widget${compact ? " compact" : " spacious"} size-${size}`}>
      <div className="bd-scoreboard-header">
        {compact ? (
          <div>
            <p className="widget-eyebrow">Battle</p>
            <h3 className="widget-title">Scoreboard</h3>
          </div>
        ) : null}
        <div className="bd-scoreboard-turn" aria-label="Turn tracker">
          <span className="bd-scoreboard-turn-label">Turn</span>
          <div className="bd-scoreboard-turn-controls">
            <button
              type="button"
              className="ghost bd-score-btn"
              onClick={() => onUpdateTurn(-1)}
              disabled={turnNumber <= 1}
              aria-label="Previous turn"
              title="Decrease turn"
            >
              -
            </button>
            <span className="bd-score-value turn">{turnNumber}</span>
            <button
              type="button"
              className="bd-score-btn"
              onClick={() => onUpdateTurn(1)}
              disabled={turnNumber >= 10}
              aria-label="Next turn"
              title="Increase turn"
            >
              +
            </button>
          </div>
        </div>
      </div>

      <div className={`bd-scoreboard-armies${armies.length === 1 ? " single" : ""}`}>
        {armies.map((army) => (
          <article key={army.id} className="bd-scoreboard-army">
            <header className="bd-scoreboard-army-head">
              <p className="bd-scoreboard-army-type">{army.armyTypeName}</p>
              <h4 className="bd-scoreboard-army-name">{army.armyName}</h4>
            </header>

            <ul className={`bd-scoreboard-list${spacious ? " grid" : ""}`}>
              {SCORE_FIELDS.map(({ key, label, syncVictory }) => {
                const score = army[key] ?? 0;
                const isCpRow = key === "commandPoints";
                const isPrimaryScore = key === "commandPoints" || key === "victoryPoints";
                const displayLabel = size === "large" && isCpRow ? "Command Point" : label;

                return (
                  <li
                    key={key}
                    className={`bd-scoreboard-row${isCpRow ? " cp-row" : ""}${isPrimaryScore ? " is-primary-score" : ""}`}
                  >
                    <span className="bd-score-label">{displayLabel}</span>
                    <div className="bd-score-controls">
                      <button
                        type="button"
                        className="ghost bd-score-btn"
                        onClick={() => applyDelta(army, key, -1, syncVictory)}
                        disabled={score <= 0}
                        aria-label={`Decrease ${label} for ${army.armyName}`}
                        title={`Decrease ${label}`}
                      >
                        -
                      </button>
                      <span className="bd-score-value">{score}</span>
                      <button
                        type="button"
                        className="bd-score-btn"
                        onClick={() => applyDelta(army, key, 1, syncVictory)}
                        disabled={score >= 99}
                        aria-label={`Increase ${label} for ${army.armyName}`}
                        title={`Increase ${label}`}
                      >
                        +
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </article>
        ))}
      </div>
    </div>
  );
}
