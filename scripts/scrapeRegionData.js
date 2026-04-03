/**
 * Scrapes all Raging Echoes League region area pages from the OSRS Wiki.
 * Outputs structured JSON broken down by region and subtitle.
 *
 * Usage: node scripts/scrapeRegionData.js
 * Output: scripts/region-data.json
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const OUTPUT_PATH = path.join(__dirname, '../src/data/region-data.json');
const WIKI_API = 'https://oldschool.runescape.wiki/api.php';
const HEADERS = { 'User-Agent': 'OSRS-Leagues-Planner/1.0 (region-scraper; local)' };
const RATE_LIMIT_MS = 300;

const REGIONS = [
  'Misthalin',
  'Karamja',
  'Asgarnia',
  'Fremennik_Province',
  'Kandarin',
  'Kharidian_Desert',
  'Morytania',
  'Tirannwn',
  'Wilderness',
  'Kebos_and_Kourend',
  'Varlamore',
];

// ---------- helpers ----------

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function fetchRaw(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: HEADERS }, res => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function fetchJSON(url) {
  const raw = await fetchRaw(url);
  return JSON.parse(raw);
}

// ---------- HTML stripping ----------

function stripTags(html) {
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, ' ')
    // decode remaining numeric entities (e.g. &#91; → [)
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    // strip wiki footnote markers like [d 1], [1], [a], etc.
    .replace(/\[[^\]]{0,10}\]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Extract plain text lines from an <ul> or <ol> block
function parseList(html) {
  const items = [];
  const re = /<li[^>]*>([\s\S]*?)<\/li>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const text = stripTags(m[1]).trim();
    if (text) items.push(text);
  }
  return items;
}

// Extract rows from a <table>. Returns array of row objects keyed by header text.
function parseTable(html) {
  // Extract header cells (from the first header row only)
  const headers = [];
  const firstTrMatch = html.match(/<tr[^>]*>([\s\S]*?)<\/tr>/i);
  if (firstTrMatch && /<th/i.test(firstTrMatch[1])) {
    const thRe2 = /<th[^>]*>([\s\S]*?)<\/th>/gi;
    let m2;
    while ((m2 = thRe2.exec(firstTrMatch[1])) !== null) {
      // Normalise header: strip tags, collapse whitespace
      headers.push(stripTags(m2[1]).replace(/\s+/g, ' ').trim());
    }
  }
  let m;

  // Extract rows — skip rows that contain ONLY <th> cells (pure header rows)
  const rows = [];
  const trRe = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  while ((m = trRe.exec(html)) !== null) {
    const rowHtml = m[1];
    // Skip rows that have no <td> at all (pure header rows)
    if (!/<td/i.test(rowHtml)) continue;
    const cells = [];
    // Collect both <td> and row-header <th> cells in document order
    const cellRe = /<(?:td|th)[^>]*>([\s\S]*?)<\/(?:td|th)>/gi;
    let td;
    while ((td = cellRe.exec(rowHtml)) !== null) {
      cells.push(stripTags(td[1]).trim());
    }
    if (cells.length === 0) continue;

    if (headers.length > 0) {
      const row = {};
      headers.forEach((h, i) => {
        row[h || `col${i}`] = cells[i] ?? '';
      });
      rows.push(row);
    } else {
      rows.push(cells);
    }
  }
  return rows;
}

// ---------- section splitting ----------

/**
 * Split parsed HTML into sections by h2/h3/h4 headings.
 * Returns array of { level, title, html }
 */
function splitSections(html) {
  const sections = [];
  const headingRe = /<h([234])[^>]*>[\s\S]*?<\/h\1>/gi;

  let lastIndex = 0;
  let lastHeading = null;
  let m;

  // Find intro content before first heading
  const firstHeading = html.search(/<h[234][^>]*>/i);
  if (firstHeading > 0) {
    const introHtml = html.slice(0, firstHeading);
    sections.push({ level: 0, title: '_intro', html: introHtml });
  }

  const matches = [...html.matchAll(/<h([234])[^>]*>([\s\S]*?)<\/h\1>/gi)];

  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    const level = parseInt(match[1]);
    const titleRaw = stripTags(match[2]).replace(/\[edit\]/gi, '').trim();
    const start = match.index + match[0].length;
    const end = i + 1 < matches.length ? matches[i + 1].index : html.length;
    const sectionHtml = html.slice(start, end);
    sections.push({ level, title: titleRaw, html: sectionHtml });
  }

  return sections;
}

