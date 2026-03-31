import React, { useState } from 'react';
import { REGIONS } from '../data/regions';
import RelicIcon from './RelicIcon';
import SelectionButton from './SelectionButton';

export default function RegionTree({ selectedRegions, onSelectRegion }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <main className="relic-tree">
      <h2 className="section-header" onClick={() => setIsOpen(o => !o)}>
        Regions
        <div className={`collapse-chevron ${isOpen ? 'open' : ''}`} />
      </h2>

      <div className={`collapsible-body ${isOpen ? 'open' : ''}`}>
        {Object.entries(REGIONS).map(([tier, regions]) => (
          <div key={tier} className="tier-block">
            <div className="tier-label">
              <span>Tier {tier}</span>
              {selectedRegions[tier] && (
                <span className="tier-chosen">
                  <RelicIcon src={selectedRegions[tier].icon} name={selectedRegions[tier].name} />
                  {selectedRegions[tier].name}
                </span>
              )}
            </div>
            <div className="relic-row">
              {regions.map(region => (
                <SelectionButton
                  key={region.name}
                  item={region}
                  selected={selectedRegions[tier]?.name === region.name}
                  onSelect={() => onSelectRegion(tier, region)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
