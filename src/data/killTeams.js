function operative(name, wounds) {
  return { name, wounds };
}

const BASE_KILL_TEAM_ARMIES = [
  {
    id: "veteran-guardsmen",
    name: "Veteran Guardsmen",
    faction: "Astra Militarum",
    operatives: [
      operative("Sergeant Veteran", 8),
      operative("Confidant", 7),
      operative("Comms Veteran", 7),
      operative("Demolition Veteran", 7),
      operative("Gunner Veteran", 7),
      operative("Medic Veteran", 7),
      operative("Sniper Veteran", 7),
      operative("Spotter Veteran", 7),
      operative("Bruiser Veteran", 7),
      operative("Zealot Veteran", 7),
      operative("Trooper Veteran", 7)
    ]
  },
  {
    id: "kommando",
    name: "Kommandos",
    faction: "Orks",
    operatives: [
      operative("Nob", 11),
      operative("Boy", 10),
      operative("Breacha Boy", 10),
      operative("Burna Boy", 10),
      operative("Comms Boy", 10),
      operative("Dakka Boy", 10),
      operative("Rokkit Boy", 10),
      operative("Slasha Boy", 10),
      operative("Snipa Boy", 10),
      operative("Grot", 5),
      operative("Bomb Squig", 5)
    ]
  },
  {
    id: "pathfinders",
    name: "Pathfinders",
    faction: "T'au Empire",
    operatives: [
      operative("Shas'ui Pathfinder", 8),
      operative("Blooded Pathfinder", 7),
      operative("Comms Specialist", 7),
      operative("Drone Controller", 7),
      operative("Marksman", 7),
      operative("Medical Technician", 7),
      operative("Recon Drone", 7),
      operative("Shas'la Pathfinder", 7),
      operative("Transpectral Interference Pathfinder", 7),
      operative("Weapons Expert Ion", 7),
      operative("Weapons Expert Rail", 7)
    ]
  },
  {
    id: "novitiates",
    name: "Novitiates",
    faction: "Adepta Sororitas",
    operatives: [
      operative("Novitiate Superior", 9),
      operative("Condemnor", 8),
      operative("Dialogus", 8),
      operative("Duelist", 8),
      operative("Exactor", 8),
      operative("Hospitaller", 8),
      operative("Militant", 8),
      operative("Penitent", 8),
      operative("Preceptor", 8),
      operative("Pronatus", 8),
      operative("Purgatus", 8)
    ]
  },
  {
    id: "legionary",
    name: "Legionary",
    faction: "Chaos Space Marines",
    operatives: [
      operative("Aspiring Champion", 15),
      operative("Anointed", 14),
      operative("Balefire Acolyte", 14),
      operative("Butcher", 14),
      operative("Chosen", 14),
      operative("Gunner", 13),
      operative("Heavy Gunner", 13),
      operative("Icon Bearer", 14),
      operative("Shrivetalon", 14),
      operative("Warrior", 14)
    ]
  },
  {
    id: "intercession",
    name: "Intercession Squad",
    faction: "Space Marines",
    operatives: [
      operative("Intercessor Sergeant", 15),
      operative("Assault Intercessor Sergeant", 15),
      operative("Intercessor Gunner", 14),
      operative("Assault Intercessor Grenadier", 14),
      operative("Intercessor Warrior", 14),
      operative("Assault Intercessor Warrior", 14)
    ]
  },
  {
    id: "corsair-voidscarred",
    name: "Corsair Voidscarred",
    faction: "Aeldari",
    operatives: [
      operative("Voidscarred Felarch", 9),
      operative("Fate Dealer", 8),
      operative("Kurnite Hunter", 8),
      operative("Shade Runner", 8),
      operative("Soul Weaver", 8),
      operative("Starstorm Duelist", 8),
      operative("Way Seeker", 8),
      operative("Warrior", 8),
      operative("Heavy Gunner", 8),
      operative("Gunner", 8)
    ]
  },
  {
    id: "void-dancer-troupe",
    name: "Void-Dancer Troupe",
    faction: "Harlequins",
    operatives: [
      operative("Lead Player", 9),
      operative("Player Warrior", 8),
      operative("Player Gunner", 8),
      operative("Player Heavy Gunner", 8),
      operative("Death Jester", 8),
      operative("Shadowseer", 8)
    ]
  },
  {
    id: "blooded",
    name: "Blooded",
    faction: "Traitor Guard",
    operatives: [
      operative("Traitor Chieftain", 8),
      operative("Brimstone Grenadier", 7),
      operative("Commsman", 7),
      operative("Corpseman", 7),
      operative("Enforcer", 8),
      operative("Flenser", 7),
      operative("Gunner", 7),
      operative("Sharpshooter", 7),
      operative("Thug", 7),
      operative("Trench Sweeper", 7),
      operative("Ogryn", 16),
      operative("Traitor Trooper", 7)
    ]
  },
  {
    id: "gellerpox-infected",
    name: "Gellerpox Infected",
    faction: "Nurgle",
    operatives: [
      operative("Vulgrar Thrice-Cursed", 19),
      operative("Nightmare Hulk", 18),
      operative("Fleshscreamer", 13),
      operative("Lumberghast", 12),
      operative("Glitchling", 6),
      operative("Mutant", 7),
      operative("Cursemite", 4),
      operative("Eyestinger Swarm", 4)
    ]
  },
  {
    id: "farstalker-kinband",
    name: "Farstalker Kinband",
    faction: "Kroot",
    operatives: [
      operative("Kill-Broker", 9),
      operative("Bow-Hunter", 8),
      operative("Cold-Blood", 8),
      operative("Cut-Skin", 8),
      operative("Dart-Bow", 8),
      operative("Heavy Gunner", 8),
      operative("Hound", 7),
      operative("Long-Sight", 8),
      operative("Pistolier", 8),
      operative("Stalker", 8),
      operative("Tracker", 8),
      operative("Warrior", 8)
    ]
  },
  {
    id: "hierotek-circle",
    name: "Hierotek Circle",
    faction: "Necrons",
    operatives: [
      operative("Cryptek", 10),
      operative("Apprentek", 8),
      operative("Despotek", 10),
      operative("Immortal Guardian", 10),
      operative("Immortal Despotek", 10),
      operative("Deathmark", 10),
      operative("Plasmacyte Accelerator", 5),
      operative("Plasmacyte Reanimator", 5)
    ]
  },
  {
    id: "kasrkin",
    name: "Kasrkin",
    faction: "Astra Militarum",
    operatives: [
      operative("Kasrkin Sergeant", 8),
      operative("Combat Medic", 7),
      operative("Comms Trooper", 7),
      operative("Demolition Trooper", 7),
      operative("Gunner", 7),
      operative("Recon Trooper", 7),
      operative("Sharpshooter", 7),
      operative("Trooper", 7),
      operative("Vox-Trooper", 7)
    ]
  },
  {
    id: "hearthkyn-salvagers",
    name: "Hearthkyn Salvagers",
    faction: "Leagues of Votann",
    operatives: [
      operative("Theyn", 9),
      operative("Dozr", 8),
      operative("Field Medic", 8),
      operative("Grenadier", 8),
      operative("Gunner", 8),
      operative("Jump Pack Warrior", 8),
      operative("Kognitar", 8),
      operative("Lugger", 8),
      operative("Lokatr", 8),
      operative("Warrior", 8)
    ]
  },
  {
    id: "arbites-exaction-squad",
    name: "Exaction Squad",
    faction: "Adeptus Arbites",
    operatives: [
      operative("Proctor-Exactant", 8),
      operative("Castigator", 7),
      operative("Chirurgant", 7),
      operative("Leashmaster", 7),
      operative("Malocator", 7),
      operative("Marksman", 7),
      operative("Revelatum", 7),
      operative("Subductor", 7),
      operative("Vox-Signifier", 7),
      operative("Cyber-Mastiff", 7)
    ]
  },
  {
    id: "fellgor-ravagers",
    name: "Fellgor Ravagers",
    faction: "Chaos Beastmen",
    operatives: [
      operative("Vandal", 10),
      operative("Fluxbray", 9),
      operative("Gnarlscar", 9),
      operative("Herd-Goad", 9),
      operative("Ironhorn", 10),
      operative("Mangier", 9),
      operative("Shaman", 9),
      operative("Toxhorn", 9),
      operative("Warrior", 9)
    ]
  },
  {
    id: "hand-of-the-archon",
    name: "Hand of the Archon",
    faction: "Drukhari",
    operatives: [
      operative("Archsybarite", 8),
      operative("Agent", 8),
      operative("Crimson Duelist", 8),
      operative("Disciple of Yaelindra", 8),
      operative("Elixicant", 8),
      operative("Flayer", 8),
      operative("Gunner", 8),
      operative("Heavy Gunner", 8),
      operative("Skysplinter Assassin", 8),
      operative("Soulreaver", 8),
      operative("Warrior", 8)
    ]
  },
  {
    id: "chaos-cult",
    name: "Chaos Cult",
    faction: "Chaos",
    operatives: [
      operative("Cult Demagogue", 8),
      operative("Blessed Blade", 7),
      operative("Devotee", 7),
      operative("Iconarch", 7),
      operative("Mindwitch", 7),
      operative("Mutant", 7),
      operative("Torment", 13),
      operative("Dark Commune Bodyguard", 8)
    ]
  },
  {
    id: "scouts",
    name: "Scout Squad",
    faction: "Space Marines",
    operatives: [
      operative("Scout Sergeant", 11),
      operative("Hunter", 10),
      operative("Sniper", 10),
      operative("Tracker", 10),
      operative("Warrior", 10),
      operative("Heavy Gunner", 10)
    ]
  },
  {
    id: "mandrakes",
    name: "Mandrakes",
    faction: "Drukhari",
    operatives: [
      operative("Nightfiend", 9),
      operative("Abyssal", 8),
      operative("Chooser of the Flesh", 8),
      operative("Dirgemaw", 8),
      operative("Shadeweaver", 8),
      operative("Warrior", 8)
    ]
  },
  {
    id: "nemesis-claw",
    name: "Nemesis Claw",
    faction: "Night Lords",
    operatives: [
      operative("Visionary", 15),
      operative("Fearmonger", 14),
      operative("Gunner", 13),
      operative("Heavy Gunner", 13),
      operative("Skinthief", 14),
      operative("Screecher", 14),
      operative("Ventrilokar", 14),
      operative("Warrior", 14)
    ]
  },
  {
    id: "brood-brothers",
    name: "Brood Brothers",
    faction: "Genestealer Cults",
    operatives: [
      operative("Brood Brother Commander", 8),
      operative("Agitator", 7),
      operative("Grenadier", 7),
      operative("Gunner", 7),
      operative("Iconward", 7),
      operative("Medic", 7),
      operative("Sapper", 7),
      operative("Sniper", 7),
      operative("Trooper", 7),
      operative("Veteran", 7)
    ]
  }
];

