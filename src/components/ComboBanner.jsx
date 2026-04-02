import React, { useState, useRef, useEffect } from 'react';
import { EXTRAS } from '../data/skills';
import ContribTooltip from './ContribTooltip';

export default function ComboBanner({ activeCombos, pendingCombos, activeThresholds = [], pendingThresholds = [], extras = {}, activePassives = [], onToggleSettings, onReset, hasSelections }) {
  const [activeTab, setActiveTab] = useState('pending');
  const [hoverCombo, setHoverCombo] = useState(null);
  const hideTimer = useRef(null);
  const prevActiveCount = useRef(0);

  const activeCount = activeCombos.length + activeThresholds.length;
  const pendingCount = pendingCombos.length + pendingThresholds.length;

  useEffect(() => {
    if (prevActiveCount.current === 0 && activeCount > 0) {
      setActiveTab('active');
    }
    prevActiveCount.current = activeCount;
  }, [activeCount]);

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
        <div className="info-bar-combos-header">
          <span className="info-bar-label">
            Combos &amp; Bonuses
            <span className="info-icon" data-tooltip="Certain relics and regions work well together. You can see combos and their bonuses to your skills here.">ℹ</span>
          </span>
          <label className="combo-tab-toggle">
            <span className={`combo-tab-label ${activeTab === 'active' ? 'combo-tab-selected' : ''}`}>
              Active <span className="tab-count">{activeCount}</span>
            </span>
            <span
              className={`toggle-track ${activeTab === 'pending' ? 'toggle-on' : 'toggle-off'}`}
              onClick={() => setActiveTab(activeTab === 'active' ? 'pending' : 'active')}
            >
              <span className="toggle-thumb" />
            </span>
            <span className={`combo-tab-label ${activeTab === 'pending' ? 'combo-tab-selected' : ''}`}>
              Pending <span className="tab-count">{pendingCount}</span>
            </span>
          </label>
        </div>

        <div className="info-bar-tags">
          {activeTab === 'active' && <>
            {activeCombos.map(c => (
              <span key={c.label} className="combo-tag combo-active"
                onMouseEnter={e => handleMouseEnter(e, c)}
                onMouseLeave={handleMouseLeave}>
                ⚡ {c.label}
              </span>
            ))}
            {activeThresholds.map(t => (
              <span key={t.label || t.extra} className="combo-tag combo-active"
                onMouseEnter={e => handleMouseEnter(e, { bonuses: t.perPoint, tooltip: t.tooltip })}
                onMouseLeave={handleMouseLeave}>
                ⚡ {t.label || t.extra}
              </span>
            ))}
            {activeCount === 0 && (
              <span className="info-bar-empty">No active combos yet</span>
            )}
          </>}

          {activeTab === 'pending' && <>
            {pendingCombos.map(c => (
              <span key={c.label} className="combo-tag combo-pending"
                data-tooltip={`Needs: ${c.missing.join(', ')}`}>
                🔗 {c.label} ({c.matched}/{c.total})
              </span>
            ))}
            {pendingThresholds.map(t => {
              const extraName = EXTRAS.find(x => x.id === t.extra)?.name || t.extra;
              return (
                <span key={t.extra} className="combo-tag combo-pending"
                  data-tooltip={`Need ${t.threshold} ${extraName}`}>
                  🔗 {t.label || t.extra} ({extras[t.extra]?.score || 0}/{t.threshold})
                </span>
              );
            })}
            {pendingCount === 0 && (
              <span className="info-bar-empty">No pending combos</span>
            )}
          </>}
        </div>
      </div>

      <div className="info-bar-section info-bar-passives">
        <span className="info-bar-label">
          Passive Bonuses
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
