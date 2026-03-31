import { useState, useRef, useEffect } from 'react';
import { HEAD, BODY, LEGS, HANDS, FEET, CAPE, NECK, RING, WEAPON, SHIELD } from '../data/gear/index';
import { UNIVERSAL_REGIONS } from '../data/regions';

const UNIVERSAL_REGION_NAMES = UNIVERSAL_REGIONS.map(r => r.name);

const ITEMS_BY_SLOT = { head: HEAD, body: BODY, legs: LEGS, hands: HANDS, feet: FEET, cape: CAPE, neck: NECK, ring: RING, weapon: WEAPON, shield: SHIELD };

const SLOT_ICONS = {
  head:   '🪖', cape:   '🧣', neck: '📿',
  weapon: '⚔️',  body:   '👕', shield: '🛡️',
  legs:   '👖', hands:  '🧤', feet: '👞', ring: '💍',
};

// Paperdoll layout: each row is [slotName | null for empty cell]
const LAYOUT = [
  [null,     'head',   null    ],
  ['cape',   'neck',   null    ],
  ['weapon', 'body',   'shield'],
  [null,     'legs',   null    ],
  ['hands',  'feet',   'ring'  ],
];

const ZERO_BONUSES = { attack: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 }, defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 }, other: { meleeStrength: 0, rangedStrength: 0, magicDamage: 0, prayer: 0 } };

function getRegionFiltered(slot, selectedRegions) {
  const allItems = ITEMS_BY_SLOT[slot] || [];
  const activeRegions = [...new Set([...selectedRegions, ...UNIVERSAL_REGION_NAMES])];
  return selectedRegions.length === 0
    ? allItems
    : allItems.filter(i => i.regions.length === 0 || i.regions.some(r => activeRegions.includes(r)));
}

function getOptimizedGear(stat, selectedRegions) {
  const result = {};
  Object.keys(ITEMS_BY_SLOT).forEach(slot => {
    const items = getRegionFiltered(slot, selectedRegions);
    let best = null;
    let bestVal = 0;
    items.forEach(item => {
      const val = item.bonuses.other[stat] || 0;
      if (val > bestVal) { bestVal = val; best = item; }
    });
    result[slot] = best;
  });
  return result;
}

function sumBonuses(gear) {
  const totals = { attack: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 }, defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 }, other: { meleeStrength: 0, rangedStrength: 0, magicDamage: 0, prayer: 0 } };
  Object.values(gear).forEach(item => {
    if (!item) return;
    ['attack', 'defence', 'other'].forEach(cat => {
      Object.keys(totals[cat]).forEach(stat => {
        totals[cat][stat] += item.bonuses[cat][stat] || 0;
      });
    });
  });
  return totals;
}

function SlotPicker({ slot, selected, selectedRegions, onSelect }) {
  const [open, setOpen] = useState(false);
  const [dropUp, setDropUp] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef(null);

  const allItems = ITEMS_BY_SLOT[slot] || [];
  const regionFiltered = selectedRegions.length === 0
    ? allItems
    : allItems.filter(i => i.regions.length === 0 || i.regions.some(r => selectedRegions.includes(r)));
  const filtered = regionFiltered.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));

  useEffect(() => {
    if (!open) return;
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setDropUp(rect.bottom + 300 > window.innerHeight);
    }
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div className="slot-picker-wrapper" ref={ref}>
      <button
        className={`slot-btn ${selected ? 'slot-filled' : 'slot-empty'}`}
        onClick={() => setOpen(o => !o)}
        title={slot.charAt(0).toUpperCase() + slot.slice(1)}
      >
        <span className="slot-icon">{SLOT_ICONS[slot]}</span>
        {selected && <span className="slot-name-label">{selected.name}</span>}
      </button>

      {open && (
        <div className={`slot-dropdown ${dropUp ? 'slot-dropdown-up' : ''}`}>
          <input
            className="slot-search"
            placeholder={`Search ${slot}…`}
            value={search}
            onChange={e => setSearch(e.target.value)}
            autoFocus
          />
          <div className="slot-dropdown-list">
            {selected && (
              <button className="slot-option slot-option-clear" onClick={() => { onSelect(null); setOpen(false); setSearch(''); }}>
                — Clear slot —
              </button>
            )}
            {filtered.map(item => (
              <button
                key={item.name}
                className={`slot-option ${selected?.name === item.name ? 'slot-option-active' : ''}`}
                onClick={() => { onSelect(item); setOpen(false); setSearch(''); }}
              >
                <span className="slot-option-name">{item.name}</span>
                {item.requirements?.length > 0 && (
                  <span className="slot-option-req">
                    {item.requirements.map(r => `${r.skill} ${r.level}`).join(', ')}
                  </span>
                )}
              </button>
            ))}
            {filtered.length === 0 && <span className="slot-option-empty">No items found</span>}
          </div>
        </div>
      )}
    </div>
  );
}

