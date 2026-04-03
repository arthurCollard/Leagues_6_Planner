/**
 * Rebuilds the "Notable drops" tables in region-full-data.json using actual gear data.
 * - Echo items → N/A for all drop rates
 * - Non-echo items → preserve wiki rates where name matches, else N/A
 *
 * Usage: node scripts/rebuildDropTables.mjs
 */

import { readFileSync, writeFileSync } from 'fs';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

// ── Load gear files ──────────────────────────────────────────────────────────

const { HEAD }   = await import('../src/data/gear/head.js');
const { BODY }   = await import('../src/data/gear/body.js');
const { LEGS }   = await import('../src/data/gear/legs.js');
const { HANDS }  = await import('../src/data/gear/hands.js');
const { FEET }   = await import('../src/data/gear/feet.js');
const { CAPE }   = await import('../src/data/gear/cape.js');
const { NECK }   = await import('../src/data/gear/neck.js');
const { RING }   = await import('../src/data/gear/ring.js');
const { WEAPON } = await import('../src/data/gear/weapon.js');
const { SHIELD } = await import('../src/data/gear/shield.js');
const { AMMO }   = await import('../src/data/gear/ammo.js');

const ALL_GEAR = [
  ...HEAD, ...BODY, ...LEGS, ...HANDS, ...FEET,
  ...CAPE, ...NECK, ...RING, ...WEAPON, ...SHIELD, ...AMMO,
];

// Build region → items map
const gearByRegion = {};
for (const item of ALL_GEAR) {
  for (const region of (item.regions || [])) {
    if (!gearByRegion[region]) gearByRegion[region] = [];
    gearByRegion[region].push(item);
  }
}

// ── Load existing JSON ───────────────────────────────────────────────────────

const JSON_PATHS = [
  join(__dirname, '../src/data/region-data.json'),
  join(__dirname, '../src/data/region-full-data.json'),
];

// ── Helpers ──────────────────────────────────────────────────────────────────

function normalise(str) {
  return str
    .toLowerCase()
    .replace(/&#\d+;/g, '')   // strip HTML entities
    .replace(/\[[^\]]*\]/g, '') // strip [d 1] style markers
    .replace(/\s+/g, ' ')
    .trim();
}

// Look up existing wiki row by item name (case/entity-insensitive)
function findWikiRow(existingRows, itemName) {
  const norm = normalise(itemName);
  return existingRows.find(r => normalise(r['Item'] || '') === norm);
}

// ── Rebuild function ─────────────────────────────────────────────────────────

const REGION_NAME_MAP = {
  Varlamore:  'Varlamore',
  Karamja:    'Karamja',
  Asgarnia:   'Asgarnia',
  Fremennik:  'Fremennik Province',
  Kandarin:   'Kandarin',
  Desert:     'Kharidian Desert',
  Morytania:  'Morytania',
  Tirannwn:   'Tirannwn',
  Wilderness: 'Wilderness',
  Kourend:    'Kebos and Kourend',
  Misthalin:  'Misthalin',
};

function rebuildDrops(data) {
  for (const [gearRegion, jsonKey] of Object.entries(REGION_NAME_MAP)) {
    const items = gearByRegion[gearRegion];
    if (!items || items.length === 0) continue;

    const regionData = data[jsonKey];
    if (!regionData) {
      console.warn(`  ⚠ No JSON entry for "${jsonKey}"`);
      continue;
    }

    const existingRows = regionData['Notable drops']?.['_content']?.rows ?? [];

    const newRows = items.map(item => {
      if (item.echo) {
        return {
          col0: '',
          Item: item.name,
          Source: 'Echo drop',
          BaseRarity: 'N/A',
          '2x DropMultiplier': 'N/A',
          '5x DropMultiplier': 'N/A',
        };
      }
      const wiki = findWikiRow(existingRows, item.name);
      return {
        col0: '',
        Item: item.name,
        Source: wiki?.['Source'] ?? '',
        BaseRarity: wiki?.['BaseRarity'] ?? 'N/A',
        '2x DropMultiplier': wiki?.['2x DropMultiplier'] ?? 'N/A',
        '5x DropMultiplier': wiki?.['5x DropMultiplier'] ?? 'N/A',
      };
    });

    if (!regionData['Notable drops']) regionData['Notable drops'] = {};
    regionData['Notable drops']['_content'] = { type: 'table', rows: newRows };
    console.log(`  ✓ ${jsonKey} — ${newRows.length} items (${items.filter(i => i.echo).length} echo)`);
  }
}

// ── Process and write both files ─────────────────────────────────────────────

for (const p of JSON_PATHS) {
  const data = JSON.parse(readFileSync(p, 'utf8'));
  rebuildDrops(data);
  writeFileSync(p, JSON.stringify(data, null, 2), 'utf8');
  console.log(`  → written: ${p.split(/[\\/]/).pop()}\n`);
}
console.log('✅ Done');
