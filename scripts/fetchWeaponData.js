/**
 * Fetches weapon stats from the OSRS Wiki and merges them into weapon.js.
 * Preserves all custom fields (regions, effects, sets, etc.)
 * Only overwrites: bonuses, speed, twoHanded, combatStyle
 *
 * Usage: node scripts/fetchWeaponData.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const WEAPON_JS_PATH = path.join(__dirname, '../src/data/gear/weapon.js');
const WIKI_API = 'https://oldschool.runescape.wiki/api.php';
const HEADERS = { 'User-Agent': 'OSRS-Leagues-Planner/1.0 (gear-stats-fetcher; github.com/osrs-planner)' };
const BATCH_SIZE = 50;
const RATE_LIMIT_MS = 200;

// ---------- helpers ----------

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: HEADERS }, res => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => {
        try { resolve(JSON.parse(Buffer.concat(chunks).toString())); }
        catch (e) { reject(new Error(`JSON parse error: ${e.message}`)); }
      });
    });
    req.on('error', reject);
  });
}

// ---------- load weapon.js ----------

function loadCurrentWeapons() {
  const src = fs.readFileSync(WEAPON_JS_PATH, 'utf8');
  const code = src.replace(/^export\s+const\s+WEAPON\s*=/, 'WEAPON =');
  const ctx = { WEAPON: null };
  vm.runInNewContext(code, ctx);
  return ctx.WEAPON;
}

// ---------- wiki batch fetch ----------

/**
 * Fetch wikitext for up to 50 page titles in one API call.
 * Returns { [normalizedTitle]: wikitextString }
 */
async function fetchWikitextBatch(titles) {
  const url =
    `${WIKI_API}?action=query&prop=revisions&rvprop=content&rvslots=main` +
    `&redirects=1&titles=${titles.map(encodeURIComponent).join('|')}&format=json`;
  const data = await fetchJSON(url);
  const pages = data?.query?.pages || {};
  const result = {};

  // Build redirect map: from -> to (normalized)
  const redirectMap = {};
  (data?.query?.redirects || []).forEach(r => {
    redirectMap[r.from.toLowerCase()] = r.to;
  });
  // Normalized titles
  const normalizedMap = {};
  (data?.query?.normalized || []).forEach(n => {
    normalizedMap[n.from.toLowerCase()] = n.to;
  });

  for (const page of Object.values(pages)) {
    if (page.missing !== undefined) continue;
    const wikitext = page.revisions?.[0]?.slots?.main?.['*'] ||
                     page.revisions?.[0]?.['*'];
    if (wikitext) result[page.title.toLowerCase()] = wikitext;
  }

  // Also expose the redirect map so callers can follow back to original names
  result.__redirects = redirectMap;
  result.__normalized = normalizedMap;
  return result;
}

// ---------- parse infobox bonuses ----------

/**
 * Extract integer value for a field (handles versioned fields like astab1/astab2).
 * useFirstVersion=true picks version1 (uncharged); otherwise picks the last version (charged).
 */
function getField(content, fieldBase, versionCount, useFirstVersion = false) {
  if (versionCount > 0) {
    const start = useFirstVersion ? 1 : versionCount;
    const end   = useFirstVersion ? 1 : 1;
    const step  = useFirstVersion ? 1 : -1;
    for (let v = start; useFirstVersion ? v <= versionCount : v >= end; v += step) {
      const m = content.match(new RegExp(`\\|\\s*${fieldBase}${v}\\s*=\\s*([+\\-]?[\\d.]+)`));
      if (m) return parseFloat(m[1]);
    }
  }
  const m = content.match(new RegExp(`\\|\\s*${fieldBase}\\s*=\\s*([+\\-]?[\\d.]+)`));
  return m ? parseFloat(m[1]) : 0;
}

