import { useMemo, useState } from "react";
import BattleArmyCard from "../components/BattleArmyCard";

export default function BattlePage({
  battleState,
  onUpdateTurn,
  onUpdateCounter,
  onUpdateWounds,
  onResetBattle,
  onEndBattle,
  onGoToOverview,
}) {
  const [activeCardId, setActiveCardId] = useState("");
  const [activeModalImageUrl, setActiveModalImageUrl] = useState("");

  const viewableCards = useMemo(() => {
    if (!battleState || !Array.isArray(battleState.armies)) {
      return [];
    }

    return battleState.armies.flatMap((army) =>
      (Array.isArray(army.members) ? army.members : [])
        .filter((member) => member.imageDataUrl)
        .map((member) => ({
          id: member.id,
          armyId: army.id,
          operative: member.operative,
          imageDataUrl: member.imageDataUrl,
          memberNotes: member.memberNotes || "",
          armyName: army.armyName,
        }))
    );
  }, [battleState]);

  const activeCardIndex = useMemo(
    () => viewableCards.findIndex((card) => card.id === activeCardId),
    [activeCardId, viewableCards]
  );

  const activeCard = activeCardIndex >= 0 ? viewableCards[activeCardIndex] : null;
  const armyCards = activeCard ? viewableCards.filter((card) => card.armyId === activeCard.armyId) : [];
  const activeArmyCardIndex = activeCard ? armyCards.findIndex((card) => card.id === activeCard.id) : -1;

  const closeCardModal = () => {
    setActiveCardId("");
    setActiveModalImageUrl("");
  };

  const openCardModal = (memberId, imageUrl) => {
    setActiveCardId(memberId);
    setActiveModalImageUrl(imageUrl || "");
  };

  const showNextCard = () => {
    if (!activeCard || armyCards.length === 0 || activeArmyCardIndex < 0) {
      return;
    }

    const nextIndex = (activeArmyCardIndex + 1) % armyCards.length;
    setActiveCardId(armyCards[nextIndex].id);
    setActiveModalImageUrl(armyCards[nextIndex].imageDataUrl);
  };

  const showPreviousCard = () => {
    if (!activeCard || armyCards.length === 0 || activeArmyCardIndex < 0) {
      return;
    }

    const previousIndex = (activeArmyCardIndex - 1 + armyCards.length) % armyCards.length;
    setActiveCardId(armyCards[previousIndex].id);
    setActiveModalImageUrl(armyCards[previousIndex].imageDataUrl);
  };

  if (!battleState) {
    return (
      <section className="battle-panel">
        <section className="panel overview-panel">
          <h2>No active battle</h2>
          <p className="intro">Select one or two saved armies in Overview to launch the tracker.</p>
          <button type="button" onClick={onGoToOverview}>
            Go To Overview
          </button>
        </section>
      </section>
    );
  }

  return (
    <section className="battle-panel">
      <section className="panel battle-topbar">
        <div>
          <p className="eyebrow">Battle Tracker</p>
          <h2>{battleState.armies.length === 1 ? "Single Army View" : "Split Battle View"}</h2>
        </div>
        <div className="battle-actions">
          <button type="button" className="ghost" onClick={onEndBattle}>
            Back To Overview
          </button>
          <button type="button" onClick={onResetBattle}>
            Reset Battle
          </button>
        </div>
      </section>

      <section className="panel turn-tracker">
        <p className="roster-meta"><strong>Turn Number</strong></p>
        <div className="counter-row">
          <button type="button" className="ghost" onClick={() => onUpdateTurn(-1)}>
            -
          </button>
          <span className="counter-value">{battleState.turnNumber}</span>
          <button type="button" onClick={() => onUpdateTurn(1)}>
            +
          </button>
        </div>
      </section>

      <section
        className={`battle-grid ${battleState.armies.length === 1 ? "single-army" : "split-armies"}`}
      >
        {battleState.armies.map((army) => (
          <BattleArmyCard
            key={army.id}
            army={army}
            onUpdateCounter={onUpdateCounter}
            onUpdateWounds={onUpdateWounds}
            onOpenCard={openCardModal}
          />
        ))}
      </section>

      {activeCard ? (
        <section
          className="card-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label="Operative card viewer"
          onClick={closeCardModal}
        >
          <div className="card-modal-panel" onClick={(event) => event.stopPropagation()}>
            <div className="card-modal-header">
              <div>
                <h3>{activeCard.operative}</h3>
                <p className="roster-meta">{activeCard.armyName}</p>
              </div>
              <button type="button" className="ghost" onClick={closeCardModal}>
                Close
              </button>
            </div>

            {activeCard.memberNotes ? (
              <div className="card-modal-notes" aria-label="Operative notes">
                <p className="roster-meta"><strong>Notes</strong></p>
                <p>{activeCard.memberNotes}</p>
              </div>
            ) : null}

            <div className="card-modal-image-wrap">
              <img src={activeModalImageUrl || activeCard.imageDataUrl} alt={`${activeCard.operative} full card`} />
            </div>

            <div className="card-modal-footer">
              <button type="button" className="ghost" onClick={showPreviousCard} disabled={armyCards.length <= 1}>
                Previous
              </button>
              <p className="roster-meta">
                Card {activeArmyCardIndex + 1} / {armyCards.length}
              </p>
              <button type="button" onClick={showNextCard} disabled={armyCards.length <= 1}>
                Next
              </button>
            </div>
          </div>
        </section>
      ) : null}
    </section>
  );
}
