import { SKILLS, EXTRAS } from '../data/skills';
import { COMBO_BONUSES } from '../data/combos';
import { EXTRA_THRESHOLDS } from '../data/thresholds';
import { UNIVERSAL_REGIONS, UNLOCKABLE_REGIONS } from '../data/region/regions';
import { TIER_PASSIVES } from '../data/tierPassives';

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

export function computeScores(selectedRelics, settings, relicWeights = {}, reloadedRelic = null, selectedMasteries = {}, selectedRegions = [], regionWeights = {}) {
  const { solvedThreshold, oversolvedFactor } = settings;
  const oversolvedThreshold = solvedThreshold * oversolvedFactor;

  const skillScores = {};
  const extraScores = {};

  const relicsToScore = [...Object.values(selectedRelics), reloadedRelic].filter(Boolean);

  relicsToScore.forEach(relic => {
    if (!relic) return;
    const customWeights = relicWeights[relic.name] || {};

    Object.entries(relic.skills || {}).forEach(([id, val]) => {
      const weight = customWeights.skills?.[id] ?? val;
      skillScores[id] = (skillScores[id] || 0) + weight;
    });
    Object.entries(customWeights.skills || {}).forEach(([id, val]) => {
      if (!(id in (relic.skills || {}))) skillScores[id] = (skillScores[id] || 0) + val;
    });

    Object.entries(relic.extras || {}).forEach(([id, val]) => {
      const weight = customWeights.extras?.[id] ?? val;
      extraScores[id] = (extraScores[id] || 0) + weight;
    });
    Object.entries(customWeights.extras || {}).forEach(([id, val]) => {
      if (!(id in (relic.extras || {}))) extraScores[id] = (extraScores[id] || 0) + val;
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
    const customWeights = regionWeights[name] || {};
    Object.entries(region.skills || {}).forEach(([id, val]) => {
      const weight = customWeights.skills?.[id] ?? val;
      skillScores[id] = (skillScores[id] || 0) + weight;
    });
    Object.entries(customWeights.skills || {}).forEach(([id, val]) => {
      if (!(id in (region.skills || {}))) skillScores[id] = (skillScores[id] || 0) + val;
    });
    Object.entries(region.extras || {}).forEach(([id, val]) => {
      const weight = customWeights.extras?.[id] ?? val;
      extraScores[id] = (extraScores[id] || 0) + weight;
    });
    Object.entries(customWeights.extras || {}).forEach(([id, val]) => {
      if (!(id in (region.extras || {}))) extraScores[id] = (extraScores[id] || 0) + val;
    });
  });

  // Apply tier passive bonuses for unlocked tiers
  Object.entries(selectedRelics).forEach(([tier, relic]) => {
    if (!relic) return;
    (TIER_PASSIVES[tier] || []).forEach(passive => {
      Object.entries(passive.skills || {}).forEach(([id, val]) => {
        skillScores[id] = (skillScores[id] || 0) + val;
      });
      Object.entries(passive.extras || {}).forEach(([id, val]) => {
        extraScores[id] = (extraScores[id] || 0) + val;
      });
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
    if (comboMatches(combo, selectedNames, activeRegionNames, extraScores)) {
      Object.entries(combo.bonuses || {}).forEach(([id, val]) => {
        skillScores[id] = (skillScores[id] || 0) + val;
      });
      Object.entries(combo.thresholds || {}).forEach(([id, val]) => {
        extraScores[id] = (extraScores[id] || 0) + val;
      });
    }
  });

  // Apply extra thresholds: flat bonus when score meets threshold
  EXTRA_THRESHOLDS.forEach(({ extra, threshold, perPoint }) => {
    if ((extraScores[extra] || 0) < threshold) return;
    Object.entries(perPoint).forEach(([id, val]) => {
      skillScores[id] = (skillScores[id] || 0) + val;
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
      EXTRAS.map(e => {
        const score = extraScores[e.id] || 0;
        const threshold = e.solvedAt ?? solvedThreshold;
        const overThreshold = threshold * oversolvedFactor;
        const getExtraStatus = s => {
          if (s === 0)             return 'unsolved';
          if (s < threshold / 2)  return 'low';
          if (s < threshold)      return 'partial';
          if (s < overThreshold)  return 'solved';
          return 'oversolved';
        };
        return [e.id, { score, status: getExtraStatus(score) }];
      })
    ),
    activeCombos: COMBO_BONUSES.filter(c =>
      comboMatches(c, selectedNames, activeRegionNames, extraScores)
    ),
  };
}
