// Pure comparison URL rules shared by the route, metadata, sitemap and link producers.
// No React or Next.js imports, so these helpers run in server, client and `node --test`.

export const PAIR_SEPARATOR = '-vs-';
const ENGINE_PREFIX = 'engine.';

/** Splits a pair slug into two distinct, non-empty browser slugs, or returns null. */
export function parsePairSlug(slug) {
  if (typeof slug !== 'string') return null;
  const parts = slug.split(PAIR_SEPARATOR);
  if (parts.length !== 2 || !parts[0] || !parts[1] || parts[0] === parts[1]) return null;
  return parts;
}

/** Canonical identity is the two slugs in lexicographic order. */
export function canonicalPair(a, b) {
  const reversed = a > b;
  const [first, second] = reversed ? [b, a] : [a, b];
  return { slug: `${first}${PAIR_SEPARATOR}${second}`, first, second, reversed };
}

/**
 * Reads view state from Next.js searchParams. Repeated keys arrive as arrays and are
 * ignored. `order` is relative to the canonical sort and only `reverse` is meaningful.
 * Engine values are returned raw; callers validate them against the comparison model.
 */
export function parseViewState(query = {}) {
  const engines = {};
  for (const [key, value] of Object.entries(query || {})) {
    if (typeof value !== 'string' || !key.startsWith(ENGINE_PREFIX)) continue;
    const [slug, platform, ...rest] = key.slice(ENGINE_PREFIX.length).split('.');
    if (!slug || !platform || rest.length || !value) continue;
    (engines[slug] ||= {})[platform] = value;
  }
  return { reverse: query?.order === 'reverse', engines };
}

/** Keeps only engine choices that exist for that browser and platform in the model. */
export function validateEngines(engines, model) {
  const valid = {};
  if (!model) return valid;
  const sides = [
    [model.browserA.slug, 'a'],
    [model.browserB.slug, 'b'],
  ];
  for (const platform of model.platforms) {
    for (const [slug, side] of sides) {
      const value = engines?.[slug]?.[platform.id];
      if (value && platform[side].engines.includes(value)) {
        (valid[slug] ||= {})[platform.id] = value;
      }
    }
  }
  return valid;
}

/**
 * Builds a canonical comparison URL. `first` is the browser shown first; `engines` maps
 * browser slug → platform → engine. Query keys are sorted for deterministic output.
 */
export function buildCompareUrl({ first, second, engines = {} } = {}) {
  const pair = canonicalPair(first, second);
  const entries = [];
  for (const slug of [pair.first, pair.second]) {
    for (const [platformId, engine] of Object.entries(engines[slug] || {})) {
      if (engine) entries.push([`${ENGINE_PREFIX}${slug}.${platformId}`, engine]);
    }
  }
  if (pair.reversed) entries.push(['order', 'reverse']);
  entries.sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
  const query = new URLSearchParams(entries).toString();
  return `/compare/${pair.slug}${query ? `?${query}` : ''}`;
}

/** All canonical unordered pairs for the given slugs, in input order of the first member. */
export function generatePairSlugs(slugs) {
  const pairs = [];
  for (let i = 0; i < slugs.length; i++) {
    for (let j = i + 1; j < slugs.length; j++) {
      const { slug, first, second } = canonicalPair(slugs[i], slugs[j]);
      pairs.push({ slug, browserA: first, browserB: second });
    }
  }
  return pairs;
}
