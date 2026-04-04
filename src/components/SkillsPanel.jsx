import React, { useState } from 'react';
import { SKILLS, EXTRAS, CATEGORIES, EXTRA_CATEGORIES, STATUS_STYLES } from '../data/skills';
import SkillIcon from './SkillIcon';
import SPELLBOOKS from '../data/spellbooks.json';
import PRAYERS from '../data/prayers.json';

function getStatusRange(key, solvedThreshold, oversolvedFactor) {
  const half = solvedThreshold / 2;
  const over = solvedThreshold * oversolvedFactor;
  const maxLow = Math.ceil(half) - 1;
  const maxSolved = Math.ceil(over) - 1;
  const minPartial = maxLow + 1;
  const maxPartial = solvedThreshold - 1;
  switch (key) {
    case 'unsolved':  return '0';
    case 'low':       return maxLow < 1 ? '—' : maxLow === 1 ? '1' : `1–${maxLow}`;
    case 'partial':   return minPartial > maxPartial ? '—' : minPartial === maxPartial ? `${minPartial}` : `${minPartial}–${maxPartial}`;
    case 'solved':    return `${solvedThreshold}–${maxSolved}`;
    case 'oversolved': return `${maxSolved + 1}+`;
    default:          return '';
  }
}

const SPELLBOOK_NAMES = Object.keys(SPELLBOOKS);
const PRAYER_BOOK_NAMES = Object.keys(PRAYERS).filter(b => b !== 'Ancient Curses');

export default function SkillsPanel({ skills, extras, solvedThreshold, oversolvedFactor, unlockedSpellbooks = new Set(['Standard']), unlockedPrayerBooks = new Set(['Standard']), unlockedPrayers = new Set() }) {
  const [activeTab, setActiveTab] = useState('skills');
  const [activeSpellbook, setActiveSpellbook] = useState(SPELLBOOK_NAMES[0]);
  const [activePrayerBook, setActivePrayerBook] = useState(PRAYER_BOOK_NAMES[0]);

  const skillList = Object.values(skills);
  const totalPoints = skillList.reduce((sum, s) => sum + Math.min(s.score, solvedThreshold), 0);
  const maxPoints = skillList.length * solvedThreshold;
  const pct = Math.round((totalPoints / maxPoints) * 100);

  return (
    <aside className="skills-panel">
      <div className="panel-header">
        <h2>Solve Progress <span className={`coverage-pct ${pct >= 100 ? 'pct-max' : pct >= 85 ? 'pct-high' : pct >= 67 ? 'pct-mid' : pct >= 50 ? 'pct-low' : ''}`}>({pct}%)</span></h2>
      </div>
      <div className="status-legend">
        {Object.entries(STATUS_STYLES).map(([key, s]) => (
          <span key={key} className="status-legend-item">
            <span className="status-legend-dot" style={{ background: s.border }} />
            {s.label}
            <span className="status-legend-range">{getStatusRange(key, solvedThreshold, oversolvedFactor)}</span>
          </span>
        ))}
      </div>

      <div className="skills-tabs">
        <button className={`skills-tab ${activeTab === 'skills' ? 'active' : ''}`} onClick={() => setActiveTab('skills')}>Skills</button>
        <button className={`skills-tab ${activeTab === 'extras' ? 'active' : ''}`} onClick={() => setActiveTab('extras')}>Extras</button>
        <button className={`skills-tab ${activeTab === 'spellbook' ? 'active' : ''}`} onClick={() => setActiveTab('spellbook')}>Spellbook</button>
        <button className={`skills-tab ${activeTab === 'prayer' ? 'active' : ''}`} onClick={() => setActiveTab('prayer')}>Prayer</button>
      </div>

      <div className="skills-panel-body">
      {activeTab === 'skills' && (
        Object.entries(CATEGORIES).map(([cat, label]) => (
          <div key={cat} className="skill-category">
            <h4>{label}</h4>
            <div className="skill-grid">
              {SKILLS.filter(s => s.category === cat).map(s => (
                <SkillIcon
                  key={s.id}
                  skill={s}
                  score={skills[s.id].score}
                  status={skills[s.id].status}
                />
              ))}
            </div>
          </div>
        ))
      )}

      {activeTab === 'extras' && (
        Object.entries(EXTRA_CATEGORIES).map(([cat, label]) => (
          <div key={cat} className="skill-category">
            <h4>{label}</h4>
            <div className="skill-grid extras-grid">
              {EXTRAS.filter(e => e.category === cat).map(e => (
                <SkillIcon
                  key={e.id}
                  skill={e}
                  score={extras[e.id]?.score ?? 0}
                  status={extras[e.id]?.status ?? 'unsolved'}
                />
              ))}
            </div>
          </div>
        ))
      )}

      {activeTab === 'spellbook' && (
        <div className="ref-tab-content">
          <div className="subbook-tabs">
            {SPELLBOOK_NAMES.map(book => (
              <button
                key={book}
                className={`subbook-tab ${activeSpellbook === book ? 'active' : ''} ${unlockedSpellbooks.has(book) ? 'unlocked' : 'locked'}`}
                onClick={() => setActiveSpellbook(book)}
              >
                {book}
              </button>
            ))}
          </div>
          {Object.entries(SPELLBOOKS[activeSpellbook]).map(([cat, spells]) => (
            <div key={cat} className="ref-category">
              <h4 className="ref-category-label">{cat}</h4>
              <div className="ref-list">
                {spells.map(spell => (
                  <div key={spell.name} className="ref-item">
                    <div className="ref-item-top">
                      <span className="ref-item-name">{spell.name}</span>
                      <span className="ref-item-level">Lvl {spell.level || 1}</span>
                    </div>
                    {spell.runes && spell.runes !== 'None' && (
                      <div className="ref-item-cost">{spell.runes}</div>
                    )}
                    <div className="ref-item-desc">{spell.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'prayer' && (
        <div className="ref-tab-content">
          <div className="mastery-placeholder-note">⚠️ Work in progress — prayer data may be incomplete or change</div>
          <div className="subbook-tabs">
            {PRAYER_BOOK_NAMES.map(book => (
              <button
                key={book}
                className={`subbook-tab ${activePrayerBook === book ? 'active' : ''} ${unlockedPrayerBooks.has(book) ? 'unlocked' : 'locked'}`}
                onClick={() => setActivePrayerBook(book)}
              >
                {book}
              </button>
            ))}
          </div>
          {Object.entries(PRAYERS[activePrayerBook]).map(([cat, prayerList]) => (
            <div key={cat} className="ref-category">
              <h4 className="ref-category-label">{cat}</h4>
              <div className="ref-list">
                {[...prayerList].sort((a, b) => b.level - a.level).map(prayer => (
                  <div key={prayer.name} className={`ref-item${prayer.unlock ? (unlockedPrayers.has(prayer.name) ? ' ref-item-unlocked' : ' ref-item-locked') : ''}`}>
                    <div className="ref-item-top">
                      <span className="ref-item-name">{prayer.name}</span>
                      <span className="ref-item-level">Lvl {prayer.level}</span>
                    </div>
                    <div className="ref-item-cost">Drain: {prayer.drain}/min</div>
                    <div className="ref-item-desc">{prayer.desc}</div>
                    {prayer.unlock && <div className="ref-item-unlock">{prayer.unlock}</div>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </aside>
  );
}
