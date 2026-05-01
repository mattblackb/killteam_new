export default function SummaryWidget({ battleState }) {
  const armies = battleState?.armies ?? [];

  return (
    <div className="widget-content bd-summary-widget">
      <p className="widget-eyebrow">Overview</p>
      <h3 className="widget-title">Battle Summary</h3>
      <div className="bd-summary-rows">
        {armies.map((army) => {
          const alive = army.members.filter((member) => member.currentWounds > 0).length;
          const dead = army.members.filter((member) => member.currentWounds === 0).length;

          return (
            <div key={army.id} className="bd-summary-row">
              <span className="bd-summary-name">{army.armyName}</span>
              <div className="bd-summary-stats">
                <span className="bd-summary-stat">
                  <strong>{army.victoryPoints}</strong> VP
                </span>
                <span className="bd-summary-stat">
                  <strong>{army.commandPoints}</strong> CP
                </span>
                <span className="bd-summary-stat">
                  <strong>{alive}</strong> alive
                </span>
                {dead > 0 ? (
                  <span className="bd-summary-stat dead">
                    <strong>{dead}</strong> out
                  </span>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
