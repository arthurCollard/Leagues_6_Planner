import { useState, useMemo } from 'react';
import { PACTS } from '../data/masteries';

const PACTS_WIP = true; // set to false when pacts are finalized

const NODE_W = 145;
const NODE_H = 75;
const H_GAP = 12;
const V_GAP = 40;

const BRANCH_COLORS = {
  General: '#b8a282',
  Melee:   '#e07848',
  Range:   '#70b870',
  Magic:   '#7090d8',
};

const EFFECT_LABELS = {
  regen_chance:   { label: 'Regen Chance',     format: v => `${v}%`           },
  magic_boost:    { label: 'Magic Boost',       format: v => `up to +${v} lvl` },
  prayer_restore: { label: 'Prayer Restore',    format: v => `${v}% chance`    },
  heal:           { label: 'Water Heal',        format: v => `${v} HP/rune`    },
  hit_increase:   { label: 'Fire Spell Bonus',  format: v => `+${v} dmg/rune`  },
  defence_boost:  { label: 'Defence Boost',     format: v => `+${v} lvl/rune`  },
  defence_flat:   { label: 'Defence Level',     format: v => `+${v} permanent` },
  accuracy_pct:   { label: 'Accuracy',          format: v => `+${v}%`          },
  accuracy_flat:  { label: 'Accuracy (flat)',   format: v => `+${v}`            },
  overheal_pct:   { label: 'Overheal',          format: v => `+${v}% HP`       },
  magic_damage_pct: { label: 'Magic Damage',    format: v => `+${v}%`          },
  air_rune_regen:   { label: 'Air Rune Regen',   format: v => `+${v} per charge regen` },
  water_rune_regen:       { label: 'Water Rune Regen',    format: v => `+${v} per charge regen` },
  earth_rune_regen:       { label: 'Earth Rune Regen',    format: v => `+${v} per charge regen` },
  fire_rune_regen:        { label: 'Fire Rune Regen',     format: v => `+${v} per charge regen` },
  spell_tick_reduction:   { label: 'Spell Attack Rate',   format: v => v ? `${v} ticks faster` : 'TBD' },
  staff_tick_reduction:   { label: 'Staff Attack Rate',   format: v => `${v} ticks faster`      },
  staff_max_hit_reduction:{ label: 'Staff Max Hit',       format: v => `-${v} (1h only)`        },
};

function accumulateEffects(selected) {
  const totals = {};
  PACTS.forEach(pact => {
    if (!selected[pact.id]) return;
    Object.entries(pact.effect || {}).forEach(([key, val]) => {
      totals[key] = (totals[key] || 0) + val;
    });
  });
  return totals;
}

function computeLayout(pacts) {
  // For layout, assign each node to its first listed parent
  const layoutChildMap = {};
  pacts.forEach(p => {
    if (!p.requires.length) return;
    const primary = p.requires[0];
    if (!layoutChildMap[primary]) layoutChildMap[primary] = [];
    layoutChildMap[primary].push(p.id);
  });

  const roots = pacts.filter(p => p.requires.length === 0);

  const subtreeWidth = {};
  function getWidth(id) {
    if (subtreeWidth[id] !== undefined) return subtreeWidth[id];
    const children = layoutChildMap[id] || [];
    if (!children.length) return (subtreeWidth[id] = NODE_W);
    const total = children.reduce((s, c) => s + getWidth(c), 0) + H_GAP * (children.length - 1);
    return (subtreeWidth[id] = Math.max(NODE_W, total));
  }
  roots.forEach(r => getWidth(r.id));

  const positions = {};
  function assignPos(id, left, top) {
    const children = layoutChildMap[id] || [];
    const w = subtreeWidth[id];
    positions[id] = { x: left + (w - NODE_W) / 2, y: top };
    let cx = left;
    children.forEach(cid => {
      assignPos(cid, cx, top + NODE_H + V_GAP);
      cx += subtreeWidth[cid] + H_GAP;
    });
  }
  let rx = 0;
  roots.forEach(r => { assignPos(r.id, rx, 0); rx += subtreeWidth[r.id] + H_GAP; });

  const totalWidth  = Math.max(...Object.values(positions).map(p => p.x + NODE_W));
  const totalHeight = Math.max(...Object.values(positions).map(p => p.y + NODE_H));

  // Draw edges from ALL parents (including secondary parents of shared nodes)
  const edges = [];
  pacts.forEach(p => {
    p.requires.forEach(pid => {
      if (positions[pid] && positions[p.id]) {
        edges.push({
          x1: positions[pid].x + NODE_W / 2,
          y1: positions[pid].y + NODE_H,
          x2: positions[p.id].x + NODE_W / 2,
          y2: positions[p.id].y,
        });
      }
    });
  });

  return { positions, totalWidth, totalHeight, edges };
}

