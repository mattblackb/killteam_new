import { useState } from "react";
import { ConfirmActionModal } from "../components/modals/AppModals";

export default function OverviewPage({
  formattedSavedArmies,
  selectedOverviewArmyIds,
  selectedOverviewArmies,
  onToggleSelection,
  onDeleteArmy,
  onStartNewArmy,
  onLaunchBattle,
  hasBuilderData,
}) {
  const [pendingModal, setPendingModal] = useState(null);

  const handleDeleteClick = (id) => {
    setPendingModal({ type: "delete", id });
  };

  const handleNewArmyClick = () => {
    if (hasBuilderData) {
      setPendingModal({ type: "newArmy" });
    } else {
      onStartNewArmy();
    }
  };

  const handleConfirm = () => {
    if (pendingModal?.type === "delete") {
      onDeleteArmy(pendingModal.id);
    } else if (pendingModal?.type === "newArmy") {
      onStartNewArmy();
    }
    setPendingModal(null);
  };

  const handleCancel = () => {
    setPendingModal(null);
  };

  return (
    <>
    <section className="panel overview-panel">
      <div className="overview-topbar">
        <h2>Saved Armies Overview</h2>
        <button type="button" onClick={handleNewArmyClick}>
          Create New Army
        </button>
      </div>

      {formattedSavedArmies.length === 0 ? (
        <p className="empty-state">No armies saved yet. Build one in the Builder screen first.</p>
      ) : (
        <ul className="saved-army-list">
          {formattedSavedArmies.map((army) => {
            const isSelected = selectedOverviewArmyIds.includes(army.id);
            return (
            <li key={army.id} className={`saved-army-item${isSelected ? " selected" : ""}`}>
              <div className="saved-army-header">
                <h3>{army.armyName}</h3>
                <p>
                  {army.armyTypeName} ({army.faction})
                </p>
              </div>
              <label className={`selection-toggle${isSelected ? " selected" : ""}`}>
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onToggleSelection(army.id)}
                />
                {isSelected ? "Selected for battle ✓" : "Select for battle"}
              </label>
              <p className="roster-meta">
                <strong>Members:</strong> {army.members.length}
              </p>
              <p className="roster-meta">
                <strong>Total Wounds:</strong>{" "}
                {army.members.reduce(
                  (total, member) => total + (typeof member.wounds === "number" ? member.wounds : 0),
                  0
                )}
              </p>
              <p className="roster-meta">
                <strong>Leader Count:</strong>{" "}
                {
                  army.members.filter(
                    (member) => Array.isArray(member.tags) && member.tags.includes("Leader")
                  ).length
                }
              </p>
              <p className="roster-meta">
                <strong>Saved:</strong> {army.savedAtLabel}
              </p>
              {army.armyNotes ? (
                <div className="saved-army-notes">
                  <p className="roster-meta"><strong>Notes</strong></p>
                  <pre>{army.armyNotes}</pre>
                </div>
              ) : null}
              <div className="saved-preview-row">
                {army.members.slice(0, 4).map((member) => (
                  <img
                    key={`${army.id}-${member.id}`}
                    src={member.imageDataUrl}
                    alt={`${member.operative} card`}
                    title={member.operative}
                    loading="lazy"
                  />
                ))}
              </div>
              <button
                type="button"
                className="danger"
                onClick={() => handleDeleteClick(army.id)}
              >
                Delete Army
              </button>
            </li>
            );
          })}
        </ul>
      )}

      <div className="battle-launcher">
        <p className="roster-meta">
          <strong>Selected:</strong> {selectedOverviewArmies.length} arm
          {selectedOverviewArmies.length === 1 ? "y" : "ies"}
        </p>
        <button
          type="button"
          onClick={onLaunchBattle}
          disabled={selectedOverviewArmies.length === 0 || selectedOverviewArmies.length > 2}
        >
          Start Battle View
        </button>
      </div>
    </section>

    <ConfirmActionModal
      isOpen={Boolean(pendingModal)}
      title={pendingModal?.type === "delete" ? "Delete Army?" : "Discard Builder Data?"}
      message={
        pendingModal?.type === "delete"
          ? "This cannot be undone."
          : "You have unsaved data in the Builder. Creating a new army will clear it. Continue?"
      }
      confirmLabel={pendingModal?.type === "delete" ? "Delete" : "Continue"}
      onClose={handleCancel}
      onConfirm={handleConfirm}
    />
    </>
  );
}
