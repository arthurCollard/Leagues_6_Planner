import { useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { SKILLS } from '../data/skills';
import { levelToXp, xpToLevel, xpToNextLevel } from '../data/xp';

// OSRS in-game skills panel order (3 columns, row by row)
const SKILLS_GRID = [
  ['attack',       'hitpoints',    'mining'      ],
  ['strength',     'agility',      'smithing'    ],
  ['defence',      'herblore',     'fishing'     ],
  ['ranged',       'thieving',     'cooking'     ],
  ['prayer',       'crafting',     'firemaking'  ],
  ['magic',        'fletching',    'woodcutting' ],
  ['runecrafting', 'slayer',       'farming'     ],
  ['construction', 'hunter',       null          ],
];
const SKILL_BY_ID = Object.fromEntries(SKILLS.map(s => [s.id, s]));

function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored !== null ? JSON.parse(stored) : defaultValue;
    } catch { return defaultValue; }
  });
  const set = useCallback(newValue => {
    setValue(prev => {
      const next = typeof newValue === 'function' ? newValue(prev) : newValue;
      try { localStorage.setItem(key, JSON.stringify(next)); } catch {}
      return next;
    });
  }, [key]);
  return [value, set];
}

function SkillLevelsPanel({ guideChecked, flashingSkills = new Set() }) {
  const [skillLevels, setSkillLevels] = useLocalStorage('ls6_skillLevels', {});

  const guideXp = {};
  Object.values(guideChecked).forEach(v => {
    if (v?.checked && v?.xp) {
      Object.entries(v.xp).forEach(([skill, xp]) => {
        guideXp[skill] = (guideXp[skill] || 0) + xp;
      });
    }
  });

  const SKILL_DEFAULTS = { hitpoints: 10, runecrafting: 5, herblore: 3 };

  const getEffectiveXp = (id) => {
    const stored = skillLevels[id];
    const base = stored == null ? (SKILL_DEFAULTS[id] ?? 1) : Math.max(1, Math.min(99, Number(stored) || 1));
    return levelToXp(base) + (guideXp[id] || 0);
  };

  const getLevel = (id) => Math.min(99, xpToLevel(getEffectiveXp(id)));

  const handleChange = (id, raw) => {
    const val = parseInt(raw, 10);
    if (!isNaN(val)) setSkillLevels(prev => ({ ...prev, [id]: Math.max(1, Math.min(99, val)) }));
  };

  const totalLevel = SKILLS.reduce((sum, s) => sum + getLevel(s.id), 0);

  return (
    <aside className="guide-levels-panel">
      <div className="guide-levels-header">
        <span className="guide-levels-title">Skills</span>
        <span className="guide-levels-total">Total: <strong>{totalLevel}</strong></span>
      </div>
      <div className="skill-levels-grid">
        {SKILLS_GRID.map((row, ri) =>
          row.map((id, ci) => {
            if (!id) {
              return (
                <div key={`empty-${ri}-${ci}`} className="skill-level-cell skill-level-total-cell">
                  <span className="skill-level-total-label">Total</span>
                  <span className="skill-level-total-value">{totalLevel}</span>
                </div>
              );
            }
            const skill = SKILL_BY_ID[id];
            const level = getLevel(id);
            const xp = getEffectiveXp(id);
            const toNext = xpToNextLevel(xp);
            const tooltipLines = [
              skill.name,
              `${xp.toLocaleString()} XP`,
              level < 99 ? `${toNext.toLocaleString()} to next` : 'Maxed',
            ].join('\n');
            return (
              <div key={id} className={`skill-level-cell${flashingSkills.has(id) ? ' skill-level-flash' : ''}`} data-tooltip={tooltipLines}>
                <img src={skill.icon} alt={skill.name} className="skill-level-icon" />
                <input
                  className="skill-level-input"
                  type="number"
                  min={1}
                  max={99}
                  value={level}
                  onChange={e => handleChange(id, e.target.value)}
                />
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
}

function Pact() {
  return <span className="guide-demonic-pact">Demonic Pact</span>;
}

function CollapsibleSection({ title, defaultOpen = true, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="guide-collapsible">
      <button className="guide-collapsible-toggle" onClick={() => setOpen(o => !o)}>
        <span>{open ? '▼' : '▶'}</span> {title}
      </button>
      {open && <div className="guide-collapsible-body">{children}</div>}
    </div>
  );
}

const COIN_BREAKPOINTS = [
  { min: 10000, img: '/coins/120px-Coins_detail.png',      label: '10,000+' },
  { min: 1000,  img: '/coins/120px-Coins_1000_detail.png', label: '1,000'   },
  { min: 250,   img: '/coins/120px-Coins_250_detail.png',  label: '250'     },
  { min: 100,   img: '/coins/120px-Coins_100_detail.png',  label: '100'     },
  { min: 25,    img: '/coins/120px-Coins_25_detail.png',   label: '25'      },
  { min: 5,     img: '/coins/120px-Coins_5_detail.png',    label: '5'       },
  { min: 4,     img: '/coins/120px-Coins_4_detail.png',    label: '4'       },
  { min: 3,     img: '/coins/120px-Coins_3_detail.png',    label: '3'       },
  { min: 2,     img: '/coins/120px-Coins_2_detail.png',    label: '2'       },
  { min: 0,     img: '/coins/120px-Coins_1_detail.png',    label: '1'       },
];

function getCoinImage(gp) {
  return COIN_BREAKPOINTS.find(b => gp >= b.min) || COIN_BREAKPOINTS[COIN_BREAKPOINTS.length - 1];
}

function formatGp(n) {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2).replace(/\.?0+$/, '')}B`;
  if (n >= 1_000_000)     return `${(n / 1_000_000).toFixed(2).replace(/\.?0+$/, '')}M`;
  if (n >= 1_000)         return `${(n / 1_000).toFixed(1).replace(/\.0$/, '')}K`;
  return n.toString();
}

function GoldPanel({ guideChecked }) {
  const [gp, setGp] = useLocalStorage('ls6_gp', 0);
  const [editing, setEditing] = useState(false);

  const earnedGold = Object.values(guideChecked).reduce((sum, v) => {
    if (!v?.checked) return sum;
    const fromXp = v.xp ? Object.values(v.xp).reduce((s, x) => s + x, 0) * 2 : 0;
    const direct = v.gold || 0;
    return sum + fromXp + direct;
  }, 0);

  const totalGp = gp + earnedGold;
  const coin = getCoinImage(totalGp);

  const commit = (val) => {
    const n = parseInt(val.replace(/[^0-9]/g, ''), 10);
    setGp(isNaN(n) ? 0 : n);
    setEditing(false);
  };

  return (
    <div className="guide-gold-panel">
      <div className="guide-gold-header">
        <span className="guide-levels-title">Gold</span>
        <span className="guide-gold-formatted">{formatGp(totalGp)} gp</span>
      </div>
      <div className="guide-gold-body">
        <img src={coin.img} alt={`${coin.label} coins`} className="guide-gold-coin-img" />
        <div className="guide-gold-input-row">
          {editing ? (
            <input
              className="guide-gold-input"
              type="text"
              autoFocus
              defaultValue={gp}
              onBlur={e => commit(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') commit(e.target.value); if (e.key === 'Escape') setEditing(false); }}
            />
          ) : (
            <button className="guide-gold-display" onClick={() => setEditing(true)} title="Click to edit">
              {totalGp.toLocaleString()} gp
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function PactsPanel({ count }) {
  const MAX_PACTS = 40;

  return (
    <div className="guide-pacts-panel">
      <div className="guide-gold-header">
        <img
          src="/35px-Demonic_Pacts_League_combat_masteries_icon.png"
          alt="Demonic Pacts"
          className="guide-pacts-icon"
        />
        <span className="guide-levels-title">Demonic Pacts</span>
      </div>
      <div className="guide-pacts-body">
        <div className="guide-pacts-count">
          <span className="guide-pacts-number">{count}</span>
          <span className="guide-pacts-max">/ {MAX_PACTS}</span>
        </div>
      </div>
      <div className="guide-pacts-pips">
        {Array.from({ length: MAX_PACTS }, (_, i) => (
          <div
            key={i}
            className={`guide-pacts-pip ${i < count ? 'filled' : ''}`}
            title={`${i + 1} pact${i + 1 !== 1 ? 's' : ''}`}
          />
        ))}
      </div>
    </div>
  );
}

function Note({ children }) {
  return <div className="guide-note">{children}</div>;
}

function CheckList({ id, items, checked, onToggle }) {
  return (
    <ul className="guide-checklist">
      {items.map((item, i) => {
        if (typeof item === 'string' && item.startsWith('NOTE:')) {
          return <li key={i} className="guide-checklist-note">{item.replace('NOTE:', '').trim()}</li>;
        }
        if (typeof item === 'object' && item.type === 'note') {
          return <li key={i} className="guide-checklist-note">{item.text}</li>;
        }
        const isPact = typeof item === 'object' && item.pact;
        const isOptional = typeof item === 'object' && item.optional;
        const text = typeof item === 'string' ? item : item.text;
        const subitems = typeof item === 'object' && item.subitems ? item.subitems : null;
        const key = `${id}_${i}`;
        const isChecked = !!(checked[key]?.checked);
        const allSubsChecked = subitems
          ? subitems.every((_, j) => !!(checked[`${id}_${i}_sub_${j}`]?.checked))
          : false;
        const effectiveChecked = subitems ? allSubsChecked : isChecked;
        return (
          <li
            key={i}
            className={`guide-checklist-item${isPact ? ' is-pact' : ''}${isOptional ? ' is-optional' : ''}${effectiveChecked ? ' is-checked' : ''}${subitems ? ' has-subitems' : ''}`}
            onClick={subitems ? undefined : () => onToggle(key, item)}
          >
            <div className="guide-checklist-row">
              <span className={`guide-check-box${effectiveChecked ? ' checked' : ''}`} />
              {isOptional && <span className="guide-optional-tag">Optional</span>}
              {text}
              {isPact && <> <Pact /></>}
            </div>
            {subitems && (
              <ul className="guide-checklist guide-checklist-sub" onClick={e => e.stopPropagation()}>
                {subitems.map((sub, j) => {
                  const subKey = `${id}_${i}_sub_${j}`;
                  const subChecked = !!(checked[subKey]?.checked);
                  const subText = typeof sub === 'string' ? sub : sub.text;
                  const handleSubClick = () => {
                    onToggle(subKey, sub);
                    const willBeChecked = !subChecked;
                    const allOthersChecked = subitems.every((_, jj) =>
                      jj === j ? willBeChecked : !!(checked[`${id}_${i}_sub_${jj}`]?.checked)
                    );
                    if (allOthersChecked && !isChecked) onToggle(key, item);
                    else if (!allOthersChecked && isChecked) onToggle(key, item);
                  };
                  return (
                    <li
                      key={j}
                      className={`guide-checklist-item${subChecked ? ' is-checked' : ''}`}
                      onClick={handleSubClick}
                    >
                      <span className={`guide-check-box${subChecked ? ' checked' : ''}`} />
                      {subText}
                    </li>
                  );
                })}
              </ul>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export default function GuidePage() {
  const [guideChecked, setGuideChecked] = useLocalStorage('ls6_guide_checked', {});
  const [flashingSkills, setFlashingSkills] = useState(new Set());
  const flashTimers = useRef({});

  const handleToggle = useCallback((key, item) => {
    const isPact = typeof item === 'object' && !!item.pact;
    const xp = (typeof item === 'object' && item.xp) ? item.xp : null;
    const gold = (typeof item === 'object' && item.gold) ? item.gold : null;
    setGuideChecked(prev => {
      const current = prev[key];
      const nowChecked = !(current?.checked);
      if (nowChecked && xp) {
        const skillIds = Object.keys(xp);
        setFlashingSkills(prev => new Set([...prev, ...skillIds]));
        skillIds.forEach(id => {
          clearTimeout(flashTimers.current[id]);
          flashTimers.current[id] = setTimeout(() => {
            setFlashingSkills(prev => { const next = new Set(prev); next.delete(id); return next; });
          }, 700);
        });
      }
      return { ...prev, [key]: { checked: nowChecked, isPact, xp, gold } };
    });
  }, [setGuideChecked]);

  const pactsCount = Object.values(guideChecked).filter(v => v?.checked && v?.isPact).length;

  return (
    <div className="guide-page">
      <header className="guide-header">
        <div className="guide-header-inner">
          <Link to="/" className="guide-back-link">← Back to Planner</Link>
          <h1>Demonic Pacts League Starting Guide</h1>
          <p className="guide-byline">By Laef &mdash; originally published on the <a href="https://oldschool.runescape.wiki/w/Guide:Leagues:_Demonic_pacts_starting_guide_by_Laef" target="_blank" rel="noopener noreferrer">OSRS Wiki</a></p>
        </div>
      </header>

      <div className="guide-layout">
        <div className="guide-left-sidebar">
          <SkillLevelsPanel guideChecked={guideChecked} flashingSkills={flashingSkills} />
          <GoldPanel guideChecked={guideChecked} />
          <PactsPanel count={pactsCount} />
        </div>

      <div className="guide-body">

        {/* TOC */}
        <nav className="guide-toc">
          <h3>Contents</h3>
          <ol>
            <li><a href="#introduction">Introduction</a></li>
            <li><a href="#route-map">Route Map</a></li>
            <li><a href="#runelite">RuneLite Plugin</a></li>
            <li><a href="#tier1">Starting Out: Money and Early Hunter (Tier I)</a></li>
            <li><a href="#tier2">Hunter Rumours and Wealthy Citizens (Tier II)</a></li>
            <li><a href="#tier3">Prayer and High Alchemy (Tier III)</a></li>
            <li><a href="#skilling">Skilling Route</a></li>
            <li><a href="#combat">Combat Route</a></li>
            <li><a href="#tier4">Fire Cape (Tier IV)</a></li>
          </ol>
        </nav>

        {/* Introduction */}
        <section id="introduction">
          <h2>Introduction</h2>
          <p>
            This is a WIP guide aimed at helping you get to your first Tier II, Tier III (and eventually Tier IV) relic
            and area in Demonic Pacts League, as well as unlocking 9 <span className="guide-demonic-pact-inline">Demonic pacts</span>.
          </p>
          <p>
            This guide is <strong>universal</strong> and can be followed regardless of your relic or area choice for this league.
          </p>
          <p>
            Grateful acknowledgement to the official Discord leagues community, I Am Groot and SwampyKebab for incredible
            Leagues map tools, Syrif for immense help with the Tasks Tracker plugin, Poppet (TVZ) for a comprehensive early
            Hunter route, Xegony for helping optimize fletching in Auburnvale, and Laudron for proofreading and efficiency help.
          </p>
          <p>
            If you have any questions, feel free to join the{' '}
            <a href="https://discord.gg/UceWfW9Mqc" target="_blank" rel="noopener noreferrer">discord channel</a> or
            Laef chat-channel in game.
          </p>
          <Note>The guide is updated daily, and will be adjusted after the official task list reveal and playtesting.</Note>
        </section>

        {/* Route Map */}
        <section id="route-map">
          <h2>Route Map</h2>
          <p>
            There is a map version of this guide available. While the map lists all tasks, some long notes have been
            removed/reduced for a comfortable user experience.
          </p>
          <p>
            View the visual map route{' '}
            <a href="https://runeleagues.com/r/8523B03AFC86" target="_blank" rel="noopener noreferrer">here</a>.
          </p>
          <p>
            You can check for route updates by clicking <strong>Build mode</strong> (Hammer) and <strong>Download updates</strong>.
          </p>
        </section>

        {/* RuneLite Plugin */}
        <section id="runelite">
          <h2>RuneLite Plugin</h2>
          <p>
            To use this route in RuneLite, you need the <strong>Tasks Tracker plugin</strong> from the RuneLite Plugin Hub.
          </p>
          <ol className="guide-steps">
            <li>Click <strong>Export to Tasks Tracker Plugin</strong> (in the Map Route)</li>
            <li>Save the .JSON file on your computer</li>
            <li>Open it and copy the contents to clipboard</li>
            <li>Paste into Tasks Tracker Plugin (<em>Route &gt; ... &gt; Import Route from Clipboard</em>)</li>
          </ol>
          <Note>This works with the Shortest Path plugin in RuneLite.</Note>
        </section>

        {/* Tier I */}
        <section id="tier1">
          <h2>Starting Out: Money and Early Hunter (Tier I)</h2>
          <p>
            The goal of this part is unlocking your Tier II relic, Hunter rumours, as well as rushing through
            the first early tasks.
          </p>

          <CollapsibleSection title="Setup & Early Thieving">
            <CheckList id="t1-thieving" checked={guideChecked} onToggle={handleToggle} items={[
              { text: 'Open the Leagues Menu', pact: true },
              { text: 'Complete the Leagues Tutorial', pact: true },
              'Pick the Abundance Relic',
              "Claim a free Spade, Impling jar and two Strange devices from the Leagues Tutor in Yama's Lair",
              'Equip your Dramen staff and starting arrows',
              { text: 'Complete a lap of the Yama Agility Course (110 XP, 550 with 5x multiplier)', xp: { agility: 550 } },
              { type: 'note', text: 'XP assumes Gnome Stronghold agility course rates.' },
              'Achieve Your First Level Up',
              "Visit Death's Domain west of Civitas illa Fortis fountain",
              'Run south and bank everything at Fortis west bank',
              { text: 'Pickpocket a Citizen near the Bazaar 10 times to reach 5 Thieving and get 30 coins (less with Abundance)', xp: { thieving: 500 }, gold: 30 },
              'Achieve Your First Level 5',
            ]} />
          </CollapsibleSection>

          <CollapsibleSection title="Bakery Stall & Early Shopping">
            <Note>Guard lure tip: lure the guard away from the bakery stall before stealing.</Note>
            <CheckList id="t1-bakery" checked={guideChecked} onToggle={handleToggle} items={[
              { text: 'Switch to Bakery stall until 20 Thieving, keeping all of the cakes', xp: { thieving: 4050 } },
              'This should take 51 thieving actions (less with Abundance)',
              'Steal a Chocolate slice',
              'Achieve Your First Level 10',
              'Achieve Your First Level 20',
              { text: 'Sell 26 cakes at Fortis General Store and keep 1 — this should give you ~550 coins', gold: 550 },
              { type: 'note', text: 'This should be enough for: 3 Box traps, Bird snare, Plank, Glassblowing pipe, 20 Soda ash/sand, Banana, Knife, Shears, Uncut sapphire, Rake, Chisel, Hammer, Stew and Enchanted gem.' },
              { text: 'Buy Hammer, Chisel and Knife from Fortis General Store', gold: -10 },
              { text: 'Steal some Silk (26 XP, 130 with 5x multiplier)', xp: { thieving: 130 } },
              { text: 'Buy a Stew and 8 Jug of wine from The Flaming Arrow', gold: -30 },
              "Give Oli some Stew",
              { text: 'Buy a Green cape from Floria\'s Fashion and equip it', gold: -32 },
              "Bank at Fortis west bank, withdraw coins, Knife, Bucket, 1 Cake, starting runes and starting bow (and Bronze pickaxe and Bronze axe if your relic isn't Barbarian Gathering)",
            ]} />
          </CollapsibleSection>

          <CollapsibleSection title="Buffalo, Mining & Smithing">
            <CheckList id="t1-buffalo" checked={guideChecked} onToggle={handleToggle} items={[
              'Run West to Buffalos',
              'Milk a Buffalo and drop the bucket',
              { text: 'Kill a Buffalo using starting runes and arrows, drop these after the kill (610 Magic XP + 140 Hitpoints XP with 5x multiplier)', xp: { magic: 610, hitpoints: 140 } },
              { text: 'Pick up its bones and bury them (4 Prayer XP, 20 with 5x multiplier)', xp: { prayer: 20 } },
              { text: "Buy a Rake from Agelus' Farm Shop", gold: -6 },
              { text: 'Rake a Farming patch and deposit Rake at the Tool Leprechaun (18 Farming XP, 90 with 5x multiplier)', xp: { farming: 90 } },
              'Run to the mine NW of Hunter Guild',
              { text: 'Mine 14 Copper ore and drop 5, keeping 9 (266 Mining XP, 1,330 with 5x multiplier)', xp: { mining: 1330 } },
              { text: 'Mine 14 Tin ore and drop 5, keeping 9 (266 Mining XP, 1,330 with 5x multiplier)', xp: { mining: 1330 } },
              { text: 'Run to Hunter Guild, buy 3 Box traps and a Bird snare from the shop, then quetzal to Civitas illa Fortis', gold: -130 },
              'Pet Renu',
              'Run south and pet Xolo east of the Fortis temple',
              'Activate a prayer near an altar',
              'Drink from a Bird bath',
              { text: 'Chop 2 trees at the park near the Bird bath (54 Woodcutting XP, 270 with 5x multiplier)', xp: { woodcutting: 270 } },
              { text: 'Use 1 log to fletch some arrow shafts and drop them (7 Fletching XP, 35 with 5x multiplier)', xp: { fletching: 35 } },
              { text: 'Smelt 9 Bronze bars using the Furnace close to the Fortis Colosseum (126 Smithing XP, 630 with 5x multiplier)', xp: { smithing: 630 } },
              'Bank south, deposit everything and withdraw coins',
              { text: 'Buy Glassblowing pipe, Shears and Banana from Trader Crewmember at Fortis Cothon', gold: -12 },
              { text: 'Buy 10 buckets of sand and 10 Soda ash', gold: -100 },
              'Eat a Banana',
              { text: 'Run SE and make Molten glass at the furnace (220 Crafting XP, 1,100 with 5x multiplier)', xp: { crafting: 1100 } },
              { text: "Buy an Amulet mould and Ring mould from Artima's Crafting Supplies", gold: -10 },
              'Bank and withdraw coins',
              { text: 'Run back to the Trader Crewmember, buy 10 more Sand/Soda ash and 1 Seaweed', gold: -105 },
              { text: 'Run SE and make Molten glass at the furnace (220 Crafting XP, 1,100 with 5x multiplier)', xp: { crafting: 1100 } },
              "Bank south, deposit all, withdraw 9 Bronze bars, Hammer, Logs, Tinderbox and Small fishing net if not Barbarian Gathering",
            ]} />
          </CollapsibleSection>

          <CollapsibleSection title="Fishing, Cooking & Crafting">
            <CheckList id="t1-fishing" checked={guideChecked} onToggle={handleToggle} items={[
              { text: "Run south to Spike's Spikes and make 7 Bronze maces and 1 Bronze full helm (124 Smithing XP, 620 with 5x multiplier)", xp: { smithing: 620 } },
              { text: 'Sell the bronze maces to the mace shop, keep the helm', gold: 45 },
              'Run south to the anchovy fishing spot',
              { text: 'Catch 49 Shrimp until 15 Fishing (less with Abundance) (2,460 Fishing XP with 5x multiplier)', xp: { fishing: 2460 } },
              'Reach Total Level 100',
              { text: 'After your first inventory is full, burn some logs (42 Firemaking XP, 210 with 5x multiplier)', xp: { firemaking: 210 } },
              { text: 'Cook Shrimp (32 Cooking XP, 160 with 5x multiplier)', xp: { cooking: 160 } },
              'Burn Some Food',
              { text: 'Successfully Cook 5 Pieces of Food (160 Cooking XP, 800 with 5x multiplier)', xp: { cooking: 800 } },
              { text: 'Catch an Anchovy (42 Fishing XP, 210 with 5x multiplier)', xp: { fishing: 210 } },
              'Cast Home Teleport',
              'Quetzal to Aldarin',
              'Cry in a Wheat Field',
              'Run west and fill a Grape barrel for the Vineyard foreman',
              'Investigate Meztlan and find out why he was banished from the lab (3rd floor of the Mastering Mixology lab)',
              'Bank everything, withdraw coins, Chisel, Glassblowing pipe and 20 Molten glass',
              { text: "Run north to Toci's Gem Store, make Oil lamps on your way for 20 Crafting, drop them (540 Crafting XP, 2,700 with 5x multiplier)", xp: { crafting: 2700 } },
              'Buy an Uncut sapphire',
              'Cut a Sapphire',
              { text: 'Sell the gems back and work your way up to Ruby', subitems: [
                { text: 'Cut and sell Sapphires to level 27 Crafting (1,092 Crafting XP, 5,460 with 5x multiplier, +3,675 coins, cost: 546 coins)', xp: { crafting: 5460 }, gold: 3675 - 546 },
                { text: 'Cut and sell Emeralds to level 34 Crafting (2,208 Crafting XP, 11,040 with 5x multiplier, +11,680 coins, cost: 1,696 coins)', xp: { crafting: 11040 }, gold: 11680 - 1696 },
                { text: 'Cut and sell Rubies to level 60 Crafting (50,895 Crafting XP, 254,475 with 5x multiplier, +409,500 coins, cost: 60,255 coins)', xp: { crafting: 254475 }, gold: 409500 - 60255 },
              ]},
              { type: 'note', text: 'Do this for 10 minutes to get 356k coins and 60 Crafting, without Abundance: 21 Sapphire, 32 Emerald, 573 Ruby. Keep one of each gem for a task later.' },
              'Achieve Your First Level 30',
              'Achieve Your First Level 40',
              'Achieve Your First Level 50',
              'Achieve Your First Level 60',
              'Run south and quetzal to Auburnvale',
              'Bank, withdraw 1805 coins, Shears, Bird snare, Knife and Tinderbox (also Bronze axe if Endless Harvest)',
            ]} />
          </CollapsibleSection>

          <CollapsibleSection title="Auburnvale & Tier II Unlock">
            <CheckList id="t1-auburnvale-a" checked={guideChecked} onToggle={handleToggle} items={[
              "Buy a Staff of fire from Sebamo's Sublime Staffs",
              'Equip an Elemental Staff',
              'Buy a Torch from Auburnvale General Store',
              'Light A Torch and drop it',
              'Buy a Steel axe from Lunami',
              "Chop one of the 8 dead trees around the Auburnvale sawmill",
              'Turn any Logs Into a Plank at the Auburnvale sawmill and drop it',
            ]} />
            <Note>You should now have 600 points — unlock your 2nd relic and get the x8 XP multiplier.</Note>
            <Note>There are 3 trees west and north of Crimson swifts, 5 north of Copper longtails and many at Gloomthorn Trail. You need to catch half as many creatures with Woodsman. Bury all bones from Hunter — you need 11 now or 8 later at Tier III.</Note>
            <CheckList id="t1-auburnvale-b" checked={guideChecked} onToggle={handleToggle} items={[
              { text: '(Skip with Abundance) Quetzal to Tal Teklan, run NE and catch 4 Crimson swifts to 9 Hunter' },
              'Run and catch 5 Copper longtails north of Nemus Retreat to 17 Hunter (7 with Abundance)',
              { type: 'note', text: 'If the spot is crowded, consider quetzal to Aldarin and catching Copper longtails there, then taking the fairy ring to Zanaris.' },
              '(Skip with Abundance) Activate the Statue of Ates on your way',
              'Run east across the bridge and fairy ring to Zanaris',
              'Shear a sheep',
              'Enter Puro Puro and get a Butterfly net, 7 Impling jars and Impling scroll from Elnock Inquisitor',
              'Drop the scroll',
              'Catch a Baby Impling',
              'Travel back to Zanaris',
              'Pick some Wheat',
              'Make Some Flour at the Zanaris windmill',
              'Fairy ring AIS and run back to Auburnvale',
              'Bank everything, withdraw coins, Steel axe, Tinderbox, Wool, Knife, Butterfly net (and Bronze axe if Endless Harvest)',
            ]} />
          </CollapsibleSection>

          <CollapsibleSection title="Woodcutting, Fletching & Hunter to 46">
            <CheckList id="t1-wc-fletch" checked={guideChecked} onToggle={handleToggle} items={[
              'Chop some more logs and burn them to get 15 Firemaking',
              'Chop Some Logs With a Steel axe (drop if Barbarian Gathering)',
              'Chop logs and turn them into arrow shafts until 15 Fletching',
              'Catch 21 Ruby harvest in Auburnvale until 25 Hunter, north of the Auburnvale sawmill (15 Hunter with Abundance)',
              'At 23 Hunter, catch two Wild kebbit and keep one Kebbit claws',
              'At 25 Hunter, run south to Nemus Retreat',
              'Grab a Forestry kit from the Friendly Forester on your way (gnome hat icon)',
              'Chop and Burn Some Oak logs',
              'Fletch 1000 arrow shafts',
              'Fletch an Oak shortbow',
              'Fletch 25 Oak stocks',
              'Spin a Ball of wool',
              'Keep chopping and fletching Oak logs, banking them until 30 Woodcutting',
              'Chop and bank 1 Willow logs',
              'Achieve Total Level 250',
              'Bank using Bank buffalo, withdraw coins, Butterfly net and 3 Box traps',
              'Follow Mountain Guide to Quetzacalli Gorge',
              'Run west to Mons Gratia',
              'Catch 51 Sapphire glacialis to 35 Hunter (25 Hunter with Abundance)',
              'Catch 32 Snowy knight to 39 Hunter (29 Hunter with Abundance)',
              'Run east and quetzal to Hunter Guild',
              'Run west to Embertailed jerboa',
              'Catch 32 jerboa to 46 Hunter',
            ]} />
            <Note>You now have access to Hunters' Rumours.</Note>
            <CheckList id="t1-wc-opt" checked={guideChecked} onToggle={handleToggle} items={[
              { text: '(Optional) Catch 62 more jerboa for 57 Hunter with Woodsman to skip Novice Rumours', optional: true },
            ]} />
          </CollapsibleSection>
        </section>

        {/* Tier II */}
        <section id="tier2">
          <h2>Hunter Rumours and Wealthy Citizens (Tier II)</h2>
          <p>
            The goal of this part is unlocking your Tier III relic via Hunter rumours and Stealing valuables,
            as well as completing some more easy/medium tasks.
          </p>
          <Note>
            If you picked Friendly Forager, you are slowly getting Herblore XP. Consider making a few Attack potions
            soon to get 40 Herblore and carrying a clean irit for the Jekyll and Hyde random event to get an Agility
            potion(4) for Tai Bwo Wannai Trio. It takes 169 Attack potions (cleaning the herb) to get 3–40 Herblore,
            but realistically much less with the relic passive effect.
          </Note>

          <CollapsibleSection title="Stealing Valuables & Quests">
            <CheckList id="t2-stealing" checked={guideChecked} onToggle={handleToggle} items={[
              'Run east to Hunter Guild and quetzal to Civitas illa Fortis',
              "Enter Yama's Lair and get 32 Agility (with Hotfoot you passively get it in 8 minutes of running, and may choose to do some Hunter rumours now instead)",
              'Barbarian Gathering: consider 55 Mining via Iron rocks for Heart of darkness instead for passive Agility',
              'Leave and run south to Silk stall to get 34 Thieving',
              'Bank everything, withdraw coins, Bronze full helm, Shears and Spade',
              'Run north and quetzal to Aldarin',
              'Complete Death on the Isle quest',
              'During or after the quest, use the Bronze full helm on a Hat stand in the Backstage entrance of Villa Lucens',
              'You should now be 50 Thieving',
              "Activate Statue of Ates on Aldarin",
              "Pick-pocket Constantinius for the Chest key (Fancy chest)",
              "Open and search the Fancy chest in the Villa Lucens Wine cellar to see the note 'Taken for a clean. Be back soon.'",
              'Search the south-west fountain on the villa grounds',
              'Use the icon on the statue north of the Aldarin market',
              'Buy 10 Ixcoztic white from Moonrise Wines (16 heals for a Demonic pact later)',
              'Buy a Steel pickaxe from Mistrock Mining Supplies and run east',
              'Mine some Ore With a Steel Pickaxe',
              'Run NW fairy ring to Zanaris',
              'Run to Chaeldar and buy an Enchanted gem, Spiny helmet and Anti-dragon shield',
              'Pick and check your Slayer Task, then drop the Enchanted gem',
              'Fairy ring AJP to Avium Savannah',
              'Run north and pick some Sweetcorn',
              'Run north-west to Ortus Farm',
              'Pickpocket a Master Farmer near the farming patches to get 3 potato seeds',
              'Take Rake from Tool Leprechaun',
              'Buy 2 Compost and Seed dibber from Harminia',
              'Plant Seeds in an Allotment Patch',
              'Protect Your Crops',
              'Deposit rake and dibber at Tool Leprechaun',
              'Run north and shear an Alpaca',
              'Run east to Civitas illa Fortis and pickpocket Guards',
              'Open 28 Coin Pouches At Once',
              'Obtain 800 Coins From Coin Pouches At Once',
              'Bank at Fortis west bank, deposit all and withdraw coins',
              'Run south to Bazaar and pay an Urchin for Information',
              'Steal a House key',
              'Steal 15 House Keys',
              'Steal 25 Valuables',
              'Steal 100 Valuables',
              'Steal a Blessed bone statuette',
              'Steal from the Fortis Spice Stall',
              'Get at least 66 Thieving for the Final Dawn',
              { text: '(Optional) Achieve Your First Level 70', optional: true },
            ]} />
          </CollapsibleSection>

          <CollapsibleSection title="Hunter Rumours to Tier III">
            <CheckList id="t2-rumours" checked={guideChecked} onToggle={handleToggle} items={[
              'Quetzal to Hunter Guild and bank everything. Withdraw Bird snare, 3 Box traps and Butterfly net',
              'We are about to do ~4 Novice, 22 Adept and 24 Expert Rumours',
              'For Novice Rumours, you are hunting butterflies, jerboa or tropical wagtails if unlucky, using Gillman',
              { text: 'Complete a Hunter Rumour', pact: false },
              'For Adept Rumours at 57 Hunter, you are using Ornus until he assigns Pyre fox, then switch to Cervus (only assigns Black warlock and Red chinchompa)',
              'Complete 10 Hunter Rumours',
              { type: 'note', text: 'We need at least 617 Blessed bone shards for 43 Prayer later. You should get 632 on average from 4 Novice and 6 Adept rumours.' },
              'Claim Basic quetzal whistle blueprint from Soar Leader Pitri and craft the Quetzal whistle using Willow logs from your bank',
              { text: '(Optional) Complete 25 Hunter Rumours', optional: true },
              "For Expert Rumours, you are using Aco until he assigns Sunlight antelope, then switch to Teco (only assigns Red chinchompa and Moonlight moth at 75 Hunter)",
              "Buy a Teasing stick from Imia's Supplies",
              { text: '(Optional) 100 Butterfly jars upon getting your first Moonlight moth task', optional: true },
              { text: '(Optional) If you picked Friendly Forager, you might get 38 Herblore passively and pick a few Snape grass from the house NE of the Grand Museum', optional: true },
              { text: '(Optional) Bank a full inventory of Moonlight moth after every task until you run out of jars', optional: true },
              { text: '(Optional) Complete 50 Hunter Rumours', optional: true },
              { text: '(Optional) Catch 25 Sunlight antelope', optional: true },
              'Craft an Enchanted quetzal if you were lucky to get Enhanced quetzal whistle blueprint and Yew logs from the rewards',
              'Recharge your whistle at Soar Leader Pitri on your last charge (using meat from rewards) if you are about to use it to travel elsewhere',
            ]} />
            <Note>
              You should now have 1650 points (1380 if skipped optional tasks) — unlock your Tier III relic and get the slayer perks.
              If you did all of the optional tasks, you should also have 80 tasks complete and unlock Karamja.
            </Note>
          </CollapsibleSection>

          <Note>
            <strong>If you plan to do more Hunter Rumours later (before unlocking Karamja), set up this block list:</strong><br />
            Gillman: Tecu salamander<br />
            Cervus: Red chinchompa<br />
            Teco will now only assign Sunlight Moth. Wolf will only assign Moonlight moth and Moonlight antelope.
          </Note>
        </section>

        {/* Tier III */}
        <section id="tier3">
          <h2>Prayer and High Alchemy (Tier III)</h2>
          <p>
            In this part of the guide we are getting early gear, Prayer and 55 Magic. While the initial goal is
            getting ready for Moons of Peril, if you choose to avoid combat and Slayer until your next region,
            there is an alternative route you can follow.
          </p>

          <CollapsibleSection title="Early Gear & Setup">
            <CheckList id="t3-gear" checked={guideChecked} onToggle={handleToggle} items={[
              'Bank and withdraw Quetzal whistle, 10 Quetzal feed, 4 Jug of wine and coins (and a pickaxe, if not Barbarian Gathering)',
              'Run SE to the Stonecutter Outpost, drinking the wine and filling jugs with water at Locus Oasis',
              'Complete The Ribbiting Tale of a Lily Pad Labour Dispute',
              'Mine 4 Clay',
              'Buy 3 Limestone brick from Stonecutter Supplies',
              'Make 4 Soft clay and drop the jugs',
              'Run to Sunset Coast',
              "Buy a Mithril full helm and Adamant full helm from Thurid's Brain Buckets",
              'Charter a ship to Civitas illa Fortis',
              'Buy 15 pineapples from Trader Crewmember',
              'Run south and bank pineapples and helmets, keep coins, Quetzal whistle, 10 Quetzal feed, 3 Limestone brick and 4 Soft clay',
              "Run through the gate to Spike's Spikes and buy a Rune mace",
              'Home teleport/Lodestone to Civitas illa Fortis',
              'Run NW to Kualti Headquarters and punch the combat Dummy for 8 Attack',
              'Attack a Dummy',
              'Purchase the following items from Fortis Blacksmith: Steel platelegs, Mithril platelegs, Adamant platelegs, Mithril platebody, Adamant platebody, Mithril spear, Adamant spear, Adamant scimitar',
              'Bank armour and weapons south',
              'Drain your Prayer to zero',
              'Withdraw coins and 15 pineapples',
              "Run west and buy 2 bucket packs from Agelus' Farm Shop",
              'Deposit them at Tool Leprechaun',
              'Put your pineapples in the Compost Bin and close it',
              'Run west to Cam Torum and build the Quetzal site',
              "Enter Cam Torum, buy a Steel and Rune pickaxe from Tizoro's Pickaxes",
              'Buy 50 Law runes from The Runic Emporium',
            ]} />
          </CollapsibleSection>

          <CollapsibleSection title="Prayer & Magic Training">
            <CheckList id="t3-prayer" checked={guideChecked} onToggle={handleToggle} items={[
              'Quetzal to Tal Teklan',
              'Restore 5 Prayer Points at an Altar',
              { type: 'note', text: 'If you skipped all optional tasks, you would unlock Karamja now.' },
              'Buy the following runes: 500 Mind rune and Chaos rune; 800 Nature rune; 1500 Air, Water, Earth and Fire runes; 100 Cosmic rune and 50 Death runes',
              'Run east and kill 15 Blue dragons using defensive cast water spells at Dragon Nest and bury their bones for 30 Prayer',
              '(Alacrity: E: Tlatli rainforest: Log balance with 40 Agility)',
              'Keep at least 6 Blue dragon hide for a task later',
              'Cast Low Level Alchemy between hits on Nature rune when you reach 21 Magic',
              'This should get you 36 Magic and 33 Defence',
              'When you reach 5 Defence, equip Steel platelegs, Spiny helmet and alch them',
              'Equip some Steel armour',
              'When you reach 20 Defence, equip Mithril full helm, Mithril platebody and Mithril platelegs and alch them',
              'Equip a Full Mithril Set',
              'When you reach 30 Defence, equip Adamant full helm, Adamant platebody and Adamant platelegs — keep this',
              'Equip a Full Adamant Set',
              'Reach Combat Level 10',
              'Reach Combat Level 25',
              'Quetzal to The Teomat, bless your wine and use the Libation bowl to get 43–50 Prayer for Antler guard',
              'Pray at the Shrine of Ralos',
              { text: 'Use the Protect from Melee Prayer', pact: true },
              'Activate Superhuman Strength and Improved Reflexes',
              'Kill an Icefiend in Varlamore north by the bridge',
              'Keep casting Low Level Alchemy until 55 Magic',
              'Quetzal to Cam Torum and run east to the Wolf Den',
              'Defeat a Dire Wolf',
              'Run to Ortus Farm and fill a bucket with Supercompost from the bin',
              'Grab the bucket from Tool Leprechaun and deposit back',
              { text: 'Run south of Avium Savannah and kill a Hill Giant', pact: true },
              'Travel to Zanaris (Alacrity: I: Zanaris: Cosmic altar path)',
              'Enter Puro-Puro and hunt Eclectic implings for a Gold bar',
              'Hunt Magpie implings for Mystic gloves or Mystic boots',
              'Equip a piece of Mystic set',
              'Fairy ring BKQ to Enchanted Valley and kill 5 bunnies',
              { text: '(Optional) Kill Tree spirits for a Rune axe — they are weak to fire spells', optional: true },
              'Bank in Zanaris, withdraw Ring mould, Amulet mould and Ball of wool',
              'Craft an Emerald ring and Ruby amulet at the Furnace to the east',
              'Run to Kualti Headquarters and kill a Guard in the underground using defensive casting',
              "Run SE to the Estate agent and purchase a Player-owned house",
              'Cast Teleport to House',
              'Teleport using Law Runes',
              'Enter your Player-owned house',
              'Enter build mode and build any room',
              'Exit the house and run south to the bank in Aldarin',
              'Grab an Adamant scimitar',
              'Run south and climb on top of the Aldarin windmill',
              'Use your scimitar on the Nice nest',
              'Hop worlds or relog',
              'Claim a Cake from the Nest',
              'At 49 Magic enchant an Amulet of strength',
              'At 54 Magic cast Civitas illa Fortis Teleport',
              'At 55 Magic cast High Level Alchemy',
              'We should be close to 50 Combat now to unlock another Demonic pact',
            ]} />
          </CollapsibleSection>

          <Note>
            You can now choose between the <a href="#combat">Combat Route</a> and the <a href="#skilling">Skilling Route</a>.
            Pick whichever you fancy or do one after the other in any order.
          </Note>
        </section>

        {/* Skilling Route */}
        <section id="skilling">
          <h2>Skilling Route</h2>
          <p>
            The goal of this route is to unlock your first region of choice by completing tasks —
            the easy and most of the medium Karamja diary.
          </p>

          <CollapsibleSection title="Mining, Fishing & Karamja">
            <CheckList id="skill-mfk" checked={guideChecked} onToggle={handleToggle} items={[
              'Bank and withdraw coins, Steel pickaxe, Rune pickaxe, Tinderbox, Seaweed',
              'Equip the Staff of air',
              'Quetzal to Sunset Coast (Tal Teklan if Barbarian Gathering, or F: Tlatli rainforest: Rock climb if you also have Alacrity)',
              '(Skip if Barbarian Gathering) Buy Fishing rod, Fly fishing rod, Lobster pot, Harpoon, Big fishing net, 100 Bait and 2000 Feathers from Picaria\'s Fishing Shop, then quetzal to Tal Teklan',
              'Run to the mine south of Tal Teklan and mine Iron ore until 1600 XP off 40 Mining, switching to Coal after (30 with Abundance)',
              'Mine 50 Iron rocks, keeping 4',
              'Mine 15 Coal rocks',
              'This gets you 41 Mining for Karamja diary (31 with Abundance)',
              'Mine some ore with a Rune pickaxe, drop your Steel pickaxe',
              'Run north to Tal Teklan and smelt an Iron bar',
              'Chop 3 Logs along the way',
              'Quetzal to Cam Torum',
              'Enter the gates, run east and mine a Calcified deposit',
              'Mine 250 Blessed bone shards',
              'Teleport to Cam Torum using a Calcified moth',
              'Quetzal to Civitas illa Fortis',
              "Fish a House key in the park",
              'Obtain a Casket from Fishing',
              'Find a Cosmic talisman in a Casket',
              'Locate a Runecrafting altar using a talisman',
              'Lodestone to Karamja',
              'Enter Brimhaven Agility Arena and get 10 Brimhaven vouchers',
              'Receive an Agility arena ticket',
              { text: '(Optional) Get 50 Agility for the Final Dawn and Colossal Wyrm Agility Course', optional: true },
              'Buy a Snapdragon from Pirate Jackie the Fruit',
              'Exchange your Agility arena tickets for XP',
              'Run east through the gate and kill an Imp on the Karamja Volcano',
              'Scatter some Ashes',
              'Pick and drop your Seaweed 5 times',
              'Run east and fill a crate with Bananas for Luthas at Musa Point',
              'Run to the fishing docks north of the Banana plantation',
              'Catch a Herring',
              'Catch 25 Sardines',
              'Get 20 Fishing',
              'Light some Logs and cook all the fish',
              'Cook 10 Sardines',
              'Keep the cooked fish',
              'Minigame teleport to Fight Pots',
              'Bank east and deposit everything, withdraw coins, Water/Chaos/Earth/Death runes, and 10 Ixcoztic white',
              'Check that you\'re wearing an Anti-dragon shield',
            ]} />
          </CollapsibleSection>

          <CollapsibleSection title="Brimhaven Dungeon & Fishing">
            <CheckList id="skill-brim" checked={guideChecked} onToggle={handleToggle} items={[
              { text: 'Kill a TzHaar', pact: true },
              'Leave the TzHaar City and run through the hidden wall to Isle of Crandor',
              'Defeat a Lesser demon',
              'Cast a Blast Spell',
              'Lodestone to Karamja',
              'Run NW and use the ropeswing to travel to Moss Giant Island and back',
              'Mine some Gold ore at the Horseshoe mine and drop it',
              'Run south of the House Portal',
              'Kill a Snake',
              'Pick a Pineapple',
              'Enter the Brimhaven Dungeon',
              'Kill a Moss giant',
              'Run west past the 22 Agility pipe shortcut and use the stepping stones',
              'Run up the south stairs and kill a Greater demon',
              'Down the stairs and past the Moss giants',
              'Kill a Fire giant',
              'Run all the way south',
              { text: 'Kill a Steel dragon', pact: true },
              'Lodestone to Karamja',
              "Use Vigroy's cart to travel to Shilo Village",
              'Bank everything, withdraw Fly fishing rod, Fishing rod, Feathers and Bait',
              'Catch Trout until 25 Fishing, bank all fish to cook later',
              'Catch a Pike',
              'Catch 2 inventories of Pike (burn chance ~60%)',
              'Burn some Logs near the bank',
              'Cook 20 Pike',
              'Catch Trout until 30 Fishing',
              'Catch a Salmon on Karamja',
              'Catch 50 Salmon',
              'Bank everything, withdraw coins, Chisel, Quetzal whistle, Teasing stick, Knife, Tinderbox, runes',
            ]} />
          </CollapsibleSection>

          <CollapsibleSection title="Shilo Village, Tai Bwo Wannai & Karamja Easy Diary">
            <CheckList id="skill-shilo" checked={guideChecked} onToggle={handleToggle} items={[
              'Run NW and mine a Red topaz from a Gem rock',
              'Obtain a Gem While Mining',
              'Run east and sleep in the Paramaya Inn',
              'Use the stepping stones across the river',
              'Exit Shilo village',
              'Run west and visit the Cairn Isle',
              'Travel back across the bridge and trap a Horned graahk',
              'Obtain 2 Tatty graahk fur and 1 Graahk fur',
              'Chop two Logs and fletch one of them into arrowshafts',
              'Catch some Karambwanji',
              'Run north to Tai Bwo Wannai',
              'Kill a Jungle spider and make a Spider on shaft',
              'Burn some logs and cook it (don\'t burn this one)',
              "Run north and buy a Pestle and mortar, Antipoison(3), Hammer and Machete from Jiminua's Jungle Store",
              'Buy 3 Bronze bars (more if not 16 Smithing)',
              'Make a Bronze plateskirt on an anvil nearby',
              'Run SE to the dungeon sign and enter the Pothole Dungeon',
              'Kill a Jogre (keep the bones)',
              'You have now completed the Karamja Easy diary',
              "Lodestone to Karamja and claim the diary lamp, using it to get 27 Farming",
              'Charter a ship to Civitas illa Fortis from Karamja',
              'Buy 100 Soda ash/Bucket of sand from Trader Crewmember',
              'Make 100 Molten glass',
              'Make 100 Unpowered orbs',
              'Bank south, grab your Graahk furs and coins',
              "Quetzal to Hunter Guild and make full Graahk armour using Pellem's Fur Store",
              'Equip full Graahk hunter gear',
              'Run south and complete 10 laps of the Colossal Wyrm Agility Course',
              'Quetzal to Quetzacalli Gorge and run north to The Darkfrost',
              { text: 'Kill The Hueycoatl using earth spells', pact: true },
              { type: 'note', text: 'Use a mass world for an easy kill.' },
            ]} />
          </CollapsibleSection>

          <Note>
            You can now proceed with the <a href="#combat">Combat Route</a>. If you have done both routes, continue with the{' '}
            <a href="#tier4">next part</a> of the guide. If you did this route first, you should now be able to unlock
            your first region of choice.
          </Note>
        </section>

        {/* Combat Route */}
        <section id="combat">
          <h2>Combat Route</h2>
          <p>
            The goal of this route is to get 48 Slayer and prepare ourselves for at least one completion of Moons of Peril.
          </p>

          <CollapsibleSection title="Slayer & Moons of Peril">
            <p className="guide-weapon-prog">
              <strong>Melee weapon progression:</strong> Rune mace → Adamant spear → Mithril spear → Dramen staff
            </p>
            <CheckList id="combat-slayer" checked={guideChecked} onToggle={handleToggle} items={[
              'Start Chaeldar slayer using melee until you reach 48 Slayer',
              { type: 'note', text: 'You only need 38 to kill Sulphur Naguas with Abundance, but consider still getting 48 for Heart of Darkness.' },
              'You should have the following stats after you\'re done: 55 Attack, 55 Strength, 55 Defence',
              'Quetzal to Cam Torum and run north to Neypotzli',
              'In the Antechamber use the SE entrance and travel through the Ancient Prison to Earthbound Cavern',
              'Run to the cooking range, grab Hunter and Herblore supplies',
              'Catch Moss Lizards, cook them and make 2–4 Moonlight potions',
              'Run south and, training on defensive, kill Sulphur Nagua until you get Sulphur blades, restocking supplies as needed and picking up Sulphurous essence',
              { type: 'note', text: 'With average luck, this should take 225 kills, 1 hour and get you 60 Defence and 35 Runecrafting. Give the Sulphurous essence to Eyatlalli, south of the Ancient Prison.' },
              { type: 'note', text: 'This is the earliest setup to do Moons of Peril. It is recommended to subdue them at least once at this point.' },
              { text: '(Optional) Keep killing Sulphur Nagua until 60 Attack and 60 Strength', optional: true },
              { type: 'note', text: 'If you would like a punish weapon for the Eclipse Moon, you can do 25 minutes of Toci\'s Gem Store rubies for 765k coins and buy 8350 Chaos runes, sell it for Tokkul and get the Tzhaar-ket-om.' },
              'Subdue the Moons of Peril',
              { text: '(Optional) Subdue the Moons of Peril 10 times', optional: true },
              { text: '(Optional) Subdue the Moons of Peril 25 times', optional: true },
              { text: '(Optional) Subdue the Moons of Peril 50 times', optional: true },
            ]} />
          </CollapsibleSection>

          <Note>
            You can now proceed with the <a href="#skilling">Skilling Route</a>. If you have done both routes OR prefer
            to keep rushing combat, continue with the <a href="#tier4">next part</a> of the guide.
          </Note>
        </section>

        {/* Tier IV */}
        <section id="tier4">
          <h2>Fire Cape (Tier IV)</h2>
          <p>
            The goal of this part is unlocking requirements to get the Glacial temotli, Arkan blade and Sunlight crossbow.
            You should be at Tier IV at this point and unlock the increased drop rate and minigame points multiplier.
          </p>

          <CollapsibleSection title="Mining, Slayer & Amoxliatl">
            <CheckList id="t4-mining" checked={guideChecked} onToggle={handleToggle} items={[
              'Quetzal to Tal Teklan (F: Tlatli rainforest: Rock climb with Alacrity)',
              'Run to the mine south of Tal Teklan',
              'Get 55 Mining using Iron rocks',
              "Get 48 Slayer if you've only gotten 38 with Abundance",
              'Complete The Heart of Darkness, this should get you 53 Slayer',
              'Defeat Amoxliatl',
              { text: '(Optional) Keep killing Amoxliatl until you receive: Pendant of ates, Glacial temotli, Rune platebody, Rune platelegs, Varlamore echo orb', optional: true },
              'Quetzal to Auburnvale',
              "Chop Willow logs in Auburnvale south of Lunami's Axe Shop by the totem to spawn Forestry events",
              'Maple trees are slightly north of the totem',
              "Complete the Vale Totems miniquest if you haven't already",
              { text: '(Optional) Buy an Adamant axe if not Barbarian Gathering OR if you got a Rune axe', optional: true },
              'Get 52 Fletching and 50 Woodcutting via Vale Totems',
            ]} />
          </CollapsibleSection>

          <Note>If you want to rush combat now, get 52 Runecrafting from Sulphurous essence and skip to the Final Dawn step.</Note>

          <CollapsibleSection title="Apple Tree & Fishing">
            <CheckList id="t4-apple" checked={guideChecked} onToggle={handleToggle} items={[
              'Get an Apple tree seed from Vale offerings',
              { text: '(Optional) Get the Fletching knife', optional: true },
              'Quetzal to Hunter Guild, run north to Ortus Farm',
              'Buy Plant pot, Trowel and Watering can',
              'Run east and pick up 9 Sweetcorn',
              'Fill your Watering can to the east',
              'Make an Apple sapling and water it',
              'Lodestone to Karamja',
              'Run north and withdraw Rake from Tool Leprechaun',
              'Plant your Apple sapling and protect it using Sweetcorn',
              'It should take 192 minutes (~3 hours) for it to grow',
              { text: '(Optional) Set a timer for 192 minutes to know when to get back and check on the tree', optional: true },
              'Deposit farming tools using Tool Leprechaun',
              "Use Vigroy to travel to Shilo Village (Shilo: Stepping stones with Alacrity)",
              'Bank, withdraw Fly fishing rod and Feathers (skip with Barbarian Gathering)',
              'Get 65 Fishing catching Trout and Salmon (55 with Abundance)',
            ]} />
          </CollapsibleSection>

          <CollapsibleSection title="Gem Rocks & Tai Bwo Wannai Trio">
            <CheckList id="t4-gem" checked={guideChecked} onToggle={handleToggle} items={[
              'Mine and cut Gem rocks until you get a full inventory of cut Opal, Jade and Red topaz',
              'Get at least 3 cut Red topaz',
              'Exit Shilo Village and run north to Tai Bwo Wannai',
              'Sell gems to Safta Doc one at a time until you get 1300 Trading sticks',
              { type: 'note', text: 'If you did not get enough, go back and mine some more gems.' },
              'IMPORTANT: Keep 3 Red topaz — you can sell the rest of the gems',
              'Repair one village fence until you get some favour',
              'Talk to Murcaily and tell him you have been helping around the village until he gives you some Trading sticks',
              'Pay 100 Trading sticks to enter the Hardwood Grove',
              'Cut some Teak logs',
              'Cut some Mahogany logs',
              'Earn 100% favour in Tai Bwo Wannai Cleanup',
              'You can do this by cutting Dense Jungle',
              'Keep doing this until you get a Gout Tuber Plant, then dig it up',
              'Talk to Safta Doc and exchange 3 Red topaz, 1200 Trading sticks and Gout tuber for Red topaz machete',
              'Equip a Red Topaz Machete',
              'Start the Tai Bwo Wannai Trio quest and do the Tiadeche part until you can catch Karambwan',
              'Catch a Karambwan',
              { type: 'note', text: 'Your Apple tree should take another 1–2 hours to grow, which is the only task left to complete the Karamja Medium Diary.' },
            ]} />
          </CollapsibleSection>

          <div className="guide-runecraft-options">
            <h3>Getting to 52 Runecrafting</h3>
            <p><strong>Option 1: Crafting Cosmic tiaras</strong></p>
            <p>
              Cosmic talismans can be obtained from big net fishing Caskets at Fortis Park.
              Silver bars can be mined using Hotfoot or traded in for Tokkul at Mor Ul Rek and then smelted.
              Tiara mould can be bought from Artima's Crafting Supplies.
            </p>
            <p><strong>Option 2: Sulphurous essence from Sulphur Nagua</strong></p>
            <p>This method is explained earlier in the Combat Route.</p>
          </div>

          <CollapsibleSection title="Final Dawn, Fletching & Fight Caves">
            <CheckList id="t4-final" checked={guideChecked} onToggle={handleToggle} items={[
              'If you have access to an Essence mine, Guardians of the Rift or Arceuus Library, use those methods instead to work your way to 52 Runecrafting',
              'Use the preferred method for 1–2 hours until the Apple tree is grown',
              'Lodestone to Karamja to check it and claim the XP lamp from Pirate Jackie the Fruit, using it on Runecrafting',
              'Keep doing your preferred method until 52 Runecrafting',
              'Complete The Final Dawn quest to get access to the Arkan blade and Doom of Mokhaiotl',
              'Use the quest lamp to get 64 Ranged',
              'Get Mixed hide armour',
              'Get 66 Ranged using the Gemstone Crab or Slayer',
              'Get 74 Fletching using Vale Totems (64 with Abundance)',
              'Get the Sunlight crossbow and ~2000 Sunlight bolts (requires catching 167 Sunlight antelopes)',
              { text: '(Optional) Get 91 Hunter using Hunter rumours for access to Moonlight bolts', optional: true },
              'Complete the Fight Caves',
              { text: 'Equip a Fire cape', pact: true },
            ]} />
            <Note>If you made it all the way here, you are the GOAT! Enjoy the rest of your journey.</Note>
          </CollapsibleSection>
        </section>


      </div>

      </div>{/* end guide-layout */}

      <footer className="app-footer">
        <span>© 2026 Leagues Plan. Guide content by Laef, originally published on the OSRS Wiki (CC BY-NC-SA 3.0).</span>
      </footer>
    </div>
  );
}
