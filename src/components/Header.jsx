import React from 'react';

export default function Header({ relicCount, solvedCount, onToggleSettings, onReset }) {
  return (
    <header className="app-header">
      <div>
        <h1>🛡️ Leagues VI: Demonic Pacts Planner</h1>
        <p>Select relics → watch skills light up by coverage</p>
      </div>
      <div className="header-stats">
        <span>{relicCount}/8 Relics</span>
        <span>{solvedCount}/23 Skills Solved</span>
        <button onClick={onToggleSettings}>⚙️ Settings</button>
        <button onClick={onReset}>🔄 Reset</button>
      </div>
    </header>
  );
}
