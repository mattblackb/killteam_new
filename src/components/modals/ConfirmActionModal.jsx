export default function ConfirmActionModal({
  isOpen,
  title,
  message,
  confirmLabel,
  onConfirm,
  onClose,
  confirmClassName = "danger",
}) {
  if (!isOpen) return null;

  return (
    <div className="card-modal-backdrop" onClick={onClose}>
      <div className="confirm-modal-panel" onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="button-row">
          <button type="button" className="ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className={confirmClassName} onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}