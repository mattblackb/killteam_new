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
          operative: member.operative,
          imageDataUrl: member.imageDataUrl,
          armyName: army.armyName,
        }))
    );
  }, [battleState]);

  const activeCardIndex = useMemo(
    () => viewableCards.findIndex((card) => card.id === activeCardId),
    [activeCardId, viewableCards]
  );

  const activeCard = activeCardIndex >= 0 ? viewableCards[activeCardIndex] : null;

  const closeCardModal = () => {
    setActiveCardId("");
    setActiveModalImageUrl("");
  };

  const openCardModal = (memberId, imageUrl) => {
    setActiveCardId(memberId);
    setActiveModalImageUrl(imageUrl || "");
  };

  const showNextCard = () => {
    if (!viewableCards.length || activeCardIndex < 0) {
      return;
    }

    const nextIndex = (activeCardIndex + 1) % viewableCards.length;
    setActiveCardId(viewableCards[nextIndex].id);
    setActiveModalImageUrl(viewableCards[nextIndex].imageDataUrl);
  };

  const showPreviousCard = () => {
    if (!viewableCards.length || activeCardIndex < 0) {
      return;
    }

    const previousIndex = (activeCardIndex - 1 + viewableCards.length) % viewableCards.length;
    setActiveCardId(viewableCards[previousIndex].id);
    setActiveModalImageUrl(viewableCards[previousIndex].imageDataUrl);
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

            <div className="card-modal-image-wrap">
              <img src={activeModalImageUrl || activeCard.imageDataUrl} alt={`${activeCard.operative} full card`} />
            </div>

            <div className="card-modal-footer">
              <button type="button" className="ghost" onClick={showPreviousCard}>
                Previous
              </button>
              <p className="roster-meta">
                Card {activeCardIndex + 1} / {viewableCards.length}
              </p>
              <button type="button" onClick={showNextCard}>
                Next
              </button>
            </div>
          </div>
        </section>
      ) : null}
    </section>
  );
}