function BonusRow({ label, value }) {
  const sign = value > 0 ? '+' : '';
  const cls = value > 0 ? 'bonus-pos' : value < 0 ? 'bonus-neg' : 'bonus-zero';
  return (
    <div className="bonus-row">
      <span className="bonus-label">{label}</span>
      <span className={`bonus-value ${cls}`}>{sign}{value}</span>
    </div>
  );
}

const OPT_BUTTONS = [
  { label: 'Max Melee Str',  stat: 'meleeStrength'  },
  { label: 'Max Ranged Str', stat: 'rangedStrength'  },
  { label: 'Max Magic Dmg',  stat: 'magicDamage'     },
  { label: 'Max Prayer',     stat: 'prayer'          },
];

export default function GearPanel({ selectedGear, selectedRegions, onSelectGear, onReset }) {
  const [open, setOpen] = useState(true);
  const totals = sumBonuses(selectedGear);
  const hasAny = Object.values(selectedGear).some(Boolean);

  function applyOptimized(stat) {
    const optimized = getOptimizedGear(stat, selectedRegions);
    Object.entries(optimized).forEach(([slot, item]) => onSelectGear(slot, item));
  }

  return (
    <main className="relic-tree gear-section">
      <h2 className="section-header" onClick={() => setOpen(o => !o)}>
        <span>Gear Planner</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <div onClick={e => e.stopPropagation()}>
            <button
              className="close-btn"
              disabled={!hasAny}
              onClick={onReset}
            >
              Reset
            </button>
          </div>
          <div className={`collapse-chevron ${open ? 'open' : ''}`} />
        </div>
      </h2>

      <div className={`collapsible-body ${open ? 'open' : ''}`}>
        {selectedRegions.length === 0 && (
          <div className="gear-region-hint">
            Select regions above to filter available gear
          </div>
        )}
        <div className="gear-opt-buttons">
          {OPT_BUTTONS.map(({ label, stat }) => (
            <button key={stat} className="gear-opt-btn" onClick={() => applyOptimized(stat)}>
              {label}
            </button>
          ))}
        </div>
        <div className="gear-panel-inner">
          {/* Paperdoll */}
          <div className="paperdoll">
            {LAYOUT.map((row, ri) => (
              <div key={ri} className="paperdoll-row">
                {row.map((slot, ci) =>
                  slot ? (
                    <SlotPicker
                      key={slot}
                      slot={slot}
                      selected={selectedGear[slot]}
                      selectedRegions={selectedRegions}
                      onSelect={item => onSelectGear(slot, item)}
                    />
                  ) : (
                    <div key={ci} className="slot-empty-cell" />
                  )
                )}
              </div>
            ))}
          </div>

          {/* Bonuses */}
          <div className="bonuses-panel">
            <div className="bonuses-col">
              <div className="bonuses-col-header">Offensive</div>
              <BonusRow label="Stab"   value={totals.attack.stab} />
              <BonusRow label="Slash"  value={totals.attack.slash} />
              <BonusRow label="Crush"  value={totals.attack.crush} />
              <BonusRow label="Magic"  value={totals.attack.magic} />
              <BonusRow label="Ranged" value={totals.attack.ranged} />
            </div>
            <div className="bonuses-col">
              <div className="bonuses-col-header">Defensive</div>
              <BonusRow label="Stab"   value={totals.defence.stab} />
              <BonusRow label="Slash"  value={totals.defence.slash} />
              <BonusRow label="Crush"  value={totals.defence.crush} />
              <BonusRow label="Magic"  value={totals.defence.magic} />
              <BonusRow label="Ranged" value={totals.defence.ranged} />
            </div>
            <div className="bonuses-col">
              <div className="bonuses-col-header">Other</div>
              <BonusRow label="Melee Str"   value={totals.other.meleeStrength} />
              <BonusRow label="Ranged Str"  value={totals.other.rangedStrength} />
              <BonusRow label="Magic Dmg %" value={totals.other.magicDamage} />
              <BonusRow label="Prayer"      value={totals.other.prayer} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
