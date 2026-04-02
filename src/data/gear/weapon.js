export const WEAPON = [
  {
    name: "Eclipse Atlatl",
    slot: 'weapon',
    regions: ["Varlamore"],
    requirements: [{ skill: "attack", level: 50 }, { skill: "strength", level: 50 }, { skill: "Ranged", level: 75 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 87 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 40, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
    speed: 4,
    twoHanded: true,
    ammoType: 'atlatl_darts',
    combatStyle: {
      accurate: 4,
      rapid: 3,
      longrange: 4
    },
    sets: ["","",""],
  },
  {
    name: "Dual Macuahuitl",
    slot: 'weapon',
    regions: ["Varlamore"],
    requirements: [{ skill: "Attack", level: 70 }, { skill: "Strength", level: 75 }],
    bonuses: {
      attack:  { stab: 115, slash: -4, crush: 121, magic: -4, ranged: 0 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 81, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
    speed: 4,
    twoHanded: true,
    combatStyle: {
      pound: 4,
      pummel: 4,
      spike: 4,
      block: 4
    },
    effect: {
          "type": "multiply_totals",
          "stats": [],
          "description": "Dual Macuahuitl: performs two independently rolled hits per attack"
    },
    sets: ["","",""],
  },
  {
    name: "Blue Moon Spear",
    slot: 'weapon',
    regions: ["Varlamore"],
    requirements: [{ skill: "Attack", level: 70 }, { skill: "Magic", level: 75 }],
    bonuses: {
      attack:  { stab: 70, slash: 62, crush: 62, magic: 30, ranged: 0 },
      defence: { stab: 2, slash: 3, crush: 1, magic: 15, ranged: 0 },
      other:   { meleeStrength: 71, rangedStrength: 0, magicDamage: 5, prayer: 0 },
    },
    speed: 5,
    twoHanded: true,
    combatStyle: {
      jab: 5,
      swipe: 5,
      pound: 5,
      spell: 5,
      defensive_spell: 5
    },
    sets: ["","",""],
  },
  {
    name: "Glacial Temotli",
    slot: 'weapon',
    regions: ["Varlamore"],
    requirements: [{ skill: "attack", level: 55 }],
    bonuses: {
      attack:  { stab: 11, slash: 0, crush: 72, magic: 0, ranged: 0 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 64, rangedStrength: 0, magicDamage: 0, prayer: 2 },
    },
    speed: 4,
    twoHanded: true,
    combatStyle: {
      pound: 4,
      pummel: 4,
      block: 4
    },
    effect: {
          "type": "multiply_totals",
          "stats": [],
          "description": "Glacial Temotli: performs two independently rolled hits per attack"
    },
  },
  {
    name: "Sulphur Blades",
    slot: 'weapon',
    regions: ["Varlamore"],
    requirements: [{ skill: "Attack", level: 55 }],
    bonuses: {
      attack:  { stab: 11, slash: 72, crush: 0, magic: 0, ranged: 0 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 64, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
    speed: 4,
    twoHanded: true,
    combatStyle: {
      chop: 4,
      slash: 4,
      lunge: 4,
      block: 4
    },
    effect: {
          "type": "multiply_totals",
          "stats": [],
          "description": "Sulphur Blades: performs two independently rolled hits per attack"
    },
  },
  {
    name: "Eye of Ayak",
    slot: 'weapon',
    regions: ["Varlamore"],
    requirements: [{ skill: "Magic", level: 83 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 0, magic: 30, ranged: 0 },
      defence: { stab: 1, slash: 5, crush: 5, magic: 10, ranged: 0 },
      other:   { meleeStrength: 0, rangedStrength: 0, magicDamage: 0, prayer: 2 },
    },
    speed: 3,
    twoHanded: false,
    combatStyle: {
      accurate: 3,
      accurate_2: 3,
      longrange: 3
    },
  },
  {
    name: "Dragon Hunter Wand",
    slot: 'weapon',
    regions: ["Varlamore"],
    requirements: [{ skill: "Magic", level: 65 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 0, magic: 16, ranged: 0 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 16, ranged: 0 },
      other:   { meleeStrength: 0, rangedStrength: 0, magicDamage: 10, prayer: 0 },
    },
    speed: 5,
    twoHanded: false,
    combatStyle: {
      bash: 5,
      pound: 5,
      focus: 5,
      spell: 5,
      defensive_spell: 5
    },
    effect: {
          "type": "multiply_totals",
          "stats": [],
          "description": "Dragon Hunter Wand: accuracy is increased by 75% and damage increased by 40% when fighting draconic creatures"
    },
  },
  {
    name: "Tonalztics of Ralos",
    slot: 'weapon',
    regions: ["Varlamore"],
    requirements: [{ skill: "Ranged", level: 75 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 115 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 0, rangedStrength: 55, magicDamage: 0, prayer: 2 },
    },
    speed: 7,
    twoHanded: false,
    ammoType: 'atlatl_darts',
    combatStyle: {
      accurate: 7,
      rapid: 6,
      longrange: 7
    },
  },
  {
    name: "Scorching Bow",
    slot: 'weapon',
    regions: ["Varlamore"],
    requirements: [{ skill: "Ranged", level: 77 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 124 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 0, rangedStrength: 40, magicDamage: 0, prayer: 0 },
    },
    speed: 5,
    twoHanded: true,
    ammoType: 'arrows',
    combatStyle: {
      accurate: 5,
      rapid: 4,
      longrange: 5
    },
    effect: {
          "type": "multiply_totals",
          "stats": [],
          "description": "Scorching Bow: has a 30% accuracy and damage bonus against demonic creatures"
    },
  },
  {
    name: "Soulreaper Axe",
    slot: 'weapon',
    regions: ["Asgarnia","Fremennik","Desert"],
    requirements: [{ skill: "Attack", level: 80 }, { skill: "Strength", level: 80 }],
    bonuses: {
      attack:  { stab: 28, slash: 134, crush: 66, magic: 0, ranged: 0 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 121, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
    speed: 5,
    twoHanded: true,
    combatStyle: {
      chop: 5,
      hack: 5,
      smash: 5,
      block: 5
    },
  },
  {
    name: "Tzhaar-ket-om",
    slot: 'weapon',
    regions: ["Karamja"],
    requirements: [{ skill: "Strength", level: 60 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 80, magic: -4, ranged: 0 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 85, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
    speed: 7,
    twoHanded: true,
    combatStyle: {
      pound: 7,
      pummel: 7,
      block: 7
    },
    sets: [],
  },
  {
    name: "Toktz-xil-ul",
    slot: 'weapon',
    regions: ["Karamja"],
    requirements: [{ skill: "Ranged", level: 60 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 69 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 0, rangedStrength: 49, magicDamage: 0, prayer: 0 },
    },
    speed: 4,
    twoHanded: false,
    ammoType: 'thrown',
    combatStyle: {
      accurate: 4,
      rapid: 3,
      longrange: 4
    },
    sets: [],
  },
  {
    name: "Toktz-mej-tal",
    slot: 'weapon',
    regions: ["Karamja"],
    requirements: [{ skill: "Magic", level: 60 }, { skill: "attack", level: 60 }],
    bonuses: {
      attack:  { stab: 15, slash: -1, crush: 55, magic: 15, ranged: 0 },
      defence: { stab: 10, slash: 15, crush: 5, magic: 15, ranged: 0 },
      other:   { meleeStrength: 55, rangedStrength: 0, magicDamage: 0, prayer: 5 },
    },
    speed: 6,
    twoHanded: true,
    combatStyle: {
      bash: 6,
      pound: 6,
      focus: 6,
      spell: 6,
      defensive_spell: 6
    },
  },
  {
    name: "Toktz-xil-ak",
    slot: 'weapon',
    regions: ["Karamja"],
    requirements: [{ skill: "Attack", level: 60 }],
    bonuses: {
      attack:  { stab: 47, slash: 38, crush: -2, magic: 0, ranged: 0 },
      defence: { stab: 2, slash: 3, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 49, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
    speed: 4,
    twoHanded: false,
    combatStyle: {
      stab: 4,
      lunge: 4,
      slash: 4,
      block: 4
    },
  },
  {
    name: "Toktz-xil-ek",
    slot: 'weapon',
    regions: ["Karamja"],
    requirements: [{ skill: "Attack", level: 60 }],
    bonuses: {
      attack:  { stab: 16, slash: 48, crush: 0, magic: 0, ranged: 0 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 39, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
    speed: 4,
    twoHanded: false,
    combatStyle: {
      chop: 4,
      slash: 4,
      lunge: 4,
      block: 4
    },
  },
  {
    name: "Armadyl Godsword",
    slot: 'weapon',
    regions: ["Asgarnia"],
    requirements: [{ skill: "Attack", level: 75 }],
    bonuses: {
      attack:  { stab: 0, slash: 132, crush: 80, magic: 0, ranged: 0 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 132, rangedStrength: 0, magicDamage: 0, prayer: 8 },
    },
    speed: 6,
    twoHanded: true,
    combatStyle: {
      chop: 6,
      slash: 6,
      smash: 6,
      block: 6
    },
  },
  {
    name: "Bandos Godsword",
    slot: 'weapon',
    regions: ["Asgarnia"],
    requirements: [{ skill: "Attack", level: 75 }],
    bonuses: {
      attack:  { stab: 0, slash: 132, crush: 80, magic: 0, ranged: 0 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 132, rangedStrength: 0, magicDamage: 0, prayer: 8 },
    },
    speed: 6,
    twoHanded: true,
    combatStyle: {
      chop: 6,
      slash: 6,
      smash: 6,
      block: 6
    },
  },
  {
    name: "Saradomin Sword",
    slot: 'weapon',
    regions: ["Asgarnia"],
    requirements: [{ skill: "Attack", level: 70 }],
    bonuses: {
      attack:  { stab: 0, slash: 82, crush: 60, magic: 0, ranged: 0 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 82, rangedStrength: 0, magicDamage: 0, prayer: 2 },
    },
    speed: 4,
    twoHanded: true,
    combatStyle: {
      chop: 4,
      slash: 4,
      smash: 4,
      block: 4
    },
  },
  {
    name: "Armadyl Crossbow",
    slot: 'weapon',
    regions: ["Asgarnia"],
    requirements: [{ skill: "Ranged", level: 70 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 100 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 0, rangedStrength: 0, magicDamage: 0, prayer: 1 },
    },
    speed: 6,
    twoHanded: false,
    ammoType: 'bolts',
    combatStyle: {
      accurate: 6,
      rapid: 5,
      longrange: 6
    },
  },
  {
    name: "Steam Battlestaff",
    slot: 'weapon',
    regions: ["Asgarnia"],
    requirements: [{ skill: "Attack", level: 30 }, { skill: "Magic", level: 30 }],
    bonuses: {
      attack:  { stab: 7, slash: -1, crush: 28, magic: 12, ranged: 0 },
      defence: { stab: 2, slash: 3, crush: 1, magic: 12, ranged: 0 },
      other:   { meleeStrength: 35, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
    speed: 5,
    twoHanded: false,
    combatStyle: {
      bash: 5,
      pound: 5,
      focus: 5,
      spell: 5,
      defensive_spell: 5
    },
  },
  {
    name: "Zamorakian Spear",
    slot: 'weapon',
    regions: ["Asgarnia"],
    requirements: [{ skill: "Attack", level: 70 }],
    bonuses: {
      attack:  { stab: 85, slash: 65, crush: 65, magic: 0, ranged: 0 },
      defence: { stab: 13, slash: 13, crush: 12, magic: 0, ranged: 13 },
      other:   { meleeStrength: 75, rangedStrength: 0, magicDamage: 0, prayer: 2 },
    },
    speed: 4,
    twoHanded: true,
    combatStyle: {
      lunge: 4,
      swipe: 4,
      pound: 4,
      block: 4
    },
  },
  {
    name: "Staff of the Dead",
    slot: 'weapon',
    regions: ["Asgarnia"],
    requirements: [{ skill: "Attack", level: 75 }, { skill: "Magic", level: 75 }],
    bonuses: {
      attack:  { stab: 55, slash: 70, crush: 0, magic: 17, ranged: 0 },
      defence: { stab: 0, slash: 3, crush: 3, magic: 17, ranged: 0 },
      other:   { meleeStrength: 72, rangedStrength: 0, magicDamage: 15, prayer: 0 },
    },
    speed: 4,
    twoHanded: false,
    combatStyle: {
      jab: 4,
      swipe: 4,
      pound: 4,
      spell: 5,
      defensive_spell: 5
    },
  },
  {
    name: "Ancient Godsword",
    slot: 'weapon',
    regions: ["Asgarnia"],
    requirements: [{ skill: "Attack", level: 75 }],
    bonuses: {
      attack:  { stab: 0, slash: 132, crush: 80, magic: 0, ranged: 0 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 132, rangedStrength: 0, magicDamage: 0, prayer: 8 },
    },
    speed: 6,
    twoHanded: true,
    combatStyle: {
      chop: 6,
      slash: 6,
      smash: 6,
      block: 6
    },
  },
  {
    name: "Dragon Axe",
    slot: 'weapon',
    regions: ["Fremennik","Kourend"],
    requirements: [{ skill: "Attack", level: 60 }],
    bonuses: {
      attack:  { stab: -2, slash: 38, crush: 32, magic: 0, ranged: 0 },
      defence: { stab: 0, slash: 1, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 42, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
    speed: 5,
    twoHanded: false,
    combatStyle: {
      chop: 5,
      hack: 5,
      smash: 5,
      block: 5
    },
  },
  {
    name: "Leaf-bladed Battleaxe",
    slot: 'weapon',
    regions: ["Fremennik","Tirannwn"],
    requirements: [{ skill: "Attack", level: 65 }, { skill: "Slayer", level: 55 }],
    bonuses: {
      attack:  { stab: -2, slash: 72, crush: 72, magic: 0, ranged: 0 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: -1 },
      other:   { meleeStrength: 92, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
    speed: 5,
    twoHanded: false,
    combatStyle: {
      chop: 5,
      hack: 5,
      smash: 5,
      block: 5
    },
  },
  {
    name: "Brine Sabre",
    slot: 'weapon',
    regions: ["Fremennik"],
    requirements: [{ skill: "Attack", level: 40 }],
    bonuses: {
      attack:  { stab: 7, slash: 47, crush: -2, magic: 0, ranged: 0 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 46, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
    speed: 4,
    twoHanded: false,
    combatStyle: {
      chop: 4,
      slash: 4,
      lunge: 4,
      block: 4
    },
  },
  {
    name: "Mud Battlestaff",
    slot: 'weapon',
    regions: ["Fremennik"],
    requirements: [{ skill: "Attack", level: 30 }, { skill: "Magic", level: 30 }],
    bonuses: {
      attack:  { stab: 7, slash: -1, crush: 28, magic: 12, ranged: 0 },
      defence: { stab: 2, slash: 3, crush: 1, magic: 12, ranged: 0 },
      other:   { meleeStrength: 35, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
    speed: 5,
    twoHanded: false,
    combatStyle: {
      bash: 5,
      pound: 5,
      focus: 5,
      spell: 5,
      defensive_spell: 5
    },
  },
  {
    name: "Ancient Sceptre",
    slot: 'weapon',
    regions: ["Fremennik"],
    requirements: [{ skill: "Magic", level: 62 }],
    bonuses: {
      attack:  { stab: 20, slash: -1, crush: 50, magic: 20, ranged: 0 },
      defence: { stab: 2, slash: 3, crush: 1, magic: 15, ranged: 0 },
      other:   { meleeStrength: 60, rangedStrength: 0, magicDamage: 5, prayer: -1 },
    },
    speed: 4,
    twoHanded: false,
    combatStyle: {
      bash: 4,
      pound: 4,
      focus: 4,
      spell: 4,
      defensive_spell: 4
    },
  },
  {
    name: "Venator Bow",
    slot: 'weapon',
    regions: ["Fremennik"],
    requirements: [{ skill: "Ranged", level: 80 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 90 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 0, rangedStrength: 25, magicDamage: 0, prayer: 0 },
    },
    speed: 5,
    twoHanded: true,
    ammoType: 'arrows',
    combatStyle: {
      accurate: 5,
      rapid: 4,
      longrange: 5
    },
  },
  {
    name: "Trident of the Seas",
    slot: 'weapon',
    regions: ["Kandarin"],
    requirements: [{ skill: "Magic", level: 75 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 0, magic: 15, ranged: 0 },
      defence: { stab: 2, slash: 3, crush: 1, magic: 15, ranged: 0 },
      other:   { meleeStrength: 0, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
    speed: 4,
    twoHanded: false,
    combatStyle: {
      accurate: 4,
      accurate_2: 4,
      longrange: 4
    },
  },
  {
    name: "Smoke Battlestaff",
    slot: 'weapon',
    regions: ["Kandarin"],
    requirements: [{ skill: "Attack", level: 30 }, { skill: "Magic", level: 30 }],
    bonuses: {
      attack:  { stab: 7, slash: -1, crush: 28, magic: 12, ranged: 0 },
      defence: { stab: 2, slash: 3, crush: 1, magic: 12, ranged: 0 },
      other:   { meleeStrength: 35, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
    speed: 5,
    twoHanded: false,
    combatStyle: {
      bash: 5,
      pound: 5,
      focus: 5,
      spell: 5,
      defensive_spell: 5
    },
  },
  {
    name: "Mist Battlestaff",
    slot: 'weapon',
    regions: ["Kandarin"],
    requirements: [{ skill: "Attack", level: 30 }, { skill: "Magic", level: 30 }],
    bonuses: {
      attack:  { stab: 7, slash: -1, crush: 28, magic: 12, ranged: 0 },
      defence: { stab: 2, slash: 3, crush: 1, magic: 12, ranged: 0 },
      other:   { meleeStrength: 35, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
    speed: 5,
    twoHanded: false,
    combatStyle: {
      bash: 5,
      pound: 5,
      focus: 5,
      spell: 5,
      defensive_spell: 5
    },
  },
  {
    name: "Warped Sceptre",
    slot: 'weapon',
    regions: ["Kandarin"],
    requirements: [{ skill: "Magic", level: 62 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 0, magic: 12, ranged: 0 },
      defence: { stab: 2, slash: 3, crush: 1, magic: 12, ranged: 0 },
      other:   { meleeStrength: 0, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
    speed: 4,
    twoHanded: false,
    combatStyle: {
      accurate: 4,
      accurate_2: 4,
      longrange: 4
    },
  },
  {
    name: "Heavy Ballista",
    slot: 'weapon',
    regions: ["Kandarin"],
    requirements: [{ skill: "Ranged", level: 75 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 125 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 0, rangedStrength: 15, magicDamage: 0, prayer: 0 },
    },
    speed: 7,
    twoHanded: true,
    ammoType: 'javelins',
    combatStyle: {
      accurate: 7,
      rapid: 6,
      longrange: 7
    },
  },
  {
    name: "Light Ballista",
    slot: 'weapon',
    regions: ["Kandarin"],
    requirements: [{ skill: "Ranged", level: 65 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 110 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 0, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
    speed: 7,
    twoHanded: true,
    ammoType: 'javelins',
    combatStyle: {
      accurate: 7,
      rapid: 6,
      longrange: 7
    },
  },
  {
    name: "Osmumten's Fang",
    slot: 'weapon',
    regions: ["Desert"],
    requirements: [{ skill: "Attack", level: 80 }],
    bonuses: {
      attack:  { stab: 105, slash: 75, crush: 0, magic: 0, ranged: 0 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 103, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
    speed: 5,
    twoHanded: false,
    combatStyle: {
      stab: 5,
      lunge: 5,
      slash: 5,
      block: 5
    },
    effect: {
          "type": "multiply_totals",
          "stats": [],
          "description": "Osmumten's Fang: re-rolls accuracy on an unsuccessful hit"
    },
  },
  {
    name: "Tumeken's Shadow",
    slot: 'weapon',
    regions: ["Desert", "Kourend", "Morytania"],
    requirements: [{ skill: "Magic", level: 85 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 0, magic: 35, ranged: 0 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 20, ranged: 0 },
      other:   { meleeStrength: 0, rangedStrength: 0, magicDamage: 0, prayer: 1 },
    },
    speed: 5,
    twoHanded: true,
    combatStyle: {
      accurate: 5,
      accurate_2: 5,
      longrange: 5
    },
    effect: {
          "type": "multiply_totals",
          "stats": [
                {
                      "category": "attack",
                      "stat": "magic",
                      "factor": 3
                },
                {
                      "category": "other",
                      "stat": "magicDamage",
                      "factor": 3
                }
          ],
          "description": "Tumeken's Shadow: ×3 magic attack & magic damage %"
    },
  },
  {
    name: "Dragon Pickaxe",
    slot: 'weapon',
    regions: ["Desert","Fremennik","Wilderness"],
    requirements: [{ skill: "Attack", level: 60 }],
    bonuses: {
      attack:  { stab: 38, slash: -2, crush: 32, magic: 0, ranged: 0 },
      defence: { stab: 0, slash: 1, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 42, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
    speed: 5,
    twoHanded: false,
    combatStyle: {
      spike: 5,
      impale: 5,
      smash: 5,
      block: 5
    },
  },
  {
    name: "Dragon 2h Sword",
    slot: 'weapon',
    regions: ["Desert"],
    requirements: [{ skill: "Attack", level: 60 }],
    bonuses: {
      attack:  { stab: -4, slash: 92, crush: 80, magic: -4, ranged: 0 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: -1 },
      other:   { meleeStrength: 93, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
    speed: 7,
    twoHanded: true,
    combatStyle: {
      chop: 7,
      slash: 7,
      smash: 7,
      block: 7
    },
  },
  {
    name: "Dust Battlestaff",
    slot: 'weapon',
    regions: ["Desert"],
    requirements: [{ skill: "Attack", level: 30 }, { skill: "Magic", level: 30 }],
    bonuses: {
      attack:  { stab: 7, slash: -1, crush: 28, magic: 12, ranged: 0 },
      defence: { stab: 2, slash: 3, crush: 1, magic: 12, ranged: 0 },
      other:   { meleeStrength: 35, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
    speed: 5,
    twoHanded: false,
    combatStyle: {
      bash: 5,
      pound: 5,
      focus: 5,
      spell: 5,
      defensive_spell: 5
    },
  },
  {
    name: "Dragon Harpoon",
    slot: 'weapon',
    regions: ["Desert"],
    requirements: [{ skill: "Attack", level: 60 }],
    bonuses: {
      attack:  { stab: 38, slash: 32, crush: 0, magic: 0, ranged: 0 },
      defence: { stab: 0, slash: 1, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 42, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
    speed: 5,
    twoHanded: false,
    combatStyle: {
      stab: 5,
      lunge: 5,
      slash: 5,
      block: 5
    },
  },
  {
    name: "Scythe of Vitur",
    slot: 'weapon',
    regions: ["Morytania", "Kourend", "Desert"],
    requirements: [{ skill: "Attack", level: 80 }, { skill: "Strength", level: 90 }],
    bonuses: {
      attack:  { stab: 75, slash: 125, crush: 30, magic: -6, ranged: 0 },
      defence: { stab: -2, slash: 8, crush: 10, magic: 0, ranged: 0 },
      other:   { meleeStrength: 75, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
    speed: 5,
    twoHanded: true,
    combatStyle: {
      reap: 5,
      chop: 5,
      jab: 5,
      block: 5
    },
    effect: {
      "type": "multiply_totals",
      "stats": [],
      "description": "Scythe of Vitur:  When attacking a large creature, the scythe will instead apply multiple hits to them."
    },
  },
  {
    name: "Sanguinesti Staff",
    slot: 'weapon',
    regions: ["Morytania"],
    requirements: [{ skill: "Magic", level: 75 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 0, magic: 25, ranged: -4 },
      defence: { stab: 2, slash: 3, crush: 1, magic: 15, ranged: 0 },
      other:   { meleeStrength: 0, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
    speed: 4,
    twoHanded: false,
    combatStyle: {
      accurate: 4,
      accurate_2: 4,
      longrange: 4
    },
  },
  {
    name: "Ghrazi Rapier",
    slot: 'weapon',
    regions: ["Morytania"],
    requirements: [{ skill: "Attack", level: 80 }],
    bonuses: {
      attack:  { stab: 94, slash: 55, crush: 0, magic: 0, ranged: 0 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 89, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
    speed: 4,
    twoHanded: false,
    combatStyle: {
      stab: 4,
      lunge: 4,
      slash: 4,
      block: 4
    },
  },
  {
    name: "Karil's Crossbow",
    slot: 'weapon',
    regions: ["Morytania"],
    requirements: [{ skill: "Ranged", level: 70 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 0, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
    speed: 4,
    twoHanded: true,
    ammoType: 'bolt_rack',
    combatStyle: {
      accurate: 4,
      rapid: 3,
      longrange: 4
    },
  },
  {
    name: "Nightmare Staff",
    slot: 'weapon',
    regions: ["Morytania"],
    requirements: [{ skill: "Magic", level: 65 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 0, magic: 16, ranged: 0 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 14, ranged: 0 },
      other:   { meleeStrength: 0, rangedStrength: 0, magicDamage: 15, prayer: 0 },
    },
    speed: 5,
    twoHanded: false,
    combatStyle: {
      bash: 5,
      pound: 5,
      focus: 5,
      spell: 5,
      defensive_spell: 5
    },
  },
  {
    name: "Inquisitor's Mace",
    slot: 'weapon',
    regions: ["Morytania"],
    requirements: [{ skill: "Attack", level: 75 }],
    bonuses: {
      attack:  { stab: 52, slash: -4, crush: 95, magic: 0, ranged: 0 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 89, rangedStrength: 0, magicDamage: 0, prayer: 2 },
    },
    speed: 4,
    twoHanded: false,
    combatStyle: {
      pound: 4,
      pummel: 4,
      spike: 4,
      block: 4
    },
  },
  {
    name: "Granite Maul",
    slot: 'weapon',
    regions: ["Morytania"],
    requirements: [{ skill: "Attack", level: 50 }, { skill: "Strength", level: 50 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 81, magic: 0, ranged: 0 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 79, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
    speed: 7,
    twoHanded: true,
    combatStyle: {
      pound: 7,
      pummel: 7,
      block: 7
    },
  },
  {
    name: "Granite Hammer",
    slot: 'weapon',
    regions: ["Morytania"],
    requirements: [{ skill: "Attack", level: 40 }, { skill: "Strength", level: 40 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 57, magic: -3, ranged: -1 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 56, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
    speed: 4,
    twoHanded: false,
    combatStyle: {
      pound: 4,
      pummel: 4,
      block: 4
    },
  },
  {
    name: "Noxious Halberd",
    slot: 'weapon',
    regions: ["Morytania"],
    requirements: [{ skill: "Attack", level: 80 }, { skill: "Slayer", level: 90 }],
    bonuses: {
      attack:  { stab: 80, slash: 132, crush: 0, magic: 0, ranged: 0 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 142, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
    speed: 5,
    twoHanded: true,
    combatStyle: {
      jab: 5,
      swipe: 5,
      fend: 5
    },
  },
  {
    name: "Toxic Blowpipe",
    slot: 'weapon',
    regions: ["Tirannwn"],
    requirements: [{ skill: "Ranged", level: 75 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 30 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 0, rangedStrength: 20, magicDamage: 0, prayer: 0 },
    },
    speed: 3,
    twoHanded: true,
    ammoType: 'darts',
    combatStyle: {
      accurate: 3,
      rapid: 2,
      longrange: 3
    },
  },
  {
    name: "Uncharged Toxic Trident",
    slot: 'weapon',
    regions: ["Tirannwn"],
    requirements: [{ skill: "Magic", level: 75 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 0, magic: 25, ranged: 0 },
      defence: { stab: 2, slash: 3, crush: 1, magic: 15, ranged: 0 },
      other:   { meleeStrength: 0, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
    speed: 4,
    twoHanded: false,
    combatStyle: {
      accurate: 4,
      accurate_2: 4,
      longrange: 4
    },
  },
  {
    name: "Dark Bow",
    slot: 'weapon',
    regions: ["Tirannwn"],
    requirements: [{ skill: "Ranged", level: 60 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 95 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 0, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
    speed: 9,
    twoHanded: true,
    ammoType: 'arrows',
    combatStyle: {
      accurate: 9,
      rapid: 8,
      longrange: 9
    },
  },
  {
    name: "Bow of Faerdhinen (c)",
    slot: 'weapon',
    ammoType: 'thrown',
    regions: ["Tirannwn"],
    requirements: [{ skill: "Ranged", level: 80 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 128 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 0, rangedStrength: 106, magicDamage: 0, prayer: 0 },
    },
    speed: 5,
    twoHanded: true,
    combatStyle: {
      accurate: 5,
      rapid: 4,
      longrange: 5
    },
  },
  {
    name: "Crystal Bow",
    slot: 'weapon',
    ammoType: 'thrown',
    regions: ["Tirannwn"],
    requirements: [{ skill: "Ranged", level: 70 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 100 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 0, rangedStrength: 78, magicDamage: 0, prayer: 0 },
    },
    speed: 5,
    twoHanded: true,
    combatStyle: {
      accurate: 5,
      rapid: 4,
      longrange: 5
    },
  },
  {
    name: "Viggora's Chainmace (u)",
    slot: 'weapon',
    regions: ["Wilderness"],
    requirements: [{ skill: "Attack", level: 60 }],
    bonuses: {
      attack:  { stab: 53, slash: -2, crush: 67, magic: 0, ranged: 0 },
      defence: { stab: 0, slash: 1, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 66, rangedStrength: 0, magicDamage: 0, prayer: 2 },
    },
    speed: 4,
    twoHanded: false,
    combatStyle: {
      pound: 4,
      pummel: 4,
      spike: 4,
      block: 4
    },
  },
  {
    name: "Craw's Bow (u)",
    slot: 'weapon',
    ammoType: 'arrows',
    regions: ["Wilderness"],
    requirements: [{ skill: "Ranged", level: 60 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 75 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 0, rangedStrength: 60, magicDamage: 0, prayer: 0 },
    },
    speed: 4,
    twoHanded: true,
    combatStyle: {
      accurate: 4,
      rapid: 3,
      longrange: 4
    },
  },
  {
    name: "Webweaver Bow",
    slot: 'weapon',
    ammoType: 'arrows',
    regions: ["Wilderness"],
    requirements: [{ skill: "Ranged", level: 70 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 85 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 0, rangedStrength: 65, magicDamage: 0, prayer: 0 },
    },
    speed: 4,
    twoHanded: true,
    combatStyle: {
      accurate: 4,
      rapid: 3,
      longrange: 4
    },
  },
  {
    name: "Thammaron's Sceptre (u)",
    slot: 'weapon',
    regions: ["Wilderness"],
    requirements: [{ skill: "Magic", level: 75 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 0, magic: 15, ranged: 0 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 20, ranged: 0 },
      other:   { meleeStrength: 0, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
    speed: 4,
    twoHanded: false,
    combatStyle: {
      accurate: 4,
      accurate_2: 4,
      longrange: 4
    },
  },
  {
    name: "Voidwaker",
    slot: 'weapon',
    regions: ["Wilderness"],
    requirements: [{ skill: "Attack", level: 75 }],
    bonuses: {
      attack:  { stab: 70, slash: 80, crush: -2, magic: 5, ranged: 0 },
      defence: { stab: 0, slash: 1, crush: 0, magic: 2, ranged: 0 },
      other:   { meleeStrength: 80, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
    speed: 4,
    twoHanded: false,
    combatStyle: {
      chop: 4,
      slash: 4,
      lunge: 4,
      block: 4
    },
  },
  {
    name: "Abyssal Whip",
    slot: 'weapon',
    regions: ["Morytania","Kourend","Wilderness"],
    requirements: [{ skill: "Attack", level: 70 }],
    bonuses: {
      attack:  { stab: 0, slash: 82, crush: 0, magic: 0, ranged: 0 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 82, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
    speed: 4,
    twoHanded: false,
    combatStyle: {
      flick: 4,
      lash: 4,
      deflect: 4
    },
  },
  {
    name: "Abyssal Dagger",
    slot: 'weapon',
    regions: ["Morytania","Kourend","Wilderness"],
    requirements: [{ skill: "Attack", level: 70 }],
    bonuses: {
      attack:  { stab: 75, slash: 40, crush: -4, magic: 1, ranged: 0 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 1, ranged: 0 },
      other:   { meleeStrength: 75, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
    speed: 4,
    twoHanded: false,
    combatStyle: {
      stab: 4,
      lunge: 4,
      slash: 4,
      block: 4
    },
  },
  {
    name: "Twisted Bow",
    slot: 'weapon',
    regions: ["Kourend", "Desert", " Morytania"],
    requirements: [{ skill: "Ranged", level: 75 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 70 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 0, rangedStrength: 20, magicDamage: 0, prayer: 0 },
    },
    speed: 6,
    twoHanded: true,
    ammoType: 'arrows',
    combatStyle: {
      accurate: 6,
      rapid: 5,
      longrange: 6
    },
    effect: {
      "type": "multiply_totals",
      "stats": [],
      "description": "Twisted Bow: the higher the target's Magic level, the higher the bow's accuracy and damage."
    },
  },
  {
    name: "Dragon Hunter Crossbow",
    slot: 'weapon',
    regions: ["Kourend"],
    requirements: [{ skill: "Ranged", level: 65 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 95 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 0, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
    speed: 6,
    twoHanded: false,
    ammoType: 'bolts',
    combatStyle: {
      accurate: 6,
      rapid: 5,
      longrange: 6
    },
  },
  {
    name: "Dragon Claws",
    slot: 'weapon',
    regions: ["Kourend"],
    requirements: [{ skill: "Attack", level: 60 }],
    bonuses: {
      attack:  { stab: 41, slash: 57, crush: -4, magic: 0, ranged: 0 },
      defence: { stab: 13, slash: 26, crush: 7, magic: 0, ranged: 0 },
      other:   { meleeStrength: 56, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
    speed: 4,
    twoHanded: true,
    combatStyle: {},
  },
  {
    name: "Elder Maul",
    slot: 'weapon',
    regions: ["Kourend"],
    requirements: [{ skill: "Attack", level: 75 }, { skill: "Strength", level: 50 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 135, magic: 0, ranged: 0 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 147, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
    speed: 6,
    twoHanded: true,
    combatStyle: {
      pound: 6,
      pummel: 6,
      block: 6
    },
  },
  {
    name: "Kodai Wand",
    slot: 'weapon',
    regions: ["Kourend"],
    requirements: [{ skill: "Magic", level: 80 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 0, magic: 28, ranged: 0 },
      defence: { stab: 0, slash: 3, crush: 3, magic: 20, ranged: 0 },
      other:   { meleeStrength: 0, rangedStrength: 0, magicDamage: 15, prayer: 0 },
    },
    speed: 4,
    twoHanded: false,
    combatStyle: {
      bash: 4,
      pound: 4,
      focus: 4,
      spell: 4,
      defensive_spell: 4
    },
  },
  {
    name: "Dragon Hunter Lance",
    slot: 'weapon',
    regions: ["Kourend"],
    requirements: [{ skill: "Attack", level: 78 }],
    bonuses: {
      attack:  { stab: 85, slash: 65, crush: 65, magic: 0, ranged: 0 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 70, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
    speed: 4,
    twoHanded: false,
    combatStyle: {
      lunge: 4,
      swipe: 4,
      pound: 4,
      block: 4
    },
  },
  {
    name: "Dragon Warhammer",
    slot: 'weapon',
    regions: ["Kourend"],
    requirements: [{ skill: "Attack", level: 60 }],
    bonuses: {
      attack:  { stab: -4, slash: -4, crush: 95, magic: -4, ranged: 0 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 85, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
    speed: 6,
    twoHanded: false,
    combatStyle: {
      pound: 6,
      pummel: 6,
      block: 6
    },
  },
  {
    name: "Sarachnis Cudgel",
    slot: 'weapon',
    regions: ["Kourend"],
    requirements: [{ skill: "Attack", level: 55 }],
    bonuses: {
      attack:  { stab: 30, slash: 0, crush: 70, magic: 0, ranged: 0 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 70, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
    speed: 4,
    twoHanded: false,
    combatStyle: {
      pound: 4,
      pummel: 4,
      spike: 4,
      block: 4
    },
  },
  {
    name: "Dragon Sword",
    slot: 'weapon',
    regions: ["Kourend"],
    requirements: [{ skill: "Attack", level: 60 }],
    bonuses: {
      attack:  { stab: 65, slash: 55, crush: -2, magic: 0, ranged: 0 },
      defence: { stab: 0, slash: 2, crush: 1, magic: 0, ranged: 0 },
      other:   { meleeStrength: 63, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
    speed: 4,
    twoHanded: false,
    combatStyle: {
      stab: 4,
      lunge: 4,
      slash: 4,
      block: 4
    },
  },
  {
    name: "Dragon Knife",
    slot: 'weapon',
    regions: ["Kourend"],
    requirements: [{ skill: "Ranged", level: 60 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 28 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 0, rangedStrength: 30, magicDamage: 0, prayer: 0 },
    },
    speed: 3,
    twoHanded: false,
    ammoType: 'thrown',
    combatStyle: {
      accurate: 3,
      rapid: 2,
      longrange: 3
    },
  },
  {
    name: "Dragon Thrownaxe",
    slot: 'weapon',
    regions: ["Kourend"],
    requirements: [{ skill: "Ranged", level: 60 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 36 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 0, rangedStrength: 47, magicDamage: 0, prayer: 0 },
    },
    speed: 5,
    twoHanded: false,
    ammoType: 'thrown',
    combatStyle: {
      accurate: 5,
      rapid: 4,
      longrange: 5
    },
  },
  {
    name: "Saradomin Godsword",
    slot: 'weapon',
    regions: ["Asgarnia"],
    requirements: [{ skill: "Attack", level: 75 }],
    bonuses: {
      attack:  { stab: 0, slash: 132, crush: 80, magic: 0, ranged: 0 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 132, rangedStrength: 0, magicDamage: 0, prayer: 8 },
    },
    speed: 6,
    twoHanded: true,
    combatStyle: {
      chop: 6,
      slash: 6,
      smash: 6,
      block: 6
    },
  },
  {
    name: "Zamorak Godsword",
    slot: 'weapon',
    regions: ["Asgarnia"],
    requirements: [{ skill: "Attack", level: 75 }],
    bonuses: {
      attack:  { stab: 0, slash: 132, crush: 80, magic: 0, ranged: 0 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 132, rangedStrength: 0, magicDamage: 0, prayer: 8 },
    },
    speed: 6,
    twoHanded: true,
    combatStyle: {
      chop: 6,
      slash: 6,
      smash: 6,
      block: 6
    },
  },
  {
    name: "Crystal Halberd",
    slot: 'weapon',
    regions: ["Tirannwn"],
    requirements: [{ skill: "Attack", level: 70 }, { skill: "Agility", level: 50 }],
    bonuses: {
      attack:  { stab: 85, slash: 110, crush: 5, magic: -4, ranged: 0 },
      defence: { stab: -1, slash: 4, crush: 5, magic: 0, ranged: 0 },
      other:   { meleeStrength: 118, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
    speed: 7,
    twoHanded: true,
    combatStyle: {
      jab: 7,
      swipe: 7,
      fend: 7
    },
  },
  {
    name: "Dharok's Greataxe",
    slot: 'weapon',
    regions: ["Morytania"],
    requirements: [{ skill: "Attack", level: 70 }, { skill: "Strength", level: 70 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 0, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
    speed: 7,
    twoHanded: true,
    combatStyle: {
      chop: 7,
      hack: 7,
      smash: 7,
      block: 7
    },
  },
  {
    name: "Barrelchest Anchor",
    slot: 'weapon',
    regions: [],
    requirements: [{ skill: "Attack", level: 60 }, { skill: "Strength", level: 60 }],
    bonuses: {
      attack:  { stab: -2, slash: 10, crush: 92, magic: 0, ranged: 0 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 100, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
    speed: 6,
    twoHanded: true,
    combatStyle: {
      pound: 6,
      pummel: 6,
      spike: 6,
      block: 6
    },
  },
  {
    name: "Colossal Blade",
    slot: 'weapon',
    regions: ["Kourend"],
    requirements: [{ skill: "Attack", level: 60 }, { skill: "Strength", level: 60 }],
    bonuses: {
      attack:  { stab: -4, slash: 98, crush: 65, magic: -4, ranged: 0 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: -1 },
      other:   { meleeStrength: 100, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
    speed: 6,
    twoHanded: true,
    combatStyle: {
      chop: 6,
      slash: 6,
      smash: 6,
      block: 6
    },
  },
  {
    name: "Dragon Halberd",
    slot: 'weapon',
    regions: ["Tirannwn"],
    requirements: [{ skill: "Attack", level: 60 }, { skill: "Agility", level: 30 }],
    bonuses: {
      attack:  { stab: 70, slash: 95, crush: 0, magic: -4, ranged: 0 },
      defence: { stab: -1, slash: 4, crush: 5, magic: 0, ranged: 0 },
      other:   { meleeStrength: 89, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
    speed: 7,
    twoHanded: true,
    combatStyle: {
      jab: 7,
      swipe: 7,
      fend: 7
    },
  },
  {
    name: "Saradomin's Blessed Sword",
    slot: 'weapon',
    regions: ["Asgarnia"],
    requirements: [{ skill: "Attack", level: 75 }],
    bonuses: {
      attack:  { stab: 0, slash: 100, crush: 60, magic: 0, ranged: 0 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 88, rangedStrength: 0, magicDamage: 0, prayer: 2 },
    },
    speed: 4,
    twoHanded: true,
    combatStyle: {
      chop: 4,
      slash: 4,
      smash: 4,
      block: 4
    },
  },
  {
    name: "Abyssal Bludgeon",
    slot: 'weapon',
    regions: ["Morytania"],
    requirements: [{ skill: "Attack", level: 70 }, { skill: "Slayer", level: 85 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 102, magic: 0, ranged: 0 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 85, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
    speed: 4,
    twoHanded: true,
    combatStyle: {
      pound: 4,
      pummel: 4,
      block: 4
    },
  },
  {
    name: "Tzhaar-ket-om (t)",
    slot: 'weapon',
    regions: ["Karamja"],
    requirements: [{ skill: "Attack", level: 60 }, { skill: "Strength", level: 60 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 80, magic: -4, ranged: 0 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 85, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
    speed: 7,
    twoHanded: true,
    combatStyle: {
      pound: 7,
      pummel: 7,
      block: 7
    },
  },
  {
    name: "Torag's Hammers",
    slot: 'weapon',
    regions: ["Morytania"],
    requirements: [{ skill: "Attack", level: 70 }, { skill: "Strength", level: 70 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 0, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
    speed: 5,
    twoHanded: true,
    combatStyle: {
      pound: 5,
      pummel: 5,
      block: 5
    },
  },
  {
    name: "Verac's Flail",
    slot: 'weapon',
    regions: ["Morytania"],
    requirements: [{ skill: "Attack", level: 70 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 0, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
    speed: 5,
    twoHanded: true,
    combatStyle: {
      pound: 5,
      pummel: 5,
      spike: 5,
      block: 5
    },
  },
  {
    name: "Black Salamander",
    slot: 'weapon',
    regions: ["Wilderness"],
    requirements: [{ skill: "Ranged", level: 65 }, { skill: "Attack", level: 65 }, { skill: "Magic", level: 65 }],
    bonuses: {
      attack:  { stab: 0, slash: 59, crush: 0, magic: 0, ranged: 69 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 71, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
    speed: 5,
    twoHanded: true,
    combatStyle: {
      scorch: 5,
      flare: 5,
      blaze: 5
    },
  },
  {
    name: "Tecu Salamander",
    slot: 'weapon',
    regions: ["Varlamore"],
    requirements: [{ skill: "Ranged", level: 70 }, { skill: "Attack", level: 70 }, { skill: "Magic", level: 70 }],
    bonuses: {
      attack:  { stab: 0, slash: 77, crush: 0, magic: 0, ranged: 87 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 91, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
    speed: 5,
    twoHanded: true,
    combatStyle: {
      scorch: 5,
      flare: 5,
      blaze: 5
    },
  },
  {
    name: "Rune Halberd",
    slot: 'weapon',
    regions: [],
    requirements: [{ skill: "Attack", level: 40 }],
    bonuses: {
      attack:  { stab: 48, slash: 67, crush: 0, magic: -4, ranged: 0 },
      defence: { stab: -1, slash: 4, crush: 5, magic: 0, ranged: 0 },
      other:   { meleeStrength: 68, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
    speed: 7,
    twoHanded: true,
    combatStyle: {
      jab: 7,
      swipe: 7,
      fend: 7
    },
  },
  {
    name: "Dragon Felling Axe",
    slot: 'weapon',
    regions: [],
    requirements: [{ skill: "Attack", level: 60 }, { skill: "Woodcutting", level: 61 }],
    bonuses: {
      attack:  { stab: -3, slash: 60, crush: 51, magic: 0, ranged: 0 },
      defence: { stab: 0, slash: 1, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 67, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
    speed: 7,
    twoHanded: true,
    combatStyle: {
      chop: 7,
      hack: 7,
      smash: 7,
      block: 7
    },
  },
  {
    name: "Crystal Felling Axe",
    slot: 'weapon',
    regions: ["Tirannwn"],
    requirements: [{ skill: "Attack", level: 60 }, { skill: "Woodcutting", level: 71 }],
    bonuses: {
      attack:  { stab: -3, slash: 60, crush: 51, magic: 0, ranged: 0 },
      defence: { stab: 0, slash: 1, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 67, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
    speed: 7,
    twoHanded: true,
    combatStyle: {
      chop: 7,
      hack: 7,
      smash: 7,
      block: 7
    },
  },
  {
    name: "Earthbound Tecpatl",
    slot: 'weapon',
    regions: ["Varlamore"],
    requirements: [{ skill: "Attack", level: 55 }],
    bonuses: {
      attack:  { stab: 72, slash: 11, crush: 0, magic: 0, ranged: 0 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 64, rangedStrength: 0, magicDamage: 0, prayer: 2 },
    },
    speed: 4,
    twoHanded: true,
    combatStyle: {
      stab: 4,
      lunge: 4,
      slash: 4,
      block: 4
    },
  },
  {
    name: "Dragon Spear",
    slot: 'weapon',
    regions: [],
    requirements: [{ skill: "Attack", level: 60 }],
    bonuses: {
      attack:  { stab: 55, slash: 55, crush: 55, magic: 0, ranged: 0 },
      defence: { stab: 5, slash: 5, crush: 5, magic: 5, ranged: 5 },
      other:   { meleeStrength: 60, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
    speed: 4,
    twoHanded: true,
    combatStyle: {
      lunge: 4,
      swipe: 4,
      pound: 4,
      block: 4
    },
  },
  {
    name: "Leaf-bladed Spear",
    slot: 'weapon',
    regions: ["Fremennik","Tirannwn"],
    requirements: [{ skill: "Attack", level: 70 }, { skill: "Slayer", level: 55 }],
    bonuses: {
      attack:  { stab: 47, slash: 42, crush: 36, magic: 0, ranged: 0 },
      defence: { stab: 1, slash: 1, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 50, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
    speed: 5,
    twoHanded: true,
    combatStyle: {
      lunge: 5,
      swipe: 5,
      pound: 5,
      block: 5
    },
  },
  {
    name: "Red Salamander",
    slot: 'weapon',
    regions: [],
    requirements: [{ skill: "Ranged", level: 60 }, { skill: "Attack", level: 60 }, { skill: "Magic", level: 60 }],
    bonuses: {
      attack:  { stab: 0, slash: 37, crush: 0, magic: 0, ranged: 47 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 49, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
    speed: 5,
    twoHanded: true,
    combatStyle: {
      scorch: 5,
      flare: 5,
      blaze: 5
    },
  },
  {
    name: "Adamant Halberd",
    slot: 'weapon',
    regions: [],
    requirements: [{ skill: "Attack", level: 30 }],
    bonuses: {
      attack:  { stab: 28, slash: 41, crush: 0, magic: -4, ranged: 0 },
      defence: { stab: -1, slash: 3, crush: 4, magic: 0, ranged: 0 },
      other:   { meleeStrength: 42, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
    speed: 7,
    twoHanded: true,
    combatStyle: {
      jab: 7,
      swipe: 7,
      fend: 7
    },
  },
  {
    name: "Gilded Spear",
    slot: 'weapon',
    regions: [],
    requirements: [{ skill: "Attack", level: 40 }],
    bonuses: {
      attack:  { stab: 36, slash: 36, crush: 36, magic: 0, ranged: 0 },
      defence: { stab: 1, slash: 1, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 42, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
    speed: 4,
    twoHanded: true,
    combatStyle: {
      lunge: 4,
      swipe: 4,
      pound: 4,
      block: 4
    },
  },
  {
    name: "Rune Spear",
    slot: 'weapon',
    regions: [],
    requirements: [{ skill: "Attack", level: 40 }],
    bonuses: {
      attack:  { stab: 36, slash: 36, crush: 36, magic: 0, ranged: 0 },
      defence: { stab: 1, slash: 1, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 42, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
    speed: 4,
    twoHanded: true,
    combatStyle: {
      lunge: 4,
      swipe: 4,
      pound: 4,
      block: 4
    },
  },
  {
    name: "Katana",
    slot: 'weapon',
    regions: [],
    requirements: [{ skill: "Attack", level: 40 }],
    bonuses: {
      attack:  { stab: 7, slash: 45, crush: 0, magic: 0, ranged: 0 },
      defence: { stab: 3, slash: 7, crush: 7, magic: 0, ranged: -3 },
      other:   { meleeStrength: 40, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
    speed: 4,
    twoHanded: true,
    combatStyle: {
      chop: 4,
      slash: 4,
      lunge: 4,
      block: 4
    },
  },
  {
    name: "Rune Claws",
    slot: 'weapon',
    regions: [],
    requirements: [{ skill: "Attack", level: 40 }],
    bonuses: {
      attack:  { stab: 26, slash: 38, crush: -4, magic: 0, ranged: 0 },
      defence: { stab: 10, slash: 19, crush: 5, magic: 0, ranged: 0 },
      other:   { meleeStrength: 39, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
    speed: 4,
    twoHanded: true,
    combatStyle: {},
  },
  {
    name: "Dinh's Bulwark",
    slot: 'weapon',
    regions: ["Kourend"],
    requirements: [{ skill: "Attack", level: 65 }, { skill: "Defence", level: 65 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 124, magic: 0, ranged: 0 },
      defence: { stab: 106, slash: 109, crush: 109, magic: -10, ranged: 148 },
      other:   { meleeStrength: 38, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
    speed: 5,
    twoHanded: true,
    combatStyle: {
      pummel: 5
    },
  },
  {
    name: "3rd Age Bow",
    slot: 'weapon',
    ammoType: 'arrows',
    regions: [],
    requirements: [{ skill: "Ranged", level: 65 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 80 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 0, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
    speed: 4,
    twoHanded: true,
    combatStyle: {
      accurate: 4,
      rapid: 3,
      longrange: 4
    },
  },
  {
    name: "Magic Shortbow (i)",
    slot: 'weapon',
    ammoType: 'arrows',
    regions: [],
    requirements: [{ skill: "Ranged", level: 50 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 75 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 0, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
    speed: 4,
    twoHanded: true,
    combatStyle: {
      accurate: 4,
      rapid: 3,
      longrange: 4
    },
  },
  {
    name: "Magic Comp Bow",
    slot: 'weapon',
    ammoType: 'arrows',
    regions: [],
    requirements: [{ skill: "Ranged", level: 50 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 71 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 0, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
    speed: 5,
    twoHanded: true,
    combatStyle: {
      accurate: 5,
      rapid: 4,
      longrange: 5
    },
  },
  {
    name: "Bone Shortbow",
    slot: 'weapon',
    ammoType: 'arrows',
    regions: [],
    requirements: [{ skill: "Ranged", level: 55 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 69 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 0, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
    speed: 4,
    twoHanded: true,
    combatStyle: {
      accurate: 4,
      rapid: 3,
      longrange: 4
    },
  },
  {
    name: "Magic Longbow",
    slot: 'weapon',
    ammoType: 'arrows',
    regions: [],
    requirements: [{ skill: "Ranged", level: 50 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 69 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 0, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
    speed: 6,
    twoHanded: true,
    combatStyle: {
      accurate: 6,
      rapid: 5,
      longrange: 6
    },
  },
  {
    name: "Magic Shortbow",
    slot: 'weapon',
    ammoType: 'arrows',
    regions: [],
    requirements: [{ skill: "Ranged", level: 50 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 69 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 0, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
    speed: 4,
    twoHanded: true,
    combatStyle: {
      accurate: 4,
      rapid: 3,
      longrange: 4
    },
  },
];
