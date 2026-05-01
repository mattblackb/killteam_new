import { useState } from "react";
import MemberCardShell from "./MemberCardShell";

export default function BattleMemberCard({
  member,
  armyId,
  onUpdateWounds,
  onOpenCard,
}) {
  const [expanded, setExpanded] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const isDead = member.currentWounds === 0;
  const soldierType = Array.isArray(member.tags) && member.tags.length > 0
    ? member.tags[0].replace(/-/g, " ")
    : "operative";

  const images = [member.imageDataUrl, member.secondImageDataUrl].filter(Boolean);
  const currentImageUrl = images[slideIndex] ?? images[0];

  function handleImageClick() {
    if (!expanded) {
      setExpanded(true);
      setSlideIndex(0);
    } else if (slideIndex === 0 && images.length > 1) {
      setSlideIndex(1);
    } else {
      setExpanded(false);
      setSlideIndex(0);
    }
  }

  return (
    <MemberCardShell className={`battle-member-card${isDead ? " is-dead" : ""}`}>
      <div className="battle-member-header">
        <div className="battle-member-meta">
          <h4>{member.operative}</h4>
          <p className="battle-member-type">{soldierType}</p>
          {member.memberNotes ? <p className="battle-member-note">{member.memberNotes}</p> : null}
          {isDead ? (
            <p className="casualty-label">Out of action</p>
          ) : null}
        </div>

        <div className="battle-wound-card" aria-label="Wound tracker">
          <p className="battle-wound-label">Wounds</p>
          <span className="battle-wound-value">
            {member.currentWounds}/{member.maxWounds}
          </span>
          <div className="battle-wound-controls">
            <button
              type="button"
              className="battle-wound-btn ghost"
              onClick={() => onUpdateWounds(armyId, member.id, -1)}
              disabled={isDead}
              aria-label={`Decrease wounds for ${member.operative}`}
            >
              -
            </button>
            <button
              type="button"
              className="battle-wound-btn"
              onClick={() => onUpdateWounds(armyId, member.id, 1)}
              disabled={member.currentWounds === member.maxWounds}
              aria-label={`Increase wounds for ${member.operative}`}
            >
              +
            </button>
          </div>
        </div>
      </div>

      {images.length > 0 ? (
        <div className={`battle-card-thumbnail${expanded ? " is-expanded" : ""}`}>
          <button
            type="button"
            className="battle-card-img-btn"
            onClick={handleImageClick}
            aria-label={expanded ? `Cycle ${member.operative} image` : `Expand ${member.operative} image`}
          >
            <img src={currentImageUrl} alt={`${member.operative} card`} loading="lazy" />
          </button>
          {expanded ? (
            <>
              {images.length > 1 ? (
                <span className="battle-card-dots" aria-hidden="true">
                  {images.map((_, i) => (
                    <span key={i} className={`battle-card-dot${i === slideIndex ? " is-active" : ""}`} />
                  ))}
                </span>
              ) : null}
              <button
                type="button"
                className="battle-card-open-btn"
                onClick={() => onOpenCard(member.id, currentImageUrl)}
                aria-label={`Open ${member.operative} full card`}
              >
                &#x2922;
              </button>
            </>
          ) : null}
        </div>
      ) : null}
    </MemberCardShell>
  );
}
