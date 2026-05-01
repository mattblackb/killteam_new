export default function StatChips({ operative }) {
  if (!operative) {
    return null;
  }

  return (
    <div className="stat-chip-row">
      {typeof operative.wounds === "number" ? <span className="stat-chip">W {operative.wounds}</span> : null}
      {typeof operative.apl === "number" ? <span className="stat-chip">APL {operative.apl}</span> : null}
      {operative.move ? <span className="stat-chip">M {operative.move}</span> : null}
      {operative.save ? <span className="stat-chip">Sv {operative.save}</span> : null}
    </div>
  );
}
