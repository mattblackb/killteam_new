function operative(name, wounds, options = {}) {
  return { name, wounds, ...options };
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
    ],
    factionRules: [
      { id: "vg-fr-1", name: "Toughened by War", description: "Veterans can receive orders from the Sergeant Veteran. Each turn, the Sergeant may issue one order to a friendly operative, granting it a free bonus action." },
      { id: "vg-fr-2", name: "Heirlooms of the Astra Militarum", description: "Before the battle, choose one heirloom wargear upgrade from the Heirlooms list to equip to one operative." },
      { id: "vg-fr-3", name: "Disciplined Fire", description: "Operatives that did not move in their activation may re-roll one attack die when making a Shoot action." }
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
    ],
    factionRules: [
      { id: "ko-fr-1", name: "Ere We Go!", description: "When a Kommando operative charges, it may make a free Shoot (pistol) or Fight action after its charge move instead of a normal additional action." },
      { id: "ko-fr-2", name: "Waaagh! Energy", description: "Each time a Kommando takes an enemy Out of Action in melee, gain 1 Waaagh! token. Spend tokens for combat re-rolls or bonus attacks." },
      { id: "ko-fr-3", name: "Brutal Kunnin'", description: "Once per activation, a Kommando operative may split its APL between shooting and melee actions in any order." }
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
    ],
    factionRules: [
      { id: "pf-fr-1", name: "Markerlight", description: "When a Pathfinder uses a Markerlight action, place a Markerlight token on a visible enemy. Friendly T'au operatives gain +1 BS against marked targets until end of turn." },
      { id: "pf-fr-2", name: "For the Greater Good", description: "When a friendly operative within 6\" of another friendly is targeted by a Shoot action, the second operative may fire back at the attacker after the attack resolves (once per activation)." },
      { id: "pf-fr-3", name: "Sept Tenets", description: "Before the battle, choose a T'au Sept (e.g. Dal'yth, T'au, Vior'la, Sa'cea, Bork'an, Farsight). Each Sept grants a unique team-wide ability." }
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
    ],
    factionRules: [
      { id: "nv-fr-1", name: "Acts of Faith", description: "Generate Miracle dice by scoring objectives, taking enemies Out of Action, or performing penance actions. Substitute a Miracle die for any dice roll during your activation." },
      { id: "nv-fr-2", name: "The Sevenfold Path", description: "Novitiate operatives can perform a Penance action to generate Miracle dice and unlock discipline-based buffs for subsequent activations." },
      { id: "nv-fr-3", name: "Fervour", description: "Once per battle round, when a Novitiate operative is taken Out of Action, a friendly operative within 6\" may immediately activate out of sequence." }
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
    ],
    factionRules: [
      { id: "lg-fr-1", name: "Chaos Mark", description: "Choose a Chaos god before battle: Khorne (re-roll melee attack dice), Nurgle (5+ Feel No Pain), Slaanesh (+1\" to all moves), Tzeentch (psychic ploy access), or Undivided (gain additional strategic ploy options)." },
      { id: "lg-fr-2", name: "Heretical Devotion", description: "Legionary operatives sharing the same Chaos Mark as the team's chosen deity gain +1 to injury rolls against enemies." },
      { id: "lg-fr-3", name: "Warp-Touched", description: "The Balefire Acolyte can manifest psychic powers as actions. Each power has a casting value; roll 2D6 and beat it to resolve the effect." }
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
    ],
    factionRules: [
      { id: "is-fr-1", name: "Angels of Death", description: "All operatives have Shock Assault (gain a free Fight action immediately after charging) and Bolter Discipline (gain +1 attack with bolt weapons when not moving)." },
      { id: "is-fr-2", name: "Combat Doctrines", description: "Advance through doctrines each battle round: Round 1 Devastator (re-roll one ranged attack die per activation), Round 2 Tactical (+1\" to all moves), Round 3+ Assault (+1 attack in melee)." }
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
    ],
    factionRules: [
      { id: "cv-fr-1", name: "Luck of the Eldar", description: "Once per activation, re-roll one die for free. Additional re-rolls beyond the first each battle round cost a Fate token (generated by certain actions)." },
      { id: "cv-fr-2", name: "Pact of the Corsair", description: "Before the battle, choose a Corsair allegiance (e.g. Ynnari, Saim-Hann, etc.) to grant your Felarch and specialists unique abilities." },
      { id: "cv-fr-3", name: "Void Dancer", description: "Once per activation, a Corsair operative may move through other operatives and ignore difficult terrain." }
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
    ],
    factionRules: [
      { id: "vd-fr-1", name: "Cegorach's Jest", description: "At the start of the battle, roll 6 Fate dice and set them aside. These can substitute any dice rolled during the game, one per roll." },
      { id: "vd-fr-2", name: "Dance of Death", description: "When a Harlequin operative ends a move within Engagement Range of an enemy, it may make a free Fight action or immediately move out of Engagement Range without triggering free strikes." },
      { id: "vd-fr-3", name: "Prismatic Blur", description: "Harlequin operatives cannot be targeted by Shoot actions while Concealed, even if they are visible to the attacker." }
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
    ],
    factionRules: [
      { id: "bl-fr-1", name: "Chaos Mark", description: "Choose a Chaos devotion before battle: Khorne, Nurgle, Slaanesh, Tzeentch, or Undivided. Each grants a unique team-wide buff for the duration of the battle." },
      { id: "bl-fr-2", name: "Renegade Blessings", description: "Each time a Blooded operative takes an enemy Out of Action, roll one die; on a 5+, that operative gains a random Chaos Boon — a permanent upgrade for the rest of the game." },
      { id: "bl-fr-3", name: "Traitor's Fervour", description: "Blooded operatives that are Injured (below half wounds) gain +1 Attack in melee, driven by desperation and dark power." }
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
    ],
    factionRules: [
      { id: "gx-fr-1", name: "Plague Reaping", description: "Each time a Gellerpox operative takes an enemy Out of Action, generate a Plague token. Spend tokens to summon additional Glitchlings or Mutants from reserve." },
      { id: "gx-fr-2", name: "Rampaging Mutations", description: "Glitchlings that survive to the end of a battle round may grow. Roll one die: on a 5+, the Glitchling is replaced by a Mutant." },
      { id: "gx-fr-3", name: "Festering Resilience", description: "Gellerpox operatives cannot be taken Out of Action by a single hit that would exceed their remaining wounds; a second attack in the same phase is required to finish them." }
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
    ],
    factionRules: [
      { id: "fk-fr-1", name: "Mercenary Hire", description: "Farstalkers can recruit hired guns from other factions. Hired guns do not benefit from Kroot faction abilities but count toward roster size." },
      { id: "fk-fr-2", name: "Hunter's Trail", description: "At the start of the first battle round, each Farstalker operative may make a free 3\" move. Operatives ending in cover gain the Conceal benefit automatically." },
      { id: "fk-fr-3", name: "Tracker Instincts", description: "During the initiative phase, mark one visible enemy operative. All Farstalker operatives gain +1 BS and +1 WS against that target for the rest of the battle round." }
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
    ],
    factionRules: [
      { id: "hk-fr-1", name: "Reanimation Protocols", description: "When a Necron operative is taken Out of Action, place a Reanimation token on them. At the start of each battle round, roll one die per token — on a 5+, that operative returns with D3 wounds." },
      { id: "hk-fr-2", name: "Living Metal", description: "At the end of each activation, a Necron operative that is not Out of Action heals 1 wound automatically." },
      { id: "hk-fr-3", name: "Technomantic Succession", description: "If the Cryptek is taken Out of Action, the Despotek immediately activates (out of sequence) to assume leadership and use any Cryptek-restricted abilities." }
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
    ],
    factionRules: [
      { id: "ks-fr-1", name: "Elite Soldiers", description: "Kasrkin operatives have access to the Heirloom action. Once per battle, one operative may activate an heirloom wargear item for a powerful one-time effect." },
      { id: "ks-fr-2", name: "Grenadier Volley", description: "Once per activation, a Kasrkin operative that did not perform a Fight action may throw a grenade as a free bonus action." },
      { id: "ks-fr-3", name: "Drilled Response", description: "When a Kasrkin operative is activated, a friendly operative within 3\" may make a free 1\" adjustment move." }
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
    ],
    factionRules: [
      { id: "hs-fr-1", name: "Grudge Bearer", description: "Before the battle, designate one enemy operative as the Target of a Grudge. Hearthkyn operatives gain +1 Attack and re-roll wound rolls against that target." },
      { id: "hs-fr-2", name: "League Credo", description: "Choose a League of Votann before the battle (e.g. Ymyr Conglomerate, Kin of Thrun, Trans-Hyperian Alliance). Each League grants a team-wide specialisation bonus." },
      { id: "hs-fr-3", name: "Kin Bond", description: "Hearthkyn operatives within 3\" of another friendly operative gain a 6+ Feel No Pain save." }
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
    ],
    factionRules: [
      { id: "ea-fr-1", name: "Exaction Protocol", description: "Arbites operatives may perform the Detain action on an Injured enemy instead of taking them Out of Action. Detained operatives score as Out of Action but may be freed by enemy actions." },
      { id: "ea-fr-2", name: "Lex Imperialis", description: "Arbites operatives gain a bonus action token when controlling or contesting an objective marker at the end of their activation." },
      { id: "ea-fr-3", name: "Cyber-Mastiff Leash", description: "The Cyber-Mastiff must remain within 6\" of the Leashmaster. While within range, both gain +1 WS. If separated, the Mastiff loses the bonus and becomes harder to command." }
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
    ],
    factionRules: [
      { id: "fr-fr-1", name: "Chaos Mark", description: "Choose a Chaos devotion before battle: Khorne (bonus melee attacks), Nurgle (resilience), Slaanesh (extra movement), Tzeentch (psychic ploys), or Undivided (versatile strategic ploys)." },
      { id: "fr-fr-2", name: "Savage Fury", description: "Fellgor operatives that charge gain +1 Attack and may re-roll one melee attack die in that activation." },
      { id: "fr-fr-3", name: "Bray Shaman Rites", description: "The Shaman can perform a Ritual action to grant one of three boons to nearby Fellgor operatives: re-roll saves, +1 Strength, or force a Nerve test on a nearby enemy." }
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
    ],
    factionRules: [
      { id: "ha-fr-1", name: "Power from Pain", description: "Gain Pain tokens each time an enemy is taken Out of Action. Spend tokens to activate abilities: Wyches gain a dodge bonus, Kabalites gain an extra attack, Wracks gain +1 Toughness." },
      { id: "ha-fr-2", name: "Kabal Obsession", description: "Choose a Drukhari Kabal before battle (e.g. Black Heart, Poisoned Tongue, Flayed Skull) to gain a unique team-wide tactical ability." },
      { id: "ha-fr-3", name: "Soul-Trap", description: "Once per battle, the Archsybarite may activate a Soul-Trap when taking an enemy Out of Action, gaining a permanent +1 to injury rolls for the rest of the game." }
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
    ],
    factionRules: [
      { id: "cc-fr-1", name: "Chaos Mark", description: "Choose a Chaos deity's blessing before battle. All Cultist operatives gain a devotion bonus based on the chosen mark (Khorne, Nurgle, Slaanesh, Tzeentch, or Undivided)." },
      { id: "cc-fr-2", name: "Cult Rising", description: "Each time a Cultist is taken Out of Action, roll one die; on a 4+, a new Cultist arrives from reserve at the start of the next battle round anywhere on your board edge." },
      { id: "cc-fr-3", name: "Dark Ritual", description: "The Mindwitch can perform a Dark Ritual action to generate Ritual tokens. Spend tokens to boost nearby operatives or unleash the Torment's rage for a bonus activation." }
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
    ],
    factionRules: [
      { id: "sc-fr-1", name: "Concealed Deployment", description: "Up to half your Scout operatives (rounded down) may begin the game Concealed regardless of terrain, representing their advanced recon infiltration." },
      { id: "sc-fr-2", name: "Scout Ahead", description: "Before the first battle round, each Scout operative may make a free 3\" move." },
      { id: "sc-fr-3", name: "Combat Doctrines", description: "Advance through doctrines each battle round: Round 1 Devastator (re-roll one ranged die), Round 2 Tactical (+1\" moves), Round 3+ Assault (+1 melee attack)." }
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
    ],
    factionRules: [
      { id: "md-fr-1", name: "From the Shadows", description: "After the first battle round, a Mandrake operative not yet on the battlefield may appear from any board edge more than 6\" from an enemy as a free action at the start of your turn." },
      { id: "md-fr-2", name: "Baleblast", description: "The Baleblast ranged ability ignores the Obscured special rule and cover saving throws. It can also be used while the operative is Engaged." },
      { id: "md-fr-3", name: "Darklight Shroud", description: "Mandrake operatives are -1 to be hit by Shoot actions while Concealed, even when targeted through or in cover." }
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
    ],
    factionRules: [
      { id: "nc-fr-1", name: "Terror", description: "When a Nemesis Claw operative takes an enemy Out of Action in melee, place a Terror token on a visible enemy within 6\". Terrorised operatives must pass a Nerve test before activating or lose one action." },
      { id: "nc-fr-2", name: "Strike from Shadows", description: "When a Nemesis Claw operative charges from Concealment, it gains +2 Attacks for that Fight action." },
      { id: "nc-fr-3", name: "Chaos Mark (Night Lords)", description: "Night Lords devotion to fear and darkness grants access to terror-themed strategic and tactical ploys unavailable to other Chaos teams." }
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
    ],
    factionRules: [
      { id: "bb-fr-1", name: "Cult Ambush", description: "Up to 3 Brood Brother operatives may begin the game in reserve. At the start of any battle round after the first, reveal them from any table edge within 6\" of an objective marker." },
      { id: "bb-fr-2", name: "Hypnotic Gaze", description: "The Agitator can use the Hypnotic Gaze action on a visible enemy within 6\". That operative must activate last in the next activation sequence." },
      { id: "bb-fr-3", name: "Four-Armed Emperor's Blessing", description: "Once per battle round, one Brood Brother operative may re-roll a failed saving throw, blessed by the will of the Patriarch." }
    ],
    tacOps: []
  },
  {
    id: "wrecka-krew",
    name: "Wrecka Krew",
    faction: "Orks",
    operatives: [
      operative("Wrecka Krew Boss Nob", 11, {
        loadoutOptions: [
          "Rokkit pistol; smash hammer",
          "Two rokkit pistols; choppa"
        ]
      }),
      operative("Wrecka Krew Bomb Squig", 5),
      operative("Breaka Boy Demolisha", 10),
      operative("Breaka Boy Fighter", 10),
      operative("Breaka Boy Krusha", 10),
      operative("Tankbusta Gunner", 10, {
        loadoutOptions: [
          "'Eavy rokkit launcha; fists",
          "Rokkit launcha; fists"
        ]
      }),
      operative("Tankbusta Rokkiteer", 10, {
        loadoutOptions: [
          "Rokkit launcha; pulsa rokkit; fists",
          "Rokkit launcha; rokkit rack; fists"
        ]
      })
    ],
    factionRules: [
      { id: "wk-fr-1", name: "Tanked Up", description: "Operatives gain +1 APL (Action Point Limit) when performing Shoot or Fight actions, encouraging highly aggressive, mixed-phase turns." },
      { id: "wk-fr-2", name: "Wrecka Rampage", description: "Critical successes can turn misses into hits." },
      { id: "wk-fr-3", name: "Structure Smash", description: "Ability to destroy terrain, crucial on maps like Volkus." }
    ],
    tacOps: []
  },
  {
    id: "murderwing",
    name: "Murderwing",
    faction: "Chaos Space Marines",
    operatives: [
      operative("Murderwing Chaos Lord", 16, {
        loadoutOptions: [
          "Bolt pistol; lightning claw",
          "Bolt pistol; power fist",
          "Bolt pistol; power weapon",
          "Plasma pistol; lightning claw",
          "Plasma pistol; power fist",
          "Plasma pistol; power weapon",
          "Relic lightning claws"
        ]
      }),
      operative("Murderwing Champion", 14, {
        loadoutOptions: [
          "Plasma pistol; power fist",
          "Plasma pistol; power weapon",
          "Bolt pistol; power fist",
          "Bolt pistol; power weapon"
        ]
      }),
      operative("Murderwing Curseclaw", 13),
      operative("Murderwing Depredator", 13),
      operative("Murderwing Huntmaster", 13),
      operative("Murderwing Raptor", 13, {
        loadoutOptions: [
          "Bolt pistol; chainsword",
          "Plasma pistol; chainsword"
        ]
      }),
      operative("Murderwing Shrieker", 13),
      operative("Murderwing Skysear", 13, {
        loadoutOptions: [
          "Flamer; bolt pistol; fists",
          "Meltagun; bolt pistol; fists",
          "Plasma gun; bolt pistol; fists"
        ]
      }),
      operative("Murderwing Warp Talon", 13)
    ],
    factionRules: [
      { id: "mw-fr-1", name: "Aerial Predators", description: "This team ignores vertical distance when moving between vantage points, as long as movement starts or ends on terrain." },
      { id: "mw-fr-2", name: "Synaptic Scream", description: "At the start of each battle round, choose one visible enemy operative within 8\" of your leader; that operative gets -1 APL until end of round." },
      { id: "mw-fr-3", name: "Feeding Frenzy", description: "After taking an enemy out of action in melee, the attacking operative can make a free 2\" move." }
    ],
    tacOps: []
  },
  {
    id: "blades-of-khaine",
    name: "Blades of Khaine",
    faction: "Aeldari",
    operatives: [
      operative("Dire Avenger Exarch", 9),
      operative("Howling Banshee Exarch", 9),
      operative("Striking Scorpion Exarch", 9),
      operative("Dire Avenger", 8),
      operative("Howling Banshee", 8)
    ],
    factionRules: [
      { id: "bk-fr-1", name: "Aspect Techniques", description: "At deployment, choose two Aspect stances. Each battle round, select one active stance that grants a team-wide bonus." },
      { id: "bk-fr-2", name: "Graceful Strike", description: "Once per activation, an operative that made a Dash can re-roll one attack die in melee." },
      { id: "bk-fr-3", name: "Khaine's Precision", description: "When this team Crits in melee, one normal save cannot be used to block that crit." }
    ],
    tacOps: []
  },
  {
    id: "wolf-scouts",
    name: "Wolf Scouts",
    faction: "Space Wolves",
    operatives: [
      operative("Wolf Scout Leader", 11),
      operative("Wolf Scout Gunner", 10),
      operative("Wolf Scout Tracker", 10),
      operative("Wolf Scout Hunter", 10),
      operative("Wolf Scout Warrior", 10)
    ],
    factionRules: [
      { id: "ws-fr-1", name: "Pack Hunters", description: "When two friendly operatives are within 2\" of the same enemy, both gain +1 attack die in melee." },
      { id: "ws-fr-2", name: "Winter-Cloaked", description: "Operatives with Conceal cannot be targeted from over 8\" unless they are on a vantage point." },
      { id: "ws-fr-3", name: "Howl of Russ", description: "Once per battle round, after an ally is incapacitated, one ready friendly operative can perform a free Dash." }
    ],
    tacOps: []
  },
  {
    id: "battleclade",
    name: "Battleclade",
    faction: "Adeptus Mechanicus",
    operatives: [
      operative("Battleclade Prime", 9),
      operative("Techno-Gunner", 8),
      operative("Electro-Adept", 8),
      operative("Servo Ranger", 8),
      operative("Battleclade Trooper", 8)
    ],
    factionRules: [
      { id: "bc-fr-1", name: "Doctrina Cycle", description: "At the start of each battle round, choose one protocol: Offensive (+1 BS) or Defensive (+1 save against one attack)." },
      { id: "bc-fr-2", name: "Binary Command", description: "Your leader can issue one command each round to a visible ally within 6\", granting a free 1 AP mission action." },
      { id: "bc-fr-3", name: "Servo-Linked Targeting", description: "If an enemy has already been shot by this team this round, subsequent shots against it can re-roll one hit die." }
    ],
    tacOps: []
  },
  {
    id: "celestian-insidiants",
    name: "Celestian Insidiants",
    faction: "Adepta Sororitas",
    operatives: [
      operative("Celestian Superior", 9),
      operative("Null-Mace Warden", 8),
      operative("Sanctified Gunner", 8),
      operative("Insidiant Duelist", 8),
      operative("Celestian Militant", 8)
    ],
    factionRules: [
      { id: "ci-fr-1", name: "Acts of Conviction", description: "Gain one Conviction token when an objective is secured. Spend tokens to auto-retain one save or one hit die." },
      { id: "ci-fr-2", name: "Null Warding", description: "Enemy psychic actions within 6\" of a Null-Mace operative suffer -1 to cast rolls." },
      { id: "ci-fr-3", name: "Martyr's Step", description: "When a friendly operative is incapacitated, another friendly operative within 6\" can immediately make a free 3\" move." }
    ],
    tacOps: []
  },
  {
    id: "warpcoven",
    name: "Warpcoven",
    faction: "Thousand Sons",
    operatives: [
      operative("Sorcerer", 12),
      operative("Rubric Marine Gunner", 11),
      operative("Rubric Marine Warrior", 11),
      operative("Tzaangor Champion", 9),
      operative("Tzaangor Fighter", 9)
    ],
    factionRules: [
      { id: "wc-fr-1", name: "Arcana Disciplines", description: "Before battle, choose each sorcerer's discipline. Each discipline grants one unique psychic action." },
      { id: "wc-fr-2", name: "Sorcerous Cabal", description: "Each successful psychic action generates 1 Cabal point. Spend Cabal points for re-rolls, extra range, or bonus movement." },
      { id: "wc-fr-3", name: "Implacable Rubricae", description: "Rubric operatives ignore movement penalties from difficult terrain and cannot have their APL reduced below 2." }
    ],
    tacOps: []
  },
  {
    id: "elucidian-starstriders",
    name: "Elucidian Starstriders",
    faction: "Imperium",
    operatives: [
      operative("Rogue Trader Elucia Vhane", 9),
      operative("Voidsman Gunner", 8),
      operative("Canid", 7),
      operative("Lectro-Maester", 8),
      operative("Voidsman-at-Arms", 8)
    ],
    factionRules: [
      { id: "es-fr-1", name: "Crew Specialisms", description: "Once per battle round, each non-leader specialist can use a unique support action for free." },
      { id: "es-fr-2", name: "Rogue Trader's Orders", description: "Elucia Vhane can issue one visible ally within 6\" an order that grants +1 APL for mission actions only." },
      { id: "es-fr-3", name: "Boarding Discipline", description: "When within 1\" of hatchways or doors, this team can re-roll one save die against shooting attacks." }
    ],
    tacOps: []
  },
  {
    id: "xv26-stealth-battlesuits",
    name: "XV26 Stealth Battlesuits",
    faction: "T'au Empire",
    operatives: [
      operative("Stealth Shas'vre", 12),
      operative("Stealth Shas'ui", 11),
      operative("Stealth Fusion Gunner", 11),
      operative("Stealth Burst Gunner", 11),
      operative("Marker Drone", 7)
    ],
    factionRules: [
      { id: "xv-fr-1", name: "Stealth Fields", description: "Attacks against this team from over 6\" worsen the attacker's BS by 1 unless the target has an Engage order on vantage." },
      { id: "xv-fr-2", name: "Marker Coordination", description: "If a target has a Marker token, the first shooting attack against it each round gains one free retained hit." },
      { id: "xv-fr-3", name: "Jet-Assisted Reposition", description: "After shooting, a ready operative can make a free 2\" move if it ends in cover." }
    ],
    tacOps: []
  },
  {
    id: "canoptek-circle",
    name: "Canoptek Circle",
    faction: "Necrons",
    operatives: [
      operative("Canoptek Overseer", 10),
      operative("Wraith", 12),
      operative("Scarab Swarm", 6),
      operative("Spyder Construct", 11),
      operative("Canoptek Sentinel", 10)
    ],
    factionRules: [
      { id: "cp-fr-1", name: "Subroutine Matrix", description: "At the start of each round, select one matrix mode: Aggression, Guard, or Recon; each grants a team-wide passive bonus." },
      { id: "cp-fr-2", name: "Canoptek Rebuild", description: "Once per battle round, restore D3 lost wounds to one visible construct within 6\" of your leader." },
      { id: "cp-fr-3", name: "Machine Persistence", description: "The first time each operative would be incapacitated, roll one die; on a 6, it remains with 1 wound." }
    ],
    tacOps: []
  },
  {
    id: "ratlings",
    name: "Ratlings",
    faction: "Astra Militarum",
    operatives: [
      operative("Ratling Boss", 7),
      operative("Ratling Sharpshooter", 7),
      operative("Ratling Spotter", 7),
      operative("Ratling Trapper", 7),
      operative("Ratling Scout", 7)
    ],
    factionRules: [
      { id: "rt-fr-1", name: "Deadeye Volley", description: "If a Ratling did not move this activation, retain one successful hit automatically when shooting." },
      { id: "rt-fr-2", name: "Small Targets", description: "Ratling operatives in cover can retain one additional defense die against shooting." },
      { id: "rt-fr-3", name: "Spotter Calls", description: "A Spotter can mark one visible enemy within 10\"; allies shooting that target ignore one cover retain." }
    ],
    tacOps: []
  },
  {
    id: "plague-marines",
    name: "Plague Marines",
    faction: "Death Guard",
    operatives: [
      operative("Plague Champion", 15),
      operative("Plague Gunner", 14),
      operative("Plague Heavy Gunner", 14),
      operative("Plague Fighter", 14),
      operative("Plague Marine", 14)
    ],
    factionRules: [
      { id: "pm-fr-1", name: "Disgustingly Resilient", description: "Each time this team suffers damage, reduce that damage by 1 to a minimum of 2 for each attack sequence." },
      { id: "pm-fr-2", name: "Contagion Aura", description: "Enemy operatives within 2\" of a Plague Marine have their melee attacks reduced by 1 attack die." },
      { id: "pm-fr-3", name: "Unstoppable Advance", description: "This team ignores movement penalties from difficult terrain and can perform mission actions while Engaged." }
    ],
    tacOps: []
  },
  {
    id: "sanctifiers",
    name: "Sanctifiers",
    faction: "Ecclesiarchy",
    operatives: [
      operative("Sanctifier Preacher", 9),
      operative("Redemptionist", 8),
      operative("Flame Zealot", 8),
      operative("Relic Bearer", 8),
      operative("Sanctifier Devout", 8)
    ],
    factionRules: [
      { id: "sf-fr-1", name: "Zealous Chorus", description: "When two or more allies are within 3\" of each other, they each gain +1 to Nerve test results and mission action checks." },
      { id: "sf-fr-2", name: "Purifying Flame", description: "The first flame weapon attack made each round by this team gains +1 attack die." },
      { id: "sf-fr-3", name: "Holy Relics", description: "At deployment, choose one relic bonus for your team: extra movement once per round, one auto-save per round, or one free re-roll per round." }
    ],
    tacOps: []
  },
  {
    id: "inquisitorial-agents",
    name: "Inquisitorial Agents",
    faction: "Inquisition",
    operatives: [
      operative("Inquisitor", 9),
      operative("Interrogator", 8),
      operative("Pistolier", 8),
      operative("Tome-Skull", 7),
      operative("Agent Operative", 8)
    ],
    factionRules: [
      { id: "ia-fr-1", name: "Authority of the Inquisition", description: "At the start of each round, choose one Directive that grants a team-wide tactical modifier until end of round." },
      { id: "ia-fr-2", name: "Interrogation Protocol", description: "An operative can perform Interrogate on an enemy within 1\" to gain one Intel token; spend Intel for re-rolls and objective bonuses." },
      { id: "ia-fr-3", name: "Asset Network", description: "Once per battle round, select one operative to gain +1 APL for mission actions only." }
    ],
    tacOps: []
  },
  {
    id: "imperial-navy-breachers",
    name: "Imperial Navy Breachers",
    faction: "Imperium",
    operatives: [
      operative("Navis Sergeant-at-Arms", 9),
      operative("Navis Axejack", 8),
      operative("Navis Gunner", 8),
      operative("Navis Endurant", 9),
      operative("Navis Armsman", 8)
    ],
    factionRules: [
      { id: "nb-fr-1", name: "Breach and Clear", description: "After opening a hatchway or destroying a barricade, one nearby ally can immediately perform a free Dash." },
      { id: "nb-fr-2", name: "Shieldwall", description: "If within 1\" of another Breacher, retain one extra defense die against ranged attacks." },
      { id: "nb-fr-3", name: "Boarding Tempo", description: "Each round, the first mission action performed by this team costs 1 AP less (minimum 1)." }
    ],
    tacOps: []
  },
  {
    id: "hunter-clade",
    name: "Hunter Clade",
    faction: "Adeptus Mechanicus",
    operatives: [
      operative("Skitarii Alpha", 8),
      operative("Sicarian Infiltrator", 9),
      operative("Sicarian Ruststalker", 9),
      operative("Skitarii Gunner", 8),
      operative("Skitarii Vanguard", 8)
    ],
    factionRules: [
      { id: "hc-fr-1", name: "Imperatives", description: "At the start of each battle round, choose one imperative to grant a team-wide buff to offense, defense, or mobility." },
      { id: "hc-fr-2", name: "Bionic Precision", description: "Sicarian operatives can re-roll one melee attack die each time they Fight." },
      { id: "hc-fr-3", name: "Data-Tether", description: "If a Skitarii is within 6\" of your leader, it can perform one mission action for 1 AP less (minimum 1) once per round." }
    ],
    tacOps: []
  },
  {
    id: "deathwatch",
    name: "Deathwatch",
    faction: "Space Marines",
    operatives: [
      operative("Watch Sergeant", 15),
      operative("Deathwatch Gunner", 14),
      operative("Deathwatch Fighter", 14),
      operative("Deathwatch Heavy Gunner", 14),
      operative("Deathwatch Warrior", 14)
    ],
    factionRules: [
      { id: "dw-fr-1", name: "Special-Issue Ammunition", description: "Each shooting attack can choose one ammo mode that changes AP, range, or crit effects." },
      { id: "dw-fr-2", name: "Mission Tactics", description: "At the start of each round, pick one target role (Leader, Gunner, or Specialist). Attacks against that role can re-roll one hit die." },
      { id: "dw-fr-3", name: "Angels of Death", description: "This team benefits from bolter discipline and shock assault style passives for ranged and melee flexibility." }
    ],
    tacOps: []
  },
  {
    id: "vespid-stingwings",
    name: "Vespid Stingwings",
    faction: "T'au Empire",
    operatives: [
      operative("Strain Leader", 9),
      operative("Stingwing Warrior", 8),
      operative("Stingwing Neutron Gunner", 8),
      operative("Stingwing Skyhunter", 8),
      operative("Stingwing Drone", 7)
    ],
    factionRules: [
      { id: "vs-fr-1", name: "Winged Assault", description: "Operatives in this team can ignore other operatives when moving and gain +2\" to Dash moves." },
      { id: "vs-fr-2", name: "Aerial Fireteams", description: "If a target has already been attacked by a Stingwing this round, subsequent Stingwing shooting gains one retained hit." },
      { id: "vs-fr-3", name: "Skirmish Withdrawal", description: "After resolving a shooting attack, the attacker can make a free 2\" move that must end in cover or behind terrain." }
    ],
    tacOps: []
  },
  {
    id: "phobos-strike-team",
    name: "Phobos Strike Team",
    faction: "Space Marines",
    operatives: [
      operative("Infiltrator Sergeant", 14),
      operative("Incursor Marksman", 13),
      operative("Reiver Warrior", 13),
      operative("Helix Adept", 13),
      operative("Phobos Warrior", 13)
    ],
    factionRules: [
      { id: "ph-fr-1", name: "Vanguard Deployment", description: "Before the first round, each operative can make a free 3\" move if it ends in cover." },
      { id: "ph-fr-2", name: "Omni-Scramblers", description: "Enemies cannot be set up from reserve within 6\" of your operatives." },
      { id: "ph-fr-3", name: "Tactical Obscuration", description: "Once per battle round, when targeted by shooting, one operative can count as obscured." }
    ],
    tacOps: []
  },
  {
    id: "wyrmblade",
    name: "Wyrmblade",
    faction: "Genestealer Cults",
    operatives: [
      operative("Kelermorph", 8),
      operative("Locus", 8),
      operative("Neophyte Leader", 8),
      operative("Neophyte Gunner", 7),
      operative("Neophyte Hybrid", 7)
    ],
    factionRules: [
      { id: "wy-fr-1", name: "Cult Ambush", description: "At deployment, select up to two operatives to ambush. They can be set up from concealment markers after round one starts." },
      { id: "wy-fr-2", name: "Hidden Operatives", description: "If this team controls no objective, one concealed operative can perform a free 1 AP mission action." },
      { id: "wy-fr-3", name: "Insidious Infiltration", description: "When a concealed operative is revealed, it gains +1 attack die for its first attack action that activation." }
    ],
    tacOps: []
  },
  {
    id: "hernkyn-yaegirs",
    name: "Hernkyn Yaegirs",
    faction: "Leagues of Votann",
    operatives: [
      operative("Yaegir Theyn", 9),
      operative("Yaegir Gunner", 8),
      operative("Yaegir Tracker", 8),
      operative("Yaegir Scout", 8),
      operative("Yaegir Warrior", 8)
    ],
    factionRules: [
      { id: "hy-fr-1", name: "Judgement Calls", description: "Each round, assign one Judgement token to an enemy that damaged your team. Attacks against judged targets can re-roll one hit die." },
      { id: "hy-fr-2", name: "Pathfinder Discipline", description: "This team ignores the first 2\" of difficult terrain moved each activation." },
      { id: "hy-fr-3", name: "Claim the Wastes", description: "When performing mission actions on objective markers in your territory, reduce AP cost by 1 (minimum 1)." }
    ],
    tacOps: []
  },
  {
    id: "raveners",
    name: "Raveners",
    faction: "Tyranids",
    operatives: [
      operative("Ravener Prime", 12),
      operative("Ravener Felltalon", 11),
      operative("Ravener Tremorscythe", 11),
      operative("Ravener Venomspitter", 11),
      operative("Ravener Warrior", 11),
      operative("Ravener Wrecker", 11)
    ],
    factionRules: [
      { id: "rv-fr-1", name: "Tunnel Hunters", description: "One operative can be placed in reserve and emerge from a marker at the start of a later round more than 6\" from enemies." },
      { id: "rv-fr-2", name: "Burrow and Strike", description: "After charging, a Ravener can perform a free 1\" reposition before fighting." },
      { id: "rv-fr-3", name: "Synapse Surge", description: "While within 6\" of the leader, Raveners can re-roll one melee attack die." }
    ],
    tacOps: []
  },
  {
    id: "tempestus-aquilons",
    name: "Tempestus Aquilons",
    faction: "Astra Militarum",
    operatives: [
      operative("Aquilon Tempestor", 9),
      operative("Aquilon Gunner", 8),
      operative("Aquilon Grenadier", 8),
      operative("Aquilon Comms", 8),
      operative("Aquilon Trooper", 8)
    ],
    factionRules: [
      { id: "ta-fr-1", name: "Aerial Insertion", description: "Up to two operatives can start in reserve and deploy from your drop zone at the start of round two or later." },
      { id: "ta-fr-2", name: "Storm Discipline", description: "If an operative has not moved this activation, it can re-roll one shooting hit die." },
      { id: "ta-fr-3", name: "Vox Command Net", description: "A comms operative can issue one order each round to grant a friendly operative +1 APL for objective actions." }
    ],
    tacOps: []
  },
  {
    id: "goremongers",
    name: "Goremongers",
    faction: "Chaos",
    operatives: [
      operative("Goremonger Champion", 10),
      operative("Butcher", 9),
      operative("Skull Hunter", 9),
      operative("Blood-Runner", 9),
      operative("Goremonger Warrior", 9)
    ],
    factionRules: [
      { id: "gm-fr-1", name: "Blood Tithe", description: "Gain one Blood token each time either player loses an operative in melee. Spend Blood tokens for melee bonuses." },
      { id: "gm-fr-2", name: "Chainblade Momentum", description: "When a Goremonger incapacitates an enemy in melee, it can immediately make a free 2\" move." },
      { id: "gm-fr-3", name: "Skull Oath", description: "At the start of each round, pick one enemy operative as oath target. Melee attacks against that target can re-roll one attack die." }
    ],
    tacOps: []
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
  factionRules: army.factionRules ?? [],
  tacOps: army.tacOps ?? [],
  operatives: army.operatives.map((baseOperative) => buildOperative(army.id, baseOperative))
}));

export const DEFAULT_ARMY_ID = KILL_TEAM_ARMIES[0].id;