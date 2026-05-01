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
      currentWounds: typeof member.wounds === "number" ? member.wounds : 0
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
                    : 0
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
