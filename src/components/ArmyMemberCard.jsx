export default function ArmyMemberCard({ member, onRemoveMember, onViewMember, onEditMember }) {
  return (
    <li className="army-member-card-compact">
      {member.imageDataUrl ? (
        <img
          src={member.imageDataUrl}
          alt={`${member.operative} card`}
          className="army-member-card-compact-thumb"
          loading="lazy"
        />
      ) : null}
      <span className="army-member-card-compact-name">{member.operative}</span>
      <div className="army-member-card-compact-actions">
        <button
          type="button"
          className="ghost"
          onClick={() => onEditMember(member)}
        >
          Edit
        </button>
        <button
          type="button"
          className="ghost"
          onClick={() => onViewMember(member)}
        >
          View
        </button>
        <button
          type="button"
          className="danger"
          onClick={() => onRemoveMember(member.id)}
        >
          Remove
        </button>
      </div>
    </li>
  );
}
