/**
 * crosscheck-gear.mjs
 *
 * Compares local gear bonus data against the OSRS Wiki item API.
 *
 * Usage:
 *   node scripts/crosscheck-gear.mjs
 *   node scripts/crosscheck-gear.mjs --slot weapon
 *   node scripts/crosscheck-gear.mjs --item "Abyssal whip"
 *   node scripts/crosscheck-gear.mjs --add "Dragon boots"
 *
 * The script fetches wikitext for each item, parses the {{Infobox Bonuses}}
 * template, and reports any mismatches between wiki values and local data.
 *
 * --add mode: looks up an item on the wiki, shows its stats, and interactively
 * prompts for slot/regions/requirements before appending it to the gear file.
 */

import { fileURLToPath } from 'url';
import { dirname, resolve, join } from 'path';
import { pathToFileURL } from 'url';
import { readFileSync, writeFileSync } from 'fs';
import rl from 'readline/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);

// ── Load gear data via dynamic import ───────────────────────────────────────
// The gear files use `export const` ES module syntax, so we use import().
function gearUrl(file) {
  return pathToFileURL(resolve(__dirname, '../src/data/gear', file)).href;
}

const { HEAD }   = await import(gearUrl('head.js'));
const { BODY }   = await import(gearUrl('body.js'));
const { LEGS }   = await import(gearUrl('legs.js'));
const { HANDS }  = await import(gearUrl('hands.js'));
const { FEET }   = await import(gearUrl('feet.js'));
const { CAPE }   = await import(gearUrl('cape.js'));
const { NECK }   = await import(gearUrl('neck.js'));
const { RING }   = await import(gearUrl('ring.js'));
const { WEAPON } = await import(gearUrl('weapon.js'));
const { SHIELD } = await import(gearUrl('shield.js'));
const { AMMO }   = await import(gearUrl('ammo.js'));

const ALL_GEAR = [
  ...HEAD, ...BODY, ...LEGS, ...HANDS, ...FEET,
  ...CAPE, ...NECK, ...RING, ...WEAPON, ...SHIELD, ...AMMO,
];

// ── Shared logic (field map, parser, comparator) ─────────────────────────────
const { FIELD_MAP, parseInfoboxBonuses, compareItem } = await import(
  pathToFileURL(resolve(__dirname, '../src/utils/gearCrosscheck.js')).href
);

// ── Wiki fetch helpers ────────────────────────────────────────────────────────
const WIKI_API = 'https://oldschool.runescape.wiki/api.php';
const USER_AGENT = 'LeaguesPlannerCrosscheck/1.0 (github.com/AJCollard; crosscheck script)';

async function fetchWikitextByTitle(title) {
  const url = new URL(WIKI_API);
  url.searchParams.set('action',    'query');
  url.searchParams.set('titles',    title);
  url.searchParams.set('redirects', '1');   // follow redirects automatically
  url.searchParams.set('prop',      'revisions');
  url.searchParams.set('rvslots',   'main');
  url.searchParams.set('rvprop',    'content');
  url.searchParams.set('format',    'json');
  url.searchParams.set('formatversion', '2');

  const res = await fetch(url.toString(), {
    headers: { 'User-Agent': USER_AGENT },
  });

  if (!res.ok) throw new Error(`HTTP ${res.status} for "${title}"`);

  const json = await res.json();
  const pages = json?.query?.pages ?? [];
  const page  = Array.isArray(pages) ? pages[0] : Object.values(pages)[0];

  if (!page || page.missing) return null;
  return page?.revisions?.[0]?.slots?.main?.content ?? null;
}

/**
 * Tries several title variants:
 *   1. Exact name as stored in local data
 *   2. Wiki title case: first letter uppercase, rest as-is
 *   3. All words title-cased → all-lowercase after first word
 *      e.g. "Torva Full Helm" → "Torva full helm"
 */
async function fetchWikitext(itemName) {
  // Variant 1: exact
  let text = await fetchWikitextByTitle(itemName);
  if (text) return text;

  // Variant 2: lowercase everything after the first character
  const lcAfterFirst = itemName[0].toUpperCase() + itemName.slice(1).toLowerCase();
  if (lcAfterFirst !== itemName) {
    text = await fetchWikitextByTitle(lcAfterFirst);
    if (text) return text;
    await sleep(150);
  }

  // Variant 3: only first word capitalised, rest lowercase
  const words = itemName.split(' ');
  const firstWordOnly = words[0][0].toUpperCase() + words[0].slice(1).toLowerCase()
    + (words.length > 1 ? ' ' + words.slice(1).join(' ').toLowerCase() : '');
  if (firstWordOnly !== itemName && firstWordOnly !== lcAfterFirst) {
    text = await fetchWikitextByTitle(firstWordOnly);
    if (text) return text;
    await sleep(150);
  }

  return null;
}

