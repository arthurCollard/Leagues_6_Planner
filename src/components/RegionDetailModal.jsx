import { createPortal } from 'react-dom';
import { useState } from 'react';
import { UNIVERSAL_REGIONS, UNLOCKABLE_REGIONS } from '../data/region/regions';
import { SKILLS, EXTRAS } from '../data/skills';
import regionData from '../data/region/region-data.json';
import shopData from '../data/region/all-shops.json';

const ALL_REGIONS = [...UNIVERSAL_REGIONS, ...UNLOCKABLE_REGIONS];

const SKILL_NAME = Object.fromEntries(SKILLS.map(s => [s.id, s.name]));
const EXTRA_NAME = Object.fromEntries(EXTRAS.map(e => [e.id, e.name]));

const NAME_MAP = {
  Varlamore:  'Varlamore',
  Karamja:    'Karamja',
  Asgarnia:   'Asgarnia',
  Fremennik:  'Fremennik Province',
  Kandarin:   'Kandarin',
  Desert:     'Kharidian Desert',
  Morytania:  'Morytania',
  Tirannwn:   'Tirannwn',
  Wilderness: 'Wilderness',
  Kourend:    'Kebos and Kourend',
  Misthalin:  'Misthalin',
};

function splitFootnotes(items) {
  const main = items.filter(i => !i.startsWith('^'));
  const notes = items.filter(i => i.startsWith('^')).map(i => i.slice(1).trim());
  return { main, notes };
}

function RdmList({ items }) {
  const { main, notes } = splitFootnotes(items);
  return (
    <>
      <ul className="rdm-list">
        {main.map((item, i) => <li key={i} className="rdm-list-item">{item}</li>)}
      </ul>
      {notes.length > 0 && (
        <ol className="rdm-footnotes">
          {notes.map((note, i) => <li key={i} className="rdm-footnote-item">{note}</li>)}
        </ol>
      )}
    </>
  );
}

function getList(scraped, ...path) {
  let node = scraped;
  for (const key of path) {
    if (!node) return null;
    const found = Object.keys(node).find(k => k.toLowerCase() === key.toLowerCase());
    node = found ? node[found] : null;
  }
  if (!node || node.type !== 'list') return null;
  return node.items;
}

function getDropTable(scraped) {
  const section = scraped?.['Notable drops'];
  if (!section) return null;
  const content = section['_content'];
  if (!content || content.type !== 'table') return null;
  return content.rows.filter(row => row['Item']?.trim());
}

