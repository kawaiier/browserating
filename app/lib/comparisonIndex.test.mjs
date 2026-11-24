import assert from 'node:assert/strict';
import test from 'node:test';
import fixture from './__fixtures__/comparison-browsers.json' with { type: 'json' };
import { mergeBrowserData } from './mergeBrowserData.js';

const browsers = mergeBrowserData(fixture.catalog, fixture.platforms);
import { deriveComparison } from './comparisonViewModel.js';
import {
  hasSharedMeasurement,
  indexableComparisonSlugs,
  randomComparisonSample,
} from './comparisonIndex.js';
import { canonicalPair, parsePairSlug } from './comparisonUrl.js';

test('random comparison sampling is a non-mutating shuffle', () => {
  const candidates = ['a', 'b', 'c'];
  const sample = randomComparisonSample(candidates, 3, () => 0.99);
  assert.deepEqual(sample, ['c', 'a', 'b']);
  assert.deepEqual(candidates, ['a', 'b', 'c']);
});

test('index candidates are exactly canonical pairs with shared default measurements', () => {
  const candidates = indexableComparisonSlugs(browsers);
  const slugs = new Set(candidates.map(({ slug }) => slug));
  assert.equal(slugs.size, candidates.length);
  for (const { slug } of candidates) {
    const pair = parsePairSlug(slug);
    assert.equal(canonicalPair(...pair).slug, slug);
    assert.equal(canonicalPair(...pair).reversed, false);
    assert.ok(hasSharedMeasurement(deriveComparison(browsers, ...pair)), slug);
  }
  assert.ok(slugs.has('crest-vs-firefox'));
  assert.ok(!slugs.has('firefox-beta-vs-floorp'));
});