// ── Rate-limit helper (avoid hammering the wiki) ──────────────────────────────
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ── CLI args ─────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const slotFilter = args.includes('--slot')  ? args[args.indexOf('--slot')  + 1] : null;
const itemFilter = args.includes('--item')  ? args[args.indexOf('--item')  + 1] : null;
const addName    = args.includes('--add')   ? args[args.indexOf('--add')   + 1] : null;

// ── --add mode ────────────────────────────────────────────────────────────────
if (addName) {
  const VALID_SLOTS = ['head','body','legs','hands','feet','cape','neck','ring','weapon','shield','ammo'];
  const SLOT_FILES  = {
    head: 'head.js', body: 'body.js', legs: 'legs.js', hands: 'hands.js',
    feet: 'feet.js', cape: 'cape.js', neck: 'neck.js', ring: 'ring.js',
    weapon: 'weapon.js', shield: 'shield.js', ammo: 'ammo.js',
  };
  const EXPORT_NAMES = {
    head: 'HEAD', body: 'BODY', legs: 'LEGS', hands: 'HANDS', feet: 'FEET',
    cape: 'CAPE', neck: 'NECK', ring: 'RING', weapon: 'WEAPON', shield: 'SHIELD', ammo: 'AMMO',
  };

  // Check for duplicate
  const existing = ALL_GEAR.find(g => g.name.toLowerCase() === addName.toLowerCase());
  if (existing) {
    console.log(`"${addName}" already exists in local data (slot: ${existing.slot}).`);
    process.exit(0);
  }

  // Fetch wiki stats
  console.log(`Fetching wiki data for "${addName}"…\n`);
  let wikitext;
  try {
    wikitext = await fetchWikitext(addName);
  } catch (err) {
    console.error(`Fetch error: ${err.message}`);
    process.exit(1);
  }

  if (!wikitext) {
    console.error(`Could not find "${addName}" on the wiki.`);
    process.exit(1);
  }

  const wikiStats = parseInfoboxBonuses(wikitext);
  if (!wikiStats) {
    console.error(`No {{Infobox Bonuses}} found for "${addName}".`);
    process.exit(1);
  }

  // Build bonuses object from wiki stats
  const bonuses = { attack: {}, defence: {}, other: {} };
  for (const [wikiKey, [cat, localKey]] of Object.entries(FIELD_MAP)) {
    const val = wikiStats[wikiKey] ?? 0;
    bonuses[cat][localKey] = val;
  }

  // Display parsed stats
  console.log(`Stats for "${addName}":`);
  console.log(`  Attack:  stab=${bonuses.attack.stab}  slash=${bonuses.attack.slash}  crush=${bonuses.attack.crush}  magic=${bonuses.attack.magic}  ranged=${bonuses.attack.ranged}`);
  console.log(`  Defence: stab=${bonuses.defence.stab}  slash=${bonuses.defence.slash}  crush=${bonuses.defence.crush}  magic=${bonuses.defence.magic}  ranged=${bonuses.defence.ranged}`);
  console.log(`  Other:   meleeStr=${bonuses.other.meleeStrength}  rangedStr=${bonuses.other.rangedStrength}  magicDmg=${bonuses.other.magicDamage}  prayer=${bonuses.other.prayer}`);
  console.log();

  const readline = rl.createInterface({ input: process.stdin, output: process.stdout });

  // Prompt for slot
  let slot;
  while (!slot) {
    const answer = (await readline.question(`Slot (${VALID_SLOTS.join('/')}): `)).trim().toLowerCase();
    if (VALID_SLOTS.includes(answer)) {
      slot = answer;
    } else {
      console.log(`  Invalid slot. Choose from: ${VALID_SLOTS.join(', ')}`);
    }
  }

  // Prompt for regions
  let regions = [];
  while (regions.length === 0) {
    const answer = (await readline.question('Regions (comma-separated, e.g. Asgarnia,Kandarin): ')).trim();
    if (answer) {
      regions = answer.split(',').map(r => r.trim()).filter(Boolean);
    } else {
      console.log('  At least one region is required.');
    }
  }

  // Prompt for requirements (optional)
  const requirements = [];
  const reqInput = (await readline.question('Requirements (e.g. Defence 70, Attack 75) or leave blank: ')).trim();
  if (reqInput) {
    for (const part of reqInput.split(',')) {
      const m = part.trim().match(/^(.+?)\s+(\d+)$/);
      if (m) {
        requirements.push({ skill: m[1].trim(), level: parseInt(m[2], 10) });
      } else {
        console.log(`  Skipping unrecognised requirement: "${part.trim()}"`);
      }
    }
  }

  // Prompt for echo item
  const echoAnswer = (await readline.question('Is this an echo item? (y/n): ')).trim().toLowerCase();
  const isEcho = echoAnswer === 'y' || echoAnswer === 'yes';

  // Prompt for special effect
  const effectAnswer = (await readline.question('Does this item have a special effect? (y/n): ')).trim().toLowerCase();
  let effect = null;
  if (effectAnswer === 'y' || effectAnswer === 'yes') {
    const effectDesc = (await readline.question('Effect description: ')).trim();
    effect = { type: 'multiply_totals', stats: [], description: effectDesc };
  }

  readline.close();

  // Serialise the new item
  const reqStr = requirements.length > 0
    ? `[${requirements.map(r => `{ skill: '${r.skill}', level: ${r.level} }`).join(', ')}]`
    : '[]';
  const regStr = `[${regions.map(r => `'${r}'`).join(', ')}]`;

  const itemLines = [
    `  {`,
    ...(isEcho ? [`    echo: true,`] : []),
    `    name: ${JSON.stringify(addName)},`,
    `    slot: '${slot}',`,
    `    regions: ${regStr},`,
    `    requirements: ${reqStr},`,
    `    bonuses: {`,
    `      attack:  { stab: ${bonuses.attack.stab}, slash: ${bonuses.attack.slash}, crush: ${bonuses.attack.crush}, magic: ${bonuses.attack.magic}, ranged: ${bonuses.attack.ranged} },`,
    `      defence: { stab: ${bonuses.defence.stab}, slash: ${bonuses.defence.slash}, crush: ${bonuses.defence.crush}, magic: ${bonuses.defence.magic}, ranged: ${bonuses.defence.ranged} },`,
    `      other:   { meleeStrength: ${bonuses.other.meleeStrength}, rangedStrength: ${bonuses.other.rangedStrength}, magicDamage: ${bonuses.other.magicDamage}, prayer: ${bonuses.other.prayer} },`,
    `    },`,
    ...(effect ? [`    effect: { type: '${effect.type}', stats: [], description: ${JSON.stringify(effect.description)} },`] : []),
    `  },`,
  ];
  const itemEntry = itemLines.join('\n');

  // Append to gear file before the closing `];`
  const gearFilePath = resolve(__dirname, '../src/data/gear', SLOT_FILES[slot]);
  const exportName = EXPORT_NAMES[slot];
  let src = readFileSync(gearFilePath, 'utf8');

  // Find last `];` to insert before
  const insertIdx = src.lastIndexOf('];');
  if (insertIdx === -1) {
    console.error(`Could not find closing ]; in ${SLOT_FILES[slot]}`);
    process.exit(1);
  }

  src = src.slice(0, insertIdx) + itemEntry + '\n' + src.slice(insertIdx);
  writeFileSync(gearFilePath, src, 'utf8');

  console.log(`\nAdded "${addName}" to src/data/gear/${SLOT_FILES[slot]}`);
  process.exit(0);
}