function parseInfoboxBonuses(wikitext, useFirstVersion = false) {
  if (!wikitext) return null;
  const match = wikitext.match(/\{\{Infobox Bonuses([\s\S]*?)\n\}\}/);
  if (!match) return null;
  const content = match[1];

  const versionCount = (content.match(/\|\s*version\d+/g) || []).length;
  const fv = useFirstVersion;

  const speedMatch = content.match(/\|\s*speed\s*=\s*(\d+)/);
  const speed = speedMatch ? parseInt(speedMatch[1]) : null;

  const slotMatch = content.match(/\|\s*slot\s*=\s*(\S+)/);
  const twoHanded = slotMatch ? slotMatch[1].trim().toLowerCase() === '2h' : false;

  const combatStyleMatch = content.match(/\|\s*combatstyle\s*=\s*([^\n|]+)/);
  const combatStyleType = combatStyleMatch ? combatStyleMatch[1].trim().toLowerCase() : null;

  return {
    bonuses: {
      attack: {
        stab:   getField(content, 'astab',  versionCount, fv),
        slash:  getField(content, 'aslash', versionCount, fv),
        crush:  getField(content, 'acrush', versionCount, fv),
        magic:  getField(content, 'amagic', versionCount, fv),
        ranged: getField(content, 'arange', versionCount, fv),
      },
      defence: {
        stab:   getField(content, 'dstab',  versionCount, fv),
        slash:  getField(content, 'dslash', versionCount, fv),
        crush:  getField(content, 'dcrush', versionCount, fv),
        magic:  getField(content, 'dmagic', versionCount, fv),
        ranged: getField(content, 'drange', versionCount, fv),
      },
      other: {
        meleeStrength:  getField(content, 'str',    versionCount, fv),
        rangedStrength: getField(content, 'rstr',   versionCount, fv),
        magicDamage:    getField(content, 'mdmg',   versionCount, fv),
        prayer:         getField(content, 'prayer', versionCount, fv),
      },
    },
    speed,
    twoHanded,
    combatStyleType,
  };
}

// ---------- combat style stances map ----------
// Maps wiki combatstyle field -> ordered stance names.
// "rapid" is the only stance that's 1 tick faster than base speed.

const STANCE_MAP = {
  'axe':           ['chop', 'hack', 'smash', 'block'],
  '2h sword':      ['chop', 'slash', 'smash', 'block'],
  'blunt':         ['pound', 'pummel', 'block'],
  'bludgeon':      ['pound', 'pummel', 'block'],
  'bulwark':       ['pummel'],
  'claws':         ['chop', 'slash', 'lunge', 'block'],
  'crossbow':      ['accurate', 'rapid', 'longrange'],
  'bow':           ['accurate', 'rapid', 'longrange'],
  'thrown':        ['accurate', 'rapid', 'longrange'],
  'blowpipe':      ['accurate', 'rapid', 'longrange'],
  'chinchompa':    ['short_fuse', 'medium_fuse', 'long_fuse'],
  'dagger':        ['stab', 'lunge', 'slash', 'block'],
  'halberd':       ['jab', 'swipe', 'fend'],
  'partisan':      ['stab', 'lunge', 'pound', 'block'],
  'pickaxe':       ['spike', 'impale', 'smash', 'block'],
  'polearm':       ['jab', 'swipe', 'fend'],
  'polestaff':     ['bash', 'pound', 'block'],
  'scimitar':      ['chop', 'slash', 'lunge', 'block'],
  'scythe':        ['reap', 'chop', 'jab', 'block'],
  'slash sword':   ['chop', 'slash', 'lunge', 'block'],
  'spear':         ['lunge', 'swipe', 'pound', 'block'],
  'spiked':        ['pound', 'pummel', 'spike', 'block'],
  'stab sword':    ['stab', 'lunge', 'slash', 'block'],
  'unarmed':       ['punch', 'kick', 'block'],
  'whip':          ['flick', 'lash', 'deflect'],
  'staff':         ['bash', 'pound', 'focus', 'spell', 'defensive_spell'],
  'magic staff':   ['bash', 'pound', 'focus', 'spell', 'defensive_spell'],
  'bladed staff':  ['jab', 'swipe', 'pound', 'spell', 'defensive_spell'],
  'powered staff': ['accurate', 'accurate_2', 'longrange'],
  'trident':       ['jab', 'swipe', 'pound', 'spell', 'defensive_spell'],
  'salamander':    ['scorch', 'flare', 'blaze'],
  'gun':           ['aim_and_fire'],
  'banner':        ['lunge', 'swipe', 'pound', 'block'],
};

