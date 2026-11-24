import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import {
  deriveComparison,
  formatScoreOutcome,
  getComparisonObservation,
  getMeasurementFreshness,
  getMetricCoverage,
  getSharedPlatforms,
  getComparisonOutcome,
  isExactDateMatch,
  getScoreOutcome,
} from './comparisonViewModel.js';
import { mergeBrowserData } from './mergeBrowserData.js';
import { getComparisonMetric } from './comparisonMetrics.js';

const record = (score, version = 'first') => ({
  observationId: `obs-${version}-${score}`,
  version,
  date: '2026-01-01',
  scores: { speedometer3: score },
});
const browsers = [
  {
    name: 'Browser A',
    logo: '/a',
    windows: {
      engineVariants: [
        { engine: 'Blink', versions: [record(10), record(99, 'later')] },
        { engine: 'WebKit', versions: [record(5)] },
      ],
    },
  },
  { name: 'Browser B', windows: { engine: 'Gecko', versions: [record(7)] } },
];

test('score outcomes apply precision, positive denominators and order consistently', () => {
  const available = (score) => ({ state: 'available', score });
  const result = getScoreOutcome(available(10), available(8));
  assert.deepEqual(result, { state: 'a', percent: 25 });
  assert.equal(
    formatScoreOutcome(result, 'A', 'B'),
    'A has the higher recorded score (25.0% higher than B).'
  );
  const reversed = getScoreOutcome(available(8), available(10));
  assert.equal(formatScoreOutcome(reversed, 'B', 'A'), formatScoreOutcome(result, 'A', 'B'));
  assert.deepEqual(getScoreOutcome(available(10), available(10)), { state: 'tie' });
  assert.deepEqual(getScoreOutcome(available(10.001), available(10.002)), {
    state: 'displayed-tie',
  });
  assert.equal(
    formatScoreOutcome(getScoreOutcome(available(10.001), available(10.002)), 'A', 'B'),
    'Same displayed score.'
  );
  assert.equal(getScoreOutcome(available(10), available(3)).percent.toFixed(1), '233.3');
  for (const score of [0, -1, Infinity, NaN]) {
    assert.equal(getScoreOutcome(available(10), available(score)).state, 'unavailable');
  }
  assert.equal(getScoreOutcome(available(10), { state: 'missing-metric' }).state, 'unavailable');
  assert.equal(getScoreOutcome(available(10), available(8), false).state, 'incompatible');
  assert.match(
    formatScoreOutcome(getScoreOutcome(available(10), available(8), false), 'A', 'B'),
    /incompatible/
  );
});

test('ad-blocking comparisons retain zero, use percentage points and distinguish missing data', () => {
  const adblock = getComparisonMetric('adblock');
  const data = [
    {
      name: 'Browser A',
      windows: {
        engine: 'Blink',
        versions: [
          { ...record(10), scores: { speedometer3: 10, adblock: null } },
          { version: 'older-adblock', date: '2025-12-01', scores: { adblock: 0 } },
        ],
      },
    },
    {
      name: 'Browser B',
      windows: {
        engine: 'Gecko',
        versions: [{ version: 'current', date: '2026-01-01', scores: { adblock: 35 } }],
      },
    },
  ];
  const model = deriveComparison(data, 'browser-a', 'browser-b', {}, 'adblock');
  const windows = model.platforms.find((platform) => platform.id === 'windows');
  assert.equal(windows.a.state, 'available');
  assert.equal(windows.a.score, 0);
  assert.equal(windows.a.record.version, 'older-adblock');
  assert.equal(windows.outcome, 'b');
  const result = getScoreOutcome(windows.a, windows.b, true, adblock);
  assert.deepEqual(result, { state: 'b', difference: 35 });
  assert.equal(
    formatScoreOutcome(result, 'A', 'B', adblock),
    'B has the higher recorded ad-blocking test score (35 percentage points higher).'
  );
  assert.equal(getMetricCoverage(model.platforms).observations, 2);
  assert.equal(getMetricCoverage(model.platforms).sharedPlatforms, 1);

  const missing = getComparisonObservation(
    { windows: { versions: [{ scores: { adblock: null } }] } },
    'windows',
    undefined,
    'adblock'
  );
  assert.equal(missing.state, 'missing-metric');
  for (const score of [-1, 101, Infinity]) {
    assert.equal(
      getComparisonObservation(
        { windows: { versions: [{ scores: { adblock: score } }] } },
        'windows',
        undefined,
        'adblock'
      ).state,
      'invalid-metric'
    );
  }
});

