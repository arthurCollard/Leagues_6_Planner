export { HEAD }   from './head';
export { BODY }   from './body';
export { LEGS }   from './legs';
export { HANDS }  from './hands';
export { FEET }   from './feet';
export { CAPE }   from './cape';
export { NECK }   from './neck';
export { RING }   from './ring';
export { WEAPON } from './weapon';
export { SHIELD } from './shield';
export { AMMO }   from './ammo';

export const GEAR_SLOTS = ['head', 'cape', 'neck', 'ammo', 'weapon', 'body', 'shield', 'legs', 'hands', 'feet', 'ring'];

export const BONUS_LABELS = {
  attack:  { stab: 'Stab', slash: 'Slash', crush: 'Crush', magic: 'Magic', ranged: 'Ranged' },
  defence: { stab: 'Stab', slash: 'Slash', crush: 'Crush', magic: 'Magic', ranged: 'Ranged' },
  other:   { meleeStrength: 'Melee Str', rangedStrength: 'Ranged Str', magicDamage: 'Magic Dmg %', prayer: 'Prayer' },
};
