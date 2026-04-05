export const PACTS = [
  {
    id: 'melee_range',
    name: '????????',
    desc: 'Melee range is doubled whilst using two handed weapons.',
    branch: 'Melee',
    icon: '',
    skills: { },
    extras: {},
  },
  {
    id: 'water_heal',
    name: '????????',
    desc: "Whenever your combat spells regenerate water runes, you're healed for one per rune regenerated.",
    branch: 'Magic',
    icon: '',
    skills: { },
    extras: {},
  },
  {
    id: 'bow_speed',
    name: '????????',
    desc: 'Bows attack 1 tick faster.',
    branch: 'Range',
    icon: '',
    skills: { ranged: 1 },
    extras: {},
  },
];

// Legacy export for computeScores compatibility
export const MASTERIES = { Melee: [], Range: [], Magic: [], Passives: [] };
