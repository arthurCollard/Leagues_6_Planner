import { useState, useRef, useEffect } from 'react';
import { HEAD, BODY, LEGS, HANDS, FEET, CAPE, NECK, RING, WEAPON, SHIELD, AMMO } from '../data/gear/index';
import { UNIVERSAL_REGIONS } from '../data/regions';

const UNIVERSAL_REGION_NAMES = UNIVERSAL_REGIONS.map(r => r.name);

const ITEMS_BY_SLOT = { head: HEAD, body: BODY, legs: LEGS, hands: HANDS, feet: FEET, cape: CAPE, neck: NECK, ring: RING, weapon: WEAPON, shield: SHIELD, ammo: AMMO };

const SLOT_ICONS = {
  head:   '/gear_slots/Head_slot.png',
  cape:   '/gear_slots/Cape_slot.png',
  neck:   '/gear_slots/Neck_slot.png',
  ammo:   '/gear_slots/Ammo_slot.png',
  weapon: '/gear_slots/Weapon_slot.png',
  body:   '/gear_slots/Body_slot.png',
  shield: '/gear_slots/Shield_slot.png',
  legs:   '/gear_slots/Legs_slot.png',
  hands:  '/gear_slots/Hands_slot.png',
  feet:   '/gear_slots/Feet_slot.png',
  ring:   '/gear_slots/Ring_slot.png',
};

// Paperdoll layout: each row is [slotName | null for empty cell]
const LAYOUT = [
  [null,     'head',   null    ],
  ['cape',   'neck',   'ammo'  ],
  ['weapon', 'body',   'shield'],
  [null,     'legs',   null    ],
  ['hands',  'feet',   'ring'  ],
];


const SET_BONUSES = {
  elite_void_mage: {
    requiredItems: ['Void Mage Helm', 'Elite Void Top', 'Elite Void Robe', 'Void Knight Gloves'],
    bonuses: [{ category: 'other', stat: 'magicDamage', value: 2.5 }],
    description: 'Elite Void Mage: +2.5% magic damage',
  },
  elite_void_range: {
    requiredItems: ['Void Ranger Helm', 'Elite Void Top', 'Elite Void Robe', 'Void Knight Gloves'],
    bonuses: [{ category: 'other', stat: 'rangedStrength', value: 2.5 }],
    description: 'Elite Void Ranged: +2.5% ranged str',
  },
  elite_void_melee: {
    requiredItems: ['Void Melee Helm', 'Elite Void Top', 'Elite Void Robe', 'Void Knight Gloves'],
    bonuses: [{ category: 'other', stat: 'meleeStrength', value: 2.5 }],
    description: 'Elite Void Melee: +2.5% melee str',
  },
};

function getRegionFiltered(slot, selectedRegions) {
  const allItems = ITEMS_BY_SLOT[slot] || [];
  const activeRegions = [...new Set([...selectedRegions, ...UNIVERSAL_REGION_NAMES])];
  return selectedRegions.length === 0
    ? allItems
    : allItems.filter(i => i.regions.length === 0 || i.regions.some(r => activeRegions.includes(r)));
}

function getOptimizedGear(stat, selectedRegions) {
  const result = {};

  if (stat === 'rangedStrength') {
    // Weapon and ammo must be evaluated as a pair
    const weapons = getRegionFiltered('weapon', selectedRegions);
    const ammos = getRegionFiltered('ammo', selectedRegions);

    let bestWeapon = null;
    let bestAmmo = null;
    let bestCombined = 0;

    weapons.forEach(weapon => {
      const weaponVal = weapon.bonuses.other.rangedStrength || 0;
      const compatibleAmmo = weapon.ammoType
        ? ammos.filter(a => a.ammoType === weapon.ammoType)
        : ammos;

      let topAmmo = null;
      let topAmmoVal = 0;
      compatibleAmmo.forEach(ammo => {
        const v = ammo.bonuses.other.rangedStrength || 0;
        if (v > topAmmoVal) { topAmmoVal = v; topAmmo = ammo; }
      });

      const combined = weaponVal + topAmmoVal;
      if (combined > bestCombined) {
        bestCombined = combined;
        bestWeapon = weapon;
        bestAmmo = topAmmo;
      }
    });

    result.weapon = bestWeapon;
    result.ammo = bestAmmo;

    Object.keys(ITEMS_BY_SLOT).forEach(slot => {
      if (slot === 'weapon' || slot === 'ammo') return;
      const items = getRegionFiltered(slot, selectedRegions);
      let best = null;
      let bestVal = 0;
      items.forEach(item => {
        const val = item.bonuses.other[stat] || 0;
        if (val > bestVal) { bestVal = val; best = item; }
      });
      result[slot] = best;
    });
  } else {
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
  }

  return result;
}