test('freshness uses recorded calendar dates and the 180-day threshold', () => {
  const now = new Date('2026-11-24T00:00:00Z');
  assert.equal(getMeasurementFreshness('2026-05-28', now), 'current');
  assert.equal(getMeasurementFreshness('2026-05-27', now), 'older');
  for (const date of [null, '', '2026-02-30', 'not a date']) {
    assert.equal(getMeasurementFreshness(date, now), 'unknown');
  }
});

test('shared-platform coverage honors exact dates only for historical selections', () => {
  const available = (date, score) => ({
    state: 'available',
    score,
    record: { date },
  });
  const platforms = [
    { id: 'current', a: available('2026-03-01', 10), b: available('2026-02-28', 8) },
    { id: 'matched', a: available('2026-03-01', 10), b: available('2026-03-01', 8) },
    { id: 'missing', a: available('2026-03-01', 10), b: { state: 'missing-metric' } },
  ];
  assert.deepEqual(
    getSharedPlatforms(platforms).map(({ id }) => id),
    ['current', 'matched']
  );
  assert.deepEqual(
    getSharedPlatforms(platforms, new Set(['current', 'matched'])).map(({ id }) => id),
    ['matched']
  );
  assert.deepEqual(getComparisonOutcome(platforms[0], true), { state: 'unavailable' });
  assert.deepEqual(getComparisonOutcome(platforms[1], true), { state: 'a', percent: 25 });
});

test('derives identity, coverage, first observation and engine-specific outcome', () => {
  const model = deriveComparison(browsers, 'browser-a', 'browser-b');
  const windows = model.platforms.find((p) => p.id === 'windows');
  assert.equal(windows.a.score, 10);
  assert.equal(windows.a.record.version, 'first');
  assert.deepEqual(windows.a.engines, ['Blink', 'WebKit']);
  assert.equal(windows.outcome, 'a');
  assert.equal(model.browserA.windows, undefined);
  assert.equal(
    deriveComparison(browsers, 'browser-a', 'browser-b', {
      'browser-a': { windows: 'WebKit' },
    }).platforms.find((p) => p.id === 'windows').outcome,
    'b'
  );
  assert.equal(deriveComparison(browsers, 'browser-a', 'browser-a'), null);
  assert.equal(deriveComparison(browsers, 'unknown', 'browser-b'), null);
});

