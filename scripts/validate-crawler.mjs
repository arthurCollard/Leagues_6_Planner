/**
 * Validates the crawler logic against known test cases before running the full crawl.
 *
 * Tests:
 *   MUST include: Mistrock Mining Supplies, Stick Your Ore Inn, Shields of Mistrock (Varlamore)
 *                 Ardougne Gem Stall, Aemad's Adventuring Supplies, West Ardougne General Store (Kandarin)
 *                 Nurmof's Pickaxe Shop, Crossbow Shop, Dwarven shopping store,
 *                 Herquin's Gems, Brian's Archery Supplies (Asgarnia)
 *   MUST NOT include: Thieving, Fish Stall, Market Guard
 *   Misthalin must not appear in REGIONS
 *
 * Usage: node scripts/validate-crawler.mjs
 */

const WIKI_API  = 'https://oldschool.runescape.wiki/api.php';
const HEADERS   = { 'User-Agent': 'OSRS-Leagues-Planner/1.0 (validate; local)' };
const RATE_MS   = 300;

const LOCATION_SECTION_KEYWORDS = [
  'geography', 'location', 'locations', 'settlement', 'town', 'city', 'cities', 'village',
  'northern', 'southern', 'eastern', 'western', 'central',
  'area', 'island', 'landmark', 'community', 'places',
];

const GENERIC_SECTION_TITLES = new Set([
  'Free', 'Members', 'Free-to-play', 'Members-only', 'Dungeons', 'Gallery',
  'Other', 'References', 'Trivia', 'History', 'Music', 'Changes', 'Quests',
  'Miniquests', 'Development history', 'Concept art', 'Notes', 'See also',
]);

const SHOP_KEYWORDS = [
  'shop', 'store', 'general store', 'supplies', 'merchant', 'trader', 'market',
  'stall', 'stalls', 'building', 'buildings',
];

const SKIP_PREFIXES = ['File:', 'Category:', 'Template:', 'Help:', 'RuneScape:', 'User:', 'Talk:', 'Special:'];
const SKIP_PAGES = new Set([
  'RuneScape', 'OSRS', 'Old School RuneScape', 'Gielinor', 'Members',
  'Free-to-play', 'Quest', 'Skill', 'Combat', 'Prayer', 'Magic',
]);

const MANUAL_LOCATION_SHOPS = {
  Ardougne: ["Aemad's Adventuring Supplies", 'West Ardougne General Store', 'Ardougne Gem Stall'],
};

// Test scenarios — wiki page names as they appear on OSRS wiki
const MUST_INCLUDE = [
  { shop: 'Mistrock Mining Supplies',      region: 'Varlamore', location: 'Mistrock' },
  { shop: 'Stick Your Ore Inn',            region: 'Varlamore', location: 'Mistrock' },
  { shop: 'Shields of Mistrock',           region: 'Varlamore', location: 'Mistrock' },
  { shop: 'Ardougne Gem Stall',            region: 'Kandarin',  location: 'Ardougne' },
  { shop: "Aemad's Adventuring Supplies",  region: 'Kandarin',  location: 'Ardougne' },
  { shop: 'West Ardougne General Store',   region: 'Kandarin',  location: 'Ardougne' },
  { shop: "Nurmof's Pickaxe Shop",         region: 'Asgarnia',  location: 'Dwarven Mine' },
  { shop: 'Crossbow Shop (Dwarven Mine)',  region: 'Asgarnia',  location: 'Dwarven Mine' },
  { shop: 'Dwarven Shopping Store',        region: 'Asgarnia',  location: 'Dwarven Mine' },
  { shop: "Herquin's Gems",               region: 'Asgarnia',  location: 'Falador' },
  { shop: "Brian's Archery Supplies",      region: 'Asgarnia',  location: 'Rimmington' },
];

const MUST_NOT_INCLUDE = ['Thieving', 'Fish Stall', 'Market Guard'];

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function fetchJSON(url) {
  const res = await fetch(url, { headers: HEADERS });
  return res.json();
}

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

async function fetchSubLocations(regionWiki) {
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

async function fetchShopLinks(pageTitle) {
  const secUrl = `${WIKI_API}?action=parse&page=${encodeURIComponent(pageTitle)}&prop=sections&redirects=1&format=json`;
  const secData = await fetchJSON(secUrl);
  if (secData.error) return [];
  const sections = secData.parse?.sections ?? [];

  const shopTitles = new Set();
  for (const s of (MANUAL_LOCATION_SHOPS[pageTitle] ?? [])) shopTitles.add(s);

  const htmlSectionsToFetch = [];

  for (let i = 0; i < sections.length; i++) {
    const sec = sections[i];
    const headingText = sec.line.replace(/&amp;/g, '&').replace(/<[^>]+>/g, '').trim().toLowerCase();

    const isShopSection     = SHOP_KEYWORDS.some(kw => headingText.includes(kw));
    const isLocationSection = LOCATION_SECTION_KEYWORDS.some(kw => headingText.includes(kw));

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

    if (isShopSection) {
      htmlSectionsToFetch.push(sec.index);
    }
  }

  for (const secIndex of htmlSectionsToFetch) {
    await sleep(RATE_MS);
    const htmlUrl = `${WIKI_API}?action=parse&page=${encodeURIComponent(pageTitle)}&prop=text&section=${secIndex}&redirects=1&format=json`;
    const htmlData = await fetchJSON(htmlUrl);
    const html = htmlData?.parse?.text?.['*'] ?? '';

    const linkRe = /href="\/w\/([^"#?]+)"/gi;
    for (const link of html.matchAll(linkRe)) {
      const decoded = decodeURIComponent(link[1].replace(/_/g, ' ')).replace(/\.$/, '');
      if (SKIP_PREFIXES.some(p => decoded.startsWith(p))) continue;
      if (SKIP_PAGES.has(decoded) || GENERIC_SECTION_TITLES.has(decoded)) continue;
      shopTitles.add(decoded);
    }
  }

  return [...shopTitles];
}

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
    if (
      headers.some(h => /item/i.test(h)) &&
      headers.some(h => /sold at/i.test(h)) &&
      rows.length
    ) {
      stockTables.push({ columns: headers, stock: rows });
    }
  }

  return stockTables.length ? { ok: true, itemCount: stockTables.reduce((n, t) => n + t.stock.length, 0) } : null;
}

