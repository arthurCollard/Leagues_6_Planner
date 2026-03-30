export const SKILLS = [
  { id: 'attack',       name: 'Attack',       category: 'combat',  icon: '⚔️' },
  { id: 'strength',     name: 'Strength',     category: 'combat',  icon: '💪' },
  { id: 'defence',      name: 'Defence',      category: 'combat',  icon: '🛡️' },
  { id: 'ranged',       name: 'Ranged',       category: 'combat',  icon: '🏹' },
  { id: 'prayer',       name: 'Prayer',       category: 'combat',  icon: '🙏' },
  { id: 'magic',        name: 'Magic',        category: 'combat',  icon: '✨' },
  { id: 'hitpoints',    name: 'Hitpoints',    category: 'combat',  icon: '❤️' },
  { id: 'mining',       name: 'Mining',       category: 'gather',  icon: '⛏️' },
  { id: 'fishing',      name: 'Fishing',      category: 'gather',  icon: '🎣' },
  { id: 'woodcutting',  name: 'Woodcutting',  category: 'gather',  icon: '🌲' },
  { id: 'hunter',       name: 'Hunter',       category: 'gather',  icon: '🪤' },
  { id: 'farming',      name: 'Farming',      category: 'gather',  icon: '🌱' },
  { id: 'cooking',      name: 'Cooking',      category: 'artisan', icon: '🍲' },
  { id: 'smithing',     name: 'Smithing',     category: 'artisan', icon: '🔨' },
  { id: 'crafting',     name: 'Crafting',     category: 'artisan', icon: '💎' },
  { id: 'fletching',    name: 'Fletching',    category: 'artisan', icon: '🪶' },
  { id: 'herblore',     name: 'Herblore',     category: 'artisan', icon: '🌿' },
  { id: 'firemaking',   name: 'Firemaking',   category: 'artisan', icon: '🔥' },
  { id: 'runecrafting', name: 'Runecrafting', category: 'artisan', icon: '🔮' },
  { id: 'construction', name: 'Construction', category: 'artisan', icon: '🏠' },
  { id: 'agility',      name: 'Agility',      category: 'support', icon: '🏃' },
  { id: 'thieving',     name: 'Thieving',     category: 'support', icon: '🕵️' },
  { id: 'slayer',       name: 'Slayer',       category: 'support', icon: '👹' },
];

export const EXTRAS = [
  { id: 'gp_source',   name: 'GP Source',         icon: '💰' },
  { id: 'food_source', name: 'Food Source',        icon: '🍖' },
  { id: 'travel',      name: 'Travel / Teleport',  icon: '🗺️' },
  { id: 'ammo_source', name: 'Ammo Source',        icon: '🏹' },
  { id: 'seed_access', name: 'Seed Access',        icon: '🌾' },
  { id: 'herb_supply', name: 'Herb Supply',        icon: '🧪' },
];

export const CATEGORIES = {
  combat:  '⚔️ Combat',
  gather:  '⛏️ Gathering',
  artisan: '🔨 Artisan',
  support: '🏃 Support',
};

export const STATUS_STYLES = {
  unsolved:   { bg: 'rgba(220,38,38,0.2)',  border: '#dc2626', glow: 'rgba(220,38,38,0.4)',  label: 'Unsolved'   },
  low:        { bg: 'rgba(234,88,12,0.2)',  border: '#ea580c', glow: 'rgba(234,88,12,0.4)',  label: 'Low'        },
  partial:    { bg: 'rgba(234,179,8,0.25)', border: '#eab308', glow: 'rgba(234,179,8,0.4)',  label: 'Partial'    },
  solved:     { bg: 'rgba(34,197,94,0.25)', border: '#22c55e', glow: 'rgba(34,197,94,0.5)',  label: 'Solved'     },
  oversolved: { bg: 'rgba(20,184,166,0.3)', border: '#14b8a6', glow: 'rgba(20,184,166,0.6)', label: 'Oversolved' },
};
