/**
 * Scrapes shop stock for all Leagues regions from the OSRS Wiki.
 *
 * Flow per region:
 *   1. Fetch the main region wiki page
 *   2. Find sub-location links in Geography / Settlements sections
 *   3. For each sub-location page → find shop links
 *   4. For each shop page → extract stock table (must have "Price sold at" column)
 *
 * Usage: node scripts/crawler.mjs [output.json]
 * Default output: scripts/all-shops.json
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Optional: node scripts/crawler.mjs [--region RegionName] [output.json]
// e.g.  node scripts/crawler.mjs --region Varlamore
//       node scripts/crawler.mjs --region Asgarnia scripts/asgarnia-shops.json
let regionFilter = null;
let outputArg = null;
for (let i = 2; i < process.argv.length; i++) {
  if (process.argv[i] === '--region') {
    regionFilter = process.argv[++i];
  } else {
    outputArg = process.argv[i];
  }
}
const outputFile = outputArg ?? resolve(__dirname, regionFilter ? `${regionFilter.toLowerCase()}-shops.json` : 'all-shops.json');

const WIKI_API  = 'https://oldschool.runescape.wiki/api.php';
const WIKI_BASE = 'https://oldschool.runescape.wiki';
const HEADERS   = { 'User-Agent': 'OSRS-Leagues-Planner/1.0 (shop-scraper; local)' };
const RATE_MS   = 300;

// Map from app region name → OSRS wiki page title (Misthalin excluded)
const REGIONS = [
  { name: 'Varlamore',  wiki: 'Varlamore' },
  { name: 'Karamja',   wiki: 'Karamja' },
  { name: 'Asgarnia',  wiki: 'Asgarnia' },
  { name: 'Fremennik', wiki: 'Fremennik Province' },
  { name: 'Kandarin',  wiki: 'Kandarin' },
  { name: 'Desert',    wiki: 'Kharidian Desert' },
  { name: 'Morytania', wiki: 'Morytania' },
  { name: 'Tirannwn',  wiki: 'Tirannwn' },
  { name: 'Wilderness',wiki: 'Wilderness' },
  { name: 'Kourend',   wiki: 'Great Kourend' },
];

// Headings to look in when finding sub-locations on a region page
const LOCATION_SECTION_KEYWORDS = [
  'geography', 'location', 'locations', 'settlement', 'town', 'city', 'cities', 'village',
  'northern', 'southern', 'eastern', 'western', 'central',
  'area', 'island', 'landmark', 'community', 'places',
];

// Section titles that are too generic to be sub-location page names
const GENERIC_SECTION_TITLES = new Set([
  'Free', 'Members', 'Free-to-play', 'Members-only', 'Dungeons', 'Gallery',
  'Other', 'References', 'Trivia', 'History', 'Music', 'Changes', 'Quests',
  'Miniquests', 'Development history', 'Concept art', 'Notes', 'See also',
]);

// Headings to look in when finding shops on a sub-location page
// "stall" covers gem/fish/silk stalls; "building"/"buildings" covers general building lists
const SHOP_KEYWORDS = [
  'shop', 'store', 'general store', 'supplies', 'merchant', 'trader', 'market',
  'stall', 'stalls', 'building', 'buildings',
];

const SKIP_PREFIXES = ['File:', 'Category:', 'Template:', 'Help:', 'RuneScape:', 'User:', 'Talk:', 'Special:'];

// Pages that are never sub-locations (too generic or non-geographic)
const SKIP_PAGES = new Set([
  'RuneScape', 'OSRS', 'Old School RuneScape', 'Gielinor', 'Members',
  'Free-to-play', 'Quest', 'Skill', 'Combat', 'Prayer', 'Magic',
]);

// Extra sub-locations that can't be discovered through section scanning alone
const REGION_EXTRA_LOCATIONS = {
  Asgarnia:   ['Dwarven Mine'],
  // Wilderness page has no settlement/geography sections; Bandit Camp has the only notable shops
  Wilderness: ['Bandit Camp (Wilderness)'],
};

// Manual shops to always check for specific sub-location pages
// Used when a shop page isn't discoverable through section link extraction
const MANUAL_LOCATION_SHOPS = {
  // Aemad's and West Ardougne General Store are only in References/Buildings sections
  // Ardougne Gem Stall: stalls section links to generic "Gem stall" article, not the specific shop page
  Ardougne: ["Aemad's Adventuring Supplies", 'West Ardougne General Store', 'Ardougne Gem Stall'],
  // Tirannwn: Lletya has no shop-keyword sections; shops must be injected directly
  Lletya:   ['Lletya Archery Shop', 'Lletya Food Store', 'Lletya General Store', 'Lletya Seamstress'],
  // Prifddinas: shop pages are spread across district sub-sections with no "Shops" heading
  Prifddinas: [
    "Amlodd's Magical Supplies", 'Hefin Inn', "Iorwerth's Arms",
    'Prifddinas Foodstuffs', 'Prifddinas Gem Stall', 'Prifddinas General Store',
    'Prifddinas Herbal Supplies', 'Prifddinas Silver Stall', 'Prifddinas Spice Stall',
    "Prifddinas' Seamstress",
  ],
  // Wilderness Bandit Camp — two shops discoverable by section but also injected for safety
  'Bandit Camp (Wilderness)': ['Bandit Bargains', 'Bandit Duty Free'],
};


function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function fetchJSON(url) {
  const res = await fetch(url, { headers: HEADERS });
  return res.json();
}

// ── HTML helpers ─────────────────────────────────────────────────────────────

function stripTags(html) {
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, c) => String.fromCharCode(Number(c)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/\[[^\]]{0,10}\]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseTable(html) {
  const headers = [];
  const allRows = [...html.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)];
  const headerRow = allRows.find(r => /<th/i.test(r[1]));
  if (headerRow) {
    const thRe = /<th([^>]*)>([\s\S]*?)<\/th>/gi;
    let m;
    while ((m = thRe.exec(headerRow[1])) !== null) {
      const colspan = parseInt(m[1].match(/colspan="?(\d+)"?/i)?.[1] ?? '1');
      const text = m[2].replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
      headers.push(text);
      for (let c = 1; c < colspan; c++) headers.push('');
    }
  }

  const rows = [];
  const trRe = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  let m;
  while ((m = trRe.exec(html)) !== null) {
    const rowHtml = m[1];
    if (!/<td/i.test(rowHtml)) continue;
    const cells = [];
    const cellRe = /<(?:td|th)[^>]*>([\s\S]*?)<\/(?:td|th)>/gi;
    let td;
    while ((td = cellRe.exec(rowHtml)) !== null)
      cells.push(stripTags(td[1]).trim());
    if (!cells.length) continue;
    if (headers.length) {
      const row = {};
      headers.forEach((h, i) => { row[h || `_col${i}`] = cells[i] ?? ''; });
      rows.push(row);
    } else {
      rows.push(cells);
    }
  }

  // Merge colspan-expanded Item columns: image cell (stripped to empty) + name cell
  const itemIdx = headers.indexOf('Item');
  if (itemIdx !== -1 && headers[itemIdx + 1] === '') {
    const nameKey = `_col${itemIdx + 1}`;
    if (rows.every(r => !r['Item']) && rows.some(r => r[nameKey])) {
      rows.forEach(r => { r['Item'] = r[nameKey] ?? ''; delete r[nameKey]; });
      headers.splice(itemIdx + 1, 1);
    }
  }

  return { headers, rows };
}

// ── Level 1: find sub-location links from a region page ──────────────────────

async function fetchSubLocations(regionWiki) {
  // Step A: get section hierarchy to find sub-location names from headings
  const secUrl = `${WIKI_API}?action=parse&page=${encodeURIComponent(regionWiki)}&prop=sections&redirects=1&format=json`;
  const secData = await fetchJSON(secUrl);
  if (secData.error) return [];
  const sections = secData.parse?.sections ?? [];

  const subLocations = new Set();
  const matchedSecIndices = [];

  for (let i = 0; i < sections.length; i++) {
    const sec = sections[i];
    const headingText = sec.line.replace(/&amp;/g, '&').replace(/<[^>]+>/g, '').trim().toLowerCase();
    if (!LOCATION_SECTION_KEYWORDS.some(kw => headingText.includes(kw))) continue;

    // Collect descendant section titles — their heading names ARE the location page names
    const parentLevel = sec.toclevel;
    let j = i + 1;
    while (j < sections.length && sections[j].toclevel > parentLevel) {
      const title = sections[j].line.replace(/&amp;/g, '&').replace(/<[^>]+>/g, '').trim();
      if (!SKIP_PAGES.has(title) && !GENERIC_SECTION_TITLES.has(title)) {
        subLocations.add(title);
      }
      j++;
    }

    matchedSecIndices.push(sec.index);
  }

  // Step B: fetch each matched section's HTML to extract <li> linked pages
  // (covers regions like Asgarnia, Desert, Tirannwn where locations appear as list items)
  for (const secIndex of matchedSecIndices) {
    await sleep(RATE_MS);
    const htmlUrl = `${WIKI_API}?action=parse&page=${encodeURIComponent(regionWiki)}&prop=text&section=${secIndex}&redirects=1&format=json`;
    const htmlData = await fetchJSON(htmlUrl);
    const html = htmlData?.parse?.text?.['*'] ?? '';

    for (const li of html.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)) {
      const firstLink = /href="\/w\/([^"#?]+)"/.exec(li[1]);
      if (!firstLink) continue;
      const title = decodeURIComponent(firstLink[1]).replace(/_/g, ' ');
      if (SKIP_PREFIXES.some(p => title.startsWith(p))) continue;
      if (SKIP_PAGES.has(title) || GENERIC_SECTION_TITLES.has(title)) continue;
      subLocations.add(title);
    }
  }

  return [...subLocations];
}

// ── Level 2: find shop links from a sub-location page ────────────────────────

async function fetchShopLinks(pageTitle) {
  // Step A: get section list via sections API
  const secUrl = `${WIKI_API}?action=parse&page=${encodeURIComponent(pageTitle)}&prop=sections&redirects=1&format=json`;
  const secData = await fetchJSON(secUrl);
  if (secData.error) return [];
  const sections = secData.parse?.sections ?? [];

  const shopTitles = new Set();

  // Seed with any manual overrides for this location
  for (const s of (MANUAL_LOCATION_SHOPS[pageTitle] ?? [])) shopTitles.add(s);

  const htmlSectionsToFetch = [];

  for (let i = 0; i < sections.length; i++) {
    const sec = sections[i];
    const headingText = sec.line.replace(/&amp;/g, '&').replace(/<[^>]+>/g, '').trim().toLowerCase();

    const isShopSection     = SHOP_KEYWORDS.some(kw => headingText.includes(kw));
    const isLocationSection = LOCATION_SECTION_KEYWORDS.some(kw => headingText.includes(kw));

    // For location sections: collect child section titles as candidate shops.
    // This handles pages like Mistrock where shops (Stick Your Ore Inn, etc.)
    // appear as sub-section headings under "Locations" rather than as links.
    if (isLocationSection) {
      const parentLevel = sec.toclevel;
      let j = i + 1;
      while (j < sections.length && sections[j].toclevel > parentLevel) {
        const title = sections[j].line.replace(/&amp;/g, '&').replace(/<[^>]+>/g, '').trim();
        if (!SKIP_PAGES.has(title) && !GENERIC_SECTION_TITLES.has(title)) {
          shopTitles.add(title);
        }
        j++;
      }
    }

    // For shop sections: fetch HTML and extract links
    if (isShopSection) {
      htmlSectionsToFetch.push(sec.index);
    }
  }

  // Step B: fetch section HTML for all shop-keyword sections and extract links
  for (const secIndex of htmlSectionsToFetch) {
    await sleep(RATE_MS);
    const htmlUrl = `${WIKI_API}?action=parse&page=${encodeURIComponent(pageTitle)}&prop=text&section=${secIndex}&redirects=1&format=json`;
    const htmlData = await fetchJSON(htmlUrl);
    const html = htmlData?.parse?.text?.['*'] ?? '';

    const linkRe = /href="\/w\/([^"#?]+)"/gi;
    for (const link of html.matchAll(linkRe)) {
      // Strip trailing period — some wiki page links have a period appended in-sentence
      const decoded = decodeURIComponent(link[1].replace(/_/g, ' ')).replace(/\.$/, '');
      if (SKIP_PREFIXES.some(p => decoded.startsWith(p))) continue;
      if (SKIP_PAGES.has(decoded) || GENERIC_SECTION_TITLES.has(decoded)) continue;
      shopTitles.add(decoded);
    }
  }

  return [...shopTitles];
}

// ── Level 3: scrape stock table from an individual shop page ─────────────────
// Only returns data if a wikitable has BOTH an "Item" column AND a "Price sold at"
// column. This filters out pickpocket loot tables, drop tables, skill training
// tables, etc. which have "Item" but no price column.

async function fetchShopStock(shopTitle) {
  const url = `${WIKI_API}?action=parse&page=${encodeURIComponent(shopTitle)}&prop=text|categories&disabletoc=1&redirects=1&format=json`;
  const data = await fetchJSON(url);
  if (data.error) return null;
  const html = data?.parse?.text?.['*'];
  if (!html) return null;

  // Skip NPC pages (character articles that embed shop stock but aren't shop pages).
  // NPC pages are in the "Non-player_characters" category; shop pages are in "Shops".
  // If the page was reached via a redirect we trust the destination regardless of category.
  const wasRedirected = (data.parse?.redirects ?? []).length > 0;
  const categories = (data.parse?.categories ?? []).map(c => c['*'] ?? '');
  if (!wasRedirected && categories.some(c => c === 'Non-player_characters')) return null;

  const stockTables = [];
  for (const match of html.matchAll(/<table[^>]*class="[^"]*wikitable[^"]*"[^>]*>/gi)) {
    const start = match.index;
    const end = html.indexOf('</table>', start) + 8;
    const tableHtml = html.slice(start, end);
    const { headers, rows } = parseTable(tableHtml);
    // Require both "Item" and "sold at" columns.
    // Shop stock tables always have "Price sold at"; loot/drop tables only have "Price" (GE value).
    if (
      headers.some(h => /item/i.test(h)) &&
      headers.some(h => /sold at/i.test(h)) &&
      rows.length
    ) {
      stockTables.push({ columns: headers, stock: rows });
    }
  }

  const introText = stripTags(html.match(/<p[^>]*>([\s\S]*?)<\/p>/i)?.[1] ?? '').slice(0, 300);
  // Strip trailing period from wiki page titles (some pages are named "Shop Name." with a period).
  // Use the original shopTitle (cleaned) as display name since resolved redirects can have generic names
  // (e.g. "Wydin's Food Store" resolves to the generic "Food Store" page).
  const resolvedTitle = (data.parse?.title ?? shopTitle).replace(/\.$/, '');
  const displayName = shopTitle.replace(/\.$/, '');
  return stockTables.length ? { resolvedTitle, displayName, description: introText, stockTables } : null;
}

// ── Main ─────────────────────────────────────────────────────────────────────

// Regions whose data is locked — the crawler will copy existing data and skip re-crawling.
// To re-crawl a locked region use: node scripts/crawler.mjs --region <Name>
const LOCKED_REGIONS = new Set([
  'Varlamore', 'Karamja', 'Asgarnia', 'Fremennik', 'Kandarin',
  'Desert', 'Morytania', 'Tirannwn', 'Kourend',
]);

// Load existing output to preserve locked region data
const existingData = existsSync(outputFile)
  ? JSON.parse(readFileSync(outputFile, 'utf8'))
  : { regions: {} };

const output = {
  scrapedAt: new Date().toISOString(),
  regions: { ...existingData.regions },
};

const visitedShops = new Set();

const regionsToRun = regionFilter
  ? REGIONS.filter(r => r.name.toLowerCase() === regionFilter.toLowerCase())
  : REGIONS.filter(r => !LOCKED_REGIONS.has(r.name));

if (regionFilter && !regionsToRun.length) {
  console.error(`Unknown region "${regionFilter}". Valid names: ${REGIONS.map(r => r.name).join(', ')}`);
  process.exit(1);
}

// Log any regions being skipped due to lock
if (!regionFilter) {
  const locked = REGIONS.filter(r => LOCKED_REGIONS.has(r.name)).map(r => r.name);
  if (locked.length) console.log(`Locked (skipping): ${locked.join(', ')}\n`);
}

for (let ri = 0; ri < regionsToRun.length; ri++) {
  const { name: regionName, wiki: regionWiki } = regionsToRun[ri];
  console.log(`\n${'═'.repeat(60)}`);
  console.log(`[${ri + 1}/${REGIONS.length}] ${regionName} (${regionWiki})`);

  // Step 1: find sub-locations
  process.stdout.write(`  Finding sub-locations… `);
  const subLocations = await fetchSubLocations(regionWiki);
  await sleep(RATE_MS);

  // Add any manual extra locations for this region
  const extras = REGION_EXTRA_LOCATIONS[regionName] ?? [];
  for (const e of extras) if (!subLocations.includes(e)) subLocations.push(e);

  console.log(`${subLocations.length} found`);

  if (!subLocations.length) {
    console.log('  (no sub-locations — skipping)');
    continue;
  }

  const regionLocations = [];

  for (const subLoc of subLocations) {
    // Step 2: find shops in this sub-location
    process.stdout.write(`  ↳ ${subLoc} — finding shops… `);
    const shopNames = await fetchShopLinks(subLoc);
    await sleep(RATE_MS);

    if (!shopNames.length) {
      console.log('none');
      continue;
    }
    console.log(`${shopNames.length} candidate(s)`);

    const locationShops = [];

    for (const shopTitle of shopNames) {
      if (visitedShops.has(shopTitle)) {
        console.log(`      [skip] ${shopTitle} (already scraped)`);
        continue;
      }

      // Step 3: scrape shop stock
      process.stdout.write(`      ${shopTitle} … `);
      const shopData = await fetchShopStock(shopTitle);
      await sleep(RATE_MS);

      if (shopData) {
        // Deduplicate by resolved title — catches redirect aliases like "Wydin" → "Wydin's Food Store"
        if (visitedShops.has(shopData.resolvedTitle)) {
          console.log(`[skip — redirect to "${shopData.resolvedTitle}"]`);
          visitedShops.add(shopTitle);
          continue;
        }
        visitedShops.add(shopTitle);
        visitedShops.add(shopData.resolvedTitle);

        const total = shopData.stockTables.reduce((n, t) => n + t.stock.length, 0);
        console.log(`${total} item(s)`);
        const { resolvedTitle, displayName, ...rest } = shopData;
        locationShops.push({
          name: displayName,
          wikiUrl: `${WIKI_BASE}/w/${encodeURIComponent(resolvedTitle.replace(/ /g, '_'))}`,
          ...rest,
        });
      } else {
        visitedShops.add(shopTitle);
        console.log('no stock');
      }
    }

    if (locationShops.length) {
      regionLocations.push({
        location: subLoc,
        wikiUrl: `${WIKI_BASE}/w/${encodeURIComponent(subLoc.replace(/ /g, '_'))}`,
        shops: locationShops,
      });
    }
  }

  if (regionLocations.length) {
    output.regions[regionName] = {
      wikiUrl: `${WIKI_BASE}/w/${encodeURIComponent(regionWiki.replace(/ /g, '_'))}`,
      locations: regionLocations,
    };
  }
}

const totalShops = Object.values(output.regions).reduce((n, r) => n + r.locations.reduce((m, l) => m + l.shops.length, 0), 0);
console.log(`\n${'═'.repeat(60)}`);
console.log(`✅ Done — ${visitedShops.size} shops visited, ${totalShops} with stock across ${Object.keys(output.regions).length} regions → ${outputFile}`);

const json = JSON.stringify(output, null, 2);
writeFileSync(outputFile, json, 'utf8');

// Keep src/data/region/all-shops.json in sync when writing to the canonical output
const srcDataFile = resolve(__dirname, '../src/data/region/all-shops.json');
if (outputFile === resolve(__dirname, 'all-shops.json') && existsSync(resolve(__dirname, '../src/data/region'))) {
  writeFileSync(srcDataFile, json, 'utf8');
}
