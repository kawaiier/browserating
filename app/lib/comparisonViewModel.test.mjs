import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import {
  deriveComparison,
  getComparisonObservation,
  getMeasurementFreshness,
} from './comparisonViewModel.js';
import { mergeBrowserData } from './mergeBrowserData.js';

const record = (score, version = 'first') => ({
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

test('freshness uses recorded calendar dates and the 180-day threshold', () => {
  const now = new Date('2026-11-24T00:00:00Z');
  assert.equal(getMeasurementFreshness('2026-05-28', now), 'current');
  assert.equal(getMeasurementFreshness('2026-05-27', now), 'older');
  for (const date of [null, '', '2026-02-30', 'not a date']) {
    assert.equal(getMeasurementFreshness(date, now), 'unknown');
  }
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
