import { useState, useRef } from 'react';
import { UNIVERSAL_REGIONS, UNLOCKABLE_REGIONS, MAX_UNLOCKABLE_REGIONS } from '../data/regions';

function RegionCard({ region, selected, disabled, onClick }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const hideTimer = useRef(null);

  const handleEnter = () => {
    clearTimeout(hideTimer.current);
    setShowTooltip(true);
  };

  const handleLeave = () => {
    hideTimer.current = setTimeout(() => setShowTooltip(false), 120);
  };

  return (
    <div
      className="region-card-wrapper"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <div
        className={`relic-btn${selected ? ' selected' : ''}${disabled ? ' mastery-locked' : ''}`}
        onClick={onClick}
      >
        <div className="relic-info">
          <strong>{region.name}</strong>
        </div>
        {selected && <span className="check">✓</span>}
      </div>

      {showTooltip && region.drops?.length > 0 && (
        <div className="region-tooltip">
          <strong>Notable Drops</strong>
          <ul>
            {region.drops.map(d => <li key={d}>{d}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function RegionTree({ selectedRegions, onSelectRegion, onReset }) {
  const [isOpen, setIsOpen] = useState(true);
  const selectedCount = selectedRegions.length;

  return (
    <main className="relic-tree">
      <h2 className="section-header" onClick={() => setIsOpen(o => !o)}>
        <span>Regions</span>
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
              <RegionCard key={region.name} region={region} selected disabled={false} onClick={null} />
            ))}
          </div>
        </div>

        <div className="tier-block">
          <div className="tier-label">
            <span>Unlockable</span>
            <span className="tier-chosen">Pick up to {MAX_UNLOCKABLE_REGIONS}</span>
          </div>
          <div className="relic-row">
            {UNLOCKABLE_REGIONS.map(region => {
              const isSelected = selectedRegions.includes(region.name);
              const isDisabled = !isSelected && selectedCount >= MAX_UNLOCKABLE_REGIONS;
              return (
                <RegionCard
                  key={region.name}
                  region={region}
                  selected={isSelected}
                  disabled={isDisabled}
                  onClick={() => !isDisabled && onSelectRegion(region.name)}
                />
              );
            })}
          </div>
        </div>

      </div>
    </main>
  );
}