export default function MasteryTree({ selectedMasteries, onSelectMastery, onReset }) {
  const [isOpen, setIsOpen] = useState(true);
  const selected = selectedMasteries || {};
  const totalSpent = Object.values(selected).filter(Boolean).length;

  const { positions, totalWidth, totalHeight, edges } = useMemo(() => computeLayout(PACTS), []);

  const togglePact = (id) => {
    if (selected[id]) {
      // Cascade deselect: only remove descendants that lose ALL their requires
      const next = { ...selected, [id]: false };
      const queue = PACTS.filter(p => p.requires.includes(id)).map(p => p.id);
      const visited = new Set();
      while (queue.length) {
        const cid = queue.shift();
        if (visited.has(cid)) continue;
        visited.add(cid);
        const pact = PACTS.find(p => p.id === cid);
        if (!pact) continue;
        const stillUnlocked = pact.requires.some(pid => pid !== id && next[pid]);
        if (!stillUnlocked && next[cid]) {
          next[cid] = false;
          PACTS.filter(p => p.requires.includes(cid)).forEach(c => queue.push(c.id));
        }
      }
      onSelectMastery(next);
    } else {
      onSelectMastery({ ...selected, [id]: true });
    }
  };

  const effects = accumulateEffects(selected);
  const activeEffects = Object.entries(effects).filter(([, v]) => v !== 0);

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
        {PACTS_WIP && (
          <div className="wip-banner">
            Work in progress — pact data is incomplete and may change.
          </div>
        )}
        {activeEffects.length > 0 && (
          <div className="pact-effects-summary">
            {activeEffects.map(([key, val]) => {
              const def = EFFECT_LABELS[key];
              return (
                <div key={key} className="pact-effect-chip">
                  <span className="pact-effect-label">{def ? def.label : key}</span>
                  <span className="pact-effect-value">{def ? def.format(val) : val}</span>
                </div>
              );
            })}
          </div>
        )}

        <div className="pact-tree-canvas-wrap">
          <div style={{ position: 'relative', width: totalWidth, height: totalHeight, flexShrink: 0 }}>
            <svg
              style={{ position: 'absolute', inset: 0, width: totalWidth, height: totalHeight, pointerEvents: 'none', overflow: 'visible' }}
            >
              {edges.map((e, i) => {
                const mx = (e.x1 + e.x2) / 2;
                const my = (e.y1 + e.y2) / 2;
                return (
                  <path
                    key={i}
                    d={`M ${e.x1} ${e.y1} C ${e.x1} ${my}, ${e.x2} ${my}, ${e.x2} ${e.y2}`}
                    stroke="#6b5c3e"
                    strokeWidth="1.5"
                    fill="none"
                    opacity="0.8"
                  />
                );
              })}
            </svg>

            {PACTS.map(pact => {
              const pos = positions[pact.id];
              if (!pos) return null;
              const isSelected = !!selected[pact.id];
              const isUnlocked = !pact.requires.length || pact.requires.some(pid => selected[pid]);
              return (
                <button
                  key={pact.id}
                  className={`pact-node-card${isSelected ? ' selected' : ''}${!isUnlocked ? ' locked' : ''}`}
                  style={{ position: 'absolute', left: pos.x, top: pos.y, width: NODE_W, height: NODE_H }}
                  onClick={() => isUnlocked && togglePact(pact.id)}
                  title={pact.desc}
                  disabled={!isUnlocked}
                >
                  <div className="pact-node-branch" style={{ color: BRANCH_COLORS[pact.branch] || BRANCH_COLORS.General }}>
                    {pact.branch}
                  </div>
                  <div className="pact-node-name">{pact.name === '????????' ? pact.id : pact.name}</div>
                  <div className="pact-node-summary">{pact.summary}</div>
                  {isSelected && <span className="pact-node-check">✓</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
