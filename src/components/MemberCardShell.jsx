export default function MemberCardShell({ className = "", children }) {
  const composedClassName = className ? `member-card ${className}` : "member-card";
  return <li className={composedClassName}>{children}</li>;
}
