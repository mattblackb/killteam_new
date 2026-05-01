import BattleMemberCard from "./BattleMemberCard";

export default function BattleArmyCard({
  army,
  onUpdateCounter,
  onUpdateWounds,
  onOpenCard,
}) {
  const activeMembers = army.members.filter((member) => member.currentWounds > 0);
  const deadMembers = army.members.filter((member) => member.currentWounds === 0);

  return (
    <article className="panel battle-army-card">
      <div className="saved-army-header">
        <h3>{army.armyName}</h3>
        <p>{army.armyTypeName} ({army.faction})</p>
      </div>

      <div className="battle-score-grid">
        <div className="battle-counter-card">
          <p className="roster-meta"><strong>Victory Points</strong></p>
          <div className="counter-row">
            <button
              type="button"
              className="ghost"
              onClick={() => onUpdateCounter(army.id, "victoryPoints", -1)}
            >
              -
            </button>
            <span className="counter-value">{army.victoryPoints}</span>
            <button
              type="button"
              onClick={() => onUpdateCounter(army.id, "victoryPoints", 1)}
            >
              +
            </button>
          </div>
        </div>

        <div className="battle-counter-card">
          <p className="roster-meta"><strong>Command Points</strong></p>
          <div className="counter-row">
            <button
              type="button"
              className="ghost"
              onClick={() => onUpdateCounter(army.id, "commandPoints", -1)}
            >
              -
            </button>
            <span className="counter-value">{army.commandPoints}</span>
            <button
              type="button"
              onClick={() => onUpdateCounter(army.id, "commandPoints", 1)}
            >
              +
            </button>
          </div>
        </div>
      </div>

      <ul className="battle-member-list">
        {activeMembers.map((member) => (
          <BattleMemberCard
            key={member.id}
            member={member}
            armyId={army.id}
            onUpdateWounds={onUpdateWounds}
            onOpenCard={onOpenCard}
          />
        ))}
        {activeMembers.length === 0 ? (
          <li className="empty-state">All operatives are casualties.</li>
        ) : null}
      </ul>

      {deadMembers.length > 0 ? (
        <>
          <h4 className="battle-casualties-heading">Casualties ({deadMembers.length})</h4>
          <ul className="battle-member-list">
            {deadMembers.map((member) => (
              <BattleMemberCard
                key={member.id}
                member={member}
                armyId={army.id}
                onUpdateWounds={onUpdateWounds}
                onOpenCard={onOpenCard}
              />
            ))}
          </ul>
        </>
      ) : null}
    </article>
  );
}
