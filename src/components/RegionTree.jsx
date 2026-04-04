import { useState, useRef } from 'react';
import { UNIVERSAL_REGIONS, UNLOCKABLE_REGIONS, MAX_UNLOCKABLE_REGIONS } from '../data/regions';
import { SKILLS, EXTRAS } from '../data/skills';
import { HEAD, BODY, LEGS, HANDS, FEET, CAPE, NECK, RING, WEAPON, SHIELD, AMMO } from '../data/gear/index';
import ContribTooltip from './ContribTooltip';
import RegionDetailModal from './RegionDetailModal';

const ALL_GEAR = [...HEAD, ...BODY, ...LEGS, ...HANDS, ...FEET, ...CAPE, ...NECK, ...RING, ...WEAPON, ...SHIELD, ...AMMO];

const DROPS_BY_REGION = {};
ALL_GEAR.forEach(item => {
  item.regions.forEach(r => {
    if (!DROPS_BY_REGION[r]) DROPS_BY_REGION[r] = [];
    DROPS_BY_REGION[r].push({ name: item.name, echo: !!item.echo });
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
    const next = { ...weights, skills: s };
    if (Object.keys(next.skills).length === 0) delete next.skills;
    onChange(next);
  }
  function removeExtra(id) {
    const e = { ...weights.extras };
    delete e[id];
    const next = { ...weights, extras: e };
    if (Object.keys(next.extras).length === 0) delete next.extras;
    onChange(next);
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

function RegionCard({ region, selected, selectionOrder, totalSelected, disabled, onClick, onReorder, weights, onWeightsChange, openSettings, onOpenSettings, onShowContrib, onHideContrib }) {
  const showSettings = openSettings === region.name;
  const wrapperRef = useRef(null);
  const hasCustomWeights = Object.keys(weights).length > 0;
  const drops = DROPS_BY_REGION[region.name];

  const handleMouseEnter = () => {
    if (!wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    onShowContrib({
      pos: { left: rect.left, top: rect.bottom + 6 },
      title: region.name,
      skills: region.skills || {},
      extras: region.extras || {},
      drops: drops || [],
      spellbooks: region.spellbook,
      prayerBooks: region.prayer,
      prayerUnlocks: region.prayerUnlocks,
    });
  };

  return (
    <div className="relic-btn-outer">
      <div
        ref={wrapperRef}
        className="region-card-wrapper"
        style={{ flex: 1, minWidth: 0, position: 'relative' }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={onHideContrib}
      >
        <div
          className={`relic-btn${selected ? ' selected' : ''}${disabled ? ' mastery-locked' : ''}`}
          style={{ width: '100%' }}
          onClick={onClick}
        >
          <div className="relic-info">
            <img
              className="region-badge-icon"
              src={`/regions/${region.name}_Area_Badge.png`}
              alt=""
              onError={e => { e.target.style.display = 'none'; }}
            />
            <strong>{region.name}</strong>
          </div>
          {selectionOrder != null && (
            <span className="region-order-badge">
              {selectionOrder > 1 && (
                <button className="region-order-arrow" onClick={e => { e.stopPropagation(); onReorder(-1); }} title="Move earlier">‹</button>
              )}
              {selectionOrder}
              {selectionOrder < totalSelected && (
                <button className="region-order-arrow" onClick={e => { e.stopPropagation(); onReorder(1); }} title="Move later">›</button>
              )}
            </span>
          )}
        </div>

        {showSettings && (
          <RegionSettings
            region={region}
            weights={weights}
            onChange={onWeightsChange}
            onClose={() => onOpenSettings(null)}
          />
        )}
      </div>

      <button
        className={`relic-cog ${hasCustomWeights ? 'cog-active' : ''}`}
        onClick={e => { e.stopPropagation(); onOpenSettings(showSettings ? null : region.name); }}
        title="Adjust region weights"
      >
        ⚙️
      </button>
    </div>
  );
}

function RegionSplitPanel({ selectedRegions, onSelectRegion, onReorderRegion, openSettings, onOpenSettings, regionWeights, onRegionWeightsChange, onShowContrib, onHideContrib }) {
  const [dragIndex, setDragIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const itemRefs = useRef({});
  const selectedCount = selectedRegions.length;
  const unselected = UNLOCKABLE_REGIONS.filter(r => !selectedRegions.includes(r.name));

  const showTooltip = (name, region) => {
    const el = itemRefs.current[name];
    if (!el) return;
    const rect = el.getBoundingClientRect();
    onShowContrib({ pos: { left: rect.left, top: rect.bottom + 6 }, title: name, skills: region?.skills || {}, extras: region?.extras || {}, drops: DROPS_BY_REGION[name] || [], spellbooks: region?.spellbook, prayerBooks: region?.prayer, prayerUnlocks: region?.prayerUnlocks });
  };

  const handleDrop = (toIndex) => {
    if (dragIndex !== null && dragIndex !== toIndex) onReorderRegion(dragIndex, toIndex);
    setDragIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="region-split-panel">
      <div className="region-panel">
        <div className="region-panel-label">
          Selected
          <span className="region-panel-count">{selectedCount} / {MAX_UNLOCKABLE_REGIONS}</span>
        </div>
        {selectedRegions.map((name, i) => {
          const region = UNLOCKABLE_REGIONS.find(r => r.name === name);
          const showSettings = openSettings === name;
          const hasCustomWeights = Object.keys(regionWeights[name] || {}).length > 0;
          return (
            <div key={name} style={{ position: 'relative' }}>
              <div
                ref={el => { itemRefs.current[name] = el; }}
                className={`region-panel-item region-selected-item${dragOverIndex === i && dragIndex !== i ? ' drag-over' : ''}`}
                draggable
                onDragStart={e => { e.dataTransfer.effectAllowed = 'move'; setDragIndex(i); onHideContrib(); }}
                onDragOver={e => { e.preventDefault(); setDragOverIndex(i); }}
                onDrop={() => handleDrop(i)}
                onDragEnd={() => { setDragIndex(null); setDragOverIndex(null); }}
                onMouseEnter={() => showTooltip(name, region)}
                onMouseLeave={onHideContrib}
              >
                <span className="region-drag-handle">⠿</span>
                <span className="region-order-num">{i + 1}.</span>
                <img
                  className="region-badge-icon"
                  src={`/regions/${name}_Area_Badge.png`}
                  alt=""
                  onError={e => { e.target.style.display = 'none'; }}
                />
                <span className="region-item-name">{name}</span>
                <button
                  className={`relic-cog ${hasCustomWeights ? 'cog-active' : ''}`}
                  onClick={e => { e.stopPropagation(); onOpenSettings(showSettings ? null : name); }}
                  title="Adjust region weights"
                >⚙️</button>
                <button className="region-remove-btn" onClick={() => onSelectRegion(name)} title="Remove">×</button>
              </div>
              {showSettings && region && (
                <RegionSettings
                  region={region}
                  weights={regionWeights[name] || {}}
                  onChange={w => onRegionWeightsChange(name, w)}
                  onClose={() => onOpenSettings(null)}
                />
              )}
            </div>
          );
        })}
        {selectedCount === 0 && (
          <div className="region-empty-hint">Click a region on the right to add it</div>
        )}
        {Array.from({ length: MAX_UNLOCKABLE_REGIONS - selectedCount }).map((_, i) => (
          <div key={`empty-${i}`} className="region-panel-item region-empty-slot">— {selectedCount + i + 1}. —</div>
        ))}
      </div>

      <div className="region-panel region-panel-available">
        <div className="region-panel-label">Available</div>
        <div className="region-available-grid">
        {unselected.map(region => {
          const showSettings = openSettings === region.name;
          const hasCustomWeights = Object.keys(regionWeights[region.name] || {}).length > 0;
          return (
            <div key={region.name} style={{ position: 'relative' }}>
              <div
                ref={el => { itemRefs.current[region.name] = el; }}
                className={`region-panel-item region-available-item${selectedCount >= MAX_UNLOCKABLE_REGIONS ? ' region-panel-maxed' : ''}`}
                onClick={() => selectedCount < MAX_UNLOCKABLE_REGIONS && onSelectRegion(region.name)}
                onMouseEnter={() => showTooltip(region.name, region)}
                onMouseLeave={onHideContrib}
              >
                <img
                  className="region-badge-icon"
                  src={`/regions/${region.name}_Area_Badge.png`}
                  alt=""
                  onError={e => { e.target.style.display = 'none'; }}
                />
                <span className="region-item-name">{region.name}</span>
                <button
                  className={`relic-cog ${hasCustomWeights ? 'cog-active' : ''}`}
                  onClick={e => { e.stopPropagation(); onOpenSettings(showSettings ? null : region.name); }}
                  title="Adjust region weights"
                >⚙️</button>
              </div>
              {showSettings && (
                <RegionSettings
                  region={region}
                  weights={regionWeights[region.name] || {}}
                  onChange={w => onRegionWeightsChange(region.name, w)}
                  onClose={() => onOpenSettings(null)}
                />
              )}
            </div>
          );
        })}
        </div>
      </div>
    </div>
  );
}

export default function RegionTree({ selectedRegions, onSelectRegion, onReorderRegion, onReset, regionWeights, onRegionWeightsChange }) {
  const [isOpen, setIsOpen] = useState(true);
  const [openSettings, setOpenSettings] = useState(null);
  const [hoverContrib, setHoverContrib] = useState(null);
  const [modalRegion, setModalRegion] = useState(null);
  const hideTimer = useRef(null);
  const showTimer = useRef(null);
  const selectedCount = selectedRegions.length;

  const handleOpenSettings = (name) => {
    setOpenSettings(name);
    if (name) setHoverContrib(null);
  };

  const handleShowContrib = (data) => {
    if (openSettings) return;
    clearTimeout(hideTimer.current);
    clearTimeout(showTimer.current);
    showTimer.current = setTimeout(() => setHoverContrib(data), 300);
  };

  const handleHideContrib = () => {
    clearTimeout(showTimer.current);
    hideTimer.current = setTimeout(() => setHoverContrib(null), 80);
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
                openSettings={openSettings}
                onOpenSettings={handleOpenSettings}
                onShowContrib={handleShowContrib}
                onHideContrib={handleHideContrib}
              />
            ))}
          </div>
        </div>

        <div className="tier-label" style={{ marginTop: '0.75rem' }}>
          <span>Unlockable</span>
          <span className="tier-chosen">Click to add up to {MAX_UNLOCKABLE_REGIONS} regions — drag to re-order</span>
        </div>

        <RegionSplitPanel
          selectedRegions={selectedRegions}
          onSelectRegion={onSelectRegion}
          onReorderRegion={onReorderRegion}
          openSettings={openSettings}
          onOpenSettings={handleOpenSettings}
          regionWeights={regionWeights}
          onRegionWeightsChange={onRegionWeightsChange}
          onShowContrib={handleShowContrib}
          onHideContrib={handleHideContrib}
        />

      </div>

      <ContribTooltip
        data={hoverContrib}
        onMouseEnter={() => clearTimeout(hideTimer.current)}
        onMouseLeave={handleHideContrib}
        onMoreInfo={name => { setHoverContrib(null); setModalRegion(name); }}
      />
      <RegionDetailModal
        key={modalRegion}
        regionName={modalRegion}
        customWeights={regionWeights[modalRegion] || {}}
        onClose={() => setModalRegion(null)}
      />
    </main>
  );
}
