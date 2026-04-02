import { useState, useEffect } from 'react';
import { RELICS } from '../data/relics';
import RelicIcon from './RelicIcon';
import { SKILLS, EXTRAS } from '../data/skills';

const SKILL_NAME = Object.fromEntries(SKILLS.map(s => [s.id, s.name]));
const EXTRA_NAME = Object.fromEntries(EXTRAS.map(e => [e.id, e.name]));

export const TIER_PASSIVES = {
  1: [
    { short: '5x Leagues XP', text: 'Leagues XP multiplier is 5x.', group: 'xp_mult', priority: 1 },
    { short: '2x item drops', text: 'Items from eligible sources will be 2x as common.', group: 'drop_rate', priority: 1 },
    { short: 'Farming ticks: 1min', text: 'Farming ticks will occur every minute instead of every five minutes.' },
    { short: '4x minigame points', text: 'Minigame points received are boosted by 4x.', group: 'minigame_pts', priority: 1 },
    { short: 'Infinite run energy', text: 'Run energy is never drained whilst running.' },
    { short: 'Stackable clue boxes', text: 'All clue scrolls will drop as stackable scroll boxes, and clue step progress is saved between clues.' },
    { short: 'Region-locked clue steps', text: 'Players will only receive clue steps they can access within an unlocked region.' },
  ],
  2: [
    { short: '8x Leagues XP', text: 'Leagues XP multiplier is increased from 5x to 8x.', group: 'xp_mult', priority: 2 },
  ],
  3: [
    { short: '1.5x combat XP', text: 'Combat experience (including Hitpoints and Prayer) will be multiplied by 1.5x. This is multiplicative with other experience modifiers.' },
    { short: 'Free Bigger & Badder', text: 'The Bigger and Badder slayer unlock is unlocked for free.' },
    { short: '5x slayer points', text: 'Slayer reward points are 5x from tasks, and you aren\'t required to complete 5 tasks before earning points.' },
    { short: 'Superior rate: 1/50', text: 'Superior slayer monsters will appear at a rate of 1/50.' },
  ],
  4: [
    { short: '5x item drops', text: 'Items from eligible sources will be 5x as common.', group: 'drop_rate', priority: 2 },
    { short: '8x minigame points', text: 'Minigame points received are boosted by 8x.', group: 'minigame_pts', priority: 2 },
  ],
  5: [
    { short: '12x Leagues XP', text: 'Leagues XP multiplier is increased from 8x to 12x.', group: 'xp_mult', priority: 3 },
  ],
  7: [
    { short: '16x Leagues XP', text: 'Leagues XP multiplier is increased from 12x to 16x.', group: 'xp_mult', priority: 4 },
  ],
};

