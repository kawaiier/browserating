import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import { indexableComparisonSlugs } from './comparisonIndex.js';
import { getObservationSourceLabel } from './benchmarkProvenance.js';
import { comparisonOptions } from './comparisonOptions.js';
import { generatePairSlugs } from './comparisonUrl.js';
import { mergeBrowserData } from './mergeBrowserData.js';
import { platformNames } from './platformDefinitions.js';
import { validateBenchmarkData } from './validateBenchmarkData.js';

const readData = (filename) =>
  JSON.parse(readFileSync(new URL(`../../public/data/${filename}`, import.meta.url), 'utf8'));
const liveCatalog = readData('browsers.json');
const livePlatforms = Object.fromEntries(
  Object.keys(platformNames).map((platform) => [platform, readData(`${platform}.json`)])
);

let nextObservationId = 0;
const version = (overrides = {}) => ({
  observationId: `obs-test-${++nextObservationId}`,
  version: '1.0',
  date: '2026-01-02',
  scores: { speedometer3: 10 },
  ...overrides,
});
const record = (overrides = {}) => ({
  name: 'Browser A',
  engine: 'Blink',
  versions: [version()],
  ...overrides,
});
function validDataset() {
  return {
    catalog: [{ name: 'Browser A' }, { name: 'Browser B' }],
    platforms: Object.fromEntries(
      Object.keys(platformNames).map((platform) => [platform, [record()]])
    ),
  };
}

const errorMessages = (dataset) =>
  validateBenchmarkData(dataset.catalog, dataset.platforms).errors.join('\n');

test('live benchmark files satisfy the validation contract', () => {
  const { errors } = validateBenchmarkData(liveCatalog, livePlatforms);
  assert.deepEqual(errors, []);
});

test('catalog names and generated slugs must be unique and usable', () => {
  const dataset = validDataset();
  dataset.catalog.push({ name: 'browser a' }, { name: 'Browser A' }, { name: 'Left vs Right' });
  const errors = errorMessages(dataset);
  assert.match(errors, /duplicate catalog name/);
  assert.match(errors, /slug "browser-a" collides/);
  assert.match(errors, /does not produce a valid browser slug/);
});

test('platform datasets require supported keys, catalog joins, and unique engine records', () => {
  const dataset = validDataset();
  dataset.platforms.windows.push(record());
  dataset.platforms.windows.push(record({ engine: 'WebKit' }));
  assert.match(errorMessages(dataset), /duplicate browser\/platform\/engine record/);

  dataset.platforms.windows = [record({ name: 'Unknown Browser' })];
  assert.match(errorMessages(dataset), /does not match a catalog browser/);

  dataset.platforms.plan9 = [record()];
  assert.match(errorMessages(dataset), /unsupported platform key/);
});

test('different engines are allowed and the first-listed engine remains primary', () => {
  const dataset = validDataset();
  dataset.platforms['macos-arm'] = [record(), record({ engine: 'WebKit' })];
  assert.deepEqual(validateBenchmarkData(dataset.catalog, dataset.platforms).errors, []);

  const merged = mergeBrowserData(dataset.catalog, dataset.platforms);
  assert.equal(merged[0]['macos-arm'].engine, 'Blink');
  assert.deepEqual(
    merged[0]['macos-arm'].engineVariants.map(({ engine }) => engine),
    ['Blink', 'WebKit']
  );
});

test('community provenance is explicit, validated, and retained by merged observations', () => {
  const dataset = validDataset();
  const observation = dataset.platforms.windows[0].versions[0];
  observation.source = 'community';
  observation.cohortId = 'desktop-arm-v1';
  assert.equal(
    getObservationSourceLabel(observation),
    'Community-reported · cohort desktop-arm-v1'
  );
  assert.deepEqual(validateBenchmarkData(dataset.catalog, dataset.platforms).errors, []);
  assert.equal(
    mergeBrowserData(dataset.catalog, dataset.platforms)[0].windows.versions[0].cohortId,
    'desktop-arm-v1'
  );
  assert.equal(
    getObservationSourceLabel(dataset.platforms.android[0].versions[0]),
    'Curated benchmark dataset'
  );

  const missingCohort = validDataset();
  missingCohort.platforms.windows[0].versions[0].source = 'community';
  assert.match(errorMessages(missingCohort), /cohortId: required for community observations/);

  const invalidSource = validDataset();
  invalidSource.platforms.windows[0].versions[0].source = 'unknown';
  assert.match(errorMessages(invalidSource), /source: expected one of: curated, community/);

  const invalidCohort = validDataset();
  Object.assign(invalidCohort.platforms.windows[0].versions[0], {
    source: 'community',
    cohortId: '../private',
  });
  assert.match(
    errorMessages(invalidCohort),
    /cohortId: expected a 1–64 character cohort identifier/
  );
});

