import { useRef, useState } from "react";
import ArmyMemberCard from "../ArmyMemberCard";
import StatChips from "../StatChips";
import { formatTags, toDataUrl } from "../../utils/helpers";

function EditMemberModal({ member, loadoutOptions, onSave, onClose }) {
  const [loadout, setLoadout] = useState(member.loadout ?? "");
  const [notes, setNotes] = useState(member.memberNotes ?? "");
  const [imageDataUrl, setImageDataUrl] = useState(member.imageDataUrl ?? null);
  const [secondImageDataUrl, setSecondImageDataUrl] = useState(member.secondImageDataUrl ?? null);
  const [saving, setSaving] = useState(false);
  const img1Ref = useRef(null);
  const img2Ref = useRef(null);

  const handleImageChange = async (file, setter) => {
    if (!file) return;
    const url = await toDataUrl(file);
    setter(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    onSave(member.id, { loadout, memberNotes: notes, imageDataUrl, secondImageDataUrl });
    setSaving(false);
    onClose();
  };

  return (
    <div
      className="card-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label={`Edit ${member.operative}`}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="card-modal-panel member-detail-modal">
        <div className="card-modal-header">
          <h2 className="card-modal-title">Edit — {member.operative}</h2>
          <button type="button" className="ghost card-modal-close-btn" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <StatChips operative={member} />

        <form className="member-edit-form" onSubmit={handleSubmit}>
          {loadoutOptions.length > 0 ? (
            <div className="member-edit-field">
              <label htmlFor="edit-loadout">Loadout</label>
              <select
                id="edit-loadout"
                value={loadout}
                onChange={(e) => setLoadout(e.target.value)}
              >
                <option value="">Select a loadout</option>
                {loadoutOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          ) : null}

          <div className="member-edit-field">
            <label htmlFor="edit-notes">Notes</label>
            <textarea
              id="edit-notes"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any notes about this operative…"
            />
          </div>

          <div className="member-edit-images">
            <div className="member-edit-image-slot">
              <p className="member-edit-image-label">Card image (front)</p>
              {imageDataUrl ? (
                <img src={imageDataUrl} alt="Card front" className="member-edit-preview" />
              ) : (
                <div className="member-edit-image-empty">No image</div>
              )}
              <div className="member-edit-image-btns">
                <button type="button" className="ghost" onClick={() => img1Ref.current?.click()}>
                  {imageDataUrl ? "Replace" : "Upload"}
                </button>
                {imageDataUrl ? (
                  <button type="button" className="ghost" onClick={() => setImageDataUrl(null)}>Remove</button>
                ) : null}
              </div>
              <input
                ref={img1Ref}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => handleImageChange(e.target.files?.[0] ?? null, setImageDataUrl)}
              />
            </div>

            <div className="member-edit-image-slot">
              <p className="member-edit-image-label">Card image (back)</p>
              {secondImageDataUrl ? (
                <img src={secondImageDataUrl} alt="Card back" className="member-edit-preview" />
              ) : (
                <div className="member-edit-image-empty">No image</div>
              )}
              <div className="member-edit-image-btns">
                <button type="button" className="ghost" onClick={() => img2Ref.current?.click()}>
                  {secondImageDataUrl ? "Replace" : "Upload"}
                </button>
                {secondImageDataUrl ? (
                  <button type="button" className="ghost" onClick={() => setSecondImageDataUrl(null)}>Remove</button>
                ) : null}
              </div>
              <input
                ref={img2Ref}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => handleImageChange(e.target.files?.[0] ?? null, setSecondImageDataUrl)}
              />
            </div>
          </div>

          <div className="card-modal-footer">
            <button type="button" className="ghost" onClick={onClose}>Cancel</button>
            <button type="submit" disabled={saving}>{saving ? "Saving…" : "Save Changes"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function RosterPanel({
  members,
  armyName,
  armyNotes,
  selectedArmy,
  onRemoveMember,
  onUpdateMember,
  onSaveArmy,
  onExportArmyAsText,
  onImportArmyFromText,
  onGoToOverview,
  onDeleteArmy,
}) {
  const importInputRef = useRef(null);
  const [viewingMember, setViewingMember] = useState(null);
  const [editingMember, setEditingMember] = useState(null);

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
        <button type="button" className="ghost" onClick={onExportArmyAsText}>
          Export TXT
        </button>
        <button
          type="button"
          className="ghost"
          onClick={() => importInputRef.current?.click()}
        >
          Import TXT
        </button>
        <input
          ref={importInputRef}
          type="file"
          accept=".txt,application/json,text/plain"
          style={{ display: "none" }}
          onChange={(event) => {
            const file = event.target.files?.[0] ?? null;
            onImportArmyFromText(file);
            event.target.value = "";
          }}
        />
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
        <ul className="member-list roster-compact-list">
          {members.map((member) => (
            <ArmyMemberCard
              key={member.id}
              member={member}
              onRemoveMember={onRemoveMember}
              onViewMember={setViewingMember}
              onEditMember={setEditingMember}
            />
          ))}
        </ul>
      )}

      {viewingMember ? (
        <div
          className="card-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label={`${viewingMember.operative} details`}
          onClick={(e) => { if (e.target === e.currentTarget) setViewingMember(null); }}
        >
          <div className="card-modal-panel member-detail-modal">
            <div className="card-modal-header">
              <h2 className="card-modal-title">{viewingMember.operative}</h2>
              <button
                type="button"
                className="ghost card-modal-close-btn"
                onClick={() => setViewingMember(null)}
                aria-label="Close details"
              >
                ✕
              </button>
            </div>

            <StatChips operative={viewingMember} />

            {Array.isArray(viewingMember.tags) && viewingMember.tags.length > 0 ? (
              <p className="tag-row">{formatTags(viewingMember.tags)}</p>
            ) : null}

            {viewingMember.loadout ? (
              <div className="card-modal-notes">
                <p><strong>Loadout</strong></p>
                <p>{viewingMember.loadout}</p>
              </div>
            ) : null}

            {viewingMember.memberNotes ? (
              <div className="card-modal-notes">
                <p><strong>Notes</strong></p>
                <p>{viewingMember.memberNotes}</p>
              </div>
            ) : null}

            {(viewingMember.imageDataUrl || viewingMember.secondImageDataUrl) ? (
              <div className="member-detail-images">
                {viewingMember.imageDataUrl ? (
                  <div className="card-modal-image-wrap">
                    <img src={viewingMember.imageDataUrl} alt={`${viewingMember.operative} card`} />
                  </div>
                ) : null}
                {viewingMember.secondImageDataUrl ? (
                  <div className="card-modal-image-wrap">
                    <img src={viewingMember.secondImageDataUrl} alt={`${viewingMember.operative} back card`} />
                  </div>
                ) : null}
              </div>
            ) : (
              <p className="empty-state">No card images uploaded.</p>
            )}

            <div className="card-modal-footer">
              <button type="button" onClick={() => setViewingMember(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {editingMember ? (
        <EditMemberModal
          member={editingMember}
          loadoutOptions={selectedArmy.operatives.find((o) => o.name === editingMember.operative)?.loadoutOptions ?? []}
          onSave={onUpdateMember}
          onClose={() => setEditingMember(null)}
        />
      ) : null}
    </section>
  );
}
