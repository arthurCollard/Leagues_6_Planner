import { SKILLS, EXTRAS } from '../data/skills';
import { COMBO_BONUSES } from '../data/combos';

export function computeScores(selectedRelics, settings, relicWeights = {}) {
  const { solvedThreshold, oversolvedFactor } = settings;
  const oversolvedThreshold = solvedThreshold * oversolvedFactor;

  const skillScores = {};
  const extraScores = {};

  Object.values(selectedRelics).forEach(relic => {
    if (!relic) return;
    const customWeights = relicWeights[relic.name] || {};

    Object.entries(relic.skills || {}).forEach(([id, val]) => {
      const weight = customWeights.skills?.[id] ?? val;  // default to base val, not 1
      skillScores[id] = (skillScores[id] || 0) + weight; // add weight directly, no multiply
    });

    Object.entries(relic.extras || {}).forEach(([id, val]) => {
      const weight = customWeights.extras?.[id] ?? val;  // default to base val, not 1
      extraScores[id] = (extraScores[id] || 0) + weight; // add weight directly, no multiply
    });

  });

  const selectedNames = Object.values(selectedRelics)
    .filter(Boolean)
    .map(r => r.name);

  COMBO_BONUSES.forEach(combo => {
    if (combo.relics.every(r => selectedNames.includes(r))) {
      Object.entries(combo.bonuses || {}).forEach(([id, val]) => {
        skillScores[id] = (skillScores[id] || 0) + val;
      });
      Object.entries(combo.extras || {}).forEach(([id, val]) => {
        extraScores[id] = (extraScores[id] || 0) + val;
      });
    }
  });

  const getStatus = score => {
    if (score === 0)                  return 'unsolved';
    if (score < solvedThreshold / 2) return 'low';
    if (score < solvedThreshold)     return 'partial';
    if (score < oversolvedThreshold) return 'solved';
    return 'oversolved';
  };

  return {
    skills: Object.fromEntries(
      SKILLS.map(s => [s.id, {
        score: skillScores[s.id] || 0,
        status: getStatus(skillScores[s.id] || 0),
      }])
    ),
    extras: Object.fromEntries(
      EXTRAS.map(e => [e.id, {
        score: extraScores[e.id] || 0,
        status: getStatus(extraScores[e.id] || 0),
      }])
    ),
    activeCombos: COMBO_BONUSES.filter(c =>
      c.relics.every(r => selectedNames.includes(r))
    ),
  };
}
