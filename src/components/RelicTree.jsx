import React, { useState } from 'react';
import { RELICS } from '../data/relics';
import RelicIcon from './RelicIcon';

function RelicSettings({ relic, weights, onChange, onClose }) {
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
        {Object.entries(relic.skills || {}).map(([skill, base]) => (
          <label key={skill}>
            {skill}
            <input
              type="number" min="0" max="10" step="0.5"
              value={weights.skills?.[skill] ?? base}
              onChange={e => onChange({
                ...weights,
                skills: { ...weights.skills, [skill]: +e.target.value }
              })}
            />
          </label>
        ))}

        {Object.keys(relic.extras || {}).length > 0 && (
          <>
            <h5>Extras</h5>
            {Object.entries(relic.extras).map(([extra, base]) => (
              <label key={extra}>
                {extra}
                <input
                  type="number" min="0" max="10" step="0.5"
                  value={weights.extras?.[extra] ?? base}
                  onChange={e => onChange({
                    ...weights,
                    extras: { ...weights.extras, [extra]: +e.target.value }
                  })}
                />
              </label>
            ))}
          </>
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
    <div className={`relic-btn-wrapper ${selected && isReloaded ? 'relic-btn-wrapper-reloaded' : ''}`}>
      <div className="relic-btn-row">
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

        <button
          className={`relic-cog ${hasCustomWeights ? 'cog-active' : ''}`}
          onClick={e => { e.stopPropagation(); setShowSettings(s => !s); }}
          title="Adjust relic weights"
        >
          ⚙️
        </button>
      </div>

      {selected && isReloaded && (
        <ReloadedPicker
          selectedRelics={selectedRelics}
          reloadedRelic={reloadedRelic}
          onSelectReloadedRelic={onSelectReloadedRelic}
        />
      )}

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
