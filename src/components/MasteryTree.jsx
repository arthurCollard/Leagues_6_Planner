import { useState } from 'react';
import { PACTS } from '../data/masteries';

const BRANCH_LABELS = { Melee: 'Melee', Range: 'Range', Magic: 'Magic' };

export default function MasteryTree({ selectedMasteries, onSelectMastery, onReset }) {
  const [isOpen, setIsOpen] = useState(true);

  const selected = selectedMasteries || {};
  const totalSpent = Object.values(selected).filter(Boolean).length;

  const togglePact = (id) => {
    const next = { ...selected, [id]: !selected[id] };
    onSelectMastery(next);
  };

  return (
    <main className="relic-tree">
      <h2 className="section-header" onClick={() => setIsOpen(o => !o)}>
        <div>
          Pacts
          <p className="relic-tree-desc">Choose pacts to enhance your combat style</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <button className="close-btn" disabled={totalSpent === 0} onClick={e => { e.stopPropagation(); onReset(); }}>Reset</button>
          <div className={`collapse-chevron ${isOpen ? 'open' : ''}`} />
        </div>
      </h2>

      <div className={`collapsible-body ${isOpen ? 'open' : ''}`}>
        <div className="mastery-placeholder-note">
          ⚠️ Names not yet revealed — pact data will be updated once fully spoiled
        </div>

        <div className="pacts-grid">
          {PACTS.map(pact => (
            <button
              key={pact.id}
              className={`pact-card${selected[pact.id] ? ' selected' : ''}`}
              onClick={() => togglePact(pact.id)}
            >
              <div className="pact-branch-tag">{BRANCH_LABELS[pact.branch]}</div>
              <div className="pact-name">{pact.name}</div>
              <div className="pact-desc">{pact.desc}</div>
              {selected[pact.id] && <span className="check">✓</span>}
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