function sumBonuses(gear) {
  const totals = { attack: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 }, defence: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 }, other: { meleeStrength: 0, rangedStrength: 0, magicDamage: 0, prayer: 0 } };
  const equippedNames = new Set(Object.values(gear).filter(Boolean).map(i => i.name));
  const activeEffects = [];

  // Sum base bonuses
  Object.values(gear).forEach(item => {
    if (!item) return;
    ['attack', 'defence', 'other'].forEach(cat => {
      Object.keys(totals[cat]).forEach(stat => {
        totals[cat][stat] += item.bonuses[cat][stat] || 0;
      });
    });
  });

  // Apply item-level multiplier effects (e.g. Tumeken's Shadow)
  Object.values(gear).forEach(item => {
    if (!item?.effect) return;
    if (item.effect.type === 'multiply_totals') {
      item.effect.stats.forEach(({ category, stat, factor }) => {
        totals[category][stat] = Math.round(totals[category][stat] * factor);
      });
      activeEffects.push(item.effect.description);
    }
  });

  // Apply set bonuses
  Object.values(SET_BONUSES).forEach(set => {
    if (set.requiredItems.every(name => equippedNames.has(name))) {
      set.bonuses.forEach(({ category, stat, value }) => {
        totals[category][stat] += value;
      });
      activeEffects.push(set.description);
    }
  });

  return { totals, activeEffects };
}

function SlotPicker({ slot, selected, selectedRegions, onSelect, ammoType, disabled }) {
  const [open, setOpen] = useState(false);
  const [dropUp, setDropUp] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef(null);

  const allItems = ITEMS_BY_SLOT[slot] || [];
  const regionFiltered = selectedRegions.length === 0
    ? allItems
    : allItems.filter(i => i.regions.length === 0 || i.regions.some(r => selectedRegions.includes(r)));
  const ammoFiltered = (slot === 'ammo' && ammoType)
    ? regionFiltered.filter(i => i.ammoType === ammoType)
    : regionFiltered;
  const filtered = ammoFiltered.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));

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
        className={`slot-btn ${selected ? 'slot-filled' : 'slot-empty'} ${disabled ? 'slot-disabled' : ''}`}
        onClick={() => !disabled && setOpen(o => !o)}
        title={disabled ? '2H weapon equipped' : slot.charAt(0).toUpperCase() + slot.slice(1)}
        disabled={disabled}
      >
        <img
          className="slot-icon"
          src={selected
            ? `https://oldschool.runescape.wiki/w/Special:FilePath/${encodeURIComponent(selected.name.charAt(0).toUpperCase() + selected.name.slice(1).toLowerCase())}.png`
            : SLOT_ICONS[slot]
          }
          alt={selected ? selected.name : slot}
          onError={e => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = slot === 'weapon' && selected?.twoHanded ? '/gear_slots/2h_slot.png' : SLOT_ICONS[slot];
          }}
        />
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
  const [selectedStyle, setSelectedStyle] = useState(null);
  const { totals, activeEffects } = sumBonuses(selectedGear);
  const hasAny = Object.values(selectedGear).some(Boolean);

  const weapon = selectedGear.weapon;
  const combatStyles = weapon?.combatStyle ? Object.entries(weapon.combatStyle) : [];
  const activeStyleSpeed = selectedStyle && weapon?.combatStyle?.[selectedStyle] != null
    ? weapon.combatStyle[selectedStyle]
    : weapon?.speed ?? null;

  // Reset style when weapon changes to one that doesn't have the current style
  useEffect(() => {
    if (selectedStyle && (!weapon?.combatStyle || weapon.combatStyle[selectedStyle] == null)) {
      setSelectedStyle(null);
    }
  }, [weapon, selectedStyle]);

  // Clear ammo when weapon changes to an incompatible ammo type
  useEffect(() => {
    const ammo = selectedGear.ammo;
    if (ammo && weapon?.ammoType && ammo.ammoType !== weapon.ammoType) {
      onSelectGear('ammo', null);
    }
  }, [weapon]);

  // Clear shield when a two-handed weapon is equipped
  useEffect(() => {
    if (weapon?.twoHanded && selectedGear.shield) {
      onSelectGear('shield', null);
    }
  }, [weapon]);

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
                      ammoType={slot === 'ammo' ? weapon?.ammoType : undefined}
                      disabled={slot === 'shield' && !!weapon?.twoHanded}
                    />
                  ) : (
                    <div key={ci} className="slot-empty-cell" />
                  )
                )}
              </div>
            ))}
          </div>

          {/* Right side: bonuses + style selector */}
          <div className="gear-right-col">
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
                {activeStyleSpeed != null && (
                  <div className="bonus-row">
                    <span className="bonus-label">Atk Speed</span>
                    <span className="bonus-value bonus-zero">{activeStyleSpeed}t</span>
                  </div>
                )}
              </div>
            </div>
            {activeEffects.length > 0 && (
              <div className="active-effects">
                {activeEffects.map(desc => (
                  <div key={desc} className="active-effect-tag">{desc}</div>
                ))}
              </div>
            )}
            {combatStyles.length > 0 && (
              <div className="combat-style-selector">
                <span className="combat-style-label">Style</span>
                <div className="combat-style-buttons">
                  {combatStyles.map(([style, speed]) => (
                    <button
                      key={style}
                      className={`combat-style-btn ${selectedStyle === style ? 'active' : ''}`}
                      onClick={() => setSelectedStyle(prev => prev === style ? null : style)}
                      title={`${speed} ticks`}
                    >
                      {style.replace(/_/g, ' ')}
                      <span className="combat-style-speed">{speed}t</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
