export const RELICS = {
  1: [
    {
      name: 'Endless Harvest',
      icon: '/relics/Endless_Harvest.png',
      desc: 'Resources sent to bank, endless gathering from depleted sources',
      skills: { woodcutting: 3, mining: 3, fishing: 3 },
      extras: {},
    },
    {
      name: 'Barbarian Gatherer',
      icon: '/relics/Barbarian_Gathering.png',
      desc: 'Barehand WC/Mining/Fishing with crystal tool XP rates',
      skills: { strength: 2, agility: 2, mining: 2, woodcutting: 2, fishing: 2 },
      extras: { food_source: 1 },
    },
    {
      name: 'Abundance',
      icon: '/relics/Abundance.png',
      desc: 'Skilling boosts + passive GP/resource generation',
      skills: {
        attack: 1, strength: 1, defence: 1, ranged: 1, prayer: 1, magic: 1,
        runecraft: 1, hitpoints: 1, crafting: 1, mining: 1, smithing: 1,
        fishing: 1, cooking: 1, firemaking: 1, woodcutting: 1, agility: 1,
        herblore: 1, thieving: 1, fletching: 1, slayer: 1, farming: 1,
        construction: 1, hunter: 1, runecrafting: 1
      },
      extras: { gp_source: 2 },
    },
  ],
  2: [
    {
      name: 'Woodsman',
      icon: '/relics/Woodsman.png',
      desc: '100% Hunter success, auto-burn logs (toggle), instant Fletching, trapped implings noted & doubled',
      skills: { hunting: 3, firemaking: 2, fletching: 3, farming: 1 },
      extras: { seed_access: 2, herb_supply: 2 },
    },
  ],
  3: [
    {
      name: 'Evil Eye',
      icon: '/relics/Evil_Eye.png',
      desc: 'Teleport to any boss/raid entrance, Barrows options, Moon of Peril teleports, ignores Wilderness',
      skills: { slayer: 1 },
      extras: { travel: 3 },
    },
  ],
  4: [
    {
      name: 'Conniving Clues',
      icon: '/relics/Conniving_Clues.png',
      desc: '1/3 chance clue contracts on casket open, 1/4 clue box, 10x clue vessel drop rate, min steps + max rolls',
      skills: {},
      extras: { travel: 1 },
    },
  ],
  5: [
    {
      name: "Nature's Accord",
      icon: '/relics/Nature\'s_Accord.png',
      desc: 'Fairy mushroom: no Farming requirements, 10x yield (noted), plants never die, 20% seed save, teleports to fairy rings/spirit trees',
      skills: { farming: 3 },
      extras: { seed_access: 1, travel: 3 },
    },
  ],
  6: [
    {
      name: 'Culling Spree',
      icon: '/relics/Culling_Spree.png',
      desc: 'Choose slayer tasks (3 choices, +boss), set kill count (5-200), 50% superior spawn chain, superior drop elite clues, free helmet perks',
      skills: { slayer: 3, attack: 1, strength: 1, ranged: 1, magic: 1, defence: 1 },
      extras: {},
    },
  ],
  7: [],
  8: [
    {
      name: 'Minion',
      icon: '/relics/Minion.png',
      desc: 'Summon minion (30min): AoE attacks, auto-loot, configurable thresholds, feeds Zamorak items for +2 max hit each',
      skills: {},
      extras: {},
    },
    {
      name: 'Flask of Fervour',
      icon: '/relics/Flask_of_Fervour.png',
      desc: 'Restore HP/Prayer/Spec, 3 explosions (60% Prayer dmg), 0 damage taken for 2.4s, 3min cooldown (reduced by damage)',
      skills: {},
      extras: {},
    },
  ],
};
