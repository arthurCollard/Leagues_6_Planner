/**
 * Merges scraped wiki data into regions.js.
 * Adds: quests[], slayer[], settlements[] to each region object.
 * Never modifies: name, icon, pvm, drops, skills, extras.
 *
 * Usage: node scripts/mergeRegionData.js
 */

const fs = require('fs');
const path = require('path');

const SCRAPED_PATH = path.join(__dirname, '../src/data/region-data.json');
const REGIONS_PATH = path.join(__dirname, '../src/data/regions.js');

// Map existing region names -> scraped page names
const NAME_MAP = {
  'Varlamore':   'Varlamore',
  'Karamja':     'Karamja',
  'Asgarnia':    'Asgarnia',
  'Fremennik':   'Fremennik Province',
  'Kandarin':    'Kandarin',
  'Desert':      'Kharidian Desert',
  'Morytania':   'Morytania',
  'Tirannwn':    'Tirannwn',
  'Wilderness':  'Wilderness',
  'Kourend':     'Kebos and Kourend',
};

// ---------- extract helpers ----------

function getList(scraped, ...path) {
  let node = scraped;
  for (const key of path) {
    if (!node) return null;
    // case-insensitive key lookup
    const found = Object.keys(node).find(k => k.toLowerCase() === key.toLowerCase());
    node = found ? node[found] : null;
  }
  if (!node || node.type !== 'list') return null;
  return node.items;
}

function extractQuests(scraped) {
  return getList(scraped, 'Unlocks', 'Quests');
}

function extractSlayer(scraped) {
  // Slayer appears under Unlocks > Slayer or Overview of area > Slayer (Kourend)
  return (
    getList(scraped, 'Unlocks', 'Slayer') ||
    getList(scraped, 'Overview of area', 'Slayer') ||
    null
  );
}

function extractSettlements(scraped) {
  return (
    getList(scraped, 'Overview of area', 'Notable settlements') ||
    getList(scraped, 'Key Info', 'Notable Settlements') ||
    null
  );
}

function extractNonCombat(scraped) {
  return (
    getList(scraped, 'Overview of area', 'Notable non-combat activities') ||
    getList(scraped, 'Key Info', 'Notable Non-Combat Activities') ||
    null
  );
}

function extractDropTable(scraped) {
  // Notable drops is a table under the top-level "Notable drops" h2, stored as _content
  const section = scraped?.['Notable drops'];
  if (!section) return null;
  const content = section['_content'];
  if (!content || content.type !== 'table') return null;
  return content.rows
    .filter(row => row['Item'] && row['Item'].trim())
    .map(row => ({
      item:   row['Item'].trim(),
      source: row['Source']?.trim() || '',
      base:   row['BaseRarity']?.trim() || '',
      x2:     row['2x DropMultiplier']?.trim() || '',
      x5:     row['5x DropMultiplier']?.trim() || '',
    }));
}

// ---------- serialise a region object ----------

function indent(str, n) {
  const pad = ' '.repeat(n);
  return str.split('\n').map((l, i) => (i === 0 ? l : pad + l)).join('\n');
}

function serializeStringArray(arr) {
  if (!arr || arr.length === 0) return '[]';
  const inner = arr.map(s => `    ${JSON.stringify(s)}`).join(',\n');
  return `[\n${inner},\n  ]`;
}