function buildCombatStyle(combatStyleType, speed) {
  if (!combatStyleType || speed == null) return null;
  const stances = STANCE_MAP[combatStyleType];
  if (!stances) return null;
  const result = {};
  stances.forEach(s => {
    result[s] = s === 'rapid' ? speed - 1 : speed;
  });
  return result;
}

// ---------- JS serialiser ----------

function serializeWeapon(w) {
  const lines = [];
  lines.push(`  {`);
  lines.push(`    name: ${JSON.stringify(w.name)},`);
  lines.push(`    slot: 'weapon',`);
  lines.push(`    regions: ${JSON.stringify(w.regions)},`);

  if (w.requirements?.length) {
    const reqs = w.requirements.map(r => `{ skill: ${JSON.stringify(r.skill)}, level: ${r.level} }`).join(', ');
    lines.push(`    requirements: [${reqs}],`);
  } else {
    lines.push(`    requirements: [],`);
  }

  const b = w.bonuses;
  lines.push(`    bonuses: {`);
  lines.push(`      attack:  { stab: ${b.attack.stab}, slash: ${b.attack.slash}, crush: ${b.attack.crush}, magic: ${b.attack.magic}, ranged: ${b.attack.ranged} },`);
  lines.push(`      defence: { stab: ${b.defence.stab}, slash: ${b.defence.slash}, crush: ${b.defence.crush}, magic: ${b.defence.magic}, ranged: ${b.defence.ranged} },`);
  lines.push(`      other:   { meleeStrength: ${b.other.meleeStrength}, rangedStrength: ${b.other.rangedStrength}, magicDamage: ${b.other.magicDamage}, prayer: ${b.other.prayer} },`);
  lines.push(`    },`);

  lines.push(`    speed: ${w.speed},`);
  lines.push(`    twoHanded: ${w.twoHanded},`);

  if (w.combatStyle && Object.keys(w.combatStyle).length) {
    const styles = Object.entries(w.combatStyle).map(([k, v]) => `      ${k}: ${v}`).join(',\n');
    lines.push(`    combatStyle: {\n${styles}\n    },`);
  } else {
    lines.push(`    combatStyle: {},`);
  }

  if (w.effect) {
    lines.push(`    effect: ${JSON.stringify(w.effect, null, 6).replace(/^/gm, '    ').trimStart()},`);
  }
  if (w.sets) {
    lines.push(`    sets: ${JSON.stringify(w.sets)},`);
  }
  if (w.special) {
    lines.push(`    special: ${JSON.stringify(w.special)},`);
  }

  lines.push(`  }`);
  return lines.join('\n');
}

// ---------- title resolution ----------

/**
 * Convert Title Case weapon name to OSRS wiki sentence case.
 * e.g. "Dragon Hunter Lance" -> "Dragon hunter lance"
 * The wiki capitalises only the first character of a page title.
 */