const TEAM_STAT_DEFAULTS = {
  "veteran-guardsmen": { apl: 2, move: '6"', save: "5+" },
  kommando: { apl: 2, move: '6"', save: "5+" },
  pathfinders: { apl: 2, move: '6"', save: "5+" },
  novitiates: { apl: 2, move: '6"', save: "4+" },
  legionary: { apl: 3, move: '6"', save: "3+" },
  intercession: { apl: 3, move: '6"', save: "3+" },
  "corsair-voidscarred": { apl: 2, move: '7"', save: "4+" },
  "void-dancer-troupe": { apl: 2, move: '8"', save: "4+" },
  blooded: { apl: 2, move: '6"', save: "5+" },
  "gellerpox-infected": { apl: 2, move: '5"', save: "5+" },
  "farstalker-kinband": { apl: 2, move: '7"', save: "6+" },
  "hierotek-circle": { apl: 2, move: '5"', save: "3+" },
  kasrkin: { apl: 2, move: '6"', save: "4+" },
  "hearthkyn-salvagers": { apl: 2, move: '5"', save: "4+" },
  "arbites-exaction-squad": { apl: 2, move: '6"', save: "4+" },
  "fellgor-ravagers": { apl: 2, move: '6"', save: "5+" },
  "hand-of-the-archon": { apl: 2, move: '8"', save: "5+" },
  "chaos-cult": { apl: 2, move: '6"', save: "6+" },
  scouts: { apl: 2, move: '6"', save: "4+" },
  mandrakes: { apl: 2, move: '8"', save: "5+" },
  "nemesis-claw": { apl: 3, move: '6"', save: "3+" },
  "brood-brothers": { apl: 2, move: '6"', save: "5+" }
};

