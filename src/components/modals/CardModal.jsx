import { useState } from "react";

export default function CardModal({ allCards, activeId, onClose }) {
  const index = allCards.findIndex((c) => c.id === activeId);
  const card = index >= 0 ? allCards[index] : null;
  const [imageUrl, setImageUrl] = useState(() => card?.imageDataUrl ?? "");

  if (!card) return null;

  const go = (delta) => {
    const next = allCards[(index + delta + allCards.length) % allCards.length];
    setImageUrl(next.imageDataUrl);
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
        <div className="card-modal-image-wrap">
          <img src={imageUrl || card.imageDataUrl} alt={`${card.operative} full card`} />
        </div>
        <div className="card-modal-footer">
          <button type="button" className="ghost" onClick={() => go(-1)}>
            Previous
          </button>
          <p className="roster-meta">
            Card {index + 1} / {allCards.length}
          </p>
          <button type="button" onClick={() => go(1)}>
            Next
          </button>
        </div>
      </div>
    </section>
  );
}