// ---------- parse a single section into structured data ----------

function parseSection(title, html) {
  // Check for tables first
  if (/<table/i.test(html)) {
    const tableMatch = html.match(/<table[\s\S]*?<\/table>/i);
    if (tableMatch) {
      return { type: 'table', rows: parseTable(tableMatch[0]) };
    }
  }

  // Check for lists
  if (/<ul|<ol/i.test(html)) {
    return { type: 'list', items: parseList(html) };
  }

  // Plain paragraphs
  const text = stripTags(html).trim();
  if (text) return { type: 'text', text };

  return null;
}

// ---------- fetch & parse a region page ----------

async function fetchRegionPage(region) {
  const pageTitle = `Raging_Echoes_League/Areas/${region}`;
  const url = `${WIKI_API}?action=parse&page=${encodeURIComponent(pageTitle)}&prop=text&disabletoc=1&redirects=1&format=json`;

  console.log(`  Fetching ${region}…`);
  const data = await fetchJSON(url);

  if (data.error) {
    console.warn(`  ⚠ Error for ${region}: ${data.error.info}`);
    return null;
  }

  const html = data?.parse?.text?.['*'];
  if (!html) return null;

  const sections = splitSections(html);
  const result = {};

  // Group sub-sections under their parent h2
  let currentH2 = '_root';

  // Sections to skip entirely
  const SKIP_SECTIONS = new Set(['references', 'see also', 'navigation']);

  for (const section of sections) {
    const { level, title, html: secHtml } = section;

    if (level === 0) {
      // intro — skip
      continue;
    }

    if (SKIP_SECTIONS.has(title.toLowerCase())) continue;

    if (level === 2) {
      currentH2 = title;
      if (!result[currentH2]) result[currentH2] = {};
      // Capture content directly under this h2 (before any h3 sub-sections)
      // Slice off everything from the first sub-heading onward
      const subHeadingIdx = secHtml.search(/<h[34][^>]*>/i);
      const h2DirectHtml = subHeadingIdx > 0 ? secHtml.slice(0, subHeadingIdx) : secHtml;
      const h2Parsed = parseSection(title, h2DirectHtml);
      if (h2Parsed) result[currentH2]['_content'] = h2Parsed;
      continue;
    }

    // h3 or h4 — goes under the current h2
    const parsed = parseSection(title, secHtml);
    if (!parsed) continue;

    if (!result[currentH2]) result[currentH2] = {};

    // If same title appears more than once, suffix with index
    let key = title;
    if (result[currentH2][key]) {
      let i = 2;
      while (result[currentH2][`${key} (${i})`]) i++;
      key = `${key} (${i})`;
    }
    result[currentH2][key] = parsed;
  }

  return result;
}

// ---------- main ----------

async function main() {
  console.log('Scraping Raging Echoes League region pages…\n');

  const output = {};

  for (let i = 0; i < REGIONS.length; i++) {
    const region = REGIONS[i];
    const displayName = region.replace(/_/g, ' ');
    try {
      const data = await fetchRegionPage(region);
      if (data) {
        output[displayName] = data;
        const sectionCount = Object.keys(data).length;
        console.log(`  ✓ ${displayName} — ${sectionCount} top-level sections`);
      } else {
        console.log(`  ✗ ${displayName} — no data`);
      }
    } catch (e) {
      console.error(`  ✗ ${displayName} — ${e.message}`);
    }

    if (i < REGIONS.length - 1) await sleep(RATE_LIMIT_MS);
  }

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2), 'utf8');
  console.log(`\n✅ Done — written to ${OUTPUT_PATH}`);
  console.log(`   Regions: ${Object.keys(output).join(', ')}`);
}

main().catch(err => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
