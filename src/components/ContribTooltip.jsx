import { createPortal } from 'react-dom';
import { useState } from 'react';
import { SKILLS, EXTRAS } from '../data/skills';

const SKILL_NAME = Object.fromEntries(SKILLS.map(s => [s.id, s.name]));
const EXTRA_NAME = Object.fromEntries(EXTRAS.map(e => [e.id, e.name]));

export default function ContribTooltip({ data, onMouseEnter, onMouseLeave }) {
  const [activeTab, setActiveTab] = useState('bonuses');

  if (!data) return null;
  const { pos, skills, extras, special, description, drops } = data;
  const skillEntries = Object.entries(skills || {}).filter(([, v]) => v > 0).sort(([, a], [, b]) => a - b);
  const extraEntries = Object.entries(extras || {}).filter(([, v]) => v > 0).sort(([, a], [, b]) => a - b);
  const clampedLeft = Math.min(pos.left, window.innerWidth - 230);

  const hasContribs = skillEntries.length > 0 || extraEntries.length > 0;
  const hasDrops = drops?.length > 0;
  const showTabs = hasContribs && hasDrops;

  return createPortal(
    <div
      className="contrib-tooltip"
      style={{ position: 'fixed', left: clampedLeft, top: pos.top }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {description && (
        <div className="contrib-description">{description}</div>
      )}
      {showTabs && (
        <div className="contrib-tabs">
          <button
            className={`contrib-tab ${activeTab === 'bonuses' ? 'active' : ''}`}
            onClick={() => setActiveTab('bonuses')}
          >Bonuses</button>
          <button
            className={`contrib-tab ${activeTab === 'gear' ? 'active' : ''}`}
            onClick={() => setActiveTab('gear')}
          >Gear</button>
        </div>
      )}
      <div className="contrib-scroll">
      {special === 'reloaded' ? (
        <div className="contrib-row" style={{ color: '#c8b896', fontStyle: 'italic' }}>
          Copies another relic's bonuses
        </div>
      ) : (
        <>
          {(!showTabs || activeTab === 'bonuses') && (
            <>
              {hasContribs ? (
                <>
                  {skillEntries.length > 0 && (
                    <div className="contrib-section">
                      {!showTabs && <div className="contrib-label">Bonuses</div>}
                      {skillEntries.map(([id, val]) => (
                        <div key={id} className="contrib-row">
                          <span>{SKILL_NAME[id] || id}</span>
                          <span className="contrib-val">+{val}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {extraEntries.length > 0 && (
                    <div className="contrib-section">
                      <div className="contrib-label">Extras</div>
                      {extraEntries.map(([id, val]) => (
                        <div key={id} className="contrib-row">
                          <span>{EXTRA_NAME[id] || id}</span>
                          <span className="contrib-val">+{val}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                !showTabs && !description && !hasDrops && (
                  <div className="contrib-row" style={{ color: '#7a6a4a', fontStyle: 'italic' }}>No skill contributions</div>
                )
              )}
            </>
          )}
          {(!showTabs || activeTab === 'gear') && hasDrops && (
            <div className="contrib-section">
              {!showTabs && <div className="contrib-label">Notable Gear</div>}
              {drops.map(d => (
                <div key={d} className="contrib-row" style={{ color: '#b8a282' }}>{d}</div>
              ))}
            </div>
          )}
        </>
      )}
      </div>
    </div>,
    document.body
  );
}
