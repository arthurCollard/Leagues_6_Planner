export const SHIELD = [
  // ── Varlamore ──────────────────────────────────────────────────────────────
  {
    name: 'Tome of Earth',
    slot: 'shield',
    regions: ['Varlamore'],
    requirements: [{ skill: 'Magic', level: 50 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 0, magic: 8, ranged: 0 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 0, rangedStrength: 0, magicDamage: 5, prayer: 0 },
    },
  },
  // ── Karamja ────────────────────────────────────────────────────────────────
  {
    name: 'Toktz-ket-xil',
    slot: 'shield',
    regions: ['Karamja'],
    requirements: [{ skill: 'Defence', level: 60 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      defence: { stab: 55, slash: 57, crush: 55, magic: 35, ranged: 52 },
      other:   { meleeStrength: 0, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
  },
  // ── Asgarnia ───────────────────────────────────────────────────────────────
  {
    name: 'Dragon Defender',
    slot: 'shield',
    regions: ['Asgarnia'],
    requirements: [{ skill: 'Attack', level: 60 }, { skill: 'Defence', level: 60 }],
    bonuses: {
      attack:  { stab: 25, slash: 24, crush: 23, magic: 0, ranged: 0 },
      defence: { stab: 30, slash: 29, crush: 28, magic: 0, ranged: 0 },
      other:   { meleeStrength: 6, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
  },
  // ── Fremennik ──────────────────────────────────────────────────────────────
  {
    name: 'Dragonfire Shield',
    slot: 'shield',
    regions: ['Fremennik'],
    requirements: [{ skill: 'Defence', level: 75 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 0, magic: -10, ranged: -5 },
      defence: { stab: 70, slash: 75, crush: 72, magic: 10, ranged: 72 },
      other:   { meleeStrength: 7, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
  },
  {
    name: 'Ancient Wyvern Shield',
    slot: 'shield',
    regions: ['Fremennik'],
    requirements: [{ skill: 'Defence', level: 75 }, { skill: 'Magic', level: 70 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 0, magic: 10, ranged: 0 },
      defence: { stab: 45, slash: 50, crush: 47, magic: 55, ranged: 50 },
      other:   { meleeStrength: 0, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
  },
  // ── Desert ─────────────────────────────────────────────────────────────────
  {
    name: "Elidinis' Ward (f)",
    slot: 'shield',
    regions: ['Wilderness'],
    requirements: [{ skill: 'Magic', level: 80 }, { skill: 'Prayer', level: 80 }, { skill: 'Defence', level: 80 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 0, magic: 30, ranged: 0 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 35, ranged: 0 },
      other:   { meleeStrength: 0, rangedStrength: 0, magicDamage: 5, prayer: 5 },
    },
  },
  {
    name: "Elidinis' Ward",
    slot: 'shield',
    regions: ['Desert'],
    requirements: [{ skill: 'Magic', level: 80 }, { skill: 'Prayer', level: 80 }, { skill: 'Defence', level: 80 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 0, magic: 25, ranged: 0 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 30, ranged: 0 },
      other:   { meleeStrength: 0, rangedStrength: 0, magicDamage: 5, prayer: 5 },
    },
  },
  {
    name: 'Tome of Water',
    slot: 'shield',
    regions: ['Desert'],
    requirements: [{ skill: 'Magic', level: 50 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 0, magic: 8, ranged: 0 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 0, rangedStrength: 0, magicDamage: 5, prayer: 0 },
    },
  },
  // ── Morytania ──────────────────────────────────────────────────────────────
  {
    name: 'Avernic Defender',
    slot: 'shield',
    regions: ['Morytania'],
    requirements: [{ skill: 'Attack', level: 70 }, { skill: 'Defence', level: 70 }],
    bonuses: {
      attack:  { stab: 30, slash: 29, crush: 28, magic: 0, ranged: 0 },
      defence: { stab: 35, slash: 34, crush: 33, magic: 0, ranged: 0 },
      other:   { meleeStrength: 8, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
  },
  // ── Wilderness ─────────────────────────────────────────────────────────────
  {
    name: 'Arcane Spirit Shield',
    slot: 'shield',
    regions: ['Wilderness'],
    requirements: [{ skill: 'Defence', level: 75 }, { skill: 'Prayer', level: 65 }, { skill: 'Magic', level: 65 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 0, magic: 20, ranged: 0 },
      defence: { stab: 52, slash: 55, crush: 53, magic: 75, ranged: 55 },
      other:   { meleeStrength: 0, rangedStrength: 0, magicDamage: 5, prayer: 3 },
    },
  },
  {
    name: 'Spectral Spirit Shield',
    slot: 'shield',
    regions: ['Wilderness'],
    requirements: [{ skill: 'Defence', level: 75 }, { skill: 'Prayer', level: 65 }, { skill: 'Magic', level: 65 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 0, magic: 3, ranged: 0 },
      defence: { stab: 52, slash: 55, crush: 53, magic: 30, ranged: 55 },
      other:   { meleeStrength: 0, rangedStrength: 0, magicDamage: 0, prayer: 3 },
    },
  },
  {
    name: 'Elysian Spirit Shield',
    slot: 'shield',
    regions: ['Wilderness'],
    requirements: [{ skill: 'Defence', level: 75 }, { skill: 'Prayer', level: 65 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      defence: { stab: 52, slash: 55, crush: 53, magic: 30, ranged: 55 },
      other:   { meleeStrength: 0, rangedStrength: 0, magicDamage: 0, prayer: 3 },
    },
  },
  {
    name: 'Malediction Ward',
    slot: 'shield',
    regions: ['Wilderness'],
    requirements: [{ skill: 'Defence', level: 60 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 0, magic: 12, ranged: 0 },
      defence: { stab: 20, slash: 28, crush: 22, magic: 20, ranged: 0 },
      other:   { meleeStrength: 0, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
  },
  {
    name: 'Odium Ward',
    slot: 'shield',
    regions: ['Wilderness'],
    requirements: [{ skill: 'Defence', level: 60 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 12 },
      defence: { stab: 20, slash: 28, crush: 22, magic: 0, ranged: 0 },
      other:   { meleeStrength: 0, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
  },
  // ── Tirannwn ───────────────────────────────────────────────────────────────
  {
    name: 'Crystal Shield',
    slot: 'shield',
    regions: ['Tirannwn'],
    requirements: [{ skill: 'Ranged', level: 70 }, { skill: 'Defence', level: 70 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 80, ranged: 85 },
      other:   { meleeStrength: 0, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
  },
  // ── Universal ──────────────────────────────────────────────────────────────
  {
    name: 'Tome of Fire',
    slot: 'shield',
    regions: ['Kourend'],
    requirements: [{ skill: 'Magic', level: 50 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 0, magic: 8, ranged: 0 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 0, rangedStrength: 0, magicDamage: 5, prayer: 0 },
    },
  },
  {
    name: 'Book of Law',
    slot: 'shield',
    regions: [],
    requirements: [{ skill: 'Prayer', level: 40 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 0, magic: 10, ranged: 0 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 0, rangedStrength: 0, magicDamage: 0, prayer: 5 },
    },
  },
  {
    name: 'Book of War',
    slot: 'shield',
    regions: [],
    requirements: [{ skill: 'Prayer', level: 40 }],
    bonuses: {
      attack:  { stab: 0, slash: 2, crush: 6, magic: 0, ranged: 0 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 4, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
  },
  {
    name: 'Book of Darkness',
    slot: 'shield',
    regions: [],
    requirements: [{ skill: 'Prayer', level: 40 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 0, magic: 10, ranged: 0 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 3, ranged: 0 },
      other:   { meleeStrength: 0, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
  },
  {
    name: 'Rune Kiteshield',
    slot: 'shield',
    regions: [],
    requirements: [{ skill: 'Defence', level: 40 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      defence: { stab: 55, slash: 57, crush: 55, magic: 0, ranged: 53 },
      other:   { meleeStrength: 0, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
  },
  {
    name: 'Anti-dragon Shield',
    slot: 'shield',
    regions: [],
    requirements: [],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      defence: { stab: 7, slash: 7, crush: 7, magic: 0, ranged: 7 },
      other:   { meleeStrength: 0, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
  },
  {
    name: 'Blessed Spirit Shield',
    slot: 'shield',
    regions: ['Wilderness'],
    requirements: [{ skill: 'Defence', level: 70 }, { skill: 'Prayer', level: 60 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      defence: { stab: 52, slash: 55, crush: 53, magic: 0, ranged: 55 },
      other:   { meleeStrength: 0, rangedStrength: 0, magicDamage: 0, prayer: 3 },
    },
  },
  // ── Fremennik ──────────────────────────────────────────────────────────────
  {
    name: 'Dragonfire Ward',
    slot: 'shield',
    regions: ['Fremennik'],
    requirements: [{ skill: 'Ranged', level: 70 }, { skill: 'Defence', level: 75 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 0, magic: -10, ranged: 10 },
      defence: { stab: 70, slash: 75, crush: 72, magic: 10, ranged: 72 },
      other:   { meleeStrength: 0, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
  },
];
