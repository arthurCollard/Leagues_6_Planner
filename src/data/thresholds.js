// Extra threshold bonuses: for each point above `threshold` in an extra,
// award `perPoint` skill bonuses.
export const EXTRA_THRESHOLDS = [
  { extra: 'gp_source', threshold: 3, perPoint: { construction: 1 }, label: 'GP Source sink: + Construction', tooltip: 'Buy construction mats from Metla in Varlamore' },
  { extra: 'gp_source', threshold: 3, perPoint: { crafting: 1 }, label: 'GP Source sink: + Crafting', tooltip: 'Buy gems from Toci\'s Gem Store in Aldarin' },
];
