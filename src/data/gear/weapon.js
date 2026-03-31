export const WEAPON = [
  // ── Varlamore ──────────────────────────────────────────────────────────────
  {
    name: 'Eclipse Atlatl',
    slot: 'weapon',
    requirements: [{ skill: 'Ranged', level: 50 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 40 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 0, rangedStrength: 56, magicDamage: 0, prayer: 0 },
    },
  },
  {
    name: 'Dual Macuahuitl',
    slot: 'weapon',
    requirements: [{ skill: 'Attack', level: 75 }, { skill: 'Strength', level: 75 }],
    bonuses: {
      attack:  { stab: 0, slash: 75, crush: 70, magic: 0, ranged: 0 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 72, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
  },
  {
    name: 'Blue Moon Spear',
    slot: 'weapon',
    requirements: [{ skill: 'Attack', level: 80 }, { skill: 'Strength', level: 80 }, { skill: 'Defence', level: 80 }],
    bonuses: {
      attack:  { stab: 88, slash: 88, crush: 0, magic: 0, ranged: 0 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 84, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
  },
  {
    name: 'Glacial Temotli',
    slot: 'weapon',
    requirements: [{ skill: 'Ranged', level: 75 }, { skill: 'Defence', level: 75 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 61 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 0, rangedStrength: 62, magicDamage: 0, prayer: 0 },
    },
  },
  {
    name: 'Sulphur Blades',
    slot: 'weapon',
    requirements: [{ skill: 'Attack', level: 65 }],
    bonuses: {
      attack:  { stab: 0, slash: 90, crush: 0, magic: 0, ranged: 0 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 85, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
  },
  {
    name: 'Dragon Hunter Wand',
    slot: 'weapon',
    requirements: [{ skill: 'Magic', level: 80 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 0, magic: 30, ranged: 0 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 0, rangedStrength: 0, magicDamage: 10, prayer: 0 },
    },
  },
  {
    name: 'Tonalztics of Ralos',
    slot: 'weapon',
    requirements: [{ skill: 'Ranged', level: 75 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 55 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 0, rangedStrength: 50, magicDamage: 0, prayer: 0 },
    },
  },
  {
    name: 'Soulreaper Axe',
    slot: 'weapon',
    requirements: [{ skill: 'Attack', level: 90 }, { skill: 'Strength', level: 80 }, { skill: 'Defence', level: 90 }, { skill: 'Hitpoints', level: 80 }],
    bonuses: {
      attack:  { stab: 80, slash: 100, crush: 80, magic: 0, ranged: 0 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 96, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
  },
  // ── Karamja ────────────────────────────────────────────────────────────────
  {
    name: 'Tzhaar-ket-om',
    slot: 'weapon',
    requirements: [{ skill: 'Attack', level: 60 }, { skill: 'Strength', level: 60 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 84, magic: 0, ranged: 0 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 103, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
  },
  {
    name: 'Toktz-xil-ul',
    slot: 'weapon',
    requirements: [{ skill: 'Ranged', level: 60 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 47 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 0, rangedStrength: 5, magicDamage: 0, prayer: 0 },
    },
  },
  {
    name: 'Toktz-mej-tal',
    slot: 'weapon',
    requirements: [{ skill: 'Magic', level: 60 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 0, magic: 35, ranged: 0 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 0, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
  },
  {
    name: 'Toktz-xil-ak',
    slot: 'weapon',
    requirements: [{ skill: 'Attack', level: 60 }],
    bonuses: {
      attack:  { stab: 45, slash: 67, crush: 0, magic: 0, ranged: 0 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 66, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
  },
  {
    name: 'Toktz-xil-ek',
    slot: 'weapon',
    requirements: [{ skill: 'Attack', level: 60 }],
    bonuses: {
      attack:  { stab: 45, slash: 35, crush: 0, magic: 0, ranged: 0 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 71, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
  },
  // ── Asgarnia ───────────────────────────────────────────────────────────────
  {
    name: 'Armadyl Godsword',
    slot: 'weapon',
    requirements: [{ skill: 'Attack', level: 75 }],
    bonuses: {
      attack:  { stab: 0, slash: 132, crush: 0, magic: 0, ranged: 0 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 132, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
  },
  {
    name: 'Bandos Godsword',
    slot: 'weapon',
    requirements: [{ skill: 'Attack', level: 75 }],
    bonuses: {
      attack:  { stab: 0, slash: 132, crush: 0, magic: 0, ranged: 0 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 132, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
  },
  {
    name: 'Saradomin Sword',
    slot: 'weapon',
    requirements: [{ skill: 'Attack', level: 70 }],
    bonuses: {
      attack:  { stab: 5, slash: 84, crush: 82, magic: 0, ranged: 0 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 82, rangedStrength: 0, magicDamage: 0, prayer: 1 },
    },
  },
  {
    name: 'Armadyl Crossbow',
    slot: 'weapon',
    requirements: [{ skill: 'Ranged', level: 70 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 100 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 0, rangedStrength: 0, magicDamage: 0, prayer: 1 },
    },
  },
  {
    name: 'Steam Battlestaff',
    slot: 'weapon',
    requirements: [{ skill: 'Attack', level: 30 }, { skill: 'Magic', level: 30 }],
    bonuses: {
      attack:  { stab: 10, slash: 0, crush: 0, magic: 12, ranged: 0 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 35, rangedStrength: 0, magicDamage: 10, prayer: 0 },
    },
  },
  {
    name: 'Zamorakian Spear',
    slot: 'weapon',
    requirements: [{ skill: 'Attack', level: 70 }],
    bonuses: {
      attack:  { stab: 75, slash: 0, crush: 70, magic: 0, ranged: 0 },
      defence: { stab: 3, slash: 5, crush: 3, magic: 0, ranged: 0 },
      other:   { meleeStrength: 55, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
  },
  {
    name: 'Staff of the Dead',
    slot: 'weapon',
    requirements: [{ skill: 'Attack', level: 75 }, { skill: 'Magic', level: 75 }],
    bonuses: {
      attack:  { stab: 10, slash: 0, crush: 0, magic: 17, ranged: 0 },
      defence: { stab: 2, slash: 3, crush: 1, magic: 0, ranged: 0 },
      other:   { meleeStrength: 35, rangedStrength: 0, magicDamage: 15, prayer: 0 },
    },
  },
  {
    name: 'Ancient Godsword',
    slot: 'weapon',
    requirements: [{ skill: 'Attack', level: 75 }],
    bonuses: {
      attack:  { stab: 0, slash: 132, crush: 0, magic: 0, ranged: 0 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 132, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
  },
  // ── Fremennik ──────────────────────────────────────────────────────────────
  {
    name: 'Dragon Axe',
    slot: 'weapon',
    requirements: [{ skill: 'Attack', level: 60 }],
    bonuses: {
      attack:  { stab: 35, slash: 72, crush: 35, magic: 0, ranged: 0 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 72, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
  },
  {
    name: 'Leaf-bladed Battleaxe',
    slot: 'weapon',
    requirements: [{ skill: 'Attack', level: 65 }, { skill: 'Slayer', level: 55 }],
    bonuses: {
      attack:  { stab: 52, slash: 72, crush: 52, magic: 0, ranged: 0 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 62, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
  },
  {
    name: 'Brine Sabre',
    slot: 'weapon',
    requirements: [{ skill: 'Attack', level: 40 }],
    bonuses: {
      attack:  { stab: 0, slash: 46, crush: 0, magic: 0, ranged: 0 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 44, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
  },
  {
    name: "Leviathan's Lure",
    slot: 'weapon',
    requirements: [{ skill: 'Attack', level: 90 }, { skill: 'Strength', level: 90 }, { skill: 'Defence', level: 90 }, { skill: 'Hitpoints', level: 90 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 100, magic: 0, ranged: 0 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 108, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
  },
  {
    name: "Siren's Staff",
    slot: 'weapon',
    requirements: [{ skill: 'Magic', level: 75 }, { skill: 'Hitpoints', level: 90 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 0, magic: 25, ranged: 0 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 0, rangedStrength: 0, magicDamage: 20, prayer: 0 },
    },
  },
  {
    name: 'Eye of the Duke',
    slot: 'weapon',
    requirements: [{ skill: 'Attack', level: 80 }, { skill: 'Strength', level: 80 }, { skill: 'Slayer', level: 60 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 110, magic: 0, ranged: 0 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 118, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
  },
  {
    name: "Executioner's Axe",
    slot: 'weapon',
    requirements: [{ skill: 'Attack', level: 75 }, { skill: 'Strength', level: 75 }],
    bonuses: {
      attack:  { stab: 0, slash: 101, crush: 0, magic: 0, ranged: 0 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 106, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
  },
  {
    name: 'Mud Battlestaff',
    slot: 'weapon',
    requirements: [{ skill: 'Attack', level: 30 }, { skill: 'Magic', level: 30 }],
    bonuses: {
      attack:  { stab: 10, slash: 0, crush: 0, magic: 12, ranged: 0 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 35, rangedStrength: 0, magicDamage: 10, prayer: 0 },
    },
  },
  {
    name: 'Ancient Sceptre',
    slot: 'weapon',
    requirements: [{ skill: 'Magic', level: 62 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 0, magic: 22, ranged: 0 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 0, rangedStrength: 0, magicDamage: 10, prayer: 0 },
    },
  },
  // ── Kandarin ───────────────────────────────────────────────────────────────
  {
    name: 'Trident of the Seas',
    slot: 'weapon',
    requirements: [{ skill: 'Magic', level: 75 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 0, magic: 15, ranged: 0 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 0, rangedStrength: 0, magicDamage: 20, prayer: 0 },
    },
  },
  {
    name: 'Smoke Battlestaff',
    slot: 'weapon',
    requirements: [{ skill: 'Attack', level: 30 }, { skill: 'Magic', level: 30 }],
    bonuses: {
      attack:  { stab: 10, slash: 0, crush: 0, magic: 12, ranged: 0 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 35, rangedStrength: 0, magicDamage: 10, prayer: 0 },
    },
  },
  {
    name: 'Dragon Chainbody',
    slot: 'weapon',
    requirements: [{ skill: 'Defence', level: 60 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      defence: { stab: 80, slash: 85, crush: 72, magic: 0, ranged: 55 },
      other:   { meleeStrength: 0, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
  },
  {
    name: 'Mist Battlestaff',
    slot: 'weapon',
    requirements: [{ skill: 'Attack', level: 30 }, { skill: 'Magic', level: 30 }],
    bonuses: {
      attack:  { stab: 10, slash: 0, crush: 0, magic: 12, ranged: 0 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 35, rangedStrength: 0, magicDamage: 10, prayer: 0 },
    },
  },
  {
    name: 'Warped Sceptre',
    slot: 'weapon',
    requirements: [{ skill: 'Magic', level: 62 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 0, magic: 22, ranged: 0 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 0, rangedStrength: 0, magicDamage: 12, prayer: 0 },
    },
  },
  // ── Desert ─────────────────────────────────────────────────────────────────
  {
    name: "Osmumten's Fang",
    slot: 'weapon',
    requirements: [{ skill: 'Attack', level: 80 }],
    bonuses: {
      attack:  { stab: 105, slash: 65, crush: 0, magic: 0, ranged: 0 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 97, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
  },
  {
    name: "Tumeken's Shadow (uncharged)",
    slot: 'weapon',
    requirements: [{ skill: 'Magic', level: 85 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 0, magic: 35, ranged: 0 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 0, rangedStrength: 0, magicDamage: 50, prayer: 0 },
    },
  },
  {
    name: 'Dragon Pickaxe',
    slot: 'weapon',
    requirements: [{ skill: 'Attack', level: 60 }],
    bonuses: {
      attack:  { stab: 35, slash: 40, crush: 0, magic: 0, ranged: 0 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 38, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
  },
  {
    name: 'Dragon 2h Sword',
    slot: 'weapon',
    requirements: [{ skill: 'Attack', level: 60 }],
    bonuses: {
      attack:  { stab: 0, slash: 93, crush: 45, magic: 0, ranged: 0 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 80, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
  },
  {
    name: 'Dust Battlestaff',
    slot: 'weapon',
    requirements: [{ skill: 'Attack', level: 30 }, { skill: 'Magic', level: 30 }],
    bonuses: {
      attack:  { stab: 10, slash: 0, crush: 0, magic: 12, ranged: 0 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 35, rangedStrength: 0, magicDamage: 10, prayer: 0 },
    },
  },
  {
    name: 'Dragon Harpoon',
    slot: 'weapon',
    requirements: [{ skill: 'Attack', level: 60 }],
    bonuses: {
      attack:  { stab: 35, slash: 55, crush: 0, magic: 0, ranged: 0 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 50, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
  },
  // ── Morytania ──────────────────────────────────────────────────────────────
  {
    name: 'Scythe of Vitur (uncharged)',
    slot: 'weapon',
    requirements: [{ skill: 'Attack', level: 80 }, { skill: 'Strength', level: 80 }],
    bonuses: {
      attack:  { stab: 45, slash: 75, crush: 35, magic: 0, ranged: 0 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 75, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
  },
  {
    name: 'Sanguinesti Staff',
    slot: 'weapon',
    requirements: [{ skill: 'Magic', level: 75 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 0, magic: 25, ranged: 0 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 0, rangedStrength: 0, magicDamage: 23, prayer: 0 },
    },
  },
  {
    name: 'Ghrazi Rapier',
    slot: 'weapon',
    requirements: [{ skill: 'Attack', level: 80 }],
    bonuses: {
      attack:  { stab: 94, slash: 0, crush: 0, magic: 0, ranged: 0 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 89, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
  },
  {
    name: 'Nightmare Staff',
    slot: 'weapon',
    requirements: [{ skill: 'Magic', level: 65 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 0, magic: 16, ranged: 0 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 0, rangedStrength: 0, magicDamage: 15, prayer: 0 },
    },
  },
  {
    name: "Inquisitor's Mace",
    slot: 'weapon',
    requirements: [{ skill: 'Attack', level: 75 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 95, magic: 0, ranged: 0 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 89, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
  },
  {
    name: 'Granite Maul',
    slot: 'weapon',
    requirements: [{ skill: 'Attack', level: 50 }, { skill: 'Strength', level: 50 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 81, magic: 0, ranged: 0 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 98, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
  },
  {
    name: 'Granite Hammer',
    slot: 'weapon',
    requirements: [{ skill: 'Attack', level: 40 }, { skill: 'Strength', level: 40 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 64, magic: 0, ranged: 0 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 82, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
  },
  {
    name: 'Noxious Halberd',
    slot: 'weapon',
    requirements: [{ skill: 'Attack', level: 80 }, { skill: 'Slayer', level: 90 }],
    bonuses: {
      attack:  { stab: 0, slash: 116, crush: 0, magic: 0, ranged: 0 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 101, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
  },
  // ── Tirannwn ───────────────────────────────────────────────────────────────
  {
    name: 'Toxic Blowpipe',
    slot: 'weapon',
    requirements: [{ skill: 'Ranged', level: 75 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 30 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 0, rangedStrength: 20, magicDamage: 0, prayer: 0 },
    },
  },
  {
    name: 'Uncharged Toxic Trident',
    slot: 'weapon',
    requirements: [{ skill: 'Magic', level: 75 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 0, magic: 15, ranged: 0 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 0, rangedStrength: 0, magicDamage: 15, prayer: 0 },
    },
  },
  {
    name: 'Dark Bow',
    slot: 'weapon',
    requirements: [{ skill: 'Ranged', level: 60 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 95 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 0, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
  },
  // ── Wilderness ─────────────────────────────────────────────────────────────
  {
    name: "Viggora's Chainmace (u)",
    slot: 'weapon',
    requirements: [{ skill: 'Attack', level: 60 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 55, magic: 0, ranged: 0 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 55, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
  },
  {
    name: "Craw's Bow (u)",
    slot: 'weapon',
    requirements: [{ skill: 'Ranged', level: 60 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 60 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 0, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
  },
  {
    name: "Thammaron's Sceptre (u)",
    slot: 'weapon',
    requirements: [{ skill: 'Magic', level: 75 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 0, magic: 22, ranged: 0 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 0, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
  },
  {
    name: 'Voidwaker',
    slot: 'weapon',
    requirements: [{ skill: 'Attack', level: 75 }],
    bonuses: {
      attack:  { stab: 65, slash: 65, crush: 0, magic: 0, ranged: 0 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 85, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
  },
  {
    name: 'Abyssal Whip',
    slot: 'weapon',
    requirements: [{ skill: 'Attack', level: 70 }],
    bonuses: {
      attack:  { stab: 0, slash: 82, crush: 0, magic: 0, ranged: 0 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 82, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
  },
  {
    name: 'Abyssal Dagger',
    slot: 'weapon',
    requirements: [{ skill: 'Attack', level: 70 }],
    bonuses: {
      attack:  { stab: 75, slash: 0, crush: 0, magic: 0, ranged: 0 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 75, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
  },
  // ── Kourend ────────────────────────────────────────────────────────────────
  {
    name: 'Twisted Bow',
    slot: 'weapon',
    requirements: [{ skill: 'Ranged', level: 75 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 70 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 0, rangedStrength: 20, magicDamage: 0, prayer: 0 },
    },
  },
  {
    name: 'Dragon Hunter Crossbow',
    slot: 'weapon',
    requirements: [{ skill: 'Ranged', level: 65 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 95 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 0, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
  },
  {
    name: 'Dragon Claws',
    slot: 'weapon',
    requirements: [{ skill: 'Attack', level: 60 }],
    bonuses: {
      attack:  { stab: 41, slash: 57, crush: 0, magic: 0, ranged: 0 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 56, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
  },
  {
    name: 'Elder Maul',
    slot: 'weapon',
    requirements: [{ skill: 'Attack', level: 75 }, { skill: 'Strength', level: 50 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 135, magic: 0, ranged: 0 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 147, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
  },
  {
    name: 'Kodai Wand',
    slot: 'weapon',
    requirements: [{ skill: 'Magic', level: 80 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 0, magic: 35, ranged: 0 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 0, rangedStrength: 0, magicDamage: 15, prayer: 0 },
    },
  },
  {
    name: 'Dragon Hunter Lance',
    slot: 'weapon',
    requirements: [{ skill: 'Attack', level: 78 }],
    bonuses: {
      attack:  { stab: 85, slash: 0, crush: 0, magic: 0, ranged: 0 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 65, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
  },
  {
    name: 'Dragon Warhammer',
    slot: 'weapon',
    requirements: [{ skill: 'Attack', level: 60 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 95, magic: 0, ranged: 0 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 92, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
  },
  {
    name: 'Sarachnis Cudgel',
    slot: 'weapon',
    requirements: [{ skill: 'Attack', level: 55 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 65, magic: 0, ranged: 0 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 82, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
  },
  {
    name: 'Dragon Sword',
    slot: 'weapon',
    requirements: [{ skill: 'Attack', level: 60 }],
    bonuses: {
      attack:  { stab: 40, slash: 67, crush: 0, magic: 0, ranged: 0 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 66, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
  },
  {
    name: 'Dragon Knife',
    slot: 'weapon',
    requirements: [{ skill: 'Ranged', level: 60 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 40 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 0, rangedStrength: 25, magicDamage: 0, prayer: 0 },
    },
  },
  {
    name: 'Dragon Thrownaxe',
    slot: 'weapon',
    requirements: [{ skill: 'Ranged', level: 60 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 28 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 0, rangedStrength: 30, magicDamage: 0, prayer: 0 },
    },
  },
];
