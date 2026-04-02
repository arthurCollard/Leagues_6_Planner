import React from 'react';
import { EXTRAS } from '../data/skills';

export default function ComboBanner({ activeCombos, pendingCombos, activeThresholds = [], pendingThresholds = [], extras = {} }) {
  if (activeCombos.length === 0 && pendingCombos.length === 0 && activeThresholds.length === 0 && pendingThresholds.length === 0) return null;

  return (
    <div className="combo-banner">
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
  );
}
