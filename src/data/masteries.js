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
  {
    id: 'regenerate',
    name: 'Regenerate',
    desc: 'Whenever you use runes to cast a spell, fire ammunition from a ranged weapon or consume charges with a charged weapon, there is a X% chance to generate an additional resource spent.',
    branch: 'General',
    icon: '',
    skills: {},
    extras: {},
  },
];

// Legacy export for computeScores compatibility
export const MASTERIES = { Melee: [], Range: [], Magic: [], Passives: [] };
