// Extra threshold bonuses: for each point above `threshold` in an extra,
// award `perPoint` skill bonuses.
export const EXTRA_THRESHOLDS = [
  { extra: 'gp_source', threshold: 3, perPoint: { construction: 1 }, label: 'GP Source sink: + Construction' },
  { extra: 'gp_source', threshold: 3, perPoint: { fletching: 1 }, label: 'GP Source sink: + Fletching' },
  { extra: 'gp_source', threshold: 3, perPoint: { crafting: 1 }, label: 'GP Source sink: + Crafting' },

];
