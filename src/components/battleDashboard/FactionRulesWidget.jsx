import { useState } from "react";
import { KILL_TEAM_ARMIES } from "../../data/killTeams";

export default function FactionRulesWidget({ army }) {
  const [expandedRules, setExpandedRules] = useState({});

  const killTeam = KILL_TEAM_ARMIES.find((kt) => kt.id === army.armyId);
  const factionRules = killTeam?.factionRules ?? [];

  const toggleRule = (id) => {
    setExpandedRules((current) => ({ ...current, [id]: !current[id] }));
  };

  return (
    <div className="widget-content bd-faction-rules-widget">
      <p className="widget-eyebrow">{army.armyTypeName}</p>
      <h3 className="widget-title">{army.armyName} — Faction Rules</h3>

      {factionRules.length === 0 ? (
        <p className="bd-faction-rules-empty">No faction rules available for this team.</p>
      ) : (
        <ul className="bd-faction-rules-list">
          {factionRules.map((rule) => (
            <li key={rule.id} className="bd-faction-rule-item">
              <button
                type="button"
                className="bd-faction-rule-header"
                onClick={() => toggleRule(rule.id)}
                aria-expanded={!!expandedRules[rule.id]}
              >
                <span className="bd-faction-rule-name">{rule.name}</span>
                <span className="bd-faction-rule-chevron" aria-hidden="true">
                  {expandedRules[rule.id] ? "▲" : "▼"}
                </span>
              </button>
              {expandedRules[rule.id] && rule.description ? (
                <p className="bd-faction-rule-desc">{rule.description}</p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
