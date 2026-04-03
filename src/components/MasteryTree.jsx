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
        <div>
          Combat Masteries
          <p className="relic-tree-desc">Spend up to 10 points to boost combat across Melee, Range, and Magic</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <span className="mastery-pts-badge">{totalSpent} / {MAX_MASTERY_POINTS} pts</span>
          <button className="close-btn" disabled={totalSpent === 0} onClick={e => { e.stopPropagation(); onReset(); }}>Reset</button>
          <div className={`collapse-chevron ${isOpen ? 'open' : ''}`} />
        </div>
      </h2>

      <div className={`collapsible-body ${isOpen ? 'open' : ''}`}>

        <div className="mastery-placeholder-note">
          ⚠️ Placeholder — actual mastery perks will be updated once spoiled
        </div>

        {BRANCHES.map(branch => {
          const depth = selectedMasteries[branch] || 0;
          return (
            <div key={branch} className={`tier-block mastery-branch-${branch.toLowerCase()}`}>
              <div className="tier-label">
                <span>{branch}</span>
                {depth > 0 && <span className="tier-chosen">{depth} / 6</span>}
              </div>
              <div className="mastery-track-wrap">
                {MASTERIES[branch].map((mastery, idx) => {
                  const tier = idx + 1;
                  const isSelected = depth >= tier;
                  const isNext = depth === tier - 1 && pointsLeft > 0;
                  const isLocked = !isSelected && !isNext;
                  return (
                    <button
                      key={mastery.name}
                      className={`mastery-tier-btn${isSelected ? ' selected' : ''}${isNext ? ' mastery-available' : ''}${isLocked ? ' mastery-locked' : ''}`}
                      onClick={() => !isLocked && handleClick(branch, tier)}
                      data-tooltip={mastery.dps || undefined}
                    >
                      <div className="mastery-tier-node">
                        <span className="mastery-roman">{ROMAN[idx]}</span>
                      </div>
                      <div className="mastery-tier-info">
                        <span className="mastery-tier-name">{mastery.name}</span>
                        <span className="mastery-tier-desc">{mastery.desc}</span>
                      </div>
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
            {passivesUnlocked > 0 && <span className="tier-chosen">{passivesUnlocked} / 6 unlocked</span>}
          </div>
          <div className="mastery-track-wrap">
            {MASTERIES.Passives.map((passive, idx) => {
              const tier = idx + 1;
              const isUnlocked = passivesUnlocked >= tier;
              return (
                <div
                  key={passive.name}
                  className={`mastery-tier-btn${isUnlocked ? ' selected' : ' mastery-locked'}`}
                >
                  <div className="mastery-tier-node">
                    <span className="mastery-roman">{ROMAN[idx]}</span>
                  </div>
                  <div className="mastery-tier-info">
                    <span className="mastery-tier-name">{passive.name}</span>
                    <span className="mastery-tier-desc">{passive.desc}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </main>
  );
}
