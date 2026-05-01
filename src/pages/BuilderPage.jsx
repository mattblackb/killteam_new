import { KILL_TEAM_ARMIES } from "../data/killTeams";
import StatChips from "../components/StatChips";
import ArmyMemberCard from "../components/ArmyMemberCard";
import { formatTags } from "../utils/helpers";

export default function BuilderPage({
  armyId,
  setArmyId,
  armyName,
  setArmyName,
  armyNotes,
  setArmyNotes,
  memberName,
  setMemberName,
  memberNotes,
  setMemberNotes,
  cardFile,
  setCardFile,
  cardFile2,
  setCardFile2,
  members,
  error,
  saveArmyMessage,
  saving,
  selectedArmy,
  selectedOperative,
  onAddMember,
  onRemoveMember,
  onClearRoster,
  onSaveArmy,
  onGoToOverview,
}) {
  return (
    <section className="builder-grid">
      <form className="panel" onSubmit={onAddMember}>
        <h2>Army Setup</h2>

        <label htmlFor="army-select">Kill Team Army</label>
        <select
          id="army-select"
          value={armyId}
          onChange={(e) => setArmyId(e.target.value)}
        >
          {KILL_TEAM_ARMIES.map((army) => (
            <option key={army.id} value={army.id}>
              {army.name} ({army.faction})
            </option>
          ))}
        </select>

        <label htmlFor="army-name">Army Name</label>
        <input
          id="army-name"
          type="text"
          placeholder="e.g. The Ash Vultures"
          value={armyName}
          onChange={(e) => setArmyName(e.target.value)}
          maxLength={60}
        />

        <label htmlFor="army-notes">Army Notes</label>
        <textarea
          id="army-notes"
          className="army-notes-input"
          value={armyNotes}
          onChange={(e) => setArmyNotes(e.target.value)}
          placeholder="Mission plan, tac ops reminders, deployment notes..."
          rows={5}
          maxLength={1200}
        />

        <h2>Add Member</h2>

        <label htmlFor="member-select">Operative</label>
        <select
          id="member-select"
          value={memberName}
          onChange={(e) => setMemberName(e.target.value)}
        >
          <option value="">Select an operative</option>
          {selectedArmy.operatives.map((operative) => (
            <option key={operative.name} value={operative.name}>
              {operative.name} (W {operative.wounds} | APL {operative.apl} | M {operative.move} | Sv {operative.save})
            </option>
          ))}
        </select>

        {selectedOperative ? (
          <div className="selected-operative-card">
            <p className="roster-meta selected-operative-meta">Selected operative stats</p>
            <StatChips operative={selectedOperative} />
            <p className="tag-row">{formatTags(selectedOperative.tags)}</p>
          </div>
        ) : null}

        <label htmlFor="card-file">Member Card Image</label>
        <input
          id="card-file"
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          onChange={(e) => setCardFile(e.target.files?.[0] ?? null)}
        />

        <label htmlFor="card-file-2">Back / Second Card Image <span className="label-optional">(optional)</span></label>
        <input
          id="card-file-2"
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          onChange={(e) => setCardFile2(e.target.files?.[0] ?? null)}
        />

        <label htmlFor="member-notes">Member Notes <span className="label-optional">(optional)</span></label>
        <textarea
          id="member-notes"
          className="member-notes-input"
          value={memberNotes}
          onChange={(e) => setMemberNotes(e.target.value)}
          placeholder="Role notes, target priorities, reminder text..."
          rows={3}
          maxLength={400}
        />

        {error ? <p className="error-text">{error}</p> : null}
        {saveArmyMessage ? <p className="ok-text">{saveArmyMessage}</p> : null}

        <div className="button-row">
          <button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Add Member"}
          </button>
          <button type="button" className="ghost" onClick={onClearRoster}>
            Clear Roster
          </button>
        </div>
      </form>

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
            Go To Overview
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
    </section>
  );
}
