import { useState } from 'react';
import './App.css';

import { computeScores } from './logic/computeScores';
import Header from './components/Header';
import SettingsPanel from './components/SettingsPanel';
import ComboBanner from './components/ComboBanner';
import SkillsPanel from './components/SkillsPanel';
import RelicTree from './components/RelicTree';
import { COMBO_BONUSES } from './data/combos';
import MasteryTree from './components/MasteryTree';
import RegionTree from './components/RegionTree';

const DEFAULT_SETTINGS = {
  solvedThreshold: 3,
  oversolvedFactor: 1.5,
};

export default function App() {
  const [selectedRelics, setSelectedRelics] = useState({});
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [showSettings, setShowSettings] = useState(false);
  const [relicWeights, setRelicWeights] = useState({});
  const [selectedMasteries, setSelectedMasteries] = useState({ Melee: 0, Range: 0, Magic: 0 });
  const [selectedRegions, setSelectedRegions] = useState([]);

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
        return next;
      }
      return { ...prev, [tier]: relic };
    });
  };

  const { skills, extras, activeCombos } = computeScores(selectedRelics, settings, relicWeights);

  const selectedNames = Object.values(selectedRelics).filter(Boolean).map(r => r.name);

  const pendingCombos = COMBO_BONUSES
    .filter(c => !activeCombos.includes(c))
    .map(c => ({
      ...c,
      matched: c.relics.filter(r => selectedNames.includes(r)).length,
      missing: c.relics.filter(r => !selectedNames.includes(r)),
      total: c.relics.length,
    }))
    .filter(c => c.matched > 0);

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

      <ComboBanner activeCombos={activeCombos} pendingCombos={pendingCombos} />


      <div className="main-layout">
        <SkillsPanel skills={skills} extras={extras} />

        <div className="right-panel">
          <RelicTree
            selectedRelics={selectedRelics}
            onSelectRelic={selectRelic}
            relicWeights={relicWeights}
            onRelicWeightsChange={handleRelicWeightsChange}
          />
          <MasteryTree selectedMasteries={selectedMasteries} onSelectMastery={handleSelectMastery} onReset={() => setSelectedMasteries({ Melee: 0, Range: 0, Magic: 0 })} />
          <RegionTree selectedRegions={selectedRegions} onSelectRegion={handleSelectRegion} onReset={() => setSelectedRegions([])} />
        </div>
      </div>
    </div>
  );
}
