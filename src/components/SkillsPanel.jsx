import React, { useState } from 'react';
import { SKILLS, EXTRAS, CATEGORIES, STATUS_STYLES } from '../data/skills';
import SkillIcon from './SkillIcon';

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

export default function SkillsPanel({ skills, extras, solvedThreshold, oversolvedFactor }) {
  const [showExtras, setShowExtras] = useState(false);

  const skillList = Object.values(skills);
  const totalPoints = skillList.reduce((sum, s) => sum + Math.min(s.score, solvedThreshold), 0);
  const maxPoints = skillList.length * solvedThreshold;
  const pct = Math.round((totalPoints / maxPoints) * 100);

  return (
    <aside className="skills-panel">
      <div className="panel-header">
        <h2>Skill Coverage <span className="coverage-pct">({pct}%)</span></h2>
        <button className="toggle-btn" onClick={() => setShowExtras(e => !e)}>
          {showExtras ? 'Show Skills' : 'Show Extras'}
        </button>
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

      {!showExtras ? (
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
      ) : (
        <div className="skill-grid extras-grid">
          {EXTRAS.map(e => (
            <SkillIcon
              key={e.id}
              skill={e}
              score={extras[e.id].score}
              status={extras[e.id].status}
            />
          ))}
        </div>
      )}
    </aside>
  );
}
