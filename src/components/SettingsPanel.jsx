import React from 'react';
import { STATUS_STYLES } from '../data/skills';

export default function SettingsPanel({ settings, onChange }) {
  return (
    <div className="settings-panel">
      <h3>⚙️ Settings</h3>
      <label>
        Solved Threshold
        <input
          type="number" min="1" max="9" step="1"
          value={settings.solvedThreshold}
          onChange={e => onChange({ ...settings, solvedThreshold: +e.target.value })}
        />
      </label>
      <label>
        Oversolved Factor
        <input
          type="number" min="1" max="3" step="0.1"
          value={settings.oversolvedFactor}
          onChange={e => onChange({ ...settings, oversolvedFactor: +e.target.value })}
        />
      </label>
      <div className="legend">
        {Object.entries(STATUS_STYLES).map(([key, s]) => (
          <div key={key} className="legend-item">
            <span style={{
              display: 'inline-block', width: 12, height: 12,
              borderRadius: '50%', background: s.border, marginRight: 6,
            }} />
            {s.label}
          </div>
        ))}
      </div>
    </div>
  );
}