function toSentenceCase(name) {
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

/**
 * Explicit overrides: key = weapon name (lowercase), value = wiki page title.
 * Use null to skip fetching (weapon has no wiki page or is not a weapon slot item).
 * Mark uncharged variants with a leading '~' so main() knows to use version1 stats.
 */
const ALT_NAMES = {
  // Renamed items
  'uncharged toxic trident':        'Trident of the swamp',
  // Uncharged variants — same wiki page, but use version1 (uncharged) stats
  "tumeken's shadow (uncharged)":   '~Tumeken\'s shadow',
  'scythe of vitur (uncharged)':    '~Scythe of vitur',
  // Wilderness weapons use the (u) uncharged page
  "viggora's chainmace (u)":        "Viggora's chainmace (u)",
  "craw's bow (u)":                 "Craw's bow (u)",
  "thammaron's sceptre (u)":        "Thammaron's sceptre (u)",
};

function resolveWikiTitle(weaponName) {
  const lower = weaponName.toLowerCase();
  if (lower in ALT_NAMES) {
    const v = ALT_NAMES[lower];
    if (v === null) return { title: null, useFirstVersion: false };
    const useFirstVersion = v.startsWith('~');
    return { title: useFirstVersion ? v.slice(1) : v, useFirstVersion };
  }
  return { title: toSentenceCase(weaponName), useFirstVersion: false };
}

// ---------- main ----------

async function main() {
  console.log('Loading current weapon.js…');
  const weapons = loadCurrentWeapons();
  console.log(`  ${weapons.length} weapons found`);

  const resolutions = weapons.map(w => resolveWikiTitle(w.name));
  const wikiTitles  = resolutions.map(r => r.title);

  // Batch fetch in groups of BATCH_SIZE
  const batches = [];
  for (let i = 0; i < wikiTitles.length; i += BATCH_SIZE) {
    batches.push(wikiTitles.slice(i, i + BATCH_SIZE));
  }

  const wikitextByTitle = {};
  for (let b = 0; b < batches.length; b++) {
    const batch = batches[b].filter(Boolean);
    console.log(`  Fetching wiki batch ${b + 1}/${batches.length} (${batch.length} pages)…`);
    try {
      const result = await fetchWikitextBatch(batch);
      const redirects = result.__redirects || {};
      const normalized = result.__normalized || {};
      delete result.__redirects;
      delete result.__normalized;

      batch.forEach(title => {
        const key = title.toLowerCase();
        if (result[key]) { wikitextByTitle[key] = result[key]; return; }
        const normKey = (normalized[key] || title).toLowerCase();
        const redirKey = (redirects[normKey] || redirects[key] || '').toLowerCase();
        if (result[normKey]) { wikitextByTitle[key] = result[normKey]; return; }
        if (redirKey && result[redirKey]) { wikitextByTitle[key] = result[redirKey]; return; }
      });
    } catch (e) {
      console.error(`  Batch ${b + 1} error: ${e.message}`);
    }
    if (b < batches.length - 1) await sleep(RATE_LIMIT_MS);
  }

  const notFound = [];
  const updated = [];

  weapons.forEach((weapon, idx) => {
    const { title: wikiTitle, useFirstVersion } = resolutions[idx];
    if (!wikiTitle) {
      updated.push(weapon);
      return;
    }

    const wikitext = wikitextByTitle[wikiTitle.toLowerCase()];
    const parsed = parseInfoboxBonuses(wikitext, useFirstVersion);

    if (!parsed) {
      notFound.push(weapon.name);
      updated.push(weapon);
      return;
    }

    // Derive combat styles from wiki type; fall back to updating speeds on existing keys
    let combatStyle = weapon.combatStyle;
    if (parsed.combatStyleType && parsed.speed != null) {
      const derived = buildCombatStyle(parsed.combatStyleType, parsed.speed);
      if (derived) combatStyle = derived;
    }
    if (parsed.speed != null && combatStyle) {
      combatStyle = Object.fromEntries(
        Object.keys(combatStyle).map(k => [k, k === 'rapid' ? parsed.speed - 1 : parsed.speed])
      );
    }

    updated.push({
      ...weapon,
      bonuses: parsed.bonuses,
      speed: parsed.speed ?? weapon.speed,
      twoHanded: parsed.twoHanded ?? weapon.twoHanded,
      combatStyle,
    });
  });

  if (notFound.length) {
    console.log(`\n⚠️  Not matched on wiki (${notFound.length}) — keeping original data:`);
    notFound.forEach(n => console.log(`  - ${n}`));
  }

  const weaponBlocks = updated.map(serializeWeapon).join(',\n');
  const output = `export const WEAPON = [\n${weaponBlocks},\n];\n`;

  fs.writeFileSync(WEAPON_JS_PATH, output);
  const matched = updated.length - notFound.length;
  console.log(`\n✅ weapon.js updated (${matched} matched, ${notFound.length} kept as-is)`);
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