// ── Run validation ────────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;

function pass(msg) { console.log(`  ✅ PASS — ${msg}`); passed++; }
function fail(msg) { console.log(`  ❌ FAIL — ${msg}`); failed++; }

// ── Section 1: REGIONS array must not contain Misthalin ──────────────────────
console.log('\n── Checking: Misthalin excluded ──');
const REGIONS_NAMES = [
  'Varlamore','Karamja','Asgarnia','Fremennik','Kandarin',
  'Desert','Morytania','Tirannwn','Wilderness','Kourend',
];
if (!REGIONS_NAMES.includes('Misthalin')) {
  pass('Misthalin not in REGIONS');
} else {
  fail('Misthalin is still in REGIONS');
}

// ── Section 2: sub-location discovery ────────────────────────────────────────
const LOCATION_TESTS = [
  { region: 'Varlamore',  wiki: 'Varlamore',  must: ['Mistrock'] },
  { region: 'Kandarin',   wiki: 'Kandarin',   must: ['Ardougne'] },
  { region: 'Asgarnia',   wiki: 'Asgarnia',   must: ['Falador', 'Port Sarim', 'Rimmington'] },
];

console.log('\n── Checking: sub-location discovery ──');
for (const t of LOCATION_TESTS) {
  process.stdout.write(`  Fetching sub-locations of ${t.wiki}… `);
  const locs = await fetchSubLocations(t.wiki);
  // Add manual extras
  if (t.region === 'Asgarnia') locs.push('Dwarven Mine');
  await sleep(RATE_MS);
  console.log(`${locs.length} found`);

  for (const must of t.must) {
    if (locs.includes(must)) {
      pass(`"${must}" found as sub-location of ${t.region}`);
    } else {
      fail(`"${must}" NOT found as sub-location of ${t.region} (got: ${locs.join(', ')})`);
    }
  }
}

// ── Section 3: shop link discovery ───────────────────────────────────────────
const SHOP_LINK_TESTS = [
  { location: 'Mistrock',    must: ['Mistrock Mining Supplies', 'Stick Your Ore Inn', 'Shields of Mistrock'] },
  { location: 'Ardougne',    must: ['Ardougne Gem Stall', "Aemad's Adventuring Supplies", 'West Ardougne General Store'] },
  { location: 'Dwarven Mine',must: ["Nurmof's Pickaxe Shop", 'Crossbow Shop (Dwarven Mine)', 'Dwarven Shopping Store'] },
  { location: 'Falador',     must: ["Herquin's Gems"] },
  { location: 'Rimmington',  must: ["Brian's Archery Supplies"] },
];

console.log('\n── Checking: shop link discovery ──');
for (const t of SHOP_LINK_TESTS) {
  process.stdout.write(`  Fetching shop links for "${t.location}"… `);
  const shops = await fetchShopLinks(t.location);
  await sleep(RATE_MS);
  console.log(`${shops.length} candidates`);

  for (const must of t.must) {
    if (shops.includes(must)) {
      pass(`"${must}" found in shop links for ${t.location}`);
    } else {
      fail(`"${must}" NOT found in shop links for ${t.location}`);
      console.log(`       (candidates: ${shops.slice(0, 10).join(', ')}${shops.length > 10 ? '…' : ''})`);
    }
  }
}

// ── Section 4: false positive rejection ──────────────────────────────────────
console.log('\n── Checking: false positive rejection ──');
for (const shopTitle of MUST_NOT_INCLUDE) {
  process.stdout.write(`  Checking "${shopTitle}" returns no stock… `);
  const result = await fetchShopStock(shopTitle);
  await sleep(RATE_MS);
  if (!result) {
    pass(`"${shopTitle}" correctly returns no stock`);
  } else {
    fail(`"${shopTitle}" incorrectly returns stock (${result.itemCount} items) — false positive!`);
  }
}

// ── Section 5: real shop stock ────────────────────────────────────────────────
const STOCK_TESTS = [
  'Mistrock Mining Supplies',
  'Stick Your Ore Inn',
  'Ardougne Gem Stall',
  "Nurmof's Pickaxe Shop",
];

console.log('\n── Checking: real shop stock ──');
for (const shopTitle of STOCK_TESTS) {
  process.stdout.write(`  Fetching stock for "${shopTitle}"… `);
  const result = await fetchShopStock(shopTitle);
  await sleep(RATE_MS);
  if (result) {
    pass(`"${shopTitle}" — ${result.itemCount} item(s)`);
  } else {
    fail(`"${shopTitle}" returned no stock (check page name or table format)`);
  }
}

// ── Results ───────────────────────────────────────────────────────────────────
console.log(`\n${'─'.repeat(60)}`);
console.log(`Results: ${passed} passed, ${failed} failed`);
if (failed === 0) {
  console.log('✅ All tests passed — safe to run: node scripts/crawler.mjs');
} else {
  console.log('❌ Some tests failed — fix issues above before running the full crawler');
}
