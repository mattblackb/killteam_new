import { useState } from "react";

export default function ArmyStrategySection({
  selectedArmy,
}) {
  const [expandedRules, setExpandedRules] = useState({});

  const toggleRuleExpand = (id) => {
    setExpandedRules((current) => ({ ...current, [id]: !current[id] }));
  };

  const factionRules = selectedArmy.factionRules ?? [];

  return (
    <>
      <div className="strategy-section">
        <h3 className="strategy-subheading">Faction Rules</h3>
        {factionRules.length === 0 ? (
          <p className="strategy-empty">
            No faction rules added yet. Add them to <code>killTeams.js</code> under{" "}
            <code>factionRules</code> for <strong>{selectedArmy.name}</strong>.
          </p>
        ) : (
          <ul className="strategy-rule-list">
            {factionRules.map((rule) => (
              <li key={rule.id} className="strategy-rule-item">
                <button
                  type="button"
                  className="strategy-rule-header"
                  onClick={() => toggleRuleExpand(rule.id)}
                  aria-expanded={!!expandedRules[rule.id]}
                >
                  <span className="strategy-rule-name">{rule.name}</span>
                  <span className="strategy-chevron">
                    {expandedRules[rule.id] ? "▲" : "▼"}
                  </span>
                </button>
                {expandedRules[rule.id] && rule.description ? (
                  <p className="strategy-rule-desc">{rule.description}</p>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
