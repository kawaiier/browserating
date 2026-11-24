import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import {
  buildCompareUrl,
  canonicalPair,
  generatePairSlugs,
  parsePairSlug,
  parseViewState,
  resolveCompareRequest,
  validateEngines,
} from './comparisonUrl.js';
import { getBrowserSlug } from './getBrowserSlug.js';

test('parsePairSlug accepts exactly two distinct non-empty slugs', () => {
  assert.deepEqual(parsePairSlug('firefox-vs-google-chrome'), ['firefox', 'google-chrome']);
  for (const bad of [
    'firefox',
    'firefox-vs-',
    '-vs-firefox',
    'firefox-vs-firefox',
    'firefox-vs-google-chrome-vs-brave',
    '',
    undefined,
  ]) {
    assert.equal(parsePairSlug(bad), null, String(bad));
  }
});

test('canonicalPair sorts lexicographically and reports reversal', () => {
  assert.deepEqual(canonicalPair('google-chrome', 'firefox'), {
    slug: 'firefox-vs-google-chrome',
    first: 'firefox',
    second: 'google-chrome',
    reversed: true,
  });
  assert.equal(canonicalPair('firefox', 'google-chrome').reversed, false);
});

test('buildCompareUrl is canonical, deterministic and keeps engines attached to browsers', () => {
  assert.equal(
    buildCompareUrl({ first: 'firefox', second: 'google-chrome' }),
    '/compare/firefox-vs-google-chrome'
  );
  assert.equal(
    buildCompareUrl({ first: 'google-chrome', second: 'firefox' }),
    '/compare/firefox-vs-google-chrome?order=reverse'
  );
  const engines = { crest: { 'macos-arm': 'WebKit' } };
  const forward = buildCompareUrl({ first: 'crest', second: 'firefox', engines });
  const swapped = buildCompareUrl({ first: 'firefox', second: 'crest', engines });
  assert.equal(forward, '/compare/crest-vs-firefox?engine.crest.macos-arm=WebKit');
  assert.equal(swapped, '/compare/crest-vs-firefox?engine.crest.macos-arm=WebKit&order=reverse');
});

test('parseViewState ignores repeated keys, malformed engine keys and non-reverse order', () => {
  const state = parseViewState({
    order: 'reverse',
    'engine.crest.macos-arm': 'WebKit',
    'engine.crest.windows': ['Blink', 'WebKit'],
    'engine.crest': 'Blink',
    'engine.crest.macos-arm.extra': 'Blink',
    utm_source: 'x',
  });
  assert.deepEqual(state, {
    reverse: true,
    platform: null,
    engines: { crest: { 'macos-arm': 'WebKit' } },
  });
  assert.equal(parseViewState({ order: 'forward' }).reverse, false);
  assert.equal(parseViewState(undefined).reverse, false);
});

test('platform state is validated and survives canonical redirects and swaps', () => {
  assert.equal(parseViewState({ platform: 'windows' }).platform, 'windows');
  assert.equal(parseViewState({ platform: 'unknown' }).platform, null);
  assert.equal(parseViewState({ platform: ['windows', 'android'] }).platform, null);
  const engines = { crest: { 'macos-arm': 'WebKit' } };
  assert.equal(
    buildCompareUrl({ first: 'firefox', second: 'crest', platform: 'macos-arm', engines }),
    '/compare/crest-vs-firefox?engine.crest.macos-arm=WebKit&order=reverse&platform=macos-arm'
  );
  assert.deepEqual(
    resolveCompareRequest(
      'firefox-vs-crest',
      new URLSearchParams('platform=windows'),
      new Set(['firefox', 'crest'])
    ),
    {
      type: 'redirect',
      url: '/compare/crest-vs-firefox?order=reverse&platform=windows',
    }
  );
});

test('validateEngines keeps only engines available for that browser and platform', () => {
  const model = {
    browserA: { slug: 'crest' },
    browserB: { slug: 'firefox' },
    platforms: [
      { id: 'macos-arm', a: { engines: ['Blink', 'WebKit'] }, b: { engines: ['Gecko'] } },
      { id: 'windows', a: { engines: [] }, b: { engines: ['Gecko'] } },
    ],
  };
  const valid = validateEngines(
    {
      crest: { 'macos-arm': 'WebKit', windows: 'Blink' },
      firefox: { 'macos-arm': 'Blink' },
      unknown: { 'macos-arm': 'Blink' },
    },
    model
  );
  assert.deepEqual(valid, { crest: { 'macos-arm': 'WebKit' } });
  assert.deepEqual(validateEngines({ crest: {} }, null), {});
});

test('generatePairSlugs emits only canonical slugs, and parse/build round-trips', () => {
  const catalog = JSON.parse(
    fs.readFileSync(new URL('../../public/data/browsers.json', import.meta.url))
  );
  const slugs = catalog.map((browser) => getBrowserSlug(browser.name));
  assert.equal(new Set(slugs).size, slugs.length, 'catalog slugs are unique');
  assert.ok(
    slugs.every((slug) => !slug.includes('-vs-')),
    'no slug contains the pair separator'
  );
  const pairs = generatePairSlugs(slugs.slice(0, 15));
  assert.equal(pairs.length, 105);
  for (const pair of pairs) {
    const parts = parsePairSlug(pair.slug);
    assert.ok(parts, pair.slug);
    assert.equal(canonicalPair(...parts).reversed, false, `${pair.slug} is canonical`);
    assert.equal(buildCompareUrl({ first: parts[0], second: parts[1] }), `/compare/${pair.slug}`);
  }
});

test('resolveCompareRequest returns 404, redirect or render decisions', () => {
  const known = new Set(['crest', 'firefox', 'google-chrome']);
  const resolve = (slug, query = '') =>
    resolveCompareRequest(slug, new URLSearchParams(query), known);
  assert.deepEqual(resolve('firefox-vs-google-chrome'), { type: 'render' });
  assert.deepEqual(resolve('firefox-vs-google-chrome', 'order=reverse&junk=1'), { type: 'render' });
  for (const slug of ['unknown-vs-firefox', 'firefox-vs-firefox', 'a-vs-b-vs-c', 'firefox', null]) {
    assert.deepEqual(resolve(slug), { type: 'not-found' }, String(slug));
  }
  assert.deepEqual(resolve('google-chrome-vs-firefox'), {
    type: 'redirect',
    url: '/compare/firefox-vs-google-chrome?order=reverse',
  });
  // Legacy reversed path: incoming order ignored, junk and other browsers' engines dropped,
  // repeated keys ignored, pair engines kept attached to their browser.
  assert.deepEqual(
    resolve(
      'firefox-vs-crest',
      'order=reverse&utm_source=x&engine.crest.macos-arm=WebKit&engine.brave.windows=Blink&engine.firefox.windows=A&engine.firefox.windows=B'
    ),
    {
      type: 'redirect',
      url: '/compare/crest-vs-firefox?engine.crest.macos-arm=WebKit&order=reverse',
    }
  );
});