function serializeRegion(r) {
  const lines = [];
  lines.push(`  {`);
  lines.push(`    name: ${JSON.stringify(r.name)},`);
  lines.push(`    icon: '',`);

  if (r.pvm) {
    lines.push(`    pvm: ${JSON.stringify(r.pvm)},`);
  }

  if (r.drops) {
    const dropStr = r.drops.map(d => `      ${JSON.stringify(d)}`).join(',\n');
    lines.push(`    drops: [\n${dropStr},\n    ],`);
  }

  if (r.quests && r.quests.length > 0) {
    const qStr = r.quests.map(q => `      ${JSON.stringify(q)}`).join(',\n');
    lines.push(`    quests: [\n${qStr},\n    ],`);
  }

  if (r.slayer && r.slayer.length > 0) {
    const sStr = r.slayer.map(s => `      ${JSON.stringify(s)}`).join(',\n');
    lines.push(`    slayer: [\n${sStr},\n    ],`);
  }

  if (r.settlements && r.settlements.length > 0) {
    const sStr = r.settlements.map(s => `      ${JSON.stringify(s)}`).join(',\n');
    lines.push(`    settlements: [\n${sStr},\n    ],`);
  }

  if (r.activities && r.activities.length > 0) {
    const aStr = r.activities.map(a => `      ${JSON.stringify(a)}`).join(',\n');
    lines.push(`    activities: [\n${aStr},\n    ],`);
  }

  // skills
  const skillEntries = Object.entries(r.skills || {});
  if (skillEntries.length > 0) {
    const inner = skillEntries.map(([k, v]) => `${k}: ${v}`).join(', ');
    lines.push(`    skills: { ${inner} },`);
  } else {
    lines.push(`    skills: {},`);
  }

  // extras
  const extraEntries = Object.entries(r.extras || {});
  if (extraEntries.length > 0) {
    const inner = extraEntries.map(([k, v]) => `${k}: ${v}`).join(', ');
    lines.push(`    extras: { ${inner} },`);
  } else {
    lines.push(`    extras: {},`);
  }

  lines.push(`  }`);
  return lines.join('\n');
}

// ---------- main ----------

function main() {
  const scraped = JSON.parse(fs.readFileSync(SCRAPED_PATH, 'utf8'));

  // Dynamically eval the regions file
  const src = fs.readFileSync(REGIONS_PATH, 'utf8');
  // Strip ES module syntax for eval
  const evaled = src
    .replace(/export const UNIVERSAL_REGIONS/, 'const UNIVERSAL_REGIONS')
    .replace(/export const UNLOCKABLE_REGIONS/, 'const UNLOCKABLE_REGIONS')
    .replace(/export const MAX_UNLOCKABLE_REGIONS/, 'const MAX_UNLOCKABLE_REGIONS');

  const ctx = {};
  // eslint-disable-next-line no-new-func
  new Function('ctx', `with(ctx){${evaled}; ctx.UNIVERSAL_REGIONS=UNIVERSAL_REGIONS; ctx.UNLOCKABLE_REGIONS=UNLOCKABLE_REGIONS; ctx.MAX_UNLOCKABLE_REGIONS=MAX_UNLOCKABLE_REGIONS;}`)(ctx);

  function enrichRegion(region) {
    const scrapedName = NAME_MAP[region.name];
    if (!scrapedName || !scraped[scrapedName]) {
      console.warn(`  ⚠ No scraped data for "${region.name}"`);
      return region;
    }
    const s = scraped[scrapedName];
    return {
      ...region,
      quests:      extractQuests(s)      || region.quests      || [],
      slayer:      extractSlayer(s)      || region.slayer      || [],
      settlements: extractSettlements(s) || region.settlements || [],
      activities:  extractNonCombat(s)   || region.activities  || [],
    };
  }

  const universal  = ctx.UNIVERSAL_REGIONS.map(enrichRegion);
  const unlockable = ctx.UNLOCKABLE_REGIONS.map(enrichRegion);

  const universalBlock  = universal.map(serializeRegion).join(',\n');
  const unlockableBlock = unlockable.map(serializeRegion).join(',\n');

  const output = [
    `export const UNIVERSAL_REGIONS = [\n${universalBlock},\n];\n`,
    `export const UNLOCKABLE_REGIONS = [\n${unlockableBlock},\n];\n`,
    `export const MAX_UNLOCKABLE_REGIONS = ${ctx.MAX_UNLOCKABLE_REGIONS};\n`,
  ].join('\n');

  fs.writeFileSync(REGIONS_PATH, output, 'utf8');
  console.log(`✅ regions.js updated`);
  console.log(`   Universal:  ${universal.length} regions`);
  console.log(`   Unlockable: ${unlockable.length} regions`);
}

main();
