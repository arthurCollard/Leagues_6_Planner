export default function Header({ relicCount, solvedCount, masteryPoints, regionCount, onToggleSettings, onReset }) {
  return (
    <header className="app-header">
      <div>
        <h1><img src="/Demonic_Pacts_League_Stylized_Logo.png" alt="Leagues VI" className="header-logo" /> Leagues VI: Demonic Pacts Planner</h1>
      </div>
      <div className="header-stats">
        <span>{relicCount}/8 Relics</span>
        <span>{solvedCount}/23 Skills Solved</span>
        <span>{masteryPoints}/10 Mastery pts</span>
        <span>{regionCount}/3 Regions</span>
        <button onClick={onToggleSettings}>⚙️ Settings</button>
        <button onClick={onReset}>🔄 Reset</button>
      </div>
    </header>
  );
}
