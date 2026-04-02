/**
 * crosscheck-gear.mjs
 *
 * Compares local gear bonus data against the OSRS Wiki item API.
 *
 * Usage:
 *   node scripts/crosscheck-gear.mjs
 *   node scripts/crosscheck-gear.mjs --slot weapon
 *   node scripts/crosscheck-gear.mjs --item "Abyssal whip"
 *
 * The script fetches wikitext for each item, parses the {{Infobox Bonuses}}
 * template, and reports any mismatches between wiki values and local data.
 */

import { fileURLToPath } from 'url';
import { dirname, resolve, join } from 'path';
import { pathToFileURL } from 'url';

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

// ── CLI args ─────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const slotFilter = args.includes('--slot')  ? args[args.indexOf('--slot')  + 1] : null;
const itemFilter = args.includes('--item')  ? args[args.indexOf('--item')  + 1] : null;

const items = ALL_GEAR.filter(item => {
  if (slotFilter && item.slot !== slotFilter) return false;
  if (itemFilter && item.name.toLowerCase() !== itemFilter.toLowerCase()) return false;
  return true;
});

console.log(`Checking ${items.length} item(s)…\n`);

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