const TEAM_OPERATIVE_OVERRIDES = {
  kommando: {
    Grot: { move: '6"', save: "6+", tags: ["Auxiliary", "Scout"] },
    "Bomb Squig": { move: '8"', save: "6+", tags: ["Auxiliary", "Beast", "Explosive"] }
  },
  pathfinders: {
    "Recon Drone": { move: '8"', save: "4+", tags: ["Auxiliary", "Drone", "Recon"] }
  },
  "gellerpox-infected": {
    "Vulgrar Thrice-Cursed": { move: '4"', save: "4+" },
    "Nightmare Hulk": { move: '4"', save: "4+" },
    Fleshscreamer: { move: '6"', save: "4+" },
    Lumberghast: { move: '6"', save: "4+" },
    Glitchling: { move: '6"', save: "6+", tags: ["Auxiliary", "Tech"] },
    Cursemite: { move: '6"', save: "6+", tags: ["Auxiliary", "Swarm"] },
    "Eyestinger Swarm": { move: '6"', save: "6+", tags: ["Auxiliary", "Swarm"] }
  },
  "farstalker-kinband": {
    Hound: { move: '8"', tags: ["Auxiliary", "Beast", "Tracker"] }
  },
  "hierotek-circle": {
    Cryptek: { apl: 3, save: "4+" },
    Apprentek: { save: "4+" },
    "Plasmacyte Accelerator": { move: '6"', save: "6+", tags: ["Auxiliary", "Drone", "Support"] },
    "Plasmacyte Reanimator": { move: '6"', save: "6+", tags: ["Auxiliary", "Drone", "Medic"] }
  },
  "hearthkyn-salvagers": {
    "Jump Pack Warrior": { move: '8"', tags: ["Trooper", "Mobile"] }
  },
  "arbites-exaction-squad": {
    "Cyber-Mastiff": { move: '8"', tags: ["Auxiliary", "Beast", "Enforcer"] }
  },
  "chaos-cult": {
    Torment: { save: "5+", tags: ["Melee", "Mutant", "Brute"] }
  }
};

