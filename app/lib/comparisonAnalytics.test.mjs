import { test } from 'node:test';
import assert from 'node:assert/strict';
import { comparisonSourceFromReferrer } from './comparisonAnalytics.js';

const origin = 'https://browserating.com';

test('comparison source attribution only classifies known same-origin entry paths', () => {
  assert.equal(comparisonSourceFromReferrer(`${origin}/browsers/firefox`, origin), 'detail');
  assert.equal(comparisonSourceFromReferrer(`${origin}/quiz?answers=ignored`, origin), 'quiz');
  assert.equal(comparisonSourceFromReferrer(`${origin}/compare`, origin), 'hub');
  assert.equal(comparisonSourceFromReferrer(`${origin}/`, origin), 'rankings');
  assert.equal(
    comparisonSourceFromReferrer('https://example.com/private?secret=1', origin),
    'direct/unknown'
  );
  assert.equal(comparisonSourceFromReferrer(`${origin}/other?secret=1`, origin), 'direct/unknown');
});
