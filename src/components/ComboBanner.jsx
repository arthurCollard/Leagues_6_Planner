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

  const MAX_PILLS = 11;
  const allPills = [
    ...activeCombos.map(c => ({ type: 'ac', key: `ac-${c.label}`, combo: c })),
    ...activeThresholds.map(t => ({ type: 'at', key: `at-${t.label || t.extra}`, threshold: t })),
    ...pendingCombos.map(c => ({ type: 'pc', key: `pc-${c.label}`, combo: c })),
    ...pendingThresholds.map(t => ({ type: 'pt', key: `pt-${t.extra}`, threshold: t })),
  ];
  const visiblePills = allPills.slice(0, MAX_PILLS);
  const overflowCount = allPills.length - MAX_PILLS;

  return (
    <div className="info-bar">
      <div className="info-bar-section info-bar-combos">
        <span className="info-bar-label">
          Combos &amp; Bonuses
          <span className="info-icon" data-tooltip="Certain relics and regions work well together. You can see combos and their bonuses to your skills here.">ℹ</span>
        </span>
        <div className="info-bar-tags">
          {visiblePills.map(p => {
            if (p.type === 'ac') return (
              <span key={p.key} className="combo-tag combo-active"
                onMouseEnter={e => handleMouseEnter(e, p.combo)}
                onMouseLeave={handleMouseLeave}>
                ⚡ {p.combo.label}
              </span>
            );
            if (p.type === 'at') return (
              <span key={p.key} className="combo-tag combo-active"
                onMouseEnter={e => handleMouseEnter(e, { bonuses: p.threshold.perPoint, tooltip: p.threshold.tooltip })}
                onMouseLeave={handleMouseLeave}>
                ⚡ {p.threshold.label || p.threshold.extra}
              </span>
            );
            if (p.type === 'pc') return (
              <span key={p.key} className="combo-tag combo-pending"
                data-tooltip={`Needs: ${p.combo.missing.join(', ')}`}>
                🔗 {p.combo.label} ({p.combo.matched}/{p.combo.total})
              </span>
            );
            if (p.type === 'pt') {
              const extraName = EXTRAS.find(x => x.id === p.threshold.extra)?.name || p.threshold.extra;
              return (
                <span key={p.key} className="combo-tag combo-pending"
                  data-tooltip={`Need ${p.threshold.threshold} ${extraName}`}>
                  🔗 {p.threshold.label || p.threshold.extra} ({extras[p.threshold.extra]?.score || 0}/{p.threshold.threshold})
                </span>
              );
            }
            return null;
          })}
          {overflowCount > 0 && (
            <span className="combo-tag combo-overflow">+{overflowCount} more</span>
          )}
        </div>
      </div>
      <div className="info-bar-section info-bar-passives">
        <span className="info-bar-label">
          Active Passives
          <span className="info-icon" data-tooltip="Relic Tiers provide passive effects. You can see the accumulated effects of your unlocked passives here">ℹ</span>
        </span>
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
