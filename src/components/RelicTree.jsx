import React, { useState } from 'react';
import { RELICS } from '../data/relics';

function RelicIcon({ src, name, className = "relic-icon" }) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className={`${className} relic-fallback`} title={name}>
        {name[0].toUpperCase()}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      className={className}
      onError={() => setError(true)}
      loading="lazy"
    />
  );
}

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

function RelicButton({ relic, selected, onSelect, weights, onWeightsChange }) {
  const [showSettings, setShowSettings] = useState(false);
  const hasCustomWeights = Object.keys(weights).length > 0;

  return (
    <div className="relic-btn-wrapper">
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

export default function RelicTree({ selectedRelics, onSelectRelic, relicWeights, onRelicWeightsChange }) {
  return (
    <main className="relic-tree">
      <h2>Relic Tree</h2>
      {Object.entries(RELICS).map(([tier, relics]) => (
        <div key={tier} className="tier-block">
          <div className="tier-label">
            <span>Tier {tier}</span>
            {selectedRelics[tier] && (
              <span className="tier-chosen">
                <RelicIcon src={selectedRelics[tier].icon} name={selectedRelics[tier].name} />
                {selectedRelics[tier].name}
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
              />
            ))}
          </div>
        </div>
      ))}
    </main>
  );
}
