import test from 'node:test';
import assert from 'node:assert/strict';
import { suggestPartners } from './comparisonOptions.js';

const options = [
  { slug: 'a', name: 'A', platforms: ['windows', 'android'] },
  { slug: 'b', name: 'B', platforms: [] },
  { slug: 'c', name: 'C', platforms: ['windows'] },
  { slug: 'd', name: 'D', platforms: ['windows', 'android', 'ipad'] },
  { slug: 'e', name: 'E', platforms: ['ipad'] },
  { slug: 'f', name: 'F', platforms: ['android'] },
];

test('suggestPartners ranks by shared coverage and excludes the current pair', () => {
  assert.deepEqual(suggestPartners(options, 'a', ['c']), [
    { slug: 'd', name: 'D', shared: 2 },
    { slug: 'f', name: 'F', shared: 1 },
  ]);
  assert.deepEqual(
    suggestPartners(options, 'a', [], 2).map((s) => s.slug),
    ['d', 'c']
  );
});

test('suggestPartners returns nothing for unmeasured or unknown browsers', () => {
  assert.deepEqual(suggestPartners(options, 'b'), []);
  assert.deepEqual(suggestPartners(options, 'zzz'), []);
});
