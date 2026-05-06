import { useState } from "react";

const MAIN_STATES = [
  { key: "engaged", label: "Engage", description: "Bright red order while active." },
  { key: "concealed", label: "Conceal", description: "Bright blue order while active." },
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
          <circle cx="8" cy="8" r="2.2" fill="none" />
          <circle cx="8" cy="8" r="4.7" fill="none" />
          <path d="M8 1.2v2.2" />
          <path d="M8 12.6v2.2" />
          <path d="M1.2 8h2.2" />
          <path d="M12.6 8h2.2" />
        </svg>
      );
    case "concealed":
      return (
        <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
          <path d="M8 1.4c2.1 0 4 .9 5.4 2.4V8c0 3-1.9 5.3-5.4 6.6C4.5 13.3 2.6 11 2.6 8V3.8C4 2.3 5.9 1.4 8 1.4z" fill="none" />
          <path d="M5.3 8.1h5.4" />
          <path d="M6.2 10.3h3.6" />
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
      : "concealed");
  const selectedPosture = posture === "engaged" ? "engaged" : "concealed";
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

  const toggleActivation = () => {
    onUpdateMemberState(armyId, member.id, {
      activation: activation === "activated" ? "not-activated" : "activated",
    });
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
          {isDead ? <span className="bd-member-dead-label">Out of action</span> : null}
          {!isDead && (
            <div className="bd-member-actions" aria-label="Order and activation controls">
              <div className="bd-order-group" role="group" aria-label="Order selection">
                {MAIN_STATES.map(({ key, label, description }) => {
                  const isActiveOrder = selectedPosture === key;
                  const isSpent = isActiveOrder && activation === "activated";

                  return (
                  <button
                    key={key}
                    type="button"
                    className={`bd-order-token order-${key}${isActiveOrder ? " active" : ""}${isSpent ? " is-spent" : ""}`}
                    onClick={() => onUpdateMemberState(armyId, member.id, { posture: key })}
                    aria-label={`${label}. ${description}`}
                    aria-pressed={isActiveOrder}
                    title={description}
                  >
                    <span className="bd-order-icon" aria-hidden="true">
                      <StateIcon stateKey={key} />
                    </span>
                    {!compact ? <span className="bd-order-text">{label}</span> : null}
                  </button>
                  );
                })}
              </div>
              <button
                type="button"
                className={`bd-order-flip-btn${activation === "activated" ? " is-spent" : ""}`}
                onClick={toggleActivation}
                aria-label={activation === "activated" ? "Set operative to ready" : "Mark operative as APL spent"}
                title={activation === "activated" ? "Flip to ready side" : "Flip to spent side"}
              >
                {activation === "activated" ? "APL Spent" : "Ready"}
              </button>
            </div>
          )}
          {member.loadout ? (
            <div className="bd-member-loadout-line" title={member.loadout}>
              <span className="bd-member-loadout-line-label">Loadout:</span>
              <span className="bd-member-loadout-line-value">{member.loadout}</span>
            </div>
          ) : null}
          {!isDead && isInjured ? (
            <div className="bd-member-status-line">
              <span
                className="bd-injured-pill"
                data-tooltip="Injured: while below half wounds, this operative's APL is reduced by 1 (minimum 1)."
                title="Injured: while below half wounds, this operative's APL is reduced by 1 (minimum 1)."
                aria-label="Injured status. While below half wounds, this operative's APL is reduced by 1, minimum 1."
              >
                <span className="bd-injured-icon" aria-hidden="true">&#9888;</span> Injured -1 APL
              </span>
            </div>
          ) : null}
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
              title={isInjured ? `Current APL: ${effectiveApl}. Injured operatives reduce APL by 1 (minimum 1).` : `Current APL: ${effectiveApl}.`}
              aria-label={isInjured ? `Current APL ${effectiveApl}. Injured operatives reduce APL by 1, minimum 1.` : `Current APL ${effectiveApl}.`}
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
