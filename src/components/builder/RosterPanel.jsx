import ArmyMemberCard from "../ArmyMemberCard";

export default function RosterPanel({
  members,
  armyName,
  armyNotes,
  selectedArmy,
  onRemoveMember,
  onSaveArmy,
  onGoToOverview,
  onDeleteArmy,
}) {
  return (
    <section className="panel roster-panel">
      <h2>Current Roster</h2>
      <p className="roster-meta">
        <strong>Army:</strong> {selectedArmy.name}
      </p>
      <p className="roster-meta">
        <strong>Roster Name:</strong> {armyName.trim() || "Not named yet"}
      </p>
      {armyNotes.trim() ? (
        <div className="roster-notes-block">
          <p className="roster-meta"><strong>Notes</strong></p>
          <pre className="roster-notes-preview">{armyNotes}</pre>
        </div>
      ) : null}

      <div className="button-row roster-actions">
        <button type="button" onClick={onSaveArmy}>
          Save Army
        </button>
        <button type="button" className="ghost" onClick={onGoToOverview}>
          Go To Dashboard
        </button>
        <button type="button" className="roster-delete-btn" onClick={onDeleteArmy}>
          Delete Army
        </button>
      </div>

      {members.length === 0 ? (
        <p className="empty-state">No operatives added yet.</p>
      ) : (
        <ul className="member-list">
          {members.map((member) => (
            <ArmyMemberCard key={member.id} member={member} onRemoveMember={onRemoveMember} />
          ))}
        </ul>
      )}
    </section>
  );
}
