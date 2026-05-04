export function createBattleArmy(army) {
  return {
    id: army.id,
    armyId: army.armyId,
    armyName: army.armyName,
    armyTypeName: army.armyTypeName,
    faction: army.faction,
    victoryPoints: 0,
    commandPoints: 0,
    critOps: 0,
    tacOps: 0,
    killOps: 0,
    primary: 0,
    members: army.members.map((member) => ({
      ...member,
      maxWounds: typeof member.wounds === "number" ? member.wounds : 0,
      currentWounds: typeof member.wounds === "number" ? member.wounds : 0,
      posture: "ready",
      activation: "not-activated"
    }))
  };
}

export function normalizeBattleState(rawBattleState) {
  if (!rawBattleState || typeof rawBattleState !== "object") {
    return null;
  }

  const armies = Array.isArray(rawBattleState.armies)
    ? rawBattleState.armies.map((army) => ({
        ...army,
        critOps: typeof army.critOps === "number" ? army.critOps : 0,
        tacOps:  typeof army.tacOps  === "number" ? army.tacOps  : 0,
        killOps: typeof army.killOps === "number" ? army.killOps : 0,
        primary: typeof army.primary === "number" ? army.primary : 0,
        members: Array.isArray(army.members)
          ? army.members.map((member) => ({
              ...member,
              maxWounds: typeof member.maxWounds === "number" ? member.maxWounds : member.wounds ?? 0,
              currentWounds:
                typeof member.currentWounds === "number"
                  ? member.currentWounds
                  : typeof member.wounds === "number"
                    ? member.wounds
                    : 0,
              posture: ["ready", "engaged", "concealed", "guard"].includes(member.posture)
                ? member.posture
                : member.state === "engaged" || member.state === "engaged-activated"
                  ? "engaged"
                  : member.state === "concealed"
                    ? "concealed"
                    : member.state === "guard"
                      ? "guard"
                      : member.order === "engage"
                        ? "engaged"
                        : member.order === "conceal"
                          ? "concealed"
                          : member.status === "guard"
                            ? "guard"
                            : "ready",
              activation: ["activated", "not-activated"].includes(member.activation)
                ? member.activation
                : member.state === "engaged-activated" || member.status === "activated"
                  ? "activated"
                  : "not-activated"
            }))
          : []
      }))
    : [];

  if (armies.length === 0) {
    return null;
  }

  return {
    turnNumber: typeof rawBattleState.turnNumber === "number" ? rawBattleState.turnNumber : 1,
    armies
  };
}
