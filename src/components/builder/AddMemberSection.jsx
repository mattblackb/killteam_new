import { useState } from "react";
import StatChips from "../StatChips";
import { formatTags } from "../../utils/helpers";

export default function AddMemberSection({
  memberName,
  setMemberName,
  memberNotes,
  setMemberNotes,
  memberLoadout,
  setMemberLoadout,
  setCardFile,
  setCardFile2,
  error,
  saveArmyMessage,
  saving,
  selectedArmy,
  selectedOperative,
  members,
  operativeAvailability,
  onClearRoster,
}) {
  const isWreckaKrew = selectedArmy.id === "wrecka-krew";
  const isRaveners = selectedArmy.id === "raveners";
  const isMurderwing = selectedArmy.id === "murderwing";
  const [showComposition, setShowComposition] = useState(true);
  const operativeCounts = members.reduce((acc, member) => {
    acc[member.operative] = (acc[member.operative] ?? 0) + 1;
    return acc;
  }, {});
  const wreckaCounts = operativeCounts;
  const ravenersPoolCount = members.filter((m) => m.operative !== "Ravener Prime").length;

  return (
    <>
      {isWreckaKrew ? (
        <div className="selected-operative-card composition-tracker">
          <div className="composition-tracker-header">
            <span className="roster-meta selected-operative-meta">Wrecka Krew Composition</span>
            <button type="button" className="composition-toggle-btn" onClick={() => setShowComposition((v) => !v)}>
              {showComposition ? "Hide" : "Show"}
            </button>
          </div>
          {showComposition && (
            <>
              <p className="roster-meta">Boss Nob: {wreckaCounts["Wrecka Krew Boss Nob"] ?? 0}/1</p>
              <p className="roster-meta">Bomb Squig: {wreckaCounts["Wrecka Krew Bomb Squig"] ?? 0}/2</p>
              <p className="roster-meta">Demolisha: {wreckaCounts["Breaka Boy Demolisha"] ?? 0}/1</p>
              <p className="roster-meta">Fighter: {wreckaCounts["Breaka Boy Fighter"] ?? 0}/5</p>
              <p className="roster-meta">Krusha: {wreckaCounts["Breaka Boy Krusha"] ?? 0}/1</p>
              <p className="roster-meta">Tankbusta Gunner: {wreckaCounts["Tankbusta Gunner"] ?? 0}/5</p>
              <p className="roster-meta">Tankbusta Rokkiteer: {wreckaCounts["Tankbusta Rokkiteer"] ?? 0}/1</p>
              <p className="roster-meta">Total: {members.length}/8</p>
            </>
          )}
        </div>
      ) : null}

      {isRaveners ? (
        <div className="selected-operative-card composition-tracker">
          <div className="composition-tracker-header">
            <span className="roster-meta selected-operative-meta">Raveners Composition</span>
            <button type="button" className="composition-toggle-btn" onClick={() => setShowComposition((v) => !v)}>
              {showComposition ? "Hide" : "Show"}
            </button>
          </div>
          {showComposition && (
            <>
              <p className="roster-meta">Ravener Prime: {operativeCounts["Ravener Prime"] ?? 0}/1 (required)</p>
              <p className="roster-meta selected-operative-meta" style={{ marginTop: 4 }}>Pool (4 total):</p>
              <p className="roster-meta">Felltalon: {operativeCounts["Ravener Felltalon"] ?? 0}/1</p>
              <p className="roster-meta">Tremorscythe: {operativeCounts["Ravener Tremorscythe"] ?? 0}/1</p>
              <p className="roster-meta">Venomspitter: {operativeCounts["Ravener Venomspitter"] ?? 0}/1</p>
              <p className="roster-meta">Warrior: {operativeCounts["Ravener Warrior"] ?? 0}/4</p>
              <p className="roster-meta">Wrecker: {operativeCounts["Ravener Wrecker"] ?? 0}/1</p>
              <p className="roster-meta">Pool: {ravenersPoolCount}/4 · Total: {members.length}/5</p>
            </>
          )}
        </div>
      ) : null}

      {isMurderwing ? (() => {
        const lordCount = operativeCounts["Murderwing Chaos Lord"] ?? 0;
        const poolCount = members.length - lordCount;
        const plasmaCount = members.filter((m) => /plasma/i.test(m.loadout || "")).length;
        const meltaCount = members.filter((m) => /melta/i.test(m.loadout || "")).length;
        return (
          <div className="selected-operative-card composition-tracker">
            <div className="composition-tracker-header">
              <span className="roster-meta selected-operative-meta">Murderwing Composition</span>
              <button type="button" className="composition-toggle-btn" onClick={() => setShowComposition((v) => !v)}>
                {showComposition ? "Hide" : "Show"}
              </button>
            </div>
            {showComposition && (
              <>
                <p className="roster-meta">Chaos Lord: {lordCount}/1 (required)</p>
                <p className="roster-meta selected-operative-meta" style={{ marginTop: 4 }}>Pool (7 total):</p>
                <p className="roster-meta">Champion: {operativeCounts["Murderwing Champion"] ?? 0}/1</p>
                <p className="roster-meta">Curseclaw: {operativeCounts["Murderwing Curseclaw"] ?? 0}/1</p>
                <p className="roster-meta">Depredator: {operativeCounts["Murderwing Depredator"] ?? 0}/1</p>
                <p className="roster-meta">Huntmaster: {operativeCounts["Murderwing Huntmaster"] ?? 0}/1</p>
                <p className="roster-meta">Raptor: {operativeCounts["Murderwing Raptor"] ?? 0} (fills remaining)</p>
                <p className="roster-meta">Shrieker: {operativeCounts["Murderwing Shrieker"] ?? 0}/1</p>
                <p className="roster-meta">Skysear: {operativeCounts["Murderwing Skysear"] ?? 0}/1</p>
                <p className="roster-meta">Warp Talon: {operativeCounts["Murderwing Warp Talon"] ?? 0}/1</p>
                <p className="roster-meta selected-operative-meta" style={{ marginTop: 4 }}>Weapon limits:</p>
                <p className="roster-meta">Plasma: {plasmaCount}/2 max · Melta: {meltaCount}/2 max</p>
                <p className="roster-meta">Pool: {poolCount}/7 · Total: {members.length}/8</p>
              </>
            )}
          </div>
        );
      })() : null}

      <label htmlFor="member-select">Operative</label>
      <select
        id="member-select"
        value={memberName}
        onChange={(e) => setMemberName(e.target.value)}
      >
        <option value="">Select an operative</option>
        {selectedArmy.operatives.map((operative) => (
          <option
            key={operative.name}
            value={operative.name}
            disabled={!!operativeAvailability?.[operative.name]?.disabled}
          >
            {operative.name} (W {operative.wounds} | APL {operative.apl} | M {operative.move} | Sv {operative.save})
          </option>
        ))}
      </select>

      {memberName && operativeAvailability?.[memberName]?.reason ? (
        <p className={`roster-meta${
          operativeAvailability[memberName].reason.toLowerCase().includes("full")
            ? " roster-full-warning"
            : ""
        }`}>{operativeAvailability[memberName].reason}</p>
      ) : null}

      {selectedOperative ? (
        <div className="selected-operative-card">
          <p className="roster-meta selected-operative-meta">Selected operative stats</p>
          <StatChips operative={selectedOperative} />
          <p className="tag-row">{formatTags(selectedOperative.tags)}</p>
        </div>
      ) : null}

      {selectedOperative?.loadoutOptions?.length > 0 ? (
        <>
          <label htmlFor="member-loadout">Loadout</label>
          <select
            id="member-loadout"
            value={memberLoadout}
            onChange={(e) => setMemberLoadout(e.target.value)}
          >
            <option value="">Select a loadout</option>
            {selectedOperative.loadoutOptions.map((loadout) => (
              <option key={loadout} value={loadout}>
                {loadout}
              </option>
            ))}
          </select>
        </>
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
    </>
  );
}
