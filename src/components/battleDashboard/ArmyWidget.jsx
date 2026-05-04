import { useState } from "react";

const MAIN_STATES = [
  { key: "ready", label: "Ready", description: "Can be activated this turning point." },
  { key: "engaged", label: "Engaged", description: "Visible and able to shoot and fight." },
  { key: "concealed", label: "Concealed", description: "Harder to target and playing stealth." },
  { key: "guard", label: "Guard", description: "Holding to react to enemy movement." },
];

const ACTIVATION_STATES = [
  { key: "not-activated", label: "Not Activated", description: "Has not yet acted this turning point." },
  { key: "activated", label: "Activated", description: "Already acted this turning point." },
];

function StateIcon({ stateKey }) {
  switch (stateKey) {
    case "ready":
      return (
        <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
          <circle cx="8" cy="8" r="4" />
        </svg>
      );
    case "not-activated":
      return (
        <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
          <circle cx="8" cy="8" r="4.7" fill="none" />
        </svg>
      );
    case "activated":
      return (
        <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
          <polygon points="8,1.5 9.8,6.2 14.8,6.2 10.8,9.2 12.4,14.5 8,11.2 3.6,14.5 5.2,9.2 1.2,6.2 6.2,6.2" />
        </svg>
      );
    case "engaged":
      return (
        <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
          <path d="M2.5 8h11" />
          <path d="M9.5 4.5L13 8l-3.5 3.5" />
        </svg>
      );
    case "concealed":
      return (
        <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
          <path d="M1.5 8c1.7-2.6 3.9-3.8 6.5-3.8S12.8 5.4 14.5 8c-1.7 2.6-3.9 3.8-6.5 3.8S3.2 10.6 1.5 8z" />
          <circle cx="8" cy="8" r="1.7" />
        </svg>
      );
    case "guard":
      return (
        <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
          <path d="M8 1.7l4.8 1.8v3.7c0 3-1.7 5.5-4.8 7.1-3.1-1.6-4.8-4.1-4.8-7.1V3.5L8 1.7z" />
        </svg>
      );
    default:
      return null;
  }
}

