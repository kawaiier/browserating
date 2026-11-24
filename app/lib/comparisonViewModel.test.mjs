import assert from 'node:assert/strict';
import test from 'node:test';
import { deriveComparison, getComparisonObservation } from './comparisonViewModel.js';

const record = (score, version = 'first') => ({ version, date: '2026-01-01', scores: { speedometer3: score } });
const browsers = [
  { name: 'Browser A', logo: '/a', windows: { engineVariants: [
    { engine: 'Blink', versions: [record(10), record(99, 'later')] },
    { engine: 'WebKit', versions: [record(5)] },
  ] } },
  { name: 'Browser B', windows: { engine: 'Gecko', versions: [record(7)] } },
];

test('derives identity, coverage, first observation and engine-specific outcome', () => {
  const model = deriveComparison(browsers, 'browser-a', 'browser-b');
  const windows = model.platforms.find((p) => p.id === 'windows');
  assert.equal(windows.a.score, 10);
  assert.equal(windows.a.record.version, 'first');
  assert.deepEqual(windows.a.engines, ['Blink', 'WebKit']);
  assert.equal(windows.outcome, 'a');
  assert.equal(model.browserA.windows, undefined);
  assert.equal(deriveComparison(browsers, 'browser-a', 'browser-b', { 'browser-a': { windows: 'WebKit' } }).platforms.find((p) => p.id === 'windows').outcome, 'b');
  assert.equal(deriveComparison(browsers, 'browser-a', 'browser-a'), null);
  assert.equal(deriveComparison(browsers, 'unknown', 'browser-b'), null);
});

test('distinguishes absent and invalid observations', () => {
  assert.equal(getComparisonObservation(null, 'windows').state, 'missing-browser');
  assert.equal(getComparisonObservation({}, 'windows').state, 'missing-platform');
  assert.equal(getComparisonObservation({ windows: {} }, 'windows').state, 'missing-version');
  assert.equal(getComparisonObservation({ windows: { versions: [{}] } }, 'windows').state, 'missing-metric');
  for (const score of [0, -1, Infinity, NaN, '10']) {
    assert.equal(getComparisonObservation({ windows: { versions: [record(score)] } }, 'windows').state, 'invalid-metric');
  }
  assert.equal(getComparisonObservation(browsers[0], 'windows', 'Gecko').state, 'missing-engine');
});
