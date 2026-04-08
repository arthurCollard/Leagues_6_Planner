import { useState, useMemo, useRef, useEffect } from 'react';
import { PACTS, PACT_ICONS } from '../data/masteries';


const NODE_BASE = 76; // base size; slider scales from this

const BRANCH_COLORS = {
  General: '#b8a282',
  Melee:   '#d94040',
  Range:   '#48c048',
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
  air_spell_dmg_pct:      { label: 'Air Spell Damage',    format: v => `+${v}% per active prayer` },
  water_spell_dmg_pct:    { label: 'Water Spell Damage',  format: v => `up to +${v}% at full HP`  },
  fire_spell_burn_pct:    { label: 'Fire Spell Burn',     format: v => `up to ${v}% HP → 2x dmg`  },
  earth_spell_defence_reduce: { label: 'Earth Spell Reduce', format: v => `-${v} Def & Magic Def` },
  earth_spell_defence_dmg:    { label: 'Earth Spell Bonus',  format: v => v ? `+1 dmg per ${v} Def` : 'TBD' },
  fire_spell_burn_stacks:     { label: 'Fire Burn Stacks',   format: v => `max ${v} stacks`           },
  fire_spell_bounce_targets:  { label: 'Fire Bounce',        format: v => `up to ${v} targets`        },
  water_spell_lifesteal_pct:  { label: 'Water Lifesteal',    format: v => `${v}% of damage dealt`     },
  air_spell_max_hit_pct_per_prayer_bonus: { label: 'Air Max Hit Chance', format: v => `+${v}% per prayer bonus` },
  prayer_penetration_pct: { label: 'Prayer Penetration', format: v => `+${v}%` },
  melee_min_hit:          { label: 'Melee Min Hit',      format: v => `+${v} (+${v}/tile)` },
  thorns_dmg:             { label: 'Thorns',             format: v => `${v} dmg on hit`       },
  light_weapon_bonus_hit_pct: { label: 'Light Weapon Hit', format: v => `+${v}% max hit bonus`   },
  blindbag_chance:            { label: 'Blindbag',         format: v => v ? `${v}% chance` : 'TBD' },
  melee_range_double:         { label: 'Melee Range',       format: () => '2x (2h weapons)'          },
  shield_reflect_pct_per_def: { label: 'Shield Reflect',    format: v => `${v}% per Def level`       },
  spec_energy_save_pct:       { label: 'Spec Energy Save',  format: v => `${v}% chance`               },
  spec_energy_regen_pct:      { label: 'Spec Energy Regen', format: v => `${v}% per ranged attack`     },
  block_heal:             { label: 'Block Heal',          format: v => `+${v} HP`           },
  block_prayer_restore:   { label: 'Block Prayer',        format: v => `+${v} prayer points` },
  spell_tick_reduction:   { label: 'Spell Attack Rate',   format: v => v ? `${v} ticks faster` : 'TBD' },
  staff_tick_reduction:   { label: 'Staff Attack Rate',   format: v => `${v} ticks faster`      },
  staff_max_hit_reduction:{ label: 'Staff Max Hit',       format: v => `-${v} (1h only)`        },
  // Melee
  melee_damage_pct:           { label: 'Melee Damage',        format: v => `+${v}%`                        },
  melee_str_pct_strength:     { label: 'Melee Str (Str%)',    format: v => `+${v}% of Str level`           },
  melee_str_pct_prayer:       { label: 'Melee Str (Prayer%)', format: v => `+${v}% of prayer bonus`        },
  overheal_min_hit:           { label: 'Overheal Min Hit',    format: v => `+${v} (consumes 5 overheal)`   },
  two_hand_ranged_echo_pct:   { label: '2H Ranged Echo',      format: v => `${v}% chance`                  },
  melee_thorns_heal_pct:      { label: 'Melee/Thorns Heal',   format: v => `${v}% chance per tile`         },
  thorns_def_bonus_pct:       { label: 'Thorns/Recoil Bonus', format: v => `+${v}% of def bonuses`         },
  light_weapon_tick_reduction:{ label: 'Light Weapon Speed',  format: v => `${v} tick faster`              },
  blindbag_chance_per_weapon: { label: 'Blindbag Scaling',    format: v => `+${v}% per heavy weapon`       },
  melee_max_hit_pct_per_tile: { label: 'Melee Max Hit',       format: v => `+${v}% (+${v}% per 3 tiles)`   },
  thorns_double_hit:          { label: 'Thorns Double Hit',   format: () => '2nd hit at 50%'               },
  melee_spec_regen_per_hit:   { label: 'Spec Regen/Hit',      format: v => `${v}% per melee hit`           },
  blindbag_max_hit_per_weapon:{ label: 'Blindbag Max Hit',    format: v => v ? `+${v}% per weapon` : 'TBD' },
  melee_range_max:            { label: 'Melee Range Max',     format: v => `${v} tiles`                    },
  spec_energy_save_pct:       { label: 'Spec Energy Save',    format: v => `${v}% chance`                  },
  spec_energy_regen_pct:      { label: 'Spec Energy Regen',   format: v => `${v}% per ranged attack`       },
  melee_range_double:         { label: 'Melee Range',         format: () => '2x (2h weapons)'              },
  shield_reflect_pct_per_def: { label: 'Shield Reflect',      format: v => `${v}% per Def level`           },
  // General / hybrid
  max_acc_chance_pct:         { label: 'Max Acc Chance',      format: v => `${v}% (+${v}%/tile)`           },
  offhand_melee_str:          { label: 'Off-hand Melee Str',  format: v => `+${v}`                         },
  offhand_ranged_str:         { label: 'Off-hand Ranged Str', format: v => `+${v}`                         },
  offhand_magic_dmg_pct:      { label: 'Off-hand Magic Dmg',  format: v => `+${v}%`                        },
  style_swap_bonus_pct:       { label: 'Style Swap Bonus',    format: v => `+${v}% next style hit`         },
  // Range
  ranged_echo_chance:         { label: 'Ranged Echo Chance',  format: v => `+${v}%`                        },
  bow_echo_never_miss:        { label: 'Bow Echo',            format: () => 'never miss'                   },
  crossbow_echo_chance:       { label: 'Crossbow Echo',       format: v => `+${v}% trigger chance`         },
  thrown_echo_max_hit_pct:    { label: 'Thrown Echo',         format: v => `${v}% max hit chance`          },
  ranged_prayer_effectiveness:{ label: 'Ranged Prayers',      format: v => `${v}% more effective`          },
  ranged_str_per_10hp:        { label: 'Ranged Str (HP)',     format: v => `+${v} per 10 HP diff`          },
  echo_chain_max:             { label: 'Echo Chain',          format: v => `up to ${v}x`                   },
  bow_tick_reduction:         { label: 'Bow Speed',           format: v => `${v} tick faster`              },
  thrown_str_from_melee_pct:  { label: 'Thrown Str (Melee)',  format: v => `+${v}% of melee str`           },
  crossbow_dmg_boost_pct:     { label: 'Crossbow Damage',     format: v => `+${v}% (2 ticks slower)`       },
  ranged_damage_pct:          { label: 'Ranged Damage',       format: v => `+${v}%`                        },
  bow_min_hit_stack:          { label: 'Bow Min Hit',         format: () => '+1 per hit (cap 15%)'         },
  bow_max_hit_stack:          { label: 'Bow Max Hit',         format: () => '+1 per hit (cap 15%)'         },
  crossbow_always_max:        { label: 'Crossbow Max Hit',    format: () => 'always'                       },
  crossbow_double_accuracy:   { label: 'Crossbow Accuracy',   format: () => 'double roll'                  },
  thrown_accuracy_flat:       { label: 'Thrown Accuracy',     format: v => `+${v}`                         },
  thrown_multi_target:        { label: 'Thrown Multi-target', format: () => '+1 target'                    },
  // Magic
  prayer_restore_passive:     { label: 'Passive Prayer Regen',format: () => '1 pt / 15t (off-prayer)'      },
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

function readLayout(pacts, nodeSize) {
  const NODE_W = nodeSize;
  const NODE_H = nodeSize;
  const raw = {};
  pacts.forEach(p => { raw[p.id] = { x: p.x ?? 0, y: p.y ?? 0 }; });

  // Offset so all coordinates are non-negative
  const allX = Object.values(raw).map(p => p.x);
  const allY = Object.values(raw).map(p => p.y);
  const PADDING = 80;
  const minX = allX.length ? Math.min(...allX) : 0;
  const minY = allY.length ? Math.min(...allY) : 0;
  const offsetX = minX < 0 ? -minX + PADDING : PADDING;
  const offsetY = minY < 0 ? -minY + PADDING : PADDING;

  const positions = {};
  Object.entries(raw).forEach(([id, p]) => {
    positions[id] = { x: p.x + offsetX, y: p.y + offsetY };
  });

  const edges = [];
  pacts.forEach(p => {
    (p.requires || []).forEach(pid => {
      if (positions[pid] && positions[p.id]) {
        edges.push({
          fromId: pid,
          toId: p.id,
          x1: positions[pid].x + NODE_W / 2,
          y1: positions[pid].y + NODE_H / 2,
          x2: positions[p.id].x + NODE_W / 2,
          y2: positions[p.id].y + NODE_H / 2,
        });
      }
    });
  });

  const shiftedX = Object.values(positions).map(p => p.x);
  const shiftedY = Object.values(positions).map(p => p.y);
  const totalWidth  = (shiftedX.length ? Math.max(...shiftedX) : 0) + NODE_W + PADDING;
  const totalHeight = (shiftedY.length ? Math.max(...shiftedY) : 0) + NODE_H + PADDING;

  return { positions, totalWidth, totalHeight, edges, nodeSize: NODE_W };

}

function shortestPathToSelected(pacts, targetId, selected) {
  if (!targetId) return new Set();

  // Build undirected adjacency
  const adj = {};
  pacts.forEach(p => {
    if (!adj[p.id]) adj[p.id] = [];
    (p.requires || []).forEach(pid => {
      adj[p.id].push(pid);
      if (!adj[pid]) adj[pid] = [];
      adj[pid].push(p.id);
    });
  });

  // BFS from target until we hit any selected node
  const prev = { [targetId]: null };
  const queue = [targetId];
  let foundId = null;

  outer: while (queue.length) {
    const curr = queue.shift();
    for (const nb of (adj[curr] || [])) {
      if (nb in prev) continue;
      prev[nb] = curr;
      if (selected[nb]) { foundId = nb; break outer; }
      queue.push(nb);
    }
  }

  if (!foundId) return new Set([targetId]);
  const path = new Set();
  let cur = foundId;
  while (cur !== null) { path.add(cur); cur = prev[cur]; }
  return path;
}

export default function MasteryTree({ selectedMasteries, onSelectMastery, onReset }) {
  const [isOpen, setIsOpen] = useState(true);
  const selected = { ...(selectedMasteries || {}), pact_aa: true };
  const totalSpent = Object.values(selected).filter(Boolean).length;

  const [nodeSize, setNodeSize] = useState(NODE_BASE * 2);
  const { positions, totalWidth, totalHeight, edges } = useMemo(() => readLayout(PACTS, nodeSize), [nodeSize]);

  // Pan / zoom
  const viewportRef = useRef(null);
  const dragStart   = useRef(null);
  const dragMoved   = useRef(false);
  const [pan,   setPan]   = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(0.4);
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredId, setHoveredId] = useState(null);
  const [tooltip, setTooltip] = useState(null); // { pact, x, y }

  const clampPan = (px, py, sc) => {
    const el = viewportRef.current;
    if (!el) return { x: px, y: py };
    const { width: vw, height: vh } = el.getBoundingClientRect();
    const margin = 80;
    return {
      x: Math.min(vw - margin, Math.max(margin - totalWidth * sc, px)),
      y: Math.min(vh - margin, Math.max(margin - totalHeight * sc, py)),
    };
  };

  const zoom = (factor, cx, cy) => {
    const el = viewportRef.current;
    const rect = el ? el.getBoundingClientRect() : { left: 0, top: 0, width: 0, height: 0 };
    const pivotX = cx ?? rect.width / 2;
    const pivotY = cy ?? rect.height / 2;
    setScale(prev => {
      const next = Math.max(0.15, Math.min(3, prev * factor));
      const ratio = next / prev;
      setPan(p => {
        const nx = pivotX - ratio * (pivotX - p.x);
        const ny = pivotY - ratio * (pivotY - p.y);
        return clampPan(nx, ny, next);
      });
      return next;
    });
  };

  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    e.preventDefault();
    setIsDragging(true);
    dragMoved.current = false;
    dragStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };
  const handleMouseMove = (e) => {
    if (!dragStart.current) return;
    const dx = e.clientX - (dragStart.current.x + pan.x);
    const dy = e.clientY - (dragStart.current.y + pan.y);
    if (!dragMoved.current && Math.abs(dx) < 4 && Math.abs(dy) < 4) return;
    dragMoved.current = true;
    const raw = { x: e.clientX - dragStart.current.x, y: e.clientY - dragStart.current.y };
    setPan(clampPan(raw.x, raw.y, scale));
  };
  const handleMouseUp = () => {
    setIsDragging(false);
    dragStart.current = null;
  };

  const centerOnAA = () => {
    const el = viewportRef.current;
    if (!el || !positions['pact_aa']) return;
    const { width: vw, height: vh } = el.getBoundingClientRect();
    const nodeCx = positions['pact_aa'].x + nodeSize / 2;
    const nodeCy = positions['pact_aa'].y + nodeSize / 2;
    setPan(clampPan(vw / 2 - nodeCx * scale, vh / 2 - nodeCy * scale, scale));
  };

  useEffect(() => { centerOnAA(); }, []);

  // Non-passive wheel listener so we can preventDefault (stops page scroll while zooming)
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const onWheel = (e) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      zoom(e.deltaY < 0 ? 1.1 : 0.9, e.clientX - rect.left, e.clientY - rect.top);
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  const togglePact = (id) => {
    if (selected[id]) {
      // Build undirected adjacency from requires edges
      const adj = {};
      PACTS.forEach(p => {
        if (!adj[p.id]) adj[p.id] = [];
        (p.requires || []).forEach(pid => {
          adj[p.id].push(pid);
          if (!adj[pid]) adj[pid] = [];
          adj[pid].push(p.id);
        });
      });

      const next = { ...selected, [id]: false };

      // BFS from pact_aa through the remaining selected subgraph
      const reachable = new Set();
      const queue = ['pact_aa'];
      while (queue.length) {
        const cid = queue.shift();
        if (reachable.has(cid) || !next[cid]) continue;
        reachable.add(cid);
        (adj[cid] || []).forEach(nid => { if (!reachable.has(nid) && next[nid]) queue.push(nid); });
      }

      // Deselect anything no longer reachable from root
      Object.keys(next).forEach(k => { if (next[k] && !reachable.has(k)) next[k] = false; });

      onSelectMastery(next);
    } else {
      const path = shortestPathToSelected(PACTS, id, selected);
      const next = { ...selected };
      path.forEach(pid => { next[pid] = true; });
      onSelectMastery(next);
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
          <span className="pact-spent-count">{totalSpent} pts spent</span>
          <button className="close-btn" disabled={totalSpent === 0} onClick={e => { e.stopPropagation(); onReset(); }}>Reset</button>
          <div className={`collapse-chevron ${isOpen ? 'open' : ''}`} />
        </div>
      </h2>

      <div className={`collapsible-body ${isOpen ? 'open' : ''}`}>
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

        <div className="pact-tree-canvas-wrap" style={{ position: 'relative' }}>
          <div className="pact-zoom-controls">
            <button className="pact-zoom-btn" onClick={centerOnAA} title="Center on AA node">⊙</button>
            <div className="pact-zoom-divider" />
            <button className="pact-zoom-btn" onClick={() => zoom(1.25)} title="Zoom in">+</button>
            <button className="pact-zoom-btn" onClick={() => {
              const el = viewportRef.current;
              const newScale = 0.4;
              setScale(newScale);
              if (el && positions['pact_aa']) {
                const { width: vw, height: vh } = el.getBoundingClientRect();
                const nodeCx = positions['pact_aa'].x + nodeSize / 2;
                const nodeCy = positions['pact_aa'].y + nodeSize / 2;
                setPan(clampPan(vw / 2 - nodeCx * newScale, vh / 2 - nodeCy * newScale, newScale));
              } else {
                setPan({ x: 0, y: 0 });
              }
            }} title="Reset zoom">{Math.round(scale * 100)}%</button>
            <button className="pact-zoom-btn" onClick={() => zoom(0.8)} title="Zoom out">−</button>
            <div className="pact-zoom-divider" />
            <input
              type="range"
              className="pact-size-slider"
              min={40}
              max={240}
              step={4}
              value={nodeSize}
              onChange={e => setNodeSize(Number(e.target.value))}
              title={`Icon size: ${nodeSize}px`}
            />
          </div>
          <div
            ref={viewportRef}
            style={{ width: '100%', height: '100%', cursor: isDragging ? 'grabbing' : 'grab' }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
          <div style={{
            position: 'relative',
            width: totalWidth,
            height: totalHeight,
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
            transformOrigin: '0 0',
            userSelect: 'none',
          }}>
            <svg
              style={{ position: 'absolute', inset: 0, width: totalWidth, height: totalHeight, pointerEvents: 'none', overflow: 'visible' }}
            >
              {edges.map((e, i) => {
                const isConnected = hoveredId && (e.fromId === hoveredId || e.toId === hoveredId);
                const isSelectedEdge = selected[e.fromId] && selected[e.toId];
                return (
                  <line
                    key={i}
                    x1={e.x1} y1={e.y1}
                    x2={e.x2} y2={e.y2}
                    stroke={isConnected ? '#f0c040' : isSelectedEdge ? '#c8a84a' : '#5a4a30'}
                    strokeWidth={isConnected ? 3 : isSelectedEdge ? 2.5 : 1.5}
                    opacity={isConnected ? 1 : isSelectedEdge ? 0.95 : 0.85}
                  />
                );
              })}
            </svg>

            {PACTS.map(pact => {
              const pos = positions[pact.id];
              if (!pos) return null;
              const isSelected = !!selected[pact.id];
              const isUnlocked = true;
              const branchColor = BRANCH_COLORS[pact.branch] || BRANCH_COLORS.General;
              return (
                <button
                  key={pact.id}
                  className={`pact-node-card${isSelected ? ' selected' : ''}${!isUnlocked ? ' locked' : ''}`}
                  style={{
                    position: 'absolute',
                    left: pos.x,
                    top: pos.y,
                    width: nodeSize,
                    height: nodeSize,
                    '--branch-color': branchColor,
                    '--node-size': `${nodeSize}px`,
                  }}
                  onClick={() => !dragMoved.current && isUnlocked && togglePact(pact.id)}
                  onMouseEnter={(e) => { setHoveredId(pact.id); if (pact.summary) setTooltip({ pact, x: e.clientX, y: e.clientY }); }}
                  onMouseMove={(e) => { if (tooltip) setTooltip(t => t ? { ...t, x: e.clientX, y: e.clientY } : null); }}
                  onMouseLeave={() => { setHoveredId(null); setTooltip(null); }}
                  disabled={!isUnlocked}
                >
                  <div className="pact-node-icon-wrap">
                    <img
                      src={PACT_ICONS[pact.wikiCode] || `/pacts/Pact_${pact.wikiCode}.png`}
                      className="pact-node-icon"
                      alt={pact.wikiCode}
                      draggable={false}
                    />
                  </div>
                  <div className="pact-node-label">{pact.wikiCode}</div>
                </button>
              );
            })}
          </div>
          </div>
          {Object.keys(selected).filter(id => selected[id]).length > 0 && (() => {
            const SECTIONS = [
              { label: 'General', branch: '' },
              { label: 'Magic',   branch: 'Magic' },
              { label: 'Melee',   branch: 'Melee' },
              { label: 'Range',   branch: 'Range' },
            ];
            const normKey = s => s.replace(/^[+]/, '').replace(/\d+(?:\.\d+)?/, '#');
            const buildGroups = (pacts) => {
              const groups = [];
              const seen = new Map();
              pacts.forEach(p => {
                const key = normKey(p.summary);
                if (seen.has(key)) {
                  const entry = seen.get(key);
                  entry.pacts.push(p);
                  const m = p.summary.match(/(\d+(?:\.\d+)?)/);
                  if (m) entry.total += parseFloat(m[1]);
                } else {
                  const m = p.summary.match(/(\d+(?:\.\d+)?)/);
                  seen.set(key, { summary: p.summary, desc: p.desc, pacts: [p], total: m ? parseFloat(m[1]) : null });
                  groups.push(seen.get(key));
                }
              });
              return groups;
            };
            const renderText = (summary, total) => {
              const display = total !== null ? summary.replace(/\d+(?:\.\d+)?/, Number.isInteger(total) ? total : total.toFixed(1)) : summary;
              const parts = display.split(/(\d+(?:\.\d+)?(?:%|kg)?)/);
              return parts.map((part, i) => /^\d+(?:\.\d+)?(?:%|kg)?$/.test(part) && /\d/.test(part)
                ? <span key={i} className="pact-summary-number">{part}</span>
                : part
              );
            };
            const sections = SECTIONS.map(({ label, branch }) => ({
              label,
              branch,
              groups: buildGroups(PACTS.filter(p => selected[p.id] && p.summary && (label === 'General' ? !['Magic', 'Melee', 'Range'].includes(p.branch) : p.branch === branch))),
            })).filter(s => s.groups.length > 0);
            return (
              <div className="pact-selected-summary">
                {sections.map(({ label, groups }, si) => (
                  <div key={label}>
                    {si > 0 && <div className="pact-summary-divider" />}
                    <div className={`pact-summary-section-title pact-summary-section-${label.toLowerCase()}`}>{label}</div>
                    {groups.map(({ summary, desc, total }) => (
                      <div key={summary} className="pact-selected-summary-row">
                        <span className="pact-selected-summary-text">{renderText(summary, total)}</span>
                        {desc && <span className="pact-selected-summary-desc">{desc}</span>}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      </div>
      {tooltip && (
        <div className="pact-custom-tooltip" style={{ left: tooltip.x + 12, top: tooltip.y + 12 }}>
          {tooltip.pact.name !== '????????' && <div className="pact-custom-tooltip-code">{tooltip.pact.name}</div>}
          <div className="pact-custom-tooltip-summary">{tooltip.pact.summary}</div>
          {tooltip.pact.desc && <div className="pact-custom-tooltip-desc">{tooltip.pact.desc}</div>}
        </div>
      )}
    </main>
  );
}
