export default function TurnWidget({ turnNumber, onUpdateTurn, size }) {
  return (
    <div className="widget-content bd-turn-widget">
      <p className="widget-eyebrow">Battle</p>
      <h3 className="widget-title">Turn Tracker</h3>
      <div className={`bd-turn-display ${size}`}>
        <button
          type="button"
          className="ghost bd-turn-btn"
          onClick={() => onUpdateTurn(-1)}
          aria-label="Previous turn"
        >
          -
        </button>
        <span className="bd-turn-number">{turnNumber}</span>
        <button
          type="button"
          className="bd-turn-btn"
          onClick={() => onUpdateTurn(1)}
          aria-label="Next turn"
        >
          +
        </button>
      </div>
    </div>
  );
}
