export const SKILLS = [
  { id: 'attack',       name: 'Attack',       category: 'combat',  icon: '/skills/Attack_icon.png' },
  { id: 'strength',     name: 'Strength',     category: 'combat',  icon: '/skills/Strength_icon.png' },
  { id: 'defence',      name: 'Defence',      category: 'combat',  icon: '/skills/Defence_icon.png' },
  { id: 'ranged',       name: 'Ranged',       category: 'combat',  icon: '/skills/Ranged_icon.png' },
  { id: 'prayer',       name: 'Prayer',       category: 'combat',  icon: '/skills/Prayer_icon.png' },
  { id: 'magic',        name: 'Magic',        category: 'combat',  icon: '/skills/Magic_icon.png' },
  { id: 'hitpoints',    name: 'Hitpoints',    category: 'combat',  icon: '/skills/Hitpoints_icon.png' },
  { id: 'mining',       name: 'Mining',       category: 'gather',  icon: '/skills/Mining_icon.png' },
  { id: 'fishing',      name: 'Fishing',      category: 'gather',  icon: '/skills/Fishing_icon.png' },
  { id: 'woodcutting',  name: 'Woodcutting',  category: 'gather',  icon: '/skills/Woodcutting_icon.png' },
  { id: 'hunter',       name: 'Hunter',       category: 'gather',  icon: '/skills/Hunter_icon.png' },
  { id: 'farming',      name: 'Farming',      category: 'gather',  icon: '/skills/Farming_icon.png' },
  { id: 'cooking',      name: 'Cooking',      category: 'artisan', icon: '/skills/Cooking_icon.png' },
  { id: 'smithing',     name: 'Smithing',     category: 'artisan', icon: '/skills/Smithing_icon.png' },
  { id: 'crafting',     name: 'Crafting',     category: 'artisan', icon: '/skills/Crafting_icon.png' },
  { id: 'fletching',    name: 'Fletching',    category: 'artisan', icon: '/skills/Fletching_icon.png' },
  { id: 'herblore',     name: 'Herblore',     category: 'artisan', icon: '/skills/Herblore_icon.png' },
  { id: 'firemaking',   name: 'Firemaking',   category: 'artisan', icon: '/skills/Firemaking_icon.png' },
  { id: 'runecrafting', name: 'Runecrafting', category: 'artisan', icon: '/skills/Runecraft_icon.png' },
  { id: 'construction', name: 'Construction', category: 'artisan', icon: '/skills/Construction_icon.png' },
  { id: 'agility',      name: 'Agility',      category: 'support', icon: '/skills/Agility_icon.png' },
  { id: 'thieving',     name: 'Thieving',     category: 'support', icon: '/skills/Thieving_icon.png' },
  { id: 'slayer',       name: 'Slayer',       category: 'support', icon: '/skills/Slayer_icon.png' },
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
