import { SKILLS, EXTRAS } from '../data/skills';
import { COMBO_BONUSES } from '../data/combos';
import { EXTRA_THRESHOLDS } from '../data/thresholds';
import { UNIVERSAL_REGIONS, UNLOCKABLE_REGIONS } from '../data/regions';

const ALL_REGIONS = [...UNIVERSAL_REGIONS, ...UNLOCKABLE_REGIONS];
const REGION_BY_NAME = Object.fromEntries(ALL_REGIONS.map(r => [r.name, r]));

const MASTERY_SKILLS = {
  Melee: { attack: 1, strength: 1, defence: 1, hitpoints: 1 },
  Range:  { ranged: 1, defence: 1, hitpoints: 1 },
  Magic:  { magic: 1, defence: 1, hitpoints: 1 },
};

function comboMatches(combo, selectedRelicNames, selectedRegions, extraScores) {
  const extrasOk = (combo.requiredExtras || []).every(e => {
    if (typeof e === 'string') return (extraScores[e] || 0) > 0;
    return (extraScores[e.extra] || 0) >= e.min;
  });
  return (
    (combo.relics  || []).every(r => !r || selectedRelicNames.includes(r)) &&
    (combo.regions || []).every(r => selectedRegions.includes(r)) &&
    extrasOk
  );
}

export function computeScores(selectedRelics, settings, relicWeights = {}, reloadedRelic = null, selectedMasteries = {}, selectedRegions = []) {
  const { solvedThreshold, oversolvedFactor } = settings;
  const oversolvedThreshold = solvedThreshold * oversolvedFactor;

  const skillScores = {};
  const extraScores = {};

  const relicsToScore = [...Object.values(selectedRelics), reloadedRelic].filter(Boolean);

  relicsToScore.forEach(relic => {
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

  // Apply region bonuses (universal regions always apply, selected unlockable regions also apply)
  const activeRegionNames = [
    ...UNIVERSAL_REGIONS.map(r => r.name),
    ...selectedRegions,
  ];
  activeRegionNames.forEach(name => {
    const region = REGION_BY_NAME[name];
    if (!region) return;
    Object.entries(region.skills || {}).forEach(([id, val]) => {
      skillScores[id] = (skillScores[id] || 0) + val;
    });
    Object.entries(region.extras || {}).forEach(([id, val]) => {
      extraScores[id] = (extraScores[id] || 0) + val;
    });
  });

  // Apply mastery points: each point adds +1 to the branch's skills
  Object.entries(MASTERY_SKILLS).forEach(([branch, skills]) => {
    const depth = selectedMasteries[branch] || 0;
    if (depth === 0) return;
    Object.entries(skills).forEach(([id, val]) => {
      skillScores[id] = (skillScores[id] || 0) + val * depth;
    });
  });

  const selectedNames = relicsToScore.map(r => r.name);

  COMBO_BONUSES.forEach(combo => {
    if (comboMatches(combo, selectedNames, selectedRegions, extraScores)) {
      Object.entries(combo.bonuses || {}).forEach(([id, val]) => {
        skillScores[id] = (skillScores[id] || 0) + val;
      });
      Object.entries(combo.thresholds || {}).forEach(([id, val]) => {
        extraScores[id] = (extraScores[id] || 0) + val;
      });
    }
  });

  // Apply extra thresholds: bonus per point above threshold
  EXTRA_THRESHOLDS.forEach(({ extra, threshold, perPoint }) => {
    const overflow = (extraScores[extra] || 0) - threshold;
    if (overflow <= 0) return;
    Object.entries(perPoint).forEach(([id, val]) => {
      skillScores[id] = (skillScores[id] || 0) + val * overflow;
    });
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
      comboMatches(c, selectedNames, selectedRegions, extraScores)
    ),
  };
}
