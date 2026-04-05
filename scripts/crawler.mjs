/**
 * Scrapes shop stock from Varlamore sub-locations on the OSRS Wiki.
 *
 * Flow:
 *   1. Each hardcoded sub-location page → find shop links in Shops sections
 *   2. Each shop page → extract full stock table
 *
 * Usage: node scripts/crawler.mjs [output.json]
 * Default output: scripts/varlamore-shops.json
 */

import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outputFile = process.argv[2] ?? resolve(__dirname, 'varlamore-shops.json');

const WIKI_API  = 'https://oldschool.runescape.wiki/api.php';
const WIKI_BASE = 'https://oldschool.runescape.wiki';
const HEADERS   = { 'User-Agent': 'OSRS-Leagues-Planner/1.0 (varlamore-shop-scraper; local)' };
const RATE_MS   = 300;

const SUB_LOCATIONS = [
  'Civitas illa Fortis',
  'Avium Savannah',
  'Hailstorm Mountains',
  'Aldarin',
  'Auburn Valley',
  'Tlati Rainforest',
];

const SHOP_KEYWORDS = ['shop', 'store', 'general store', 'supplies', 'merchant', 'trader', 'market'];
const SKIP_PREFIXES = ['File:', 'Category:', 'Template:', 'Help:', 'RuneScape:', 'User:', 'Talk:', 'Special:'];


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
    const thRe = /<th[^>]*>([\s\S]*?)<\/th>/gi;
    let m;
    while ((m = thRe.exec(headerRow[1])) !== null)
      headers.push(m[1].replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim());
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
      headers.forEach((h, i) => { row[h || `col${i}`] = cells[i] ?? ''; });
      rows.push(row);
    } else {
      rows.push(cells);
    }
  }
  return { headers, rows };
}

// ── Level 2: find shop links from a sub-location page ────────────────────────

async function fetchShopLinks(pageTitle) {
  const url = `${WIKI_API}?action=parse&page=${encodeURIComponent(pageTitle)}&prop=text&disabletoc=1&redirects=1&format=json`;
  const data = await fetchJSON(url);
  if (data.error) return [];
  const html = data?.parse?.text?.['*'];
  if (!html) return [];

  // Split into sections by h2/h3 headings
  const sectionRe = /<h[23][^>]*>([\s\S]*?)<\/h[23]>([\s\S]*?)(?=<h[23]|$)/gi;
  const shopTitles = new Set();

  for (const section of html.matchAll(sectionRe)) {
    const headingText = stripTags(section[1]).toLowerCase();
    const isShopSection = SHOP_KEYWORDS.some(kw => headingText.includes(kw));
    if (!isShopSection) continue;

    // Extract all /w/ links from this section
    const linkRe = /href="\/w\/([^"#?]+)"/gi;
    for (const link of section[2].matchAll(linkRe)) {
      const decoded = decodeURIComponent(link[1].replace(/_/g, ' '));
      if (SKIP_PREFIXES.some(p => decoded.startsWith(p))) continue;
      shopTitles.add(decoded.replace(/_/g, ' '));
    }
  }

  return [...shopTitles];
}

// ── Level 3: scrape stock table from an individual shop page ─────────────────

async function fetchShopStock(shopTitle) {
  const url = `${WIKI_API}?action=parse&page=${encodeURIComponent(shopTitle)}&prop=text&disabletoc=1&redirects=1&format=json`;
  const data = await fetchJSON(url);
  if (data.error) return null;
  const html = data?.parse?.text?.['*'];
  if (!html) return null;

  const stockTables = [];
  for (const match of html.matchAll(/<table[^>]*class="[^"]*wikitable[^"]*"[^>]*>/gi)) {
    const start = match.index;
    const end = html.indexOf('</table>', start) + 8;
    const tableHtml = html.slice(start, end);
    const { headers, rows } = parseTable(tableHtml);
    if (headers.some(h => /item/i.test(h)) && rows.length) {
      stockTables.push({ columns: headers, stock: rows });
    }
  }

  const introText = stripTags(html.match(/<p[^>]*>([\s\S]*?)<\/p>/i)?.[1] ?? '').slice(0, 300);

  return stockTables.length ? { description: introText, stockTables } : null;
}

// ── Main ─────────────────────────────────────────────────────────────────────

const results = [];
const visitedShops = new Set();

for (let i = 0; i < SUB_LOCATIONS.length; i++) {
  const locTitle = SUB_LOCATIONS[i];
  process.stdout.write(`\n[${i + 1}/${SUB_LOCATIONS.length}] ${locTitle} — finding shops… `);

  const shopNames = await fetchShopLinks(locTitle);
  await sleep(RATE_MS);
  console.log(`${shopNames.length} shop link(s) found`);

  if (!shopNames.length) {
    console.log('    (no shops found — skipping)');
    continue;
  }

  const locationShops = [];

  for (const shopTitle of shopNames) {
    if (visitedShops.has(shopTitle)) {
      console.log(`    ↳ [skip] ${shopTitle} (already scraped)`);
      continue;
    }
    visitedShops.add(shopTitle);

    process.stdout.write(`    ↳ ${shopTitle} … `);
    const shopData = await fetchShopStock(shopTitle);
    await sleep(RATE_MS);

    if (shopData) {
      const totalItems = shopData.stockTables.reduce((n, t) => n + t.stock.length, 0);
      console.log(`${totalItems} item(s)`);
      locationShops.push({
        name: shopTitle,
        wikiUrl: `${WIKI_BASE}/w/${encodeURIComponent(shopTitle.replace(/ /g, '_'))}`,
        ...shopData,
      });
    } else {
      console.log('no stock found');
    }
  }

  if (locationShops.length) {
    results.push({
      location: locTitle,
      wikiUrl: `${WIKI_BASE}/w/${encodeURIComponent(locTitle.replace(/ /g, '_'))}`,
      shops: locationShops,
    });
  }
}

const output = {
  scrapedAt: new Date().toISOString(),
  subLocationsChecked: SUB_LOCATIONS.length,
  shopsScraped: visitedShops.size,
  locationsWithShops: results.length,
  locations: results,
};

writeFileSync(outputFile, JSON.stringify(output, null, 2), 'utf8');
console.log(`\n✅ Done — ${visitedShops.size} shops across ${results.length} locations → ${outputFile}`);
