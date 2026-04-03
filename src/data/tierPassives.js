export const TIER_PASSIVES = {
  1: [
    { short: '5x Leagues XP', text: 'Leagues XP multiplier is 5x.', group: 'xp_mult', priority: 1 },
    { short: '2x item drops', text: 'Items from eligible sources will be 2x as common.', group: 'drop_rate', priority: 1 },
    { short: 'Farming ticks: 1min', text: 'Farming ticks will occur every minute instead of every five minutes.', skills: { farming: 1 } },
    { short: '4x minigame points', text: 'Minigame points received are boosted by 4x.', group: 'minigame_pts', priority: 1 },
    { short: 'Infinite run energy', text: 'Run energy is never drained whilst running.', skills: { } },
    { short: 'Stackable clue boxes', text: 'All clue scrolls will drop as stackable scroll boxes, and clue step progress is saved between clues.' },
    { short: 'Region-locked clue steps', text: 'Players will only receive clue steps they can access within an unlocked region.' },
  ],
  2: [
    { short: '8x Leagues XP', text: 'Leagues XP multiplier is increased from 5x to 8x.', group: 'xp_mult', priority: 2 },
  ],
  3: [
    { short: '1.5x combat XP', text: 'Combat experience (including Hitpoints and Prayer) will be multiplied by 1.5x. This is multiplicative with other experience modifiers.', skills: { attack: 1, strength: 1, defence: 1, ranged: 1, magic: 1, prayer: 1, hitpoints: 1 } },
    { short: 'Free Bigger & Badder', text: 'The Bigger and Badder slayer unlock is unlocked for free.', skills: {} },
    { short: '5x slayer points', text: 'Slayer reward points are 5x from tasks, and you aren\'t required to complete 5 tasks before earning points.', skills: {} },
    { short: 'Superior rate: 1/50', text: 'Superior slayer monsters will appear at a rate of 1/50.' },
  ],
  4: [
    { short: '5x item drops', text: 'Items from eligible sources will be 5x as common.', group: 'drop_rate', priority: 2 },
    { short: '8x minigame points', text: 'Minigame points received are boosted by 8x.', group: 'minigame_pts', priority: 2 },
  ],
  5: [
    { short: '12x Leagues XP', text: 'Leagues XP multiplier is increased from 8x to 12x.', group: 'xp_mult', priority: 3 },
  ],
  7: [
    { short: '16x Leagues XP', text: 'Leagues XP multiplier is increased from 12x to 16x.', group: 'xp_mult', priority: 4 },
  ],
};