test('observation IDs are required and globally unique', () => {
  const missing = validDataset();
  delete missing.platforms.windows[0].versions[0].observationId;
  assert.match(errorMessages(missing), /observationId: expected a stable non-empty observation ID/);

  const duplicate = validDataset();
  duplicate.platforms.android[0].versions[0].observationId =
    duplicate.platforms.windows[0].versions[0].observationId;
  assert.match(errorMessages(duplicate), /duplicate observation ID/);
});

test('version structure and metric-specific rules reject malformed values', () => {
  const dataset = validDataset();
  dataset.platforms.windows[0].versions[0].version = '';
  dataset.platforms.windows[0].versions[0].scores = null;
  assert.match(
    errorMessages(dataset),
    /versions\[0\]\.version: expected a non-empty version string/
  );
  assert.match(errorMessages(dataset), /versions\[0\]\.scores: expected a scores object/);

  for (const [metric, values] of [
    ['speedometer3', [0, -1, Infinity, '10']],
    ['ram', [0, -1, Infinity, '100']],
    ['adblock', [-1, 100.1, Infinity, '0']],
  ]) {
    for (const value of values) {
      const invalid = validDataset();
      invalid.platforms.windows[0].versions[0].scores[metric] = value;
      assert.match(errorMessages(invalid), new RegExp(`scores\\.${metric}: expected`));
    }
  }
});

test('absent optional measurements and a zero ad-block score are valid unknown/known values', () => {
  const dataset = validDataset();
  const scores = dataset.platforms.windows[0].versions[0].scores;
  scores.speedometer3 = null;
  delete scores.ram;
  scores.adblock = 0;
  assert.deepEqual(validateBenchmarkData(dataset.catalog, dataset.platforms).errors, []);
});

test('dates must be valid and newest-first; unknown or equal dates are reported, not guessed', () => {
  const invalidDate = validDataset();
  invalidDate.platforms.windows[0].versions[0].date = '2026-02-30';
  assert.match(errorMessages(invalidDate), /valid YYYY-MM-DD calendar date/);

  const outOfOrder = validDataset();
  outOfOrder.platforms.windows[0].versions.push(version({ date: '2026-01-03' }));
  assert.match(errorMessages(outOfOrder), /not newest-first/);

  const ambiguous = validDataset();
  ambiguous.platforms.windows[0].versions.push(version({ date: '2026-01-02' }));
  ambiguous.platforms.windows[0].versions.push(version({ date: null }));
  const result = validateBenchmarkData(ambiguous.catalog, ambiguous.platforms);
  assert.deepEqual(result.errors, []);
  assert.ok(result.warnings.some((message) => message.includes('order is ambiguous')));
  assert.ok(result.warnings.some((message) => message.includes('date is unknown')));

  const missing = validDataset();
  delete missing.platforms.windows[0].versions[0].date;
  assert.deepEqual(validateBenchmarkData(missing.catalog, missing.platforms).errors, []);
});

test('release candidates are recomputed from live primary-engine shared coverage', () => {
  const browsers = mergeBrowserData(liveCatalog, livePlatforms);
  const candidates = indexableComparisonSlugs(browsers);
  const options = comparisonOptions(browsers);
  const coverage = new Map(options.map(({ slug, platforms }) => [slug, platforms]));
  const expected = generatePairSlugs(options.map(({ slug }) => slug)).filter(
    ({ browserA, browserB }) =>
      coverage.get(browserA).some((platform) => coverage.get(browserB).includes(platform))
  );

  assert.deepEqual(candidates, expected);
  for (const { slug, browserA, browserB } of candidates) {
    assert.equal(slug, `${browserA}-vs-${browserB}`);
    assert.ok(browserA < browserB);
    assert.ok(coverage.get(browserA).some((platform) => coverage.get(browserB).includes(platform)));
  }
});
