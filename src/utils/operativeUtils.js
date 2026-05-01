import { KILL_TEAM_ARMIES } from "../data/killTeams";

export function findOperativeProfile(armyId, operativeName) {
  const army = KILL_TEAM_ARMIES.find((entry) => entry.id === armyId);
  return army?.operatives.find((operative) => operative.name === operativeName) ?? null;
}

export function hydrateMembers(armyId, memberList) {
  if (!Array.isArray(memberList)) {
    return [];
  }

  return memberList.map((member) => {
    const operativeProfile = findOperativeProfile(armyId, member.operative);
    if (!operativeProfile) {
      return member;
    }

    return {
      ...member,
      wounds: typeof member.wounds === "number" ? member.wounds : operativeProfile.wounds,
      apl: typeof member.apl === "number" ? member.apl : operativeProfile.apl,
      move: member.move || operativeProfile.move,
      save: member.save || operativeProfile.save,
      tags: Array.isArray(member.tags) ? member.tags : operativeProfile.tags
    };
  });
}
