/**
 * Test: verifies shop stock scraping works using the known
 * Civitas illa Fortis shop list before running the full crawler.
 *
 * Usage: node scripts/test-crawler.mjs
 */

const WIKI_API  = 'https://oldschool.runescape.wiki/api.php';
const HEADERS   = { 'User-Agent': 'OSRS-Leagues-Planner/1.0 (test; local)' };
const RATE_MS   = 300;

const TEST_SHOPS = [
  "Artima's Crafting Supplies",
  "Cobado's Groceries",
  'The Flaming Arrow',
  'Fortis Blacksmith',
  "Floria's Fashion",
  "Fortis Baker's Stall",
  'Fortis Fur Stall',
  'Fortis Gem Stall',
  'Fortis General Store',
  'Fortis Silk Stall',
  'Fortis Spice Stall',
];

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

async function fetchShopStock(shopTitle) {
  const url = `${WIKI_API}?action=parse&page=${encodeURIComponent(shopTitle)}&prop=text&disabletoc=1&redirects=1&format=json`;
  const data = await fetchJSON(url);
  if (data.error) return { ok: false, reason: data.error.info };
  const html = data?.parse?.text?.['*'];
  if (!html) return { ok: false, reason: 'no html' };

  // Stock tables on shop pages use class="wikitable" — target those specifically
  const wikiTableRe = /<table[^>]*class="[^"]*wikitable[^"]*"[^>]*>/gi;
  const stockTables = [];

  for (const match of html.matchAll(wikiTableRe)) {
    const start = match.index;
    const end = html.indexOf('</table>', start) + 8;
    const tableHtml = html.slice(start, end);
    const { headers, rows } = parseTable(tableHtml);
    if (headers.some(h => /item/i.test(h)) && rows.length) {
      stockTables.push({ columns: headers, stock: rows });
    }
  }

  return stockTables.length
    ? { ok: true, stockTables }
    : { ok: false, reason: 'no stock table found' };
}

// ── Run tests ─────────────────────────────────────────────────────────────────

console.log('Testing shop stock scraping with Civitas illa Fortis shops…\n');

let passed = 0;
let failed = 0;

for (let i = 0; i < TEST_SHOPS.length; i++) {
  const name = TEST_SHOPS[i];
  process.stdout.write(`[${i + 1}/${TEST_SHOPS.length}] ${name} … `);

  const result = await fetchShopStock(name);

  if (result.ok) {
    const itemCount = result.stockTables.reduce((n, t) => n + t.stock.length, 0);
    const cols = result.stockTables[0]?.columns.join(', ');
    const first = result.stockTables[0]?.stock[0];
    const sample = first ? ` | first: "${first['Item']}" stock=${first['Number in stock']} price=${first['Price sold at']}` : '';
    console.log(`PASS — ${itemCount} item(s) | cols: ${cols}${sample}`);
    passed++;
  } else {
    console.log(`FAIL — ${result.reason}`);
    failed++;
  }

  if (i < TEST_SHOPS.length - 1) await sleep(RATE_MS);
}

console.log(`\n${'─'.repeat(50)}`);
console.log(`Results: ${passed} passed, ${failed} failed out of ${TEST_SHOPS.length} shops`);
if (failed === 0) {
  console.log('✅ All tests passed — safe to run the full crawler');
} else {
  console.log('❌ Some shops failed — check the output above before running the full crawler');
}
