
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
    </div>
  );
}
