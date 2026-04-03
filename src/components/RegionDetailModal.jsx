import { createPortal } from 'react-dom';
import { useState } from 'react';
import { UNIVERSAL_REGIONS, UNLOCKABLE_REGIONS } from '../data/regions';
import { SKILLS, EXTRAS } from '../data/skills';
import regionData from '../data/region-data.json';

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

export default function RegionDetailModal({ regionName, onClose }) {
  const [activeTab, setActiveTab] = useState(null);
  const [dropFilter, setDropFilter] = useState('');

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
  const skillEntries = Object.entries(region.skills || {}).filter(([, v]) => v > 0);
  const extraEntries = Object.entries(region.extras || {}).filter(([, v]) => v > 0);

  const tabs = [
    pvm?.length        && { id: 'pvm',          label: 'PVM' },
    dropTable?.length  && { id: 'drops',         label: 'Drops' },
    (skillEntries.length > 0 || extraEntries.length > 0) && { id: 'weights', label: 'Bonuses' },
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
          {currentTab === 'weights' && (
            <div className="rdm-weights">
              {skillEntries.length > 0 && (
                <>
                  <div className="rdm-sub-label">Skills</div>
                  {skillEntries.map(([id, val]) => (
                    <div key={id} className="rdm-weight-row">
                      <span>{SKILL_NAME[id] || id}</span>
                      <span className="rdm-weight-val">+{val}</span>
                    </div>
                  ))}
                </>
              )}
              {extraEntries.length > 0 && (
                <>
                  <div className="rdm-sub-label" style={{ marginTop: '0.6rem' }}>Extras</div>
                  {extraEntries.map(([id, val]) => (
                    <div key={id} className="rdm-weight-row">
                      <span>{EXTRA_NAME[id] || id}</span>
                      <span className="rdm-weight-val">+{val}</span>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
