import React, { useState, useRef } from 'react';
import { EXTRAS } from '../data/skills';
import ContribTooltip from './ContribTooltip';

export default function ComboBanner({ activeCombos, pendingCombos, activeThresholds = [], pendingThresholds = [], extras = {}, activePassives = [], onToggleSettings, onReset, hasSelections }) {
  const [hoverCombo, setHoverCombo] = useState(null);
  const hideTimer = useRef(null);

  const handleMouseEnter = (e, combo) => {
    clearTimeout(hideTimer.current);
    const rect = e.currentTarget.getBoundingClientRect();
    setHoverCombo({
      pos: { left: rect.left, top: rect.bottom + 6 },
      skills: combo.bonuses || {},
      extras: {},
      description: combo.tooltip || undefined,
    });
  };

  const handleMouseLeave = () => {
    hideTimer.current = setTimeout(() => setHoverCombo(null), 80);
  };

  return (
    <div className="info-bar">
      <div className="info-bar-section info-bar-combos">
        <span className="info-bar-label">Combos &amp; Bonuses</span>
        <div className="info-bar-tags">
          {activeCombos.map(c => (
            <span
              key={c.label}
              className="combo-tag combo-active"
              onMouseEnter={e => handleMouseEnter(e, c)}
              onMouseLeave={handleMouseLeave}
            >
              ⚡ {c.label}
            </span>
          ))}
          {activeThresholds.map(t => (
            <span
              key={t.label || t.extra}
              className="combo-tag combo-active"
              onMouseEnter={e => handleMouseEnter(e, { bonuses: t.perPoint, tooltip: t.tooltip })}
              onMouseLeave={handleMouseLeave}
            >
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
      <ContribTooltip data={hoverCombo} />

      <div className="info-bar-controls">
        <button className="info-bar-ctrl-btn" onClick={onToggleSettings}>⚙️</button>
        <button className="info-bar-ctrl-btn" onClick={onReset} disabled={!hasSelections}>↺</button>
      </div>
    </div>
  );
}
