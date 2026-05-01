export default function AddWidgetModal({ isOpen, options, onAddWidget, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="card-modal-backdrop" onClick={onClose}>
      <div className="confirm-modal-panel widget-picker-panel" onClick={(e) => e.stopPropagation()}>
        <h3>Add Widget</h3>
        <p className="preset-subtitle">Choose a widget to place back on the board</p>
        {options.length > 0 ? (
          <div className="widget-picker-list">
            {options.map((option) => (
              <button
                key={option.id}
                type="button"
                className="widget-picker-item"
                onClick={() => onAddWidget(option.id)}
              >
                <strong>{option.name}</strong>
                <span>{option.description}</span>
              </button>
            ))}
          </div>
        ) : (
          <p className="roster-meta">All available widgets are already on the board.</p>
        )}
        <button type="button" className="ghost" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}