import assert from 'node:assert/strict';
import test from 'node:test';
import fixture from './__fixtures__/comparison-browsers.json' with { type: 'json' };
import { mergeBrowserData } from './mergeBrowserData.js';
import { deriveComparison } from './comparisonViewModel.js';
import { comparisonCard } from './comparisonCard.js';

const browsers = mergeBrowserData(fixture.catalog, fixture.platforms);

test('card uses the default view: first shared platform, primary engines, page precision', () => {
  const data = deriveComparison(browsers, 'crest', 'firefox');
  const shared = data.platforms.find((p) => p.a.state === 'available' && p.b.state === 'available');
  const card = comparisonCard(data);
  assert.equal(card.title, 'Crest vs Firefox');
  assert.equal(card.platform, `${shared.label} · Speedometer 3.1`);
  assert.deepEqual(
    card.rows.map((row) => row.score),
    [shared.a.score.toFixed(2), shared.b.score.toFixed(2)]
  );
  assert.match(card.outcome, /higher recorded score|Same (recorded|displayed) score/);
});

test('evidence-poor pairs get no score card', () => {
  assert.equal(comparisonCard(deriveComparison(browsers, 'firefox-beta', 'floorp')), null);
  assert.equal(comparisonCard(null), null);
});
