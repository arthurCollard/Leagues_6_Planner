import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { STATUS_STYLES } from '../data/skills';

function SkillTooltip({ text, anchorRef }) {
  if (!anchorRef.current) return null;
  const rect = anchorRef.current.getBoundingClientRect();
  return createPortal(
    <div
      className="skill-tooltip"
      style={{
        top: rect.top - 6,
        left: rect.left + rect.width / 2,
        transform: 'translateX(-50%) translateY(-100%)',
      }}
    >
      {text}
    </div>,
    document.body
  );
}

export default function SkillIcon({ skill, score, status }) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef(null);
  const style = STATUS_STYLES[status];
  return (
    <div
      ref={ref}
      className="skill-icon"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: style.bg,
        border: `2px solid ${style.border}`,
        boxShadow: score > 0 ? `0 0 14px ${style.glow}` : 'none',
      }}
    >
      <img
        src={skill.icon}
        alt={skill.name}
        className="skill-emoji"
        onError={e => { e.currentTarget.style.display = 'none'; }}
      />
      <span className="skill-name">{skill.name}</span>
      <span className="skill-score" style={{ color: style.border }}>
        {score > 0 ? score : '—'}
      </span>
      {hovered && <SkillTooltip text={`${skill.name}: ${score} pts (${style.label})`} anchorRef={ref} />}
    </div>
  );
}
