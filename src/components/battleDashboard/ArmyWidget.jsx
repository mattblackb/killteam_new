function MemberRow({ member, armyId, onUpdateWounds, onOpenCard, compact }) {
  const isDead = member.currentWounds === 0;
  const images = [member.imageDataUrl, member.secondImageDataUrl].filter(Boolean);

  return (
    <li className={`bd-member-row${isDead ? " is-dead" : ""}${compact ? " compact" : ""}`}>
      {images[0] && !compact ? (
        <button
          type="button"
          className="bd-member-thumb-btn"
          onClick={() => onOpenCard(member.id)}
          aria-label={`Open ${member.operative} card`}
        >
          <img src={images[0]} alt={member.operative} loading="lazy" />
        </button>
      ) : null}
      <div className="bd-member-info">
        <span className="bd-member-name">{member.operative}</span>
        {isDead ? <span className="bd-member-dead-label">Out of action</span> : null}
      </div>
      <div className="bd-wound-controls" aria-label="Wound tracker">
        <button
          type="button"
          className="ghost bd-wound-btn"
          onClick={() => onUpdateWounds(armyId, member.id, -1)}
          disabled={isDead}
          aria-label={`Reduce wounds for ${member.operative}`}
        >
          -
        </button>
        <span className={`bd-wound-value${isDead ? " dead" : ""}`}>
          {member.currentWounds}/{member.maxWounds}
        </span>
        <button
          type="button"
          className="bd-wound-btn"
          onClick={() => onUpdateWounds(armyId, member.id, 1)}
          disabled={member.currentWounds === member.maxWounds}
          aria-label={`Restore wounds for ${member.operative}`}
        >
          +
        </button>
      </div>
    </li>
  );
}

export default function ArmyWidget({ army, onUpdateCounter, onUpdateWounds, onOpenCard, size }) {
  const activeMembers = army.members.filter((member) => member.currentWounds > 0);
  const deadMembers = army.members.filter((member) => member.currentWounds === 0);
  const compact = size === "small";

  return (
    <div className="widget-content bd-army-widget">
      <div className="bd-army-widget-header">
        <div>
          <p className="widget-eyebrow">{army.armyTypeName}</p>
          <h3 className="widget-title">{army.armyName}</h3>
        </div>
        <div className="bd-army-widget-stats">
          <div className="bd-inline-counter">
            <span className="bd-counter-label">VP</span>
            <button
              type="button"
              className="ghost bd-small-btn"
              onClick={() => onUpdateCounter(army.id, "victoryPoints", -1)}
            >
              -
            </button>
            <span className="bd-counter-val">{army.victoryPoints}</span>
            <button
              type="button"
              className="bd-small-btn"
              onClick={() => onUpdateCounter(army.id, "victoryPoints", 1)}
            >
              +
            </button>
          </div>
          <div className="bd-inline-counter">
            <span className="bd-counter-label">CP</span>
            <button
              type="button"
              className="ghost bd-small-btn"
              onClick={() => onUpdateCounter(army.id, "commandPoints", -1)}
            >
              -
            </button>
            <span className="bd-counter-val">{army.commandPoints}</span>
            <button
              type="button"
              className="bd-small-btn"
              onClick={() => onUpdateCounter(army.id, "commandPoints", 1)}
            >
              +
            </button>
          </div>
        </div>
      </div>

      <ul className="bd-member-list">
        {activeMembers.map((member) => (
          <MemberRow
            key={member.id}
            member={member}
            armyId={army.id}
            onUpdateWounds={onUpdateWounds}
            onOpenCard={onOpenCard}
            compact={compact}
          />
        ))}
        {activeMembers.length === 0 ? (
          <li className="bd-empty-list">All operatives are casualties.</li>
        ) : null}
      </ul>

      {deadMembers.length > 0 ? (
        <>
          <p className="bd-casualties-heading">Casualties ({deadMembers.length})</p>
          <ul className="bd-member-list casualties">
            {deadMembers.map((member) => (
              <MemberRow
                key={member.id}
                member={member}
                armyId={army.id}
                onUpdateWounds={onUpdateWounds}
                onOpenCard={onOpenCard}
                compact={compact}
              />
            ))}
          </ul>
        </>
      ) : null}
    </div>
  );
}
