function PresetPreview({ pattern }) {
  return (
    <div className="preset-preview-grid">
      {pattern.map((span, i) => (
        <div key={i} className="preset-preview-cell" style={{ gridColumn: `span ${span}` }} />
      ))}
    </div>
  );
}

export default function LayoutPresetsModal({ isOpen, presets, onApplyPreset, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="card-modal-backdrop" onClick={onClose}>
      <div className="confirm-modal-panel presets-panel" onClick={(e) => e.stopPropagation()}>
        <h3>Choose Layout</h3>
        <p className="preset-subtitle">Apply a size to all widgets at once</p>
        <div className="preset-options">
          {presets.map((preset) => (
            <button
              key={preset.id}
              type="button"
              className="preset-option-btn"
              onClick={() => onApplyPreset(preset.id)}
            >
              <PresetPreview pattern={preset.pattern} />
              <strong>{preset.label}</strong>
              <span>{preset.desc}</span>
            </button>
          ))}
        </div>
        <button type="button" className="ghost" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
}