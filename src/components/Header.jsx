import { Link } from 'react-router-dom';

const guideEnabled = process.env.REACT_APP_ENABLE_GUIDE === 'true';

export default function Header({ relicCount, solvedCount, masteryPoints, regionCount }) {
  return (
    <header className="app-header">
      <div className="header-title-row">
        <h1><img src="/Demonic_Pacts_League_Stylized_Logo.png" alt="Leagues VI" className="header-logo" /> Leagues VI: Demonic Pacts Planner</h1>
        <nav className="header-nav">
          <Link to="/" className="header-nav-link">Planner</Link>
          {guideEnabled && <Link to="/guide" className="header-nav-link">Guide</Link>}
        </nav>
      </div>
      <div className="header-stats">
        <span>{relicCount}/8 Relics</span>
        <span>{solvedCount}/23 Skills Solved</span>
        <span>{masteryPoints}/10 Pact pts</span>
        <span>{regionCount}/3 Regions</span>
      </div>
    </header>
  );
}
