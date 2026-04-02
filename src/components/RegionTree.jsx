import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { UNIVERSAL_REGIONS, UNLOCKABLE_REGIONS, MAX_UNLOCKABLE_REGIONS } from '../data/regions';
import { SKILLS, EXTRAS } from '../data/skills';
import { HEAD, BODY, LEGS, HANDS, FEET, CAPE, NECK, RING, WEAPON, SHIELD, AMMO } from '../data/gear/index';

const ALL_GEAR = [...HEAD, ...BODY, ...LEGS, ...HANDS, ...FEET, ...CAPE, ...NECK, ...RING, ...WEAPON, ...SHIELD, ...AMMO];

const DROPS_BY_REGION = {};
ALL_GEAR.forEach(item => {
  item.regions.forEach(r => {
    if (!DROPS_BY_REGION[r]) DROPS_BY_REGION[r] = [];
    DROPS_BY_REGION[r].push(item.name);
  });
});

const SKILL_NAME = Object.fromEntries(SKILLS.map(s => [s.id, s.name]));
const EXTRA_NAME = Object.fromEntries(EXTRAS.map(e => [e.id, e.name]));

function RegionSettings({ region, weights, onChange, onClose }) {
  const baseSkills = region.skills || {};
  const baseExtras = region.extras || {};

  const customSkillIds = Object.keys(weights.skills || {}).filter(id => !(id in baseSkills));
  const customExtraIds = Object.keys(weights.extras || {}).filter(id => !(id in baseExtras));

  const addableSkills = SKILLS.filter(s => !(s.id in baseSkills) && !customSkillIds.includes(s.id));
  const addableExtras = EXTRAS.filter(e => !(e.id in baseExtras) && !customExtraIds.includes(e.id));

  function removeSkill(id) {
    const s = { ...weights.skills };
    delete s[id];
    onChange({ ...weights, skills: s });
  }
  function removeExtra(id) {
    const e = { ...weights.extras };
    delete e[id];
    onChange({ ...weights, extras: e });
  }

  return (
    <div className="relic-settings-panel">
      <div className="relic-settings-header">
        <strong>{region.name} Weights</strong>
        <button className="close-btn" onClick={onClose}>✕</button>
      </div>
      <div className="relic-settings-body">
        <h5>Skills</h5>
        {Object.entries(baseSkills).map(([id, base]) => (
          <label key={id}>
            {SKILL_NAME[id] || id}
            <input
              type="number" min="0" max="10" step="0.5"
              value={weights.skills?.[id] ?? base}
              onChange={e => onChange({ ...weights, skills: { ...weights.skills, [id]: +e.target.value } })}
            />
          </label>
        ))}
        {customSkillIds.map(id => (
          <label key={id}>
            {SKILL_NAME[id] || id}
            <input
              type="number" min="0" max="10" step="0.5"
              value={weights.skills[id]}
              onChange={e => onChange({ ...weights, skills: { ...weights.skills, [id]: +e.target.value } })}
            />
            <button className="remove-bonus-btn" onClick={() => removeSkill(id)}>×</button>
          </label>
        ))}
        {addableSkills.length > 0 && (
          <select className="add-bonus-select" value="" onChange={e => e.target.value && onChange({ ...weights, skills: { ...weights.skills, [e.target.value]: 1 } })}>
            <option value="">+ Add skill…</option>
            {addableSkills.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        )}

        <h5>Extras</h5>
        {Object.entries(baseExtras).map(([id, base]) => (
          <label key={id}>
            {EXTRA_NAME[id] || id}
            <input
              type="number" min="0" max="10" step="0.5"
              value={weights.extras?.[id] ?? base}
              onChange={e => onChange({ ...weights, extras: { ...weights.extras, [id]: +e.target.value } })}
            />
          </label>
        ))}
        {customExtraIds.map(id => (
          <label key={id}>
            {EXTRA_NAME[id] || id}
            <input
              type="number" min="0" max="10" step="0.5"
              value={weights.extras[id]}
              onChange={e => onChange({ ...weights, extras: { ...weights.extras, [id]: +e.target.value } })}
            />
            <button className="remove-bonus-btn" onClick={() => removeExtra(id)}>×</button>
          </label>
        ))}
        {addableExtras.length > 0 && (
          <select className="add-bonus-select" value="" onChange={e => e.target.value && onChange({ ...weights, extras: { ...weights.extras, [e.target.value]: 1 } })}>
            <option value="">+ Add extra…</option>
            {addableExtras.map(ex => <option key={ex.id} value={ex.id}>{ex.name}</option>)}
          </select>
        )}

        <button className="reset-btn" onClick={() => onChange({})}>
          Reset to Default
        </button>
      </div>
    </div>
  );
}

function RegionCard({ region, selected, disabled, onClick, weights, onWeightsChange, tooltip, onShowTooltip, onHideTooltip }) {
  const [showSettings, setShowSettings] = useState(false);
  const wrapperRef = useRef(null);
  const hasCustomWeights = Object.keys(weights).length > 0;
  const drops = DROPS_BY_REGION[region.name];

  const handleMouseEnter = () => {
    if (wrapperRef.current && drops?.length > 0) {
      const rect = wrapperRef.current.getBoundingClientRect();
      onShowTooltip(region.name, { left: rect.left, bottom: window.innerHeight - rect.top + 6 });
    }
  };

  return (
    <div className="relic-btn-outer">
      <div
        ref={wrapperRef}
        className="region-card-wrapper"
        style={{ flex: 1, minWidth: 0, position: 'relative' }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={onHideTooltip}
      >
        <div
          className={`relic-btn${selected ? ' selected' : ''}${disabled ? ' mastery-locked' : ''}`}
          style={{ width: '100%' }}
          onClick={onClick}
        >
          <div className="relic-info">
            <strong>{region.name}</strong>
          </div>
          {selected && <span className="check">✓</span>}
        </div>

        {showSettings && (
          <RegionSettings
            region={region}
            weights={weights}
            onChange={onWeightsChange}
            onClose={() => setShowSettings(false)}
          />
        )}
      </div>

      <button
        className={`relic-cog ${hasCustomWeights ? 'cog-active' : ''}`}
        onClick={e => { e.stopPropagation(); setShowSettings(s => !s); }}
        title="Adjust region weights"
      >
        ⚙️
      </button>
    </div>
  );
}

export default function RegionTree({ selectedRegions, onSelectRegion, onReset, regionWeights, onRegionWeightsChange }) {
  const [isOpen, setIsOpen] = useState(true);
  const [activeTooltip, setActiveTooltip] = useState(null); // { name, pos }
  const hideTimer = useRef(null);
  const selectedCount = selectedRegions.length;

  const handleShowTooltip = (name, pos) => {
    clearTimeout(hideTimer.current);
    setActiveTooltip({ name, pos });
  };

  const handleHideTooltip = () => {
    hideTimer.current = setTimeout(() => setActiveTooltip(null), 80);
  };

  return (
    <main className="relic-tree">
      <h2 className="section-header" onClick={() => setIsOpen(o => !o)}>
        <div>
          Regions
          <p className="relic-tree-desc">Unlock up to 3 regions to access their gear and content</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <span className="mastery-pts-badge">{selectedCount} / {MAX_UNLOCKABLE_REGIONS} unlocked</span>
          <button
            className="close-btn"
            disabled={selectedCount === 0}
            onClick={e => { e.stopPropagation(); onReset(); }}
          >
            Reset
          </button>
          <div className={`collapse-chevron ${isOpen ? 'open' : ''}`} />
        </div>
      </h2>

      <div className={`collapsible-body ${isOpen ? 'open' : ''}`}>

        <div className="tier-block">
          <div className="tier-label">
            <span>Universal</span>
            <span className="tier-chosen">Always unlocked</span>
          </div>
          <div className="relic-row">
            {UNIVERSAL_REGIONS.map(region => (
              <RegionCard
                key={region.name}
                region={region}
                selected
                disabled={false}
                onClick={null}
                weights={regionWeights[region.name] || {}}
                onWeightsChange={w => onRegionWeightsChange(region.name, w)}
                onShowTooltip={handleShowTooltip}
                onHideTooltip={handleHideTooltip}
              />
            ))}
          </div>
        </div>

        <div className="tier-block">
          <div className="tier-label">
            <span>Unlockable</span>
            <span className="tier-chosen">Pick up to {MAX_UNLOCKABLE_REGIONS}</span>
          </div>
          <div className="relic-row">
            {UNLOCKABLE_REGIONS.map(region => {
              const isSelected = selectedRegions.includes(region.name);
              const isDisabled = !isSelected && selectedCount >= MAX_UNLOCKABLE_REGIONS;
              return (
                <RegionCard
                  key={region.name}
                  region={region}
                  selected={isSelected}
                  disabled={isDisabled}
                  onClick={() => !isDisabled && onSelectRegion(region.name)}
                  weights={regionWeights[region.name] || {}}
                  onWeightsChange={w => onRegionWeightsChange(region.name, w)}
                  onShowTooltip={handleShowTooltip}
                  onHideTooltip={handleHideTooltip}
                />
              );
            })}
          </div>
        </div>

      </div>

      {activeTooltip && createPortal(
        <div
          className="region-tooltip"
          style={{ position: 'fixed', left: activeTooltip.pos.left, bottom: activeTooltip.pos.bottom, pointerEvents: 'auto' }}
          onMouseEnter={() => clearTimeout(hideTimer.current)}
          onMouseLeave={handleHideTooltip}
        >
          <strong>Notable Gear</strong>
          <ul>
            {DROPS_BY_REGION[activeTooltip.name].map(d => <li key={d}>{d}</li>)}
          </ul>
        </div>,
        document.body
      )}
    </main>
  );
}
