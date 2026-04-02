import { useState, useCallback } from 'react';
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

function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored !== null ? JSON.parse(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  const setStoredValue = useCallback(newValue => {
    setValue(prev => {
      const next = typeof newValue === 'function' ? newValue(prev) : newValue;
      try { localStorage.setItem(key, JSON.stringify(next)); } catch {}
      return next;
    });
  }, [key]);

  return [value, setStoredValue];
}

const EMPTY_GEAR = { head: null, cape: null, neck: null, ammo: null, weapon: null, body: null, shield: null, legs: null, hands: null, feet: null, ring: null };

const DEFAULT_SETTINGS = {
  solvedThreshold: 3,
  oversolvedFactor: 1.5,
};

export default function App() {
  const [selectedRelics, setSelectedRelics] = useLocalStorage('ls6_selectedRelics', {});
  const [reloadedRelic, setReloadedRelic] = useLocalStorage('ls6_reloadedRelic', null);
  const [settings, setSettings] = useLocalStorage('ls6_settings', DEFAULT_SETTINGS);
  const [showSettings, setShowSettings] = useState(false);
  const [relicWeights, setRelicWeights] = useLocalStorage('ls6_relicWeights', {});
  const [regionWeights, setRegionWeights] = useLocalStorage('ls6_regionWeights', {});
  const [selectedMasteries, setSelectedMasteries] = useLocalStorage('ls6_selectedMasteries', { Melee: 0, Range: 0, Magic: 0 });
  const [selectedRegions, setSelectedRegions] = useLocalStorage('ls6_selectedRegions', []);
  const [selectedGear, setSelectedGear] = useLocalStorage('ls6_selectedGear', EMPTY_GEAR);

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

  const { skills, extras, activeCombos } = computeScores(selectedRelics, settings, relicWeights, reloadedRelic, selectedMasteries, selectedRegions, regionWeights);

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
          <RegionTree
            selectedRegions={selectedRegions}
            onSelectRegion={handleSelectRegion}
            onReset={() => setSelectedRegions([])}
            regionWeights={regionWeights}
            onRegionWeightsChange={(name, w) => setRegionWeights(prev => ({ ...prev, [name]: w }))}
          />
          <GearPanel
            selectedGear={selectedGear}
            selectedRegions={selectedRegions}
            onSelectGear={(slot, item) => setSelectedGear(prev => ({ ...prev, [slot]: item }))}
            onReset={() => setSelectedGear(EMPTY_GEAR)}
          />
        </div>
      </div>

      <footer className="app-footer">
        <a
          href="https://buymeacoffee.com/officerkingsley"
          target="_blank"
          rel="noopener noreferrer"
          className="bmc-button"
        >
          <img
            src="https://cdn.buymeacoffee.com/buttons/bmc-new-btn-logo.svg"
            alt="Buy me a coffee"
          />
          <span>Buy me a coffee</span>
        </a>
      </footer>
    </div>
  );
}
