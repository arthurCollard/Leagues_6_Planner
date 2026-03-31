import React from 'react';
import RelicIcon from './RelicIcon';

export default function SelectionButton({ item, selected, onSelect }) {
  return (
    <button
      className={`relic-btn ${selected ? 'selected' : ''}`}
      onClick={onSelect}
    >
      <RelicIcon src={item.icon} name={item.name} />
      <div className="relic-info">
        <strong>{item.name}</strong>
        <small>{item.desc}</small>
      </div>
      {selected && <span className="check">✓</span>}
    </button>
  );
}
