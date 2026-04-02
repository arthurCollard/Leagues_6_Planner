// ── Wiki ↔ local field mapping ───────────────────────────────────────────────
// wiki param → [localCategory, localKey]
export const FIELD_MAP = {
  astab:  ['attack',  'stab'],
  aslash: ['attack',  'slash'],
  acrush: ['attack',  'crush'],
  amagic: ['attack',  'magic'],
  arange: ['attack',  'ranged'],
  dstab:  ['defence', 'stab'],
  dslash: ['defence', 'slash'],
  dcrush: ['defence', 'crush'],
  dmagic: ['defence', 'magic'],
  drange: ['defence', 'ranged'],
  str:    ['other',   'meleeStrength'],
  rstr:   ['other',   'rangedStrength'],
  mdmg:   ['other',   'magicDamage'],
  prayer: ['other',   'prayer'],
};

/**
 * Extracts key=value pairs from the FIRST {{Infobox Bonuses ...}} template
 * found in the wikitext. Values like "+5", "−3", "0" are returned as numbers.
 */
export function parseInfoboxBonuses(wikitext) {
  const startIdx = wikitext.indexOf('{{Infobox Bonuses');
  if (startIdx === -1) {
    const altIdx = wikitext.indexOf('{{infobox bonuses');
    if (altIdx === -1) return null;
  }

  let depth = 0;
  let start = wikitext.indexOf('{{', startIdx);
  let end   = start;
  for (let i = start; i < wikitext.length - 1; i++) {
    if (wikitext[i] === '{' && wikitext[i + 1] === '{') { depth++; i++; continue; }
    if (wikitext[i] === '}' && wikitext[i + 1] === '}') { depth--; i++; if (depth === 0) { end = i + 1; break; } }
  }

  const block = wikitext.slice(start, end + 1);
  const result = {};

  for (const [wikiKey] of Object.entries(FIELD_MAP)) {
    const re = new RegExp(`\\|\\s*${wikiKey}\\s*=\\s*([^|}\n]+)`, 'i');
    const m  = block.match(re);
    if (!m) continue;

    const raw = m[1].trim()
      .replace(/,/g, '')
      .replace(/−/g, '-')
      .replace(/[^0-9.\-+]/g, '')
      .replace(/^\+/, '');

    const num = parseFloat(raw);
    if (!isNaN(num)) result[wikiKey] = num;
  }

  return result;
}

/**
 * Compares a local item's bonuses against parsed wiki stats.
 * Returns an array of { field, local, wiki } for any mismatches.
 */
export function compareItem(item, wikiStats) {
  const mismatches = [];

  for (const [wikiKey, [cat, localKey]] of Object.entries(FIELD_MAP)) {
    const wikiVal = wikiStats[wikiKey];
    if (wikiVal === undefined) continue;

    const localVal = item.bonuses?.[cat]?.[localKey];
    if (localVal === undefined) {
      mismatches.push({ field: wikiKey, local: 'MISSING', wiki: wikiVal });
      continue;
    }

    if (localVal !== wikiVal) {
      mismatches.push({ field: wikiKey, local: localVal, wiki: wikiVal });
    }
  }

  return mismatches;
}