const items = ALL_GEAR.filter(item => {
  if (slotFilter && item.slot !== slotFilter) return false;
  if (itemFilter && item.name.toLowerCase() !== itemFilter.toLowerCase()) return false;
  return true;
});

console.log(`Checking ${items.length} item(s)…\n`);

// ── Main ──────────────────────────────────────────────────────────────────────
let totalMismatches = 0;
let totalMissing    = 0;
let totalOk         = 0;

for (const item of items) {
  let wikitext;
  try {
    wikitext = await fetchWikitext(item.name);
  } catch (err) {
    console.warn(`  [FETCH ERROR] ${item.name}: ${err.message}`);
    await sleep(300);
    continue;
  }

  if (!wikitext) {
    console.log(`  [NOT FOUND]   ${item.name}`);
    totalMissing++;
    await sleep(200);
    continue;
  }

  const wikiStats = parseInfoboxBonuses(wikitext);
  if (!wikiStats) {
    console.log(`  [NO INFOBOX]  ${item.name} — no {{Infobox Bonuses}} found`);
    totalMissing++;
    await sleep(200);
    continue;
  }

  const diffs = compareItem(item, wikiStats);

  if (diffs.length === 0) {
    console.log(`  [OK]          ${item.name}`);
    totalOk++;
  } else {
    totalMismatches++;
    console.log(`\n  [MISMATCH]    ${item.name} (slot: ${item.slot})`);
    for (const d of diffs) {
      const label = FIELD_MAP[d.field]?.join('.') ?? d.field;
      console.log(`                  ${label.padEnd(22)} local=${String(d.local).padStart(6)}  wiki=${String(d.wiki).padStart(6)}`);
    }
    console.log();
  }

  await sleep(250); // ~4 req/s — well within wiki limits
}

// ── Summary ───────────────────────────────────────────────────────────────────
const okLabel      = `✔  OK: ${totalOk}`;
const mismatchLabel = `✘  Mismatches: ${totalMismatches}`;
const missingLabel  = `?  Not found / no infobox: ${totalMissing}`;
const summaryLine  = `  ${okLabel}   ${mismatchLabel}   ${missingLabel}`;

console.log('─'.repeat(60));
console.log(summaryLine);
console.log('─'.repeat(60));
