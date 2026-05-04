import { useEffect, useState } from "react";

export default function CardModal({ allCards, activeId, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(() => allCards.findIndex((c) => c.id === activeId));

  useEffect(() => {
    setCurrentIndex(allCards.findIndex((c) => c.id === activeId));
  }, [allCards, activeId]);

  const index = currentIndex >= 0 ? currentIndex : allCards.findIndex((c) => c.id === activeId);
  const card = index >= 0 ? allCards[index] : null;
  const scopedCards = card ? allCards.filter((c) => c.armyId === card.armyId) : [];
  const scopedIndex = card ? scopedCards.findIndex((c) => c.id === card.id) : -1;

  if (!card) return null;

  const go = (delta) => {
    if (scopedCards.length <= 1 || scopedIndex < 0) {
      return;
    }
    setCurrentIndex((prev) => {
      const current = prev >= 0 ? allCards[prev] : card;
      const currentArmyCards = allCards.filter((c) => c.armyId === current.armyId);
      const currentArmyIndex = currentArmyCards.findIndex((c) => c.id === current.id);
      if (currentArmyIndex < 0) {
        return prev;
      }
      const nextArmyIndex = (currentArmyIndex + delta + currentArmyCards.length) % currentArmyCards.length;
      const nextCard = currentArmyCards[nextArmyIndex];
      return allCards.findIndex((c) => c.id === nextCard.id);
    });
  };

  return (
    <section
      className="card-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="Operative card viewer"
      onClick={onClose}
    >
      <div className="card-modal-panel" onClick={(e) => e.stopPropagation()}>
        <div className="card-modal-header">
          <div>
            <h3>{card.operative}</h3>
            <p className="roster-meta">{card.armyName}</p>
          </div>
          <button type="button" className="ghost" onClick={onClose}>
            Close
          </button>
        </div>
        {card.memberNotes ? (
          <div className="card-modal-notes" aria-label="Operative notes">
            <p className="roster-meta"><strong>Notes</strong></p>
            <p>{card.memberNotes}</p>
          </div>
        ) : null}
        <div className="card-modal-image-wrap">
          <img src={card.imageDataUrl} alt={`${card.operative} full card`} />
        </div>
        <div className="card-modal-footer">
          <button
            type="button"
            className="ghost"
            onClick={() => go(-1)}
            disabled={scopedCards.length <= 1}
          >
            Previous
          </button>
          <p className="roster-meta">
            Card {scopedIndex + 1} / {scopedCards.length}
          </p>
          <button type="button" onClick={() => go(1)} disabled={scopedCards.length <= 1}>
            Next
          </button>
        </div>
      </div>
    </section>
  );
}