test('historical selection resolves by stable ID and only compares exact matching dates', () => {
  const history = [
    {
      observationId: 'obs-a-new',
      version: 'beta (2026-03-02)',
      date: '2026-03-02',
      scores: { speedometer3: 12 },
    },
    {
      observationId: 'obs-a-old',
      version: 'nightly-2026-02-01',
      date: '2026-02-01',
      scores: { speedometer3: 10 },
    },
  ];
  const otherHistory = [
    {
      observationId: 'obs-b-new',
      version: 'release channel',
      date: '2026-03-03',
      scores: { speedometer3: 15 },
    },
    {
      observationId: 'obs-b-match',
      version: 'build 02/01',
      date: '2026-02-01',
      scores: { speedometer3: 9 },
    },
  ];
  const pair = [
    { name: 'Browser A', windows: { engine: 'Blink', versions: history } },
    { name: 'Browser B', windows: { engine: 'Gecko', versions: otherHistory } },
  ];
  const unmatched = deriveComparison(pair, 'browser-a', 'browser-b', {}, undefined, {
    'browser-a': { windows: 'obs-a-old' },
    'browser-b': { windows: 'obs-b-new' },
  }).platforms.find(({ id }) => id === 'windows');
  assert.equal(unmatched.a.record.version, 'nightly-2026-02-01');
  assert.equal(unmatched.b.record.version, 'release channel');
  assert.equal(unmatched.outcome, 'unavailable');
  assert.equal(isExactDateMatch(unmatched.a, unmatched.b), false);

  const matched = deriveComparison(pair, 'browser-a', 'browser-b', {}, undefined, {
    'browser-a': { windows: 'obs-a-old' },
    'browser-b': { windows: 'obs-b-match' },
  }).platforms.find(({ id }) => id === 'windows');
  assert.equal(isExactDateMatch(matched.a, matched.b), true);
  assert.equal(matched.outcome, 'a');
  assert.equal(
    getComparisonObservation(pair[0], 'windows', undefined, undefined, 'unknown').state,
    'missing-observation'
  );
});

test('distinguishes absent and invalid observations', () => {
  assert.equal(getComparisonObservation(null, 'windows').state, 'missing-browser');
  assert.equal(getComparisonObservation({}, 'windows').state, 'missing-platform');
  assert.equal(getComparisonObservation({ windows: {} }, 'windows').state, 'missing-version');
  assert.equal(
    getComparisonObservation({ windows: { versions: [{}] } }, 'windows').state,
    'missing-metric'
  );
  for (const score of [0, -1, Infinity, NaN, '10']) {
    assert.equal(
      getComparisonObservation({ windows: { versions: [record(score)] } }, 'windows').state,
      'invalid-metric'
    );
  }
  assert.equal(getComparisonObservation(browsers[0], 'windows', 'Gecko').state, 'missing-engine');
});

// Frozen snapshot of real records with known quirks; see generatedFrom in the fixture.
const fixture = JSON.parse(
  fs.readFileSync(new URL('./__fixtures__/comparison-browsers.json', import.meta.url))
);
const real = mergeBrowserData(fixture.catalog, fixture.platforms);
const platformOf = (model, id) => model.platforms.find((p) => p.id === id);

test('real data: Crest engine choice flips the macOS ARM outcome against Firefox', () => {
  const blink = platformOf(deriveComparison(real, 'crest', 'firefox'), 'macos-arm');
  assert.deepEqual(blink.a.engines, ['Blink', 'WebKit']);
  assert.equal(blink.a.engine, 'Blink');
  assert.equal(blink.a.score, 44.88);
  assert.equal(blink.b.score, 43.5);
  assert.equal(blink.outcome, 'a');

  const webkit = platformOf(
    deriveComparison(real, 'crest', 'firefox', { crest: { 'macos-arm': 'WebKit' } }),
    'macos-arm'
  );
  assert.equal(webkit.a.engine, 'WebKit');
  assert.equal(webkit.a.score, 36.77);
  assert.equal(webkit.outcome, 'b');
});

test('real data: Floorp vs Firefox Beta has only one-sided platforms', () => {
  const model = deriveComparison(real, 'floorp', 'firefox-beta');
  assert.ok(model.platforms.every((p) => p.outcome === 'unavailable'));
  assert.ok(
    model.platforms.some((p) => p.a.state === 'available' && p.b.state === 'missing-platform')
  );
  assert.ok(
    model.platforms.some((p) => p.a.state === 'missing-platform' && p.b.state === 'available')
  );
});

test('real data: Deta Surf vs Web is a valid pair with no measurements', () => {
  const model = deriveComparison(real, 'deta-surf', 'web');
  assert.equal(model.browserA.slug, 'deta-surf');
  assert.equal(model.browserB.slug, 'web');
  assert.ok(
    model.platforms.every(
      (p) => p.a.state === 'missing-platform' && p.b.state === 'missing-platform'
    )
  );
});
