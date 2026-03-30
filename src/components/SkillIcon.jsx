import React from 'react';
import { STATUS_STYLES } from '../data/skills';

export default function SkillIcon({ skill, score, status }) {
  const style = STATUS_STYLES[status];
  return (
    <div
      className="skill-icon"
      title={`${skill.name}: ${score} pts (${style.label})`}
      style={{
        background: style.bg,
        border: `2px solid ${style.border}`,
        boxShadow: score > 0 ? `0 0 14px ${style.glow}` : 'none',
      }}
    >
      <span className="skill-emoji">{skill.icon}</span>
      <span className="skill-name">{skill.name}</span>
      <span className="skill-score" style={{ color: style.border }}>
        {score > 0 ? score : '—'}
      </span>
    </div>
  );
}