export default function RegionDetailModal({ regionName, customWeights = {}, onClose }) {
  const [activeTab, setActiveTab] = useState(null);
  const [activeShop, setActiveShop] = useState(null);
  const [dropFilter, setDropFilter] = useState('');
  const [shopSearch, setShopSearch] = useState('');

  if (!regionName) return null;
  const region = ALL_REGIONS.find(r => r.name === regionName);
  if (!region) return null;

  const scrapedKey = NAME_MAP[regionName];
  const scraped = scrapedKey ? regionData[scrapedKey] : null;

  const pvm         = getList(scraped, 'Overview of area', 'Notable combat-related activities');
  const quests      = getList(scraped, 'Unlocks', 'Quests');
  const slayer      = getList(scraped, 'Unlocks', 'Slayer') || getList(scraped, 'Overview of area', 'Slayer');
  const settlements = getList(scraped, 'Overview of area', 'Notable settlements') || getList(scraped, 'Key Info', 'Notable Settlements');
  const activities  = getList(scraped, 'Overview of area', 'Notable non-combat activities') || getList(scraped, 'Key Info', 'Notable Non-Combat Activities');
  const dropTable   = getDropTable(scraped);
  const mergedSkills = { ...region.skills, ...customWeights.skills };
  const mergedExtras = { ...region.extras, ...customWeights.extras };
  const skillEntries = Object.entries(mergedSkills).filter(([, v]) => v > 0);
  const extraEntries = Object.entries(mergedExtras).filter(([, v]) => v > 0);

  const extraSpellbooks = (region.spellbook || []).filter(b => b !== 'Standard');
  const extraPrayerBooks = (region.prayer || []).filter(b => b !== 'Standard');
  const prayerUnlocks = region.prayerUnlocks || [];
  const hasSpellsPrayers = extraSpellbooks.length > 0 || extraPrayerBooks.length > 0 || prayerUnlocks.length > 0;

  const regionShops = shopData.regions[regionName]?.locations ?? [];
  const hasShops = regionShops.length > 0;

  const shopQ = shopSearch.toLowerCase();
  const filteredShopLocations = shopQ
    ? regionShops
        .map(loc => ({
          ...loc,
          shops: loc.shops.filter(shop =>
            shop.stockTables[0]?.stock.some(row => row['Item']?.toLowerCase().includes(shopQ))
          ),
        }))
        .filter(loc => loc.shops.length > 0)
    : regionShops;

  const allFilteredShops = filteredShopLocations.flatMap(l => l.shops);
  const defaultShop = allFilteredShops[0] ?? null;
  const currentShop = (activeShop && allFilteredShops.find(s => s.name === activeShop))
    ?? defaultShop;

  const regionTasks = region.tasks || [];
  const TIER_ORDER = ['Easy', 'Medium', 'Hard', 'Elite', 'Master'];
  const tasksByTier = TIER_ORDER.map(tier => ({
    tier,
    tasks: regionTasks.filter(t => t.tier === tier).sort((a, b) => (a.global ? 1 : 0) - (b.global ? 1 : 0)),
  })).filter(g => g.tasks.length > 0);

  const tabs = [
    regionTasks.length && { id: 'tasks',         label: 'Tasks' },
    pvm?.length        && { id: 'pvm',          label: 'PVM' },
    dropTable?.length  && { id: 'drops',         label: 'Drops' },
    (skillEntries.length > 0 || extraEntries.length > 0) && { id: 'weights', label: 'Bonuses' },
    hasSpellsPrayers   && { id: 'spells',        label: 'Spellbooks & Prayers' },
    hasShops           && { id: 'shops',          label: 'Shops' },
    slayer?.length     && { id: 'slayer',        label: 'Slayer' },
    quests?.length     && { id: 'quests',        label: 'Quests' },
    activities?.length && { id: 'activities',    label: 'Activities' },
    settlements?.length && { id: 'settlements',  label: 'Settlements' },
  ].filter(Boolean);

  const currentTab = activeTab && tabs.find(t => t.id === activeTab) ? activeTab : tabs[0]?.id;

  const filteredDrops = dropTable
    ? dropTable
        .filter(row => {
          const q = dropFilter.toLowerCase();
          return !q || row['Item']?.toLowerCase().includes(q) || row['Source']?.toLowerCase().includes(q);
        })
        .sort((a, b) => (b['Source'] === 'Echo drop') - (a['Source'] === 'Echo drop'))
    : [];
  const tableMaxHeight = 36 + filteredDrops.length * 30;

  return createPortal(
    <div className="rdm-overlay" onClick={onClose}>
      <div className="rdm-panel" onClick={e => e.stopPropagation()}>
        <div className="rdm-header">
          <div className="rdm-title">
            <img
              className="rdm-badge-icon"
              src={`/regions/${regionName}_Area_Badge.png`}
              alt=""
              onError={e => { e.target.style.display = 'none'; }}
            />
            {regionName}
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="rdm-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`rdm-tab${currentTab === tab.id ? ' active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="rdm-body">
          {currentTab === 'pvm'         && <RdmList items={pvm} />}
          {currentTab === 'quests'      && <RdmList items={quests} />}
          {currentTab === 'slayer'      && <RdmList items={slayer} />}
          {currentTab === 'activities'  && <RdmList items={activities} />}
          {currentTab === 'settlements' && <RdmList items={settlements} />}
          {currentTab === 'drops' && (
            <div className="rdm-drops-section">
              <div className="rdm-drops-header">
                <div className="rdm-filter-wrap">
                  <input
                    className="rdm-filter-input"
                    type="text"
                    placeholder="Filter by item or source…"
                    value={dropFilter}
                    onChange={e => setDropFilter(e.target.value)}
                  />
                  {dropFilter && (
                    <button className="rdm-filter-clear" onClick={() => setDropFilter('')}>✕</button>
                  )}
                </div>
              </div>
              <div className="rdm-table-wrap" style={{ maxHeight: tableMaxHeight }}>
                <table className="rdm-drop-table">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Source</th>
                      <th>Base Rate</th>
                      <th>2× Multiplier</th>
                      <th>5× Multiplier</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDrops.map((row, i) => (
                      <tr key={i} className={row['Source'] === 'Echo drop' ? 'rdm-row-echo' : ''}>
                        <td>{row['Item']}</td>
                        <td className="rdm-source">{row['Source']}</td>
                        <td className="rdm-rarity">{row['BaseRarity']}</td>
                        <td className="rdm-rarity">{row['2x DropMultiplier']}</td>
                        <td className="rdm-rarity">{row['5x DropMultiplier']}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {currentTab === 'spells' && (
            <div className="rdm-weights">
              {extraSpellbooks.length > 0 && (
                <div className="rdm-weights-col">
                  <div className="rdm-sub-label">Spellbooks</div>
                  {extraSpellbooks.map(b => (
                    <div key={b} className="rdm-weight-row"><span>{b}</span></div>
                  ))}
                </div>
              )}
              {(extraPrayerBooks.length > 0 || prayerUnlocks.length > 0) && (
                <div className="rdm-weights-col">
                  <div className="rdm-sub-label">Prayers</div>
                  {extraPrayerBooks.map(b => (
                    <div key={b} className="rdm-weight-row"><span>{b}</span></div>
                  ))}
                  {prayerUnlocks.map(p => (
                    <div key={p} className="rdm-weight-row"><span>{p}</span></div>
                  ))}
                </div>
              )}
            </div>
          )}
          {currentTab === 'shops' && (
            <div className="rdm-shops">
              <div className="rdm-shops-sidebar">
                <div className="rdm-filter-wrap rdm-shops-search">
                  <input
                    className="rdm-filter-input"
                    type="text"
                    placeholder="Search items…"
                    value={shopSearch}
                    onChange={e => { setShopSearch(e.target.value); setActiveShop(null); }}
                  />
                  {shopSearch && (
                    <button className="rdm-filter-clear" onClick={() => { setShopSearch(''); setActiveShop(null); }}>✕</button>
                  )}
                </div>
                <div className="rdm-shops-list">
                  {filteredShopLocations.map(loc => (
                    <div key={loc.location} className="rdm-shops-group">
                      <div className="rdm-shops-location">{loc.location}</div>
                      {loc.shops.map(shop => (
                        <button
                          key={shop.name}
                          className={`rdm-shop-btn${currentShop?.name === shop.name ? ' active' : ''}`}
                          onClick={() => setActiveShop(shop.name)}
                        >
                          {shop.name}
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
              <div className="rdm-shops-stock">
                {currentShop && (
                  <>
                    <div className="rdm-shops-title">{currentShop.name}</div>
                    <div className="rdm-table-wrap">
                      <table className="rdm-drop-table">
                        <thead>
                          <tr><th>Item</th><th>Stock</th><th>Restock</th><th>Price</th></tr>
                        </thead>
                        <tbody>
                          {currentShop.stockTables[0]?.stock.filter(row =>
                            !shopQ || row['Item']?.toLowerCase().includes(shopQ)
                          ).map((row, i) => {
                            const name = row['Item'];
                            if (!name) return null;
                            const stock = row['Number in stock'];
                            const restock = (row['Restock time'] || '').replace(/\s*\([\d,]+t\)/gi, '').trim();
                            const price = row['Price sold at'];
                            return (
                              <tr key={i}>
                                <td>{name}</td>
                                <td className="rdm-rarity">{/^\d+$/.test(stock) ? stock : '–'}</td>
                                <td className="rdm-rarity">{restock || '–'}</td>
                                <td className="rdm-rarity">{price || '–'}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
          {currentTab === 'tasks' && (
            <div className="rdm-tasks">
              {tasksByTier.map(({ tier, tasks }) => (
                <div key={tier} className="rdm-tasks-group">
                  <div className={`rdm-tasks-tier rdm-tier-${tier.toLowerCase()}`}>{tier}</div>
                  {tasks.map((task, i) => (
                    <div key={i} className="rdm-task-row">
                      <span className="rdm-task-name">
                        {task.name}
                        {task.global && <span className="rdm-task-global-badge">Global</span>}
                      </span>
                      <span className="rdm-task-points">{task.points} pts</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
          {currentTab === 'weights' && (
            <div className="rdm-weights">
              {skillEntries.length > 0 && (
                <div className="rdm-weights-col">
                  <div className="rdm-sub-label">Skills</div>
                  {skillEntries.map(([id, val]) => (
                    <div key={id} className="rdm-weight-row">
                      <span>{SKILL_NAME[id] || id}</span>
                      <span className="rdm-weight-val">+{val}</span>
                    </div>
                  ))}
                </div>
              )}
              {extraEntries.length > 0 && (
                <div className="rdm-weights-col">
                  <div className="rdm-sub-label">Extras</div>
                  {extraEntries.map(([id, val]) => (
                    <div key={id} className="rdm-weight-row">
                      <span>{EXTRA_NAME[id] || id}</span>
                      <span className="rdm-weight-val">+{val}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
