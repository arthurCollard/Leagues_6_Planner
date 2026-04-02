export const RELICS = {
  1: [
    {
      name: 'Endless Harvest',
      icon: `${process.env.PUBLIC_URL}/relics/Endless_Harvest.png`,
      desc: 'Resources sent to bank, endless gathering from depleted sources',
      description: {
        toggle: 'Send all resources gathered to the bank.',
        effects: [
          'You can endlessly gather from fishing spots, trees, and mining rocks even if they deplete after your initial interaction.',
          'Resources gathered from Fishing, Woodcutting, and Mining are multiplied by 2.',
          'XP is granted for all additional resources gathered.',
        ],
        notes: [
          'Being in combat will stop you from re-harvesting.',
          'Your character will chase the fishing spot as it moves.',
          'Rocks and trees cannot be depleted while harvesting.',
          'If another player depletes the tree or rock for you then you\'ll continue to gather from it as if it wasn\'t depleted.',
          'You cannot start gathering from something that is depleted.',
          'Forestry events will still spawn even if you have Endless Harvest.',
          'While aerial fishing, Endless Harvest will bank the catches but will not allow endless gathering from one spot.',
          'Endless Harvest will not allow infinite gathering from a Farming resource such as a celastrus tree.',
        ],
      },
      skills: { woodcutting: 3, mining: 3, fishing: 3 },
      extras: { food_source: 1 },
    },
    {
      name: 'Barbarian Gatherer',
      icon: `${process.env.PUBLIC_URL}/relics/Barbarian_Gathering.png`,
      desc: 'Barehand WC/Mining/Fishing with crystal tool XP rates',
      description: {
        toggle: 'Dispose option will ask what to destroy.',
        effects: [
          'Grants the knapsack — up to 3 different types of gathered items (wood, raw and cooked fish, metallic ore, coal, and metal bars) with a total capacity of 140. Can be retrieved from the Leagues Tutor in Yama\'s lair if lost.',
          'You become capable of chopping wood, mining rocks, and fishing with your bare hands without requiring any tools or bait.',
          'Your hands are equivalent to the crystal version of the respective tools where those exist.',
          'Whenever you gain Fishing, Woodcutting, or Mining XP while gathering you will also receive an additional 10% XP in both Strength and Agility.',
          'On failing to mine a rock, catch a fish, or chop a tree you will have a separate 50% chance to succeed instead.',
        ],
        notes: [
          'Barbarian Gathering will act as a substitute for a high-level tool in several bossing situations: punching/kicking Guardians in Chambers of Xeric counts as a dragon or higher pickaxe; mining Zalcano barehanded counts as a crystal pickaxe; damaging Het\'s seal in Tombs of Amascut provides the highest tier of bonus damage.',
          'The knapsack can be emptied at a bank.',
          'You can delete a stack of items from the knapsack anywhere in the world, but cannot withdraw from it.',
        ],
      },
      skills: { strength: 2, agility: 2, mining: 2, woodcutting: 2, fishing: 2 },
      extras: { food_source: 1 },
    },
    {
      name: 'Abundance',
      icon: `${process.env.PUBLIC_URL}/relics/Abundance.png`,
      desc: 'Skilling boosts + passive GP/resource generation',
      description: {
        toggle: 'Coins generated will be put into your inventory.',
        effects: [
          'All non-combat skills are permanently boosted by 10.',
          'Every time you receive an XP drop, gain an additional 2 XP in the same skill. This is affected by the league passive XP modifier.',
          'For every XP gained, gain 2x as many coins. These can go either to your bank or inventory if there is room, which can be toggled.',
        ],
        notes: [
          'Coins will still be generated even when training a skill that is at 200m XP.',
        ],
      },
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
      icon: `${process.env.PUBLIC_URL}/relics/Woodsman.png`,
      desc: '100% Hunter success, auto-burn logs (toggle), instant Fletching, trapped implings noted & doubled',
      description: {
        toggles: [
          'Hunter traps harvest directly to your bank.',
          'Logs chopped will be automatically burned.',
        ],
        effects: [
          'All items are processed at once while Fletching; stackable fletching items are capped at 10x the regular amount per action.',
          'Chopped logs are automatically burned while Woodcutting, granting full Firemaking XP (toggleable).',
          '100% success rate on all Hunter actions.',
          'Traps attract animals faster, give double the loot and XP.',
          'Traps always drop a random herb seed or tree seed when harvested.',
          'Hunter rumours give double XP and Hunters\' loot sacks will award 2x as much loot.',
          'All loot from jarred implings will be doubled and noted; they will no longer break upon opening.',
          'All quetzal whistles will not lose charges.',
        ],
        notes: [],
      },
      skills: { hunter: 3, firemaking: 2, fletching: 3, farming: 1 },
      extras: { seed_access: 2, herb_supply: 2 },
    },
        {
      name: 'Hotfoot',
      icon: `${process.env.PUBLIC_URL}/relics/Hotfoot.png`,
      desc: 'Level agility while you run, caught fish are automatically cooked, and mined ore is automatically smelted.',
      description: {
        grant: 'Upon choosing this relic you will receive the searing boots.',
        effects: [
          '(Searing boots) Agility experience is gained based on your Agility level while you run.',
          '(Searing boots) Caught fish are automatically cooked, granting XP.',
          '(Searing boots) Mined ore is automatically smelted, granting XP.',
          'Picking up termites or a mark of grace from a course will automatically complete the lap, granting completion XP and 10,000 coins.',
          'Marks of grace will always have a 33% chance to spawn on all rooftop courses.',
          'Completing a course grants two completion count and 25% bonus experience.',
          '100% success rate on all actions for Agility and Cooking.',
          'You will receive 2x termites from the Colossal Wyrm Agility Course.',
          'You will receive 10x crystal shards from Prifddinas Agility Course.',
        ],
        notes: [
          'The searing boots can be retrieved from the Leagues tutor in Yama\'s lair if lost.',
        ],
      },
      skills: { agility: 2, cooking: 3, smithing: 2, farming: 1 },
      extras: { gp_source: 2 },
    },
  ],
  3: [
    {
      name: 'Evil Eye',
      icon: `${process.env.PUBLIC_URL}/relics/Evil_Eye.png`,
      desc: 'Teleport to any boss/raid entrance, Barrows options, Moon of Peril teleports, ignores Wilderness',
      description: {
        grant: 'Upon choosing this relic you will receive the evil eye.',
        effects: [
          'Allows you to teleport to the entrance of any boss or raid in the Combat Achievements list.',
          'Barrows will have the option to go to the chest or to the surface.',
          'You can teleport to each Moon of Peril individually.',
          'The eye ignores Wilderness teleport restrictions.',
        ],
        notes: [
          'The eye cannot be used to teleport to an area you have not unlocked.',
          'The eye can be retrieved from the Leagues Tutor in Yama\'s Lair if lost.',
        ],
      },
      skills: { slayer: 1 },
      extras: { travel: 3 },
    },
  ],
  4: [
    {
      name: 'Conniving Clues',
      icon: `${process.env.PUBLIC_URL}/relics/Conniving_Clues.png`,
      desc: '1/3 chance clue contracts on casket open, 1/4 clue box, 10x clue vessel drop rate, min steps + max rolls',
      description: {
        effects: [
          'When opening a reward casket, you have a 1/3 chance to receive clue contracts which can be consumed to teleport you to your current clue step. Beginner: 0–2, Easy: 1–4, Medium: 1–5, Hard: 1–7, Elite: 1–9, Master: 1–10.',
          'Reward caskets have a 1/4 chance to contain a clue scroll box of the same tier.',
          'Clues from creatures and impling jars now have a drop rate of 1/15.',
          'Clue vessels obtained from skilling (such as clue geodes or clue nests) are 10x more likely to drop.',
          'All clues have the lowest possible number of steps and will give the maximum amount of reward rolls.',
          'Emote and Falo clue steps no longer have item requirements.',
        ],
        notes: [],
      },
      skills: {},
      extras: { travel: 1 },
    },
  ],
  5: [
    {
      name: "Nature's Accord",
      icon: `${process.env.PUBLIC_URL}/relics/Nature's_Accord.png`,
      desc: 'Fairy mushroom: no Farming requirements, 10x yield (noted), plants never die, 20% seed save, teleports to fairy rings/spirit trees',
      description: {
        grant: 'Upon choosing this relic you will receive the fairy mushroom.',
        effects: [
          'Farming patches and plants no longer have any level requirements to harvest, plant, or make.',
          'You will receive 10x yield from all farming patches and it will automatically be noted.',
          'Experience is granted for all additional resources gathered.',
          'Plants will never die.',
          'There is a 20% chance to not use a seed or sapling when planting crops in patches.',
          'The fairy mushroom allows you to teleport to any fairy ring, spirit tree, or tool leprechaun.',
          'Unlocking this will autocomplete the Tree Gnome Village quest.',
          'The fairy mushroom ignores Wilderness teleport restrictions.',
        ],
        notes: [
          'The fairy mushroom cannot be used to teleport to an area you haven\'t unlocked.',
          'The fairy mushroom can be retrieved from the Leagues Tutor in Yama\'s Lair if lost.',
          'At Tithe Farm: seeds are saved 20% of the time, any seed can be planted at level 1, plants cannot die so there is no need to water them, and the 10x yield is applied.',
          'Harvesting a celastrus tree is considered a Farming action, not a Woodcutting action — it is affected by Nature\'s Accord but not Endless Harvest.',
        ],
      },
      skills: { farming: 3 },
      extras: { seed_access: 1, travel: 3, white_berries: 1 },
    },
    {
      name: 'Larcenist',
      icon: `${process.env.PUBLIC_URL}/relics/Nature's_Accord.png`,
      desc: '100% Thieving success, auto re-steal, 10x loot from pickpocketing and stalls',
      description: {
        effects: [
          '100% success rate on all Thieving actions.',
          'Automatically re-pickpocket an NPC.',
          'Automatically re-steal from a stall.',
          'Items obtained from pickpocketing and stalls are noted.',
          'Stalls never deplete and guards will never catch you thieving from them.',
          'The amount of coin pouches you can carry is increased by 10x.',
          'Loot is increased by 10x for: pickpocketing (not including clue scrolls), stealing from stalls, and stealing house valuables in Varlamore.',
        ],
      },
      skills: { thieving: 5 },
      extras: { gp_source: 3 },
    },
  ],
  6: [
    {
      name: 'Culling Spree',
      icon: `${process.env.PUBLIC_URL}/relics/Culling_Spree.png`,
      desc: 'Choose slayer tasks (3 choices, +boss), set kill count (5-200), 50% superior spawn chain, superior drop elite clues, free helmet perks',
      description: {
        effects: [
          'Choose your Slayer task from a list of 3 choices; one choice will always be a boss task pulled from any boss normally assignable within your unlocked areas.',
          'Task kill count is selectable for all tasks, with a range of 5–200.',
          'Superior Slayer monsters have a 50% chance of spawning another superior on death.',
          'Superior monsters always drop between 1 and 3 elite clue scrolls.',
          'All effects of an imbued Slayer helmet are gained without needing to wear one, including protective effects such as acting as a nosepeg, facemask, etc.',
          'All Slayer reward shop perks are free. The rune pouch, herb sack, and looting bag are available from the Slayer reward store for free.',
        ],
        notes: [
          'Wearing a Slayer helmet while having this relic will not double the helmet effects.',
          'This relic\'s boost will stack with set effects like those of Void Knight equipment or crystal armour.',
        ],
      },
      skills: { slayer: 3, attack: 1, strength: 1, ranged: 1, magic: 1, defence: 1 },
      extras: {},
    }
  ],
  7: [
    {
      name: 'Reloaded',
      icon: `${process.env.PUBLIC_URL}/relics/Reloaded.png`,
      desc: 'Choose another relic from any tier below this one',
      description: {
        effects: [
          'Choose another relic from any tier below this one.',
        ],
        notes: [],
      },
      skills: {},
      extras: {},
      special: 'reloaded',
    }
  ],
  8: [
    {
      name: 'Minion',
      icon: `${process.env.PUBLIC_URL}/relics/Minion.png`,
      desc: 'Summon minion (30min): AoE attacks, auto-loot, configurable thresholds, feeds Zamorak items for +2 max hit each',
      description: {
        grant: 'Upon choosing this relic you will receive the Minion whistle.',
        effects: [
          'Summon a powerful minion lasting 30 minutes. Base stats: min hit 3, max hit 10, attack speed 1.8, accuracy 45,000.',
          'In multi-combat, the minion will cast an AoE attack if the target is weakest to Range or Magic.',
          'The whistle can consume up to 5 unique equippable Zamorak items, increasing the minion\'s max hit by 2 per unique item.',
          'The minion will automatically loot items from creatures you kill, including fired ranged ammo. A minimum value threshold and whether loot should be noted is configurable on the whistle.',
          'The minion will deal damage to targets immune to thralls.',
        ],
        notes: [
          'The minion will not fight in PvP and will not fight against Yama.',
          'The minion can be summoned at Vorkath and in The Gauntlet.',
          'The ash sanctifier and bone crusher are prioritised over the minion looting.',
          'The minion whistle can be retrieved from the Leagues Tutor in Yama\'s Lair if lost.',
        ],
      },
      skills: {},
      extras: {},
    },
    {
      name: 'Flask of Fervour',
      icon: `${process.env.PUBLIC_URL}/relics/Flask_of_Fervour.png`,
      desc: 'Restore HP/Prayer/Spec, 3 explosions (60% Prayer dmg), 0 damage taken for 2.4s, 3min cooldown (reduced by damage)',
      description: {
        grant: 'Upon choosing this relic you will receive the flask of fervour.',
        effects: [
          'When consumed: restores Hitpoints, Prayer points, and special attack energy to full.',
          'Over the next 2.4 seconds: triggers three explosions dealing 60% of your base Prayer level (30% in PvP) as typeless damage to all enemies within 3 tiles, and reduces all damage you take to 0. Does not deal damage to Yama.',
          'Base cooldown of 3 minutes. For every 10 damage dealt in a single hitsplat, the cooldown is reduced by 0.6s (1 tick per 10 damage; dealing 0–9 provides no reduction, 10–19 reduces by 1 tick, 20–29 by 2 ticks, etc.). Counts each individual hitsplat for multi-hitting weapons and AoE attacks.',
        ],
        notes: [
          'The flask spawns in your inventory with its cooldown reset when you enter The Gauntlet.',
          'The explosion will damage NPCs if any of their tiles are within the 7x7 blast range.',
          'Its own explosion damage does not reduce the cooldown.',
          'The flask of fervour can be retrieved from the Leagues Tutor in Yama\'s Lair if lost.',
        ],
      },
      skills: {},
      extras: {},
    },
  ],
};
