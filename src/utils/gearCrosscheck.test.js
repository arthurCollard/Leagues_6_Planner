import { parseInfoboxBonuses, compareItem } from './gearCrosscheck';

// ── Fixtures ──────────────────────────────────────────────────────────────────

const RUNE_FULL_HELM_WIKITEXT = `
{{Infobox Item
|name = Rune full helm
|image = Rune full helm.png
}}
{{Infobox Bonuses
|astab = 0
|aslash = 0
|acrush = 0
|amagic = -6
|arange = -3
|dstab = 30
|dslash = 32
|dcrush = 27
|dmagic = -1
|drange = 30
|str = 0
|rstr = 0
|mdmg = 0
|prayer = 0
}}
`;

const VOID_RANGER_HELM_WIKITEXT = `
{{Infobox Bonuses
|astab = 0
|aslash = 0
|acrush = 0
|amagic = 0
|arange = 0
|dstab = 6
|dslash = 6
|dcrush = 6
|dmagic = 6
|drange = 6
|str = 0
|rstr = 0
|mdmg = 0
|prayer = 0
}}
`;

// Realistic wiki formatting: unicode minus, leading +, extra whitespace
const TRICKY_FORMAT_WIKITEXT = `
{{Infobox Bonuses
|astab  = +15
|aslash = +15
|acrush = +15
|amagic = 0
|arange = 0
|dstab  = 0
|dslash = 0
|dcrush = 0
|dmagic = 0
|drange = 0
|str    = +10
|rstr   = 0
|mdmg   = 0
|prayer = 2
}}
`;

const UNICODE_MINUS_WIKITEXT = `
{{Infobox Bonuses
|astab = 0
|aslash = 0
|acrush = 0
|amagic = −6
|arange = −3
|dstab = 30
|dslash = 32
|dcrush = 27
|dmagic = −1
|drange = 30
|str = 0
|rstr = 0
|mdmg = 0
|prayer = 0
}}
`;

// ── parseInfoboxBonuses ───────────────────────────────────────────────────────

describe('parseInfoboxBonuses', () => {
  test('parses all bonuses correctly for Rune full helm', () => {
    const result = parseInfoboxBonuses(RUNE_FULL_HELM_WIKITEXT);
    expect(result).toEqual({
      astab: 0, aslash: 0, acrush: 0, amagic: -6, arange: -3,
      dstab: 30, dslash: 32, dcrush: 27, dmagic: -1, drange: 30,
      str: 0, rstr: 0, mdmg: 0, prayer: 0,
    });
  });

  test('parses all bonuses correctly for Void Ranger Helm', () => {
    const result = parseInfoboxBonuses(VOID_RANGER_HELM_WIKITEXT);
    expect(result).toEqual({
      astab: 0, aslash: 0, acrush: 0, amagic: 0, arange: 0,
      dstab: 6, dslash: 6, dcrush: 6, dmagic: 6, drange: 6,
      str: 0, rstr: 0, mdmg: 0, prayer: 0,
    });
  });

  test('strips leading + signs from positive values', () => {
    const result = parseInfoboxBonuses(TRICKY_FORMAT_WIKITEXT);
    expect(result.astab).toBe(15);
    expect(result.str).toBe(10);
    expect(result.prayer).toBe(2);
  });

  test('handles unicode minus signs (−) as negative numbers', () => {
    const result = parseInfoboxBonuses(UNICODE_MINUS_WIKITEXT);
    expect(result.amagic).toBe(-6);
    expect(result.arange).toBe(-3);
    expect(result.dmagic).toBe(-1);
  });

  test('returns null when no Infobox Bonuses template is present', () => {
    const result = parseInfoboxBonuses('{{Infobox Item|name = Rune full helm}}');
    expect(result).toBeNull();
  });

  test('handles infobox preceded by other content', () => {
    const wikitext = `Some intro text.\n\n${RUNE_FULL_HELM_WIKITEXT}\n\nMore text.`;
    const result = parseInfoboxBonuses(wikitext);
    expect(result.dstab).toBe(30);
  });
});

