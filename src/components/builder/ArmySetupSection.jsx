import { KILL_TEAM_ARMIES } from "../../data/killTeams";

export default function ArmySetupSection({
  armyId,
  onChangeArmyId,
  armyName,
  setArmyName,
  armyNotes,
  setArmyNotes,
}) {
  return (
    <>
      <label htmlFor="army-select">Kill Team Army</label>
      <select
        id="army-select"
        value={armyId}
        onChange={(e) => onChangeArmyId(e.target.value)}
      >
        {[...KILL_TEAM_ARMIES].sort((a, b) => a.name.localeCompare(b.name)).map((army) => (
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
    </>
  );
}