function TierPassiveModal({ passives, tier, onClose }) {
  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div className="relic-modal-backdrop" onMouseDown={onClose}>
      <div className="relic-modal" onMouseDown={e => e.stopPropagation()}>
        <div className="relic-modal-header">
          <strong className="relic-modal-title">Tier {tier} Passive Effects</strong>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        <div className="relic-modal-body">
          <div className="relic-modal-section">
            <ul className="relic-modal-list">
              {passives.map((p, i) => <li key={i}>{p.text}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function TierPassiveTooltip({ passives, tier }) {
  const [open, setOpen] = useState(false);

  return (
    <span className="tier-info-wrap">
      <button
        className="tier-info-btn"
        onClick={e => { e.stopPropagation(); setOpen(true); }}
        aria-label="Passive effects"
      >Passives</button>
      {open && <TierPassiveModal passives={passives} tier={tier} onClose={() => setOpen(false)} />}
    </span>
  );
}

function RelicDescModal({ relic, onClose }) {
  const d = relic.description;
  const toggles = d.toggles ?? (d.toggle ? [d.toggle] : []);

  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div className="relic-modal-backdrop" onMouseDown={onClose}>
      <div className="relic-modal" onMouseDown={e => e.stopPropagation()}>
        <div className="relic-modal-header">
          <div className="relic-modal-title-row">
            <RelicIcon src={relic.icon} name={relic.name} />
            <strong className="relic-modal-title">{relic.name}</strong>
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="relic-modal-body">
          {d.grant && <p className="relic-modal-grant">{d.grant}</p>}

          {toggles.length > 0 && (
            <div className="relic-modal-section">
              <span className="relic-modal-section-label">Toggleable</span>
              <ul className="relic-modal-list relic-modal-toggles">
                {toggles.map((t, i) => <li key={i}>{t}</li>)}
              </ul>
            </div>
          )}

          {d.effects?.length > 0 && (
            <div className="relic-modal-section">
              <span className="relic-modal-section-label">Active Effects</span>
              <ul className="relic-modal-list">
                {d.effects.map((ef, i) => <li key={i}>{ef}</li>)}
              </ul>
            </div>
          )}

          {d.notes?.length > 0 && (
            <div className="relic-modal-section">
              <span className="relic-modal-section-label">Notes</span>
              <ul className="relic-modal-list relic-modal-notes">
                {d.notes.map((n, i) => <li key={i}>{n}</li>)}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function RelicDescButton({ relic }) {
  const [open, setOpen] = useState(false);
  if (!relic.description) return null;

  return (
    <>
      <button
        className="relic-info-btn"
        onClick={e => { e.stopPropagation(); setOpen(true); }}
        aria-label="Relic description"
      >i</button>
      {open && <RelicDescModal relic={relic} onClose={() => setOpen(false)} />}
    </>
  );
}

function RelicSettings({ relic, weights, onChange, onClose }) {
  const baseSkills = relic.skills || {};
  const baseExtras = relic.extras || {};

  const customSkillIds = Object.keys(weights.skills || {}).filter(id => !(id in baseSkills));
  const customExtraIds = Object.keys(weights.extras || {}).filter(id => !(id in baseExtras));

  const addableSkills = SKILLS.filter(s => !(s.id in baseSkills) && !customSkillIds.includes(s.id));
  const addableExtras = EXTRAS.filter(e => !(e.id in baseExtras) && !customExtraIds.includes(e.id));

  function removeSkill(id) {
    const s = { ...weights.skills };
    delete s[id];
    onChange({ ...weights, skills: s });
  }
  function removeExtra(id) {
    const e = { ...weights.extras };
    delete e[id];
    onChange({ ...weights, extras: e });
  }

  return (
    <div className="relic-settings-panel">
      <div className="relic-settings-header">
        <strong>
          <RelicIcon src={relic.icon} name={relic.name} />
          {relic.name} Weights
        </strong>
        <button className="close-btn" onClick={onClose}>✕</button>
      </div>

      <div className="relic-settings-body">
        <h5>Skills</h5>
        {Object.entries(baseSkills).map(([id, base]) => (
          <label key={id}>
            {SKILL_NAME[id] || id}
            <input
              type="number" min="0" max="10" step="0.5"
              value={weights.skills?.[id] ?? base}
              onChange={e => onChange({ ...weights, skills: { ...weights.skills, [id]: +e.target.value } })}
            />
          </label>
        ))}
        {customSkillIds.map(id => (
          <label key={id}>
            {SKILL_NAME[id] || id}
            <input
              type="number" min="0" max="10" step="0.5"
              value={weights.skills[id]}
              onChange={e => onChange({ ...weights, skills: { ...weights.skills, [id]: +e.target.value } })}
            />
            <button className="remove-bonus-btn" onClick={() => removeSkill(id)}>×</button>
          </label>
        ))}
        {addableSkills.length > 0 && (
          <select className="add-bonus-select" value="" onChange={e => e.target.value && onChange({ ...weights, skills: { ...weights.skills, [e.target.value]: 1 } })}>
            <option value="">+ Add skill…</option>
            {addableSkills.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        )}

        <h5>Extras</h5>
        {Object.entries(baseExtras).map(([id, base]) => (
          <label key={id}>
            {EXTRA_NAME[id] || id}
            <input
              type="number" min="0" max="10" step="0.5"
              value={weights.extras?.[id] ?? base}
              onChange={e => onChange({ ...weights, extras: { ...weights.extras, [id]: +e.target.value } })}
            />
          </label>
        ))}
        {customExtraIds.map(id => (
          <label key={id}>
            {EXTRA_NAME[id] || id}
            <input
              type="number" min="0" max="10" step="0.5"
              value={weights.extras[id]}
              onChange={e => onChange({ ...weights, extras: { ...weights.extras, [id]: +e.target.value } })}
            />
            <button className="remove-bonus-btn" onClick={() => removeExtra(id)}>×</button>
          </label>
        ))}
        {addableExtras.length > 0 && (
          <select className="add-bonus-select" value="" onChange={e => e.target.value && onChange({ ...weights, extras: { ...weights.extras, [e.target.value]: 1 } })}>
            <option value="">+ Add extra…</option>
            {addableExtras.map(ex => <option key={ex.id} value={ex.id}>{ex.name}</option>)}
          </select>
        )}

        <button className="reset-btn" onClick={() => onChange({})}>
          Reset to Default
        </button>
      </div>
    </div>
  );
}

function RelicButton({ relic, selected, onSelect, weights, onWeightsChange, selectedRelics, reloadedRelic, onSelectReloadedRelic, locked, openSettings, onOpenSettings }) {
  const showSettings = openSettings === relic.name;
  const hasCustomWeights = Object.keys(weights).length > 0;
  const isReloaded = relic.special === 'reloaded';

  return (
    <div className={`relic-btn-outer ${locked ? 'relic-btn-locked' : ''}`}>
      <div className={`relic-btn-wrapper ${selected && isReloaded ? 'relic-btn-wrapper-reloaded' : ''}`}>
        <button
          className={`relic-btn ${selected ? 'selected' : ''}`}
          onClick={locked ? undefined : onSelect}
          disabled={locked}
        >
          <RelicIcon src={relic.icon} name={relic.name} />
          <div className="relic-info">
            <strong>{relic.name}</strong>
            <small>{relic.desc}</small>
          </div>
          {selected && <span className="check">✓</span>}
        </button>

        {selected && isReloaded && (
          <ReloadedPicker
            selectedRelics={selectedRelics}
            reloadedRelic={reloadedRelic}
            onSelectReloadedRelic={onSelectReloadedRelic}
          />
        )}
      </div>

      <div className="relic-side-btns">
        <RelicDescButton relic={relic} />
        <button
          className={`relic-cog ${hasCustomWeights ? 'cog-active' : ''}`}
          onClick={e => { e.stopPropagation(); onOpenSettings(showSettings ? null : relic.name); }}
          title="Adjust relic weights"
        >
          ⚙️
        </button>
      </div>

      {showSettings && (
        <RelicSettings
          relic={relic}
          weights={weights}
          onChange={onWeightsChange}
          onClose={() => onOpenSettings(null)}
        />
      )}
    </div>
  );
}

function ReloadedPicker({ selectedRelics, reloadedRelic, onSelectReloadedRelic }) {
  // Gather all relics from tiers 1-6 that aren't already selected
  const options = Object.entries(RELICS)
    .filter(([tier]) => Number(tier) < 7)
    .flatMap(([tier, relics]) =>
      relics
        .filter(r => selectedRelics[tier]?.name !== r.name)
        .map(r => ({ ...r, tier }))
    );

  return (
    <div className="reloaded-picker">
      <label className="reloaded-picker-label">Reloaded:</label>
      <select
        className="reloaded-picker-select"
        value={reloadedRelic?.name ?? ''}
        onChange={e => {
          const found = options.find(r => r.name === e.target.value) ?? null;
          onSelectReloadedRelic(found);
        }}
      >
        <option value="">— Choose a relic —</option>
        {options.map(r => (
          <option key={r.name} value={r.name}>
            T{r.tier}: {r.name}
          </option>
        ))}
      </select>
    </div>
  );
}

function ConfirmClearModal({ onConfirm, onCancel }) {
  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onCancel(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onCancel]);

  return (
    <div className="relic-modal-backdrop" onMouseDown={onCancel}>
      <div className="relic-modal" onMouseDown={e => e.stopPropagation()}>
        <div className="relic-modal-header">
          <strong className="relic-modal-title">Switch to Progression Mode?</strong>
          <button className="close-btn" onClick={onCancel}>✕</button>
        </div>
        <div className="relic-modal-body">
          <p style={{ color: '#c8b896', marginBottom: '1.2rem' }}>
            Returning to progression mode will clear your current relic selections.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button className="close-btn" onClick={onCancel}>Cancel</button>
            <button className="confirm-btn" onClick={onConfirm}>Clear &amp; Switch</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RelicTree({ selectedRelics, onSelectRelic, relicWeights, onRelicWeightsChange, reloadedRelic, onSelectReloadedRelic, onReset }) {
  const [isOpen, setIsOpen] = useState(true);
  const [tierLock, setTierLock] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [openSettings, setOpenSettings] = useState(null);

  const hasSelections = Object.keys(selectedRelics).length > 0 || reloadedRelic != null;

  const handleToggleLock = () => {
    if (!tierLock && hasSelections) {
      setShowConfirm(true);
    } else {
      setTierLock(l => !l);
    }
  };

  return (
    <main className="relic-tree">
      {showConfirm && (
        <ConfirmClearModal
          onConfirm={() => { onReset(); setTierLock(true); setShowConfirm(false); }}
          onCancel={() => setShowConfirm(false)}
        />
      )}
      <h2 className="section-header" onClick={() => setIsOpen(o => !o)}>
        <div>
          Relic Tree
          <p className="relic-tree-desc">Select relics → watch skills light up by coverage</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <label
            className="tier-lock-toggle"
            data-tooltip={tierLock ? 'Progression mode' : 'Free pick mode'}
            onClick={e => e.stopPropagation()}
          >
            <span
              className={`toggle-track ${tierLock ? 'toggle-on' : 'toggle-off'}`}
              onClick={handleToggleLock}
            >
              <span className="toggle-thumb">
                <svg viewBox="0 0 24 24" className="toggle-icon">
                  {tierLock
                    ? <path d="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z" />
                    : <path d="M18 1C15.24 1 13 3.24 13 6V8H4C2.9 8 2 8.89 2 10V20C2 21.11 2.9 22 4 22H16C17.11 22 18 21.11 18 20V10C18 8.9 17.11 8 16 8H15V6C15 4.34 16.34 3 18 3C19.66 3 21 4.34 21 6V8H23V6C23 3.24 20.76 1 18 1M10 13C11.1 13 12 13.89 12 15C12 16.11 11.11 17 10 17C8.9 17 8 16.11 8 15C8 13.9 8.9 13 10 13Z" />
                  }
                </svg>
              </span>
            </span>
          </label>
          <button className="close-btn" disabled={!hasSelections} onClick={e => { e.stopPropagation(); onReset(); }}>Reset</button>
          <div className={`collapse-chevron ${isOpen ? 'open' : ''}`} />
        </div>
      </h2>

      <div className={`collapsible-body ${isOpen ? 'open' : ''}`}>
        {Object.entries(RELICS).map(([tier, relics]) => {
          const locked = tierLock && Number(tier) > 1 && !selectedRelics[String(Number(tier) - 1)];
          return (
            <div key={tier} className={`tier-block ${locked ? 'tier-block-locked' : ''}`}>
              <div className="tier-label">
                <span>Tier {tier}</span>
                {TIER_PASSIVES[tier] && <TierPassiveTooltip passives={TIER_PASSIVES[tier]} tier={tier} />}
                {selectedRelics[tier] && (
                  <span className="tier-chosen">
                    <RelicIcon src={selectedRelics[tier].icon} name={selectedRelics[tier].name} />
                    <span className="tier-chosen-name">
                      {selectedRelics[tier].special === 'reloaded' && reloadedRelic
                        ? `Reloaded (${reloadedRelic.name})`
                        : selectedRelics[tier].name}
                    </span>
                  </span>
                )}
              </div>
              <div className="relic-row">
                {relics.map(relic => (
                  <RelicButton
                    key={relic.name}
                    relic={relic}
                    selected={selectedRelics[tier]?.name === relic.name}
                    onSelect={() => onSelectRelic(tier, relic)}
                    weights={relicWeights?.[relic.name] ?? {}}
                    onWeightsChange={w => onRelicWeightsChange(relic.name, w)}
                    selectedRelics={selectedRelics}
                    reloadedRelic={reloadedRelic}
                    onSelectReloadedRelic={onSelectReloadedRelic}
                    locked={locked}
                    openSettings={openSettings}
                    onOpenSettings={setOpenSettings}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
