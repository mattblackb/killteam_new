import StatChips from "./StatChips";
import MemberCardShell from "./MemberCardShell";
import { formatTags } from "../utils/helpers";

export default function ArmyMemberCard({ member, onRemoveMember }) {
  return (
    <MemberCardShell>
      <div className="army-member-images">
        <img src={member.imageDataUrl} alt={`${member.operative} card`} loading="lazy" />
        {member.secondImageDataUrl ? (
          <img src={member.secondImageDataUrl} alt={`${member.operative} back card`} loading="lazy" className="army-member-img-2" />
        ) : null}
      </div>
      <div>
        <h3>{member.operative}</h3>
        <StatChips operative={member} />
        {Array.isArray(member.tags) && member.tags.length > 0 ? (
          <p className="tag-row">{formatTags(member.tags)}</p>
        ) : null}
        {member.loadout ? <p className="member-note-text"><strong>Loadout:</strong> {member.loadout}</p> : null}
        {member.memberNotes ? <p className="member-note-text">{member.memberNotes}</p> : null}
        <p>{member.imageName}</p>
        <button
          type="button"
          className="danger"
          onClick={() => onRemoveMember(member.id)}
        >
          Remove
        </button>
      </div>
    </MemberCardShell>
  );
}
