import React from 'react';

export default function ComboBanner({ activeCombos, pendingCombos }) {
  if (activeCombos.length === 0 && pendingCombos.length === 0) return null;

  return (
    <div className="combo-banner">
      {activeCombos.map(c => (
        <span key={c.label} className="combo-tag combo-active">
          ⚡ {c.label}
        </span>
      ))}
      {pendingCombos.map(c => (
        <span key={c.label} className="combo-tag combo-pending" title={`Needs: ${c.missing.join(', ')}`}>
          🔗 {c.label} ({c.matched}/{c.total})
        </span>
      ))}
    </div>
  );
}
