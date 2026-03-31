import { useState } from 'react';
import { MASTERIES } from '../data/masteries';

const MAX_MASTERY_POINTS = 10;
const BRANCHES = ['Melee', 'Range', 'Magic'];
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI'];

export default function MasteryTree({ selectedMasteries, onSelectMastery, onReset }) {
  const [isOpen, setIsOpen] = useState(true);

  const totalSpent = BRANCHES.reduce((sum, b) => sum + (selectedMasteries[b] || 0), 0);
  const passivesUnlocked = Math.max(0, ...BRANCHES.map(b => selectedMasteries[b] || 0));
  const pointsLeft = MAX_MASTERY_POINTS - totalSpent;

  const handleClick = (branch, tier) => {
    const current = selectedMasteries[branch] || 0;
    if (current >= tier) {
      onSelectMastery(branch, tier - 1);
    } else if (current === tier - 1 && pointsLeft > 0) {
      onSelectMastery(branch, tier);
    }
  };

  return (
    <main className="relic-tree">
      <h2 className="section-header" onClick={() => setIsOpen(o => !o)}>
        <span>Combat Masteries</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <span className="mastery-pts-badge">{totalSpent} / {MAX_MASTERY_POINTS} pts</span>
          <button className="close-btn" disabled={totalSpent === 0} onClick={e => { e.stopPropagation(); onReset(); }}>Reset</button>
          <div className={`collapse-chevron ${isOpen ? 'open' : ''}`} />
        </div>
      </h2>

      <div className={`collapsible-body ${isOpen ? 'open' : ''}`}>

        {/* One tier-block per branch */}
        {BRANCHES.map(branch => {
          const depth = selectedMasteries[branch] || 0;
          return (
            <div key={branch} className="tier-block">
              <div className="tier-label">
                <span>{branch}</span>
                {depth > 0 && (
                  <span className="tier-chosen">{depth} / 6 tiers</span>
                )}
              </div>
              <div className="mastery-row-grid">
                {MASTERIES[branch].map((mastery, idx) => {
                  const tier = idx + 1;
                  const isSelected = depth >= tier;
                  const isNext = depth === tier - 1 && pointsLeft > 0;
                  const isLocked = !isSelected && !isNext;

                  return (
                    <button
                      key={mastery.name}
                      className={`relic-btn${isSelected ? ' selected' : ''}${isNext ? ' mastery-available' : ''}${isLocked ? ' mastery-locked' : ''}`}
                      onClick={() => !isLocked && handleClick(branch, tier)}
                      title={mastery.dps || undefined}
                    >
                      <div className="mastery-diamond">
                        <span className="mastery-roman">{ROMAN[idx]}</span>
                      </div>
                      <div className="relic-info">
                        <strong>{mastery.name}</strong>
                        <small>{mastery.desc}</small>
                      </div>
                      {isSelected && <span className="check">✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Passives — auto-unlocked by highest branch depth */}
        <div className="tier-block">
          <div className="tier-label">
            <span>Passives</span>
            {passivesUnlocked > 0 && (
              <span className="tier-chosen">{passivesUnlocked} / 6 unlocked</span>
            )}
          </div>
          <div className="mastery-row-grid">
            {MASTERIES.Passives.map((passive, idx) => {
              const tier = idx + 1;
              const isUnlocked = passivesUnlocked >= tier;

              return (
                <div
                  key={passive.name}
                  className={`relic-btn${isUnlocked ? ' selected' : ' mastery-locked'}`}
                >
                  <div className="mastery-diamond">
                    <span className="mastery-roman">{ROMAN[idx]}</span>
                  </div>
                  <div className="relic-info">
                    <strong>{passive.name}</strong>
                    <small>{passive.desc}</small>
                  </div>
                  {isUnlocked && <span className="check">✓</span>}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </main>
  );
}
