export const SHIELD = [
  // ── Echo Items (stats TBD) ─────────────────────────────────────────────────
  {
    name: "Devil's Element",
    echo: true,
    slot: 'shield',
    regions: ['Kandarin'],
    requirements: [{ skill: 'Magic', level: 75 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 0, magic: 20, ranged: 0 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 0, rangedStrength: 0, magicDamage: 6, prayer: 3 },
    },
    effect: {
      type: 'multiply_totals',
      stats: [],
      description: "Devil's Element: Your elemental spells act as if any creature has an additional 30% elemental weakness to that element.",
    },
  },
  // ── Varlamore ──────────────────────────────────────────────────────────────
  {
    name: 'Tome of Earth',
    slot: 'shield',
    regions: ['Varlamore'],
    requirements: [{ skill: 'Magic', level: 50 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 0, magic: 8, ranged: 0 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 8, ranged: 0 },
      other:   { meleeStrength: 0, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
  },
  // ── Karamja ────────────────────────────────────────────────────────────────
  {
    name: 'Toktz-ket-xil',
    slot: 'shield',
    regions: ['Karamja'],
    requirements: [{ skill: 'Defence', level: 60 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 0, magic: -12, ranged: -8 },
      defence: { stab: 40, slash: 42, crush: 38, magic: 0, ranged: 65 },
      other:   { meleeStrength: 5, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
  },
  // ── Asgarnia ───────────────────────────────────────────────────────────────
  {
    name: 'Dragon Defender',
    slot: 'shield',
    regions: ['Asgarnia'],
    requirements: [{ skill: 'Attack', level: 60 }, { skill: 'Defence', level: 60 }],
    bonuses: {
      attack:  { stab: 25, slash: 24, crush: 23, magic: -3, ranged: -2 },
      defence: { stab: 25, slash: 24, crush: 23, magic: -3, ranged: -2 },
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
      attack:  { stab: -10, slash: -10, crush: -10, magic: 15, ranged: -10 },
      defence: { stab: 72, slash: 80, crush: 75, magic: 15, ranged: -5 },
      other:   { meleeStrength: -2, rangedStrength: 0, magicDamage: 2, prayer: 0 },
    },
  },
  // ── Desert ─────────────────────────────────────────────────────────────────
  {
    name: "Elidinis' Ward (f)",
    slot: 'shield',
    regions: ['Wilderness', 'Desert'],
    requireAllRegions: true,
    requirements: [{ skill: 'Magic', level: 80 }, { skill: 'Prayer', level: 80 }, { skill: 'Defence', level: 80 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 0, magic: 25, ranged: 0 },
      defence: { stab: 53, slash: 55, crush: 73, magic: 2, ranged: 52 },
      other:   { meleeStrength: 0, rangedStrength: 0, magicDamage: 5, prayer: 4 },
    },
  },
  {
    name: "Elidinis' Ward",
    slot: 'shield',
    regions: ['Desert'],
    requirements: [{ skill: 'Magic', level: 80 }, { skill: 'Prayer', level: 80 }, { skill: 'Defence', level: 80 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 0, magic: 5, ranged: 0 },
      defence: { stab: 5, slash: 3, crush: 9, magic: 0, ranged: 6 },
      other:   { meleeStrength: 0, rangedStrength: 0, magicDamage: 3, prayer: 1 },
    },
  },
  {
    name: 'Tome of Water',
    slot: 'shield',
    regions: ['Desert'],
    requirements: [{ skill: 'Magic', level: 50 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 0, magic: 8, ranged: 0 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 8, ranged: 0 },
      other:   { meleeStrength: 0, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
  },
  // ── Morytania ──────────────────────────────────────────────────────────────
  {
    name: 'Avernic Defender',
    slot: 'shield',
    regions: ['Morytania'],
    requirements: [{ skill: 'Attack', level: 70 }, { skill: 'Defence', level: 70 }],
    bonuses: {
      attack:  { stab: 30, slash: 29, crush: 28, magic: -5, ranged: -4 },
      defence: { stab: 30, slash: 29, crush: 28, magic: -5, ranged: -4 },
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
      defence: { stab: 53, slash: 55, crush: 73, magic: 2, ranged: 52 },
      other:   { meleeStrength: 0, rangedStrength: 0, magicDamage: 3, prayer: 3 },
    },
  },
  {
    name: 'Spectral Spirit Shield',
    slot: 'shield',
    regions: ['Wilderness'],
    requirements: [{ skill: 'Defence', level: 75 }, { skill: 'Prayer', level: 65 }, { skill: 'Magic', level: 65 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      defence: { stab: 53, slash: 55, crush: 73, magic: 30, ranged: 52 },
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
      defence: { stab: 63, slash: 65, crush: 75, magic: 2, ranged: 57 },
      other:   { meleeStrength: 0, rangedStrength: 0, magicDamage: 0, prayer: 3 },
    },
  },
  {
    name: 'Malediction Ward',
    slot: 'shield',
    regions: ['Wilderness'],
    requirements: [{ skill: 'Defence', level: 60 }],
    bonuses: {
      attack:  { stab: -8, slash: -8, crush: -8, magic: 12, ranged: -12 },
      defence: { stab: 50, slash: 52, crush: 48, magic: 15, ranged: 0 },
      other:   { meleeStrength: 0, rangedStrength: 0, magicDamage: 2, prayer: 0 },
    },
  },
  {
    name: 'Odium Ward',
    slot: 'shield',
    regions: ['Wilderness'],
    requirements: [{ skill: 'Defence', level: 60 }],
    bonuses: {
      attack:  { stab: -12, slash: -12, crush: -12, magic: -8, ranged: 12 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 24, ranged: 52 },
      other:   { meleeStrength: 0, rangedStrength: 4, magicDamage: 0, prayer: 0 },
    },
  },
  // ── Tirannwn ───────────────────────────────────────────────────────────────
  {
    name: 'Crystal Shield',
    slot: 'shield',
    regions: ['Tirannwn'],
    requirements: [{ skill: 'Ranged', level: 70 }, { skill: 'Defence', level: 70 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 0, magic: -10, ranged: -10 },
      defence: { stab: 51, slash: 54, crush: 53, magic: 0, ranged: 80 },
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
      defence: { stab: 0, slash: 0, crush: 0, magic: 8, ranged: 0 },
      other:   { meleeStrength: 0, rangedStrength: 0, magicDamage: 0, prayer: 0 },
    },
  },
  {
    name: 'Book of Law',
    slot: 'shield',
    regions: [],
    requirements: [{ skill: 'Prayer', level: 40 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 10 },
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
      attack:  { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
      other:   { meleeStrength: 2, rangedStrength: 0, magicDamage: 0, prayer: 5 },
    },
  },
  {
    name: 'Book of Darkness',
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
    name: 'Rune Kiteshield',
    slot: 'shield',
    regions: [],
    requirements: [{ skill: 'Defence', level: 40 }],
    bonuses: {
      attack:  { stab: 0, slash: 0, crush: 0, magic: -8, ranged: -3 },
      defence: { stab: 44, slash: 48, crush: 46, magic: -1, ranged: 46 },
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
      defence: { stab: 7, slash: 9, crush: 8, magic: 2, ranged: 8 },
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
      defence: { stab: 53, slash: 55, crush: 73, magic: 2, ranged: 52 },
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
      attack:  { stab: -10, slash: -10, crush: -10, magic: -10, ranged: 15 },
      defence: { stab: 70, slash: 75, crush: 72, magic: 28, ranged: 72 },
      other:   { meleeStrength: -2, rangedStrength: 8, magicDamage: 0, prayer: 0 },
    },
  },
];
