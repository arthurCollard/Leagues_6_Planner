import React, { useState } from 'react';
import { RELICS } from '../data/relics';
import RelicIcon from './RelicIcon';
import { SKILLS, EXTRAS } from '../data/skills';

const SKILL_NAME = Object.fromEntries(SKILLS.map(s => [s.id, s.name]));
const EXTRA_NAME = Object.fromEntries(EXTRAS.map(e => [e.id, e.name]));

function RelicSettings({ relic, weights, onChange, onClose }) {
  const baseSkills = relic.skills || {};
  const baseExtras = relic.extras || {};

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
        <strong>
          <RelicIcon src={relic.icon} name={relic.name} />
          {relic.name} Weights
        </strong>
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

function RelicButton({ relic, selected, onSelect, weights, onWeightsChange, selectedRelics, reloadedRelic, onSelectReloadedRelic }) {
  const [showSettings, setShowSettings] = useState(false);
  const hasCustomWeights = Object.keys(weights).length > 0;
  const isReloaded = relic.special === 'reloaded';

  return (
    <div className="relic-btn-outer">
      <div className={`relic-btn-wrapper ${selected && isReloaded ? 'relic-btn-wrapper-reloaded' : ''}`}>
        <button
          className={`relic-btn ${selected ? 'selected' : ''}`}
          onClick={onSelect}
        >
          <RelicIcon src={relic.icon} name={relic.name} />
          <div className="relic-info">
            <strong>{relic.name}</strong>
            <small>{relic.desc}</small>
          </div>
          {selected && <span className="check">✓</span>}
        </button>

        {selected && isReloaded && (
          <ReloadedPicker
            selectedRelics={selectedRelics}
            reloadedRelic={reloadedRelic}
            onSelectReloadedRelic={onSelectReloadedRelic}
          />
        )}
      </div>

      <button
        className={`relic-cog ${hasCustomWeights ? 'cog-active' : ''}`}
        onClick={e => { e.stopPropagation(); setShowSettings(s => !s); }}
        title="Adjust relic weights"
      >
        ⚙️
      </button>

      {showSettings && (
        <RelicSettings
          relic={relic}
          weights={weights}
          onChange={onWeightsChange}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}

function ReloadedPicker({ selectedRelics, reloadedRelic, onSelectReloadedRelic }) {
  // Gather all relics from tiers 1-6 that aren't already selected
  const options = Object.entries(RELICS)
    .filter(([tier]) => Number(tier) < 7)
    .flatMap(([tier, relics]) =>
      relics
        .filter(r => selectedRelics[tier]?.name !== r.name)
        .map(r => ({ ...r, tier }))
    );

  return (
    <div className="reloaded-picker">
      <label className="reloaded-picker-label">Reloaded:</label>
      <select
        className="reloaded-picker-select"
        value={reloadedRelic?.name ?? ''}
        onChange={e => {
          const found = options.find(r => r.name === e.target.value) ?? null;
          onSelectReloadedRelic(found);
        }}
      >
        <option value="">— Choose a relic —</option>
        {options.map(r => (
          <option key={r.name} value={r.name}>
            T{r.tier}: {r.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function RelicTree({ selectedRelics, onSelectRelic, relicWeights, onRelicWeightsChange, reloadedRelic, onSelectReloadedRelic }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <main className="relic-tree">
      <h2 className="section-header" onClick={() => setIsOpen(o => !o)}>
        Relic Tree
        <div className={`collapse-chevron ${isOpen ? 'open' : ''}`} />
      </h2>

      <div className={`collapsible-body ${isOpen ? 'open' : ''}`}>
        {Object.entries(RELICS).map(([tier, relics]) => (
          <div key={tier} className="tier-block">
            <div className="tier-label">
              <span>Tier {tier}</span>
              {selectedRelics[tier] && (
                <span className="tier-chosen">
                  <RelicIcon src={selectedRelics[tier].icon} name={selectedRelics[tier].name} />
                  {selectedRelics[tier].special === 'reloaded' && reloadedRelic
                    ? `Reloaded (${reloadedRelic.name})`
                    : selectedRelics[tier].name}
                </span>
              )}
            </div>
            <div className="relic-row">
              {relics.map(relic => (
                <RelicButton
                  key={relic.name}
                  relic={relic}
                  selected={selectedRelics[tier]?.name === relic.name}
                  onSelect={() => onSelectRelic(tier, relic)}
                  weights={relicWeights?.[relic.name] ?? {}}
                  onWeightsChange={w => onRelicWeightsChange(relic.name, w)}
                  selectedRelics={selectedRelics}
                  reloadedRelic={reloadedRelic}
                  onSelectReloadedRelic={onSelectReloadedRelic}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
