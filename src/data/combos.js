// Extras
export const E_GP_SOURCE = 'gp_source';
export const E_FOOD_SOURCE = 'food_source';
export const E_TRAVEL = 'travel';
export const E_AMMO_SOURCE = 'ammo_source';
export const E_SEED_ACCESS = 'seed_access';
export const E_HERB_SUPPLY = 'herb_supply';
export const E_HERB_PATCHES = 'herb_patches';
export const E_ALLOTMENT_PATCHES = 'allotment_patches';
export const E_LIMPWURT = 'limpwurt';
export const E_WHITE_BERRIES = 'white_berries';
export const E_EYE_OF_NEWT = 'eye_of_newt';
export const E_PRAYER_POT_PRIMARY = 'prayer_pot_primary';
export const E_PRAYER_POT_SECONDARY = 'prayer_pot_secondary';
export const E_ANTI_VENOMS_PRIMARY = 'anti_venoms_primary';
export const E_ANTI_VENOMS_SECONDARY = 'anti_venoms_secondary';
export const E_ANTIFIRES_PRIMARY = 'antifires_primary';
export const E_ANTIFIRES_SECONDARY = 'antifires_secondary';
export const E_MEGA_RARES = 'mega_rares';

// Relics
export const R_ENDLESS_HARVEST = 'Endless Harvest';
export const R_BARBARIAN_GATHERER = 'Barbarian Gatherer';
export const R_ABUNDANCE = 'Abundance';
export const R_WOODSMAN = 'Woodsman';
export const R_HOTFOOT = 'Hotfoot';
export const R_EVIL_EYE = 'Evil Eye';
export const R_CONNIVING_CLUES = 'Conniving Clues';
export const R_NATURES_ACCORD = "Nature's Accord";
export const R_LARCENIST = 'Larcenist';
export const R_CULLING_SPREE = 'Culling Spree';
export const R_RELOADED = 'Reloaded';
export const R_MINION = 'Minion';
export const R_FLASK_OF_FERVOUR = 'Flask of Fervour';

// Regions
export const REG_VARLAMORE = 'Varlamore';
export const REG_KARAMJA = 'Karamja';
export const REG_ASGARNIA = 'Asgarnia';
export const REG_FREMENNIK = 'Fremennik';
export const REG_KANDARIN = 'Kandarin';
export const REG_DESERT = 'Desert';
export const REG_MORYTANIA = 'Morytania';
export const REG_TIRANNWN = 'Tirannwn';
export const REG_WILDERNESS = 'Wilderness';
export const REG_KOUREND = 'Kourend';

export const COMBO_BONUSES = [
  // Endless Harvest combos (T1)
  {
    relics: [R_ENDLESS_HARVEST, R_WOODSMAN],
    bonuses: { firemaking: 2, fletching: 1 },
    thresholds: {},
    label: 'Endless Harvest + Woodsman',
    tooltip: 'Chop with endless harvest and automatically burn',
  },
  {
    relics: [R_ENDLESS_HARVEST, R_HOTFOOT],
    bonuses: { smithing: 1, cooking: 2 },
    thresholds: {},
    label: 'Endless Harvest + Hotfoot',
    tooltip: 'Mine and Fish with endless harvest to automatically smelt/cook',
  },
  {
    relics: [R_ENDLESS_HARVEST],
    regions: [REG_ASGARNIA],
    requiredExtras: [],
    bonuses: { mining: 1 },
    thresholds: {},
    label: 'Endless Harvest + Mining Guild',
    tooltip: 'Continuously mine rune',
  },
  {
    relics: [R_ENDLESS_HARVEST],
    regions: [REG_KOUREND],
    requiredExtras: [],
    bonuses: { firemaking: 2 },
    thresholds: {},
    label: 'Endless Harvest + Wintertodt',
    tooltip: 'Easy firemaking xp at wintertodt',
  },
  {
    relics: [R_ENDLESS_HARVEST],
    regions: [REG_KOUREND],
    requiredExtras: [],
    bonuses: { woodcutting: 1 },
    thresholds: {},
    label: 'Endless Harvest + WC Guild',
    tooltip: 'Continuously chop redwoods',
  },

  // Barbarian Gatherer combos (T1)
  {
    relics: [R_BARBARIAN_GATHERER, R_HOTFOOT],
    bonuses: { smithing: 1, cooking: 1 },
    thresholds: {},
    label: 'Barbarian Gatherer + Hotfoot',
    tooltip: 'Mine and fish with barbarian gatherer to smelt/cook',
  },
  {
    relics: [R_BARBARIAN_GATHERER, R_WOODSMAN],
    bonuses: { firemaking: 1 },
    thresholds: {},
    label: 'Barbarian Gatherer + Woodsman',
    tooltip: 'Auto burn logs chopped with barb gatherer',
  },

  // Abundance combos (T2)

  // Woodsman combos (T2)
   {
    relics: [R_WOODSMAN],
    regions: [REG_VARLAMORE],
    bonuses: { fletching: 1 },
    thresholds: {},
    label: 'Woodsman + Varlamore',
    tooltip: '10x Fletch action with minigame',
  },

  // Hotfoot combos (T2)

  // Evil Eye combos (T3)

  // Conniving Clues combos (T4)

  // Nature's Accord combos (T5)

  // Larcenist combos (T4)
  {
    relics: [R_LARCENIST],
    regions: [REG_TIRANNWN],
    requiredExtras: [],
    bonuses: { crafting: 1, smithing: 1 },
    thresholds: {},
    label: 'Larcenist + Prif Elves',
    tooltip: 'Steal shards, then craft crystal equipment for big xp',
  },
  {
    relics: [R_LARCENIST],
    regions: [REG_VARLAMORE],
    requiredExtras: [],
    bonuses: { crafting: 1 },
    thresholds: {},
    label: 'Larcenist + Varlamore Gem Stall',
    tooltip: 'Gem stall thieving for potential crafting xp',
  },

  // Culling Spree combos (T6)

  // Reloaded combos (T7)

  // Minion combos (T8)

  // Flask of Fervour combos (T8)

  // Region + Extra combos
  {
    relics: [],
    regions: [REG_FREMENNIK],
    requiredExtras: [{ extra: E_GP_SOURCE, min: 3 }],
    bonuses: { smithing: 2 },
    thresholds: {},
    label: 'Fremennik + GP Source',
    tooltip: 'Buy ore at blast furnace for smithing xp',
  }
];