function deriveOperativeTags(name) {
  const normalizedName = name.toLowerCase();
  const tags = [];

  if (
    /(sergeant|superior|champion|felarch|lead player|chieftain|kill-broker|cryptek|theyn|proctor-exactant|archsybarite|demagogue|nightfiend|visionary|commander|nob|shas'ui)/.test(
      normalizedName
    )
  ) {
    tags.push("Leader");
  }

  if (
    /(gunner|heavy gunner|sniper|marksman|dakka|rokkit|burna|grenadier|demolition|rail|ion|fate dealer|long-sight|sharpshooter|castigator|soulreaver|purgatus)/.test(
      normalizedName
    )
  ) {
    tags.push("Ranged");
  }

  if (/(medic|hospitaller|corpseman|chirurgant)/.test(normalizedName)) {
    tags.push("Medic");
  }

  if (/(duelist|butcher|slasha|cut-skin|skinthief|screecher|anointed|penitent|bruiser|flayer|thug|ogryn|torment)/.test(normalizedName)) {
    tags.push("Melee");
  }

  if (/(grot|squig|hound|mastiff|drone|plasmacyte|swarm)/.test(normalizedName)) {
    tags.push("Auxiliary");
  }

  if (/(warrior|trooper|boy$|militant|devotee|mutant|veteran)/.test(normalizedName)) {
    tags.push("Trooper");
  }

  if (tags.length === 0) {
    tags.push("Specialist");
  }

  return [...new Set(tags)];
}

function buildOperative(armyId, baseOperative) {
  const defaultStats = TEAM_STAT_DEFAULTS[armyId] ?? { apl: 2, move: '6"', save: "5+" };
  const overrides = TEAM_OPERATIVE_OVERRIDES[armyId]?.[baseOperative.name] ?? {};
  const tags = overrides.tags ?? deriveOperativeTags(baseOperative.name);

  return {
    ...baseOperative,
    apl: overrides.apl ?? defaultStats.apl,
    move: overrides.move ?? defaultStats.move,
    save: overrides.save ?? defaultStats.save,
    tags
  };
}

export const KILL_TEAM_ARMIES = BASE_KILL_TEAM_ARMIES.map((army) => ({
  ...army,
  operatives: army.operatives.map((baseOperative) => buildOperative(army.id, baseOperative))
}));

export const DEFAULT_ARMY_ID = KILL_TEAM_ARMIES[0].id;