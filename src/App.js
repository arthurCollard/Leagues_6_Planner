import { useState, useCallback } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import GuidePage from './pages/GuidePage';

import { computeScores } from './logic/computeScores';
import Header from './components/Header';
import SettingsPanel from './components/SettingsPanel';
import ComboBanner from './components/ComboBanner';
import SkillsPanel from './components/SkillsPanel';
import RelicTree from './components/RelicTree';
import { COMBO_BONUSES } from './data/combos';
import { EXTRAS } from './data/skills';
import { TIER_PASSIVES } from './components/RelicTree';
import { EXTRA_THRESHOLDS } from './data/thresholds';
import MasteryTree from './components/MasteryTree';
import RegionTree from './components/RegionTree';
import GearPanel from './components/GearPanel';
import { UNIVERSAL_REGIONS, UNLOCKABLE_REGIONS } from './data/region/regions';
import { FLAGS } from './featureFlags';

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
  const [selectedMasteries, setSelectedMasteries] = useLocalStorage('ls6_selectedMasteries', {});
  const [selectedRegions, setSelectedRegions] = useLocalStorage('ls6_selectedRegions', []);
  const [selectedGear, setSelectedGear] = useLocalStorage('ls6_selectedGear', EMPTY_GEAR);

  const handleSelectRegion = (regionName) =>
    setSelectedRegions(prev =>
      prev.includes(regionName)
        ? prev.filter(n => n !== regionName)
        : prev.length < 3 ? [...prev, regionName] : prev
    );

  const handleReorderRegion = (fromIdx, toIdx) =>
    setSelectedRegions(prev => {
      if (fromIdx === toIdx) return prev;
      const next = [...prev];
      const [moved] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, moved);
      return next;
    });
  const handleRelicWeightsChange = (relicName, weights) => {
    setRelicWeights(prev => ({ ...prev, [relicName]: weights }));
  };

  const selectRelic = (tier, relic) => {
    setSelectedRelics(prev => {
      if (prev[tier]?.name === relic.name) {
        // Deselecting: cascade remove this tier and all higher tiers
        const next = { ...prev };
        const tierNum = Number(tier);
        Object.keys(next).forEach(t => { if (Number(t) >= tierNum) delete next[t]; });
        setReloadedRelic(null);
        return next;
      }
      if (tier === '7' && prev[tier]?.name !== relic.name) setReloadedRelic(null);
      if (tier !== '7' && reloadedRelic?.name === relic.name) setReloadedRelic(null);
      return { ...prev, [tier]: relic };
    });
  };

  const { skills, extras, activeCombos } = computeScores(selectedRelics, settings, relicWeights, reloadedRelic, selectedMasteries, selectedRegions, regionWeights);

  const selectedNames = Object.values(selectedRelics).filter(Boolean).map(r => r.name);
  const activeRegionNames = [...UNIVERSAL_REGIONS.map(r => r.name), ...selectedRegions];

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
        ...(c.regions || []).filter(r => activeRegionNames.includes(r)),
        ...extraMatched,
      ].length;
      const missing = [
        ...(c.relics || []).filter(r => r && !selectedNames.includes(r)),
        ...(c.regions || []).filter(r => !activeRegionNames.includes(r)).map(r => `Region: ${r}`),
        ...extraMissing,
      ];
      return { ...c, matched, missing, total: allConditions.length };
    })
    .filter(c => c.matched > 0);

  const activeThresholds = EXTRA_THRESHOLDS.filter(t => (extras[t.extra]?.score || 0) >= t.threshold);
  const pendingThresholds = EXTRA_THRESHOLDS.filter(t => {
    const score = extras[t.extra]?.score || 0;
    return score > 0 && score < t.threshold;
  });

  const activePassives = (() => {
    const all = Object.entries(TIER_PASSIVES)
      .filter(([tier]) => selectedRelics[tier])
      .flatMap(([, passives]) => passives);
    const best = new Map();
    const ungrouped = [];
    for (const p of all) {
      if (p.group) {
        const prev = best.get(p.group);
        if (!prev || p.priority > prev.priority) best.set(p.group, p);
      } else {
        ungrouped.push(p);
      }
    }
    return [...best.values(), ...ungrouped].map(p => ({ short: p.short, text: p.text }));
  })();

  const solvedCount = Object.values(skills)
    .filter(s => s.status === 'solved' || s.status === 'oversolved').length;

  const unlockedSpellbooks = (() => {
    const books = new Set(['Standard']);
    const allRegions = [...UNIVERSAL_REGIONS, ...UNLOCKABLE_REGIONS];
    const activeRegionObjs = allRegions.filter(r => activeRegionNames.includes(r.name));
    const activeRelics = [...Object.values(selectedRelics).filter(Boolean), reloadedRelic].filter(Boolean);
    for (const r of activeRegionObjs) (r.spellbook || []).forEach(b => books.add(b));
    for (const r of activeRelics) (r.spellbook || []).forEach(b => books.add(b));
    return books;
  })();

  const unlockedPrayerBooks = (() => {
    const books = new Set(['Standard']);
    const allRegions = [...UNIVERSAL_REGIONS, ...UNLOCKABLE_REGIONS];
    const activeRegionObjs = allRegions.filter(r => activeRegionNames.includes(r.name));
    const activeRelics = [...Object.values(selectedRelics).filter(Boolean), reloadedRelic].filter(Boolean);
    for (const r of activeRegionObjs) (r.prayer || []).forEach(b => books.add(b));
    for (const r of activeRelics) (r.prayer || []).forEach(b => books.add(b));
    return books;
  })();

  const unlockedPrayers = (() => {
    const prayers = new Set();
    const allRegions = [...UNIVERSAL_REGIONS, ...UNLOCKABLE_REGIONS];
    const activeRegionObjs = allRegions.filter(r => activeRegionNames.includes(r.name));
    const activeRelics = [...Object.values(selectedRelics).filter(Boolean), reloadedRelic].filter(Boolean);
    for (const r of activeRegionObjs) (r.prayerUnlocks || []).forEach(p => prayers.add(p));
    for (const r of activeRelics) (r.prayerUnlocks || []).forEach(p => prayers.add(p));
    return prayers;
  })();

  const guideEnabled = FLAGS.guide;

  return (
    <Routes>
      {guideEnabled && <Route path="/guide" element={<GuidePage />} />}
      <Route path="*" element={<PlannerPage />} />
    </Routes>
  );

  function PlannerPage() { return (
    <div className="app">
<Header
        relicCount={Object.keys(selectedRelics).length}
        solvedCount={solvedCount}
        masteryPoints={Object.values(selectedMasteries).filter(Boolean).length}
        regionCount={selectedRegions.length}
        onToggleSettings={() => setShowSettings(s => !s)}
        onReset={() => {
          setSelectedRelics({});
          setSelectedMasteries({});
          setSelectedRegions([]);
          setReloadedRelic(null);
          setSelectedGear(EMPTY_GEAR);
        }}
      />

      <ComboBanner
        activeCombos={activeCombos}
        pendingCombos={pendingCombos}
        activeThresholds={activeThresholds}
        pendingThresholds={pendingThresholds}
        extras={extras}
        activePassives={activePassives}
        onToggleSettings={() => setShowSettings(s => !s)}
        onReset={() => { setSelectedRelics({}); setSelectedMasteries({}); setSelectedRegions([]); setReloadedRelic(null); setSelectedGear(EMPTY_GEAR); }}
        hasSelections={Object.keys(selectedRelics).length > 0 || selectedRegions.length > 0 || Object.keys(selectedMasteries).some(k => selectedMasteries[k])}
      />

      {showSettings && (
        <SettingsPanel settings={settings} onChange={setSettings} />
      )}

      <div className="main-layout">
        <SkillsPanel skills={skills} extras={extras} solvedThreshold={settings.solvedThreshold} oversolvedFactor={settings.oversolvedFactor} unlockedSpellbooks={unlockedSpellbooks} unlockedPrayerBooks={unlockedPrayerBooks} unlockedPrayers={unlockedPrayers} />

        <div className="right-panel">
          <RelicTree
            selectedRelics={selectedRelics}
            onSelectRelic={selectRelic}
            relicWeights={relicWeights}
            onRelicWeightsChange={handleRelicWeightsChange}
            reloadedRelic={reloadedRelic}
            onSelectReloadedRelic={setReloadedRelic}
            onReset={() => { setSelectedRelics({}); setReloadedRelic(null); }}
          />
          <MasteryTree selectedMasteries={selectedMasteries} onSelectMastery={setSelectedMasteries} onReset={() => setSelectedMasteries({ pact_aa: true })} />
          <RegionTree
            selectedRegions={selectedRegions}
            onSelectRegion={handleSelectRegion}
            onReorderRegion={handleReorderRegion}
            onReset={() => setSelectedRegions([])}
            regionWeights={regionWeights}
            onRegionWeightsChange={(name, w) => setRegionWeights(prev => ({ ...prev, [name]: w }))}
          />
          <GearPanel
            selectedGear={selectedGear}
            selectedRegions={selectedRegions}
            onSelectGear={(slot, item) => setSelectedGear(prev => ({ ...prev, [slot]: item }))}
            onReset={() => setSelectedGear(EMPTY_GEAR)}
            selectedMasteries={{}}
          />
        </div>
      </div>

      <footer className="app-footer">
        <span>© 2026 Leagues Plan. All rights reserved. This is a community-built tool and is not affiliated with or endorsed by Jagex Ltd.</span>
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
  ); }
}
