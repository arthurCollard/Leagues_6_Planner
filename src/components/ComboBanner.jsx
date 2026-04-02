import React from 'react';
import { EXTRAS } from '../data/skills';

export default function ComboBanner({ activeCombos, pendingCombos, activeThresholds = [], pendingThresholds = [], extras = {}, activePassives = [], onToggleSettings, onReset, hasSelections }) {
  return (
    <div className="info-bar">
      <div className="info-bar-section info-bar-combos">
        <span className="info-bar-label">Combos &amp; Bonuses</span>
        <div className="info-bar-tags">
          {activeCombos.map(c => (
            <span key={c.label} className="combo-tag combo-active">
              ⚡ {c.label}
            </span>
          ))}
          {activeThresholds.map(t => (
            <span key={t.extra} className="combo-tag combo-active">
              ⚡ {t.label || t.extra}
            </span>
          ))}
          {pendingCombos.map(c => (
            <span key={c.label} className="combo-tag combo-pending" data-tooltip={`Needs: ${c.missing.join(', ')}`}>
              🔗 {c.label} ({c.matched}/{c.total})
            </span>
          ))}
          {pendingThresholds.map(t => {
            const extraName = EXTRAS.find(x => x.id === t.extra)?.name || t.extra;
            return (
              <span key={t.extra} className="combo-tag combo-pending" data-tooltip={`Need ${t.threshold} ${extraName}`}>
                🔗 {t.label || t.extra} ({extras[t.extra]?.score || 0}/{t.threshold})
              </span>
            );
          })}
        </div>
      </div>
      <div className="info-bar-section info-bar-passives">
        <span className="info-bar-label">Active Passives</span>
        <div className="info-bar-passive-chips">
          {activePassives.map((p, i) => (
            <span key={i} className="passive-chip" data-tooltip={p.text}>
              {p.short}
            </span>
          ))}
        </div>
      </div>
      <div className="info-bar-controls">
        <button className="info-bar-ctrl-btn" onClick={onToggleSettings}>⚙️</button>
        <button className="info-bar-ctrl-btn" onClick={onReset} disabled={!hasSelections}>↺</button>
      </div>
    </div>
  );
}
