import { useState } from 'react';
import './App.css';

import { computeScores } from './logic/computeScores';
import Header from './components/Header';
import SettingsPanel from './components/SettingsPanel';
import ComboBanner from './components/ComboBanner';
import SkillsPanel from './components/SkillsPanel';
import RelicTree from './components/RelicTree';
import { COMBO_BONUSES } from './data/combos';
import { EXTRAS } from './data/skills';
import { EXTRA_THRESHOLDS } from './data/thresholds';
import MasteryTree from './components/MasteryTree';
import RegionTree from './components/RegionTree';
import GearPanel from './components/GearPanel';

const EMPTY_GEAR = { head: null, cape: null, neck: null, weapon: null, body: null, shield: null, legs: null, hands: null, feet: null, ring: null };

const DEFAULT_SETTINGS = {
  solvedThreshold: 3,
  oversolvedFactor: 1.5,
};

export default function App() {
  const [selectedRelics, setSelectedRelics] = useState({});
  const [reloadedRelic, setReloadedRelic] = useState(null);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [showSettings, setShowSettings] = useState(false);
  const [relicWeights, setRelicWeights] = useState({});
  const [selectedMasteries, setSelectedMasteries] = useState({ Melee: 0, Range: 0, Magic: 0 });
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [selectedGear, setSelectedGear] = useState(EMPTY_GEAR);

  const handleSelectMastery = (branch, depth) =>
    setSelectedMasteries(prev => ({ ...prev, [branch]: depth }));

  const handleSelectRegion = (regionName) =>
    setSelectedRegions(prev =>
      prev.includes(regionName)
        ? prev.filter(n => n !== regionName)
        : prev.length < 3 ? [...prev, regionName] : prev
    );
  const handleRelicWeightsChange = (relicName, weights) => {
    setRelicWeights(prev => ({ ...prev, [relicName]: weights }));
  };

  const selectRelic = (tier, relic) => {
    setSelectedRelics(prev => {
      if (prev[tier]?.name === relic.name) {
        const next = { ...prev };
        delete next[tier];
        if (tier === '7') setReloadedRelic(null);
        return next;
      }
      if (tier === '7' && prev[tier]?.name !== relic.name) setReloadedRelic(null);
      if (tier !== '7' && reloadedRelic?.name === relic.name) setReloadedRelic(null);
      return { ...prev, [tier]: relic };
    });
  };

  const { skills, extras, activeCombos } = computeScores(selectedRelics, settings, relicWeights, reloadedRelic, selectedMasteries, selectedRegions);

  const selectedNames = Object.values(selectedRelics).filter(Boolean).map(r => r.name);

  const pendingCombos = COMBO_BONUSES
    .filter(c => !activeCombos.includes(c))
    .map(c => {
      const extraConditions = (c.requiredExtras || []).map(e =>
        typeof e === 'string' ? `${e} > 0` : `${e.extra} ≥ ${e.min}`
      );
      const extraMatched = (c.requiredExtras || []).filter(e => {
        const score = extras[typeof e === 'string' ? e : e.extra]?.score || 0;
        return typeof e === 'string' ? score > 0 : score >= e.min;
      });
      const extraMissing = (c.requiredExtras || [])
        .filter(e => {
          const score = extras[typeof e === 'string' ? e : e.extra]?.score || 0;
          return typeof e === 'string' ? score === 0 : score < e.min;
        })
        .map(e => {
          const id = typeof e === 'string' ? e : e.extra;
          const name = EXTRAS.find(x => x.id === id)?.name || id;
          return typeof e === 'string' ? name : `${name} (${extras[id]?.score || 0}/${e.min})`;
        });

      const allConditions = [
        ...(c.relics || []).filter(Boolean),
        ...(c.regions || []).map(r => `Region: ${r}`),
        ...extraConditions,
      ];
      const matched = [
        ...(c.relics || []).filter(r => r && selectedNames.includes(r)),
        ...(c.regions || []).filter(r => selectedRegions.includes(r)),
        ...extraMatched,
      ].length;
      const missing = [
        ...(c.relics || []).filter(r => r && !selectedNames.includes(r)),
        ...(c.regions || []).filter(r => !selectedRegions.includes(r)).map(r => `Region: ${r}`),
        ...extraMissing,
      ];
      return { ...c, matched, missing, total: allConditions.length };
    })
    .filter(c => c.matched > 0);

  const activeThresholds = EXTRA_THRESHOLDS.filter(t => (extras[t.extra]?.score || 0) > t.threshold);
  const pendingThresholds = EXTRA_THRESHOLDS.filter(t => {
    const score = extras[t.extra]?.score || 0;
    return score > 0 && score <= t.threshold;
  });

  const solvedCount = Object.values(skills)
    .filter(s => s.status === 'solved' || s.status === 'oversolved').length;

  return (
    <div className="app">
      <Header
        relicCount={Object.keys(selectedRelics).length}
        solvedCount={solvedCount}
        masteryPoints={Object.values(selectedMasteries).reduce((a, b) => a + b, 0)}
        regionCount={selectedRegions.length}
        onToggleSettings={() => setShowSettings(s => !s)}
        onReset={() => {
          setSelectedRelics({});
          setSelectedMasteries({ Melee: 0, Range: 0, Magic: 0 });
          setSelectedRegions([]);
        }}
      />

      {showSettings && (
        <SettingsPanel settings={settings} onChange={setSettings} />
      )}

      <ComboBanner activeCombos={activeCombos} pendingCombos={pendingCombos} activeThresholds={activeThresholds} pendingThresholds={pendingThresholds} extras={extras} />

      <div className="main-layout">
        <SkillsPanel skills={skills} extras={extras} solvedThreshold={settings.solvedThreshold} />

        <div className="right-panel">
          <RelicTree
            selectedRelics={selectedRelics}
            onSelectRelic={selectRelic}
            relicWeights={relicWeights}
            onRelicWeightsChange={handleRelicWeightsChange}
            reloadedRelic={reloadedRelic}
            onSelectReloadedRelic={setReloadedRelic}
          />
          <MasteryTree selectedMasteries={selectedMasteries} onSelectMastery={handleSelectMastery} onReset={() => setSelectedMasteries({ Melee: 0, Range: 0, Magic: 0 })} />
          <RegionTree selectedRegions={selectedRegions} onSelectRegion={handleSelectRegion} onReset={() => setSelectedRegions([])} />
          <GearPanel
            selectedGear={selectedGear}
            selectedRegions={selectedRegions}
            onSelectGear={(slot, item) => setSelectedGear(prev => ({ ...prev, [slot]: item }))}
            onReset={() => setSelectedGear(EMPTY_GEAR)}
          />
        </div>
      </div>
    </div>
  );
}
