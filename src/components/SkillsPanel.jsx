import React, { useState } from 'react';
import { SKILLS, EXTRAS, CATEGORIES } from '../data/skills';
import SkillIcon from './SkillIcon';

export default function SkillsPanel({ skills, extras }) {
  const [showExtras, setShowExtras] = useState(false);

  return (
    <aside className="skills-panel">
      <div className="panel-header">
        <h2>Skill Coverage</h2>
        <button className="toggle-btn" onClick={() => setShowExtras(e => !e)}>
          {showExtras ? 'Show Skills' : 'Show Extras'}
        </button>
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