// ── compareItem ───────────────────────────────────────────────────────────────

const RUNE_FULL_HELM_LOCAL = {
  name: 'Rune full helm',
  slot: 'head',
  regions: [],
  requirements: [{ skill: 'Defence', level: 40 }],
  bonuses: {
    attack:  { stab: 0, slash: 0, crush: 0, magic: -6, ranged: -3 },
    defence: { stab: 30, slash: 32, crush: 27, magic: -1, ranged: 30 },
    other:   { meleeStrength: 0, rangedStrength: 0, magicDamage: 0, prayer: 0 },
  },
};

const VOID_RANGER_HELM_LOCAL = {
  name: 'Void Ranger Helm',
  slot: 'head',
  regions: [],
  requirements: [{ skill: 'Attack', level: 40 }, { skill: 'Defence', level: 40 }],
  bonuses: {
    attack:  { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },
    defence: { stab: 6, slash: 6, crush: 6, magic: 6, ranged: 6 },
    other:   { meleeStrength: 0, rangedStrength: 0, magicDamage: 0, prayer: 0 },
  },
  sets: ['elite_void_range'],
};

describe('compareItem', () => {
  test('returns no mismatches when local data matches wiki (Rune full helm)', () => {
    const wikiStats = parseInfoboxBonuses(RUNE_FULL_HELM_WIKITEXT);
    expect(compareItem(RUNE_FULL_HELM_LOCAL, wikiStats)).toEqual([]);
  });

  test('returns no mismatches when local data matches wiki (Void Ranger Helm)', () => {
    const wikiStats = parseInfoboxBonuses(VOID_RANGER_HELM_WIKITEXT);
    expect(compareItem(VOID_RANGER_HELM_LOCAL, wikiStats)).toEqual([]);
  });

  test('detects a mismatch in a single field', () => {
    const wikiStats = parseInfoboxBonuses(RUNE_FULL_HELM_WIKITEXT);
    const badItem = {
      ...RUNE_FULL_HELM_LOCAL,
      bonuses: {
        ...RUNE_FULL_HELM_LOCAL.bonuses,
        defence: { ...RUNE_FULL_HELM_LOCAL.bonuses.defence, stab: 99 },
      },
    };
    const mismatches = compareItem(badItem, wikiStats);
    expect(mismatches).toHaveLength(1);
    expect(mismatches[0]).toEqual({ field: 'dstab', local: 99, wiki: 30 });
  });

  test('detects multiple mismatches', () => {
    const wikiStats = parseInfoboxBonuses(RUNE_FULL_HELM_WIKITEXT);
    const badItem = {
      ...RUNE_FULL_HELM_LOCAL,
      bonuses: {
        attack:  { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 0 },  // amagic and arange wrong
        defence: { stab: 30, slash: 32, crush: 27, magic: -1, ranged: 30 },
        other:   { meleeStrength: 0, rangedStrength: 0, magicDamage: 0, prayer: 0 },
      },
    };
    const mismatches = compareItem(badItem, wikiStats);
    const fields = mismatches.map(m => m.field);
    expect(fields).toContain('amagic');
    expect(fields).toContain('arange');
  });

  test('reports MISSING for fields absent from local bonuses', () => {
    const wikiStats = { dstab: 30 };
    const itemWithoutBonuses = { name: 'Test', bonuses: {} };
    const mismatches = compareItem(itemWithoutBonuses, wikiStats);
    expect(mismatches[0]).toEqual({ field: 'dstab', local: 'MISSING', wiki: 30 });
  });

  test('skips wiki fields not present in the parsed infobox', () => {
    // Empty wikiStats means wiki had no parseable fields — nothing to compare
    expect(compareItem(RUNE_FULL_HELM_LOCAL, {})).toEqual([]);
  });
});