function MemberRow({
  member,
  armyId,
  onUpdateWounds,
  onUpdateMemberState,
  onOpenCard,
  compact,
  layoutMode,
}) {
  const isDead = member.currentWounds === 0;
  const images = [member.imageDataUrl, member.secondImageDataUrl].filter(Boolean);
  const posture =
    member.posture ??
    (member.state === "engaged" || member.state === "engaged-activated"
      ? "engaged"
      : member.state === "concealed"
        ? "concealed"
        : member.state === "guard"
          ? "guard"
          : "ready");
  const activation =
    member.activation ?? (member.state === "engaged-activated" ? "activated" : "not-activated");
  const hasWounds = typeof member.maxWounds === "number" && member.maxWounds > 0;
  const isInjured = !isDead && hasWounds && member.currentWounds < member.maxWounds / 2;
  const baseApl = typeof member.apl === "number" ? member.apl : null;
  const effectiveApl = baseApl == null ? null : Math.max(1, baseApl - (isInjured ? 1 : 0));
  const [previewExpanded, setPreviewExpanded] = useState(false);
  const [previewSlideIndex, setPreviewSlideIndex] = useState(0);
  const previewImage = images[previewSlideIndex] ?? images[0];

  const handlePreviewToggle = () => {
    if (!images.length) {
      return;
    }
    if (!previewExpanded) {
      setPreviewExpanded(true);
      setPreviewSlideIndex(0);
      return;
    }
    if (previewSlideIndex === 0 && images.length > 1) {
      setPreviewSlideIndex(1);
      return;
    }
    setPreviewExpanded(false);
    setPreviewSlideIndex(0);
  };

  return (
    <li className={`bd-member-row${isDead ? " is-dead" : ""}${compact ? " compact" : ""}${layoutMode === "b" ? " layout-b" : ""}`}>
      <div className="bd-member-row-main">
        {images[0] && !compact && layoutMode !== "b" ? (
          <button
            type="button"
            className={`bd-member-thumb-btn${layoutMode === "c" ? " layout-c" : ""}`}
            onClick={() => onOpenCard(member.id)}
            aria-label={`Open ${member.operative} card`}
          >
            <img src={images[0]} alt={member.operative} loading="lazy" />
          </button>
        ) : null}
        <div className="bd-member-info">
          <span className="bd-member-name">{member.operative}</span>
          {member.loadout ? (
            <div className="bd-member-loadout-box">
              <span className="bd-member-loadout-title">Chosen Loadout</span>
              <span className="bd-member-loadout-value">{member.loadout}</span>
            </div>
          ) : null}
          {!isDead && isInjured ? (
            <div className="bd-member-status-line">
              <span className="bd-injured-pill">Injured</span>
            </div>
          ) : null}
          {isDead ? <span className="bd-member-dead-label">Out of action</span> : null}
          {!isDead && (
            <div className="bd-member-states">
              <div className="bd-state-group" aria-label="Main state">
                {MAIN_STATES.map(({ key, label, description }) => (
                  <button
                    key={key}
                    type="button"
                    className={`bd-state-pill main-${key}${posture === key ? " active" : ""}`}
                    onClick={() => onUpdateMemberState(armyId, member.id, { posture: key })}
                    aria-label={`${label}. ${description}`}
                    aria-pressed={posture === key}
                  >
                    <span className="bd-state-icon" aria-hidden="true">
                      <StateIcon stateKey={key} />
                    </span>
                    {!compact ? <span className="bd-state-text">{label}</span> : null}
                    <span className="bd-state-tooltip" role="tooltip">
                      <strong>{label}</strong>
                      <span>{description}</span>
                    </span>
                  </button>
                ))}
              </div>
              <div className="bd-state-group" aria-label="Activation state">
                {ACTIVATION_STATES.map(({ key, label, description }) => (
                  <button
                    key={key}
                    type="button"
                    className={`bd-state-pill activation-${key}${activation === key ? " active" : ""}`}
                    onClick={() => onUpdateMemberState(armyId, member.id, { activation: key })}
                    aria-label={`${label}. ${description}`}
                    aria-pressed={activation === key}
                  >
                    <span className="bd-state-icon" aria-hidden="true">
                      <StateIcon stateKey={key} />
                    </span>
                    {!compact ? <span className="bd-state-text">{label}</span> : null}
                    <span className="bd-state-tooltip" role="tooltip">
                      <strong>{label}</strong>
                      <span>{description}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="bd-wound-controls" aria-label="Wound tracker">
          <div className="bd-wound-row">
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
          {!isDead && effectiveApl != null ? (
            <span
              className={`bd-apl-display${isInjured ? " is-injured" : ""}`}
              title={isInjured ? "APL reduced by 1 while injured" : "Current APL"}
            >
              <span className="bd-apl-display-label">APL</span>
              <span className="bd-apl-display-value">{effectiveApl}</span>
            </span>
          ) : null}
        </div>
      </div>
      {layoutMode === "b" && !isDead && images[0] ? (
        <div className={`bd-inline-card-preview${previewExpanded ? " is-expanded" : ""}`}>
          <button
            type="button"
            className="bd-inline-card-preview-btn"
            onClick={handlePreviewToggle}
            aria-label={previewExpanded ? `Cycle ${member.operative} card` : `Expand ${member.operative} card`}
          >
            <img src={previewImage} alt={`${member.operative} card`} loading="lazy" />
          </button>
          {previewExpanded ? (
            <>
              {images.length > 1 ? (
                <span className="bd-inline-card-preview-dots" aria-hidden="true">
                  {images.map((_, i) => (
                    <span key={i} className={`bd-inline-card-preview-dot${i === previewSlideIndex ? " is-active" : ""}`} />
                  ))}
                </span>
              ) : null}
              <button
                type="button"
                className="bd-inline-card-preview-open-btn"
                onClick={() => onOpenCard(member.id)}
                aria-label={`Open ${member.operative} full card`}
              >
                &#x2922;
              </button>
            </>
          ) : null}
        </div>
      ) : null}
    </li>
  );
}

export default function ArmyWidget({
  army,
  onUpdateCounter,
  onUpdateWounds,
  onUpdateMemberState,
  onOpenCard,
  size,
  layoutMode = "a",
}) {
  const activeMembers = army.members.filter((member) => member.currentWounds > 0);
  const deadMembers = army.members.filter((member) => member.currentWounds === 0);
  const compact = size === "small";

  const startNewTurn = () => {
    activeMembers.forEach((member) => {
      onUpdateMemberState(army.id, member.id, { activation: "not-activated" });
    });
  };

  return (
    <div className="widget-content bd-army-widget">
      <div className="bd-army-widget-header">
        <div>
          <p className="widget-eyebrow">{army.armyTypeName}</p>
          <h3 className="widget-title">{army.armyName}</h3>
        </div>
        <div className="bd-army-widget-stats">
          {/* <div className="bd-inline-counter">
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
          </div> */}
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
          {/* <button
            type="button"
            className="ghost bd-new-turn-btn"
            onClick={startNewTurn}
            title="Reset all operatives to Ready"
          >
            New Turn
          </button> */}
        </div>
      </div>

      <ul className="bd-member-list">
        {activeMembers.map((member) => (
          <MemberRow
            key={member.id}
            member={member}
            armyId={army.id}
            onUpdateWounds={onUpdateWounds}
            onUpdateMemberState={onUpdateMemberState}
            onOpenCard={onOpenCard}
            compact={compact}
            layoutMode={layoutMode}
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
                onUpdateMemberState={onUpdateMemberState}
                onOpenCard={onOpenCard}
                compact={compact}
                layoutMode={layoutMode}
              />
            ))}
          </ul>
        </>
      ) : null}
    </div>
  );
}
