import assert from 'node:assert/strict';
import test from 'node:test';

import { computeResults, rankBrowsers } from './quizEngine.js';

const questions = [
  {
    id: 'platforms',
    selectionMode: 'multiple',
    options: [
      { id: 'windows', platforms: ['windows'] },
      { id: 'mac', platforms: ['macos-arm', 'macos-intel'] },
      { id: 'android', platforms: ['android'] },
    ],
  },
  {
    id: 'q1',
    options: [{ id: 'q1a', traits: { privacy: 1 } }],
  },
];

const profiles = [
  { id: 'windows-only', platforms: ['windows'], traits: { privacy: 8 } },
  { id: 'mac-intel-only', platforms: ['macos-intel'], traits: { privacy: 8 } },
  { id: 'mac-arm-only', platforms: ['macos-arm'], traits: { privacy: 8 } },
  { id: 'android-only', platforms: ['android'], traits: { privacy: 8 } },
  { id: 'windows-and-android', platforms: ['windows', 'android'], traits: { privacy: 8 } },
];

test('platform filtering excludes unsupported browsers before ranking', () => {
  const ranked = rankBrowsers({ privacy: 1 }, profiles, ['windows']);

  assert.deepEqual(ranked.map((browser) => browser.id).sort(), [
    'windows-and-android',
    'windows-only',
  ]);
});

test('rankBrowsers excludes discontinued profiles', () => {
  const discontinued = {
    ...profiles[0],
    id: 'discontinued',
    discontinued: true,
  };

  const ranked = rankBrowsers({ privacy: 1 }, [profiles[0], discontinued], ['windows']);

  assert.deepEqual(
    ranked.map((browser) => browser.id),
    ['windows-only']
  );
});

test('a Mac selection matches either supported Mac architecture', () => {
  const ranked = rankBrowsers({ privacy: 1 }, profiles, ['macos-arm', 'macos-intel']);

  assert.deepEqual(ranked.map((browser) => browser.id).sort(), ['mac-arm-only', 'mac-intel-only']);
});

test('computeResults supports multi-select as a union of selected platforms', () => {
  const results = computeResults([['windows', 'android'], 'q1a'], questions, profiles);

  assert.deepEqual(results.selectedPlatforms, ['windows', 'android']);
  assert.deepEqual(results.rankedBrowsers.map((browser) => browser.id).sort(), [
    'android-only',
    'windows-and-android',
    'windows-only',
  ]);
  assert.equal(
    results.topResults.some((browser) => browser.id === 'mac-arm-only'),
    false
  );
  assert.equal(
    results.topResults.some((browser) => browser.id === 'mac-intel-only'),
    false
  );
});

test('computeResults excludes discontinued browsers but notes one that would rank in the top three', () => {
  const makeProfile = (id, discontinued = false) => ({
    id,
    name: id,
    platforms: ['windows'],
    traits: { privacy: 10 },
    discontinued,
  });
  const browserProfiles = [
    makeProfile('discontinued', true),
    makeProfile('active-1'),
    makeProfile('active-2'),
    makeProfile('active-3'),
  ];

  const results = computeResults([['windows'], 'q1a'], questions, browserProfiles);

  assert.deepEqual(
    results.topResults.map((browser) => browser.id),
    ['active-1', 'active-2', 'active-3']
  );
  assert.deepEqual(
    results.rankedBrowsers.map((browser) => browser.id),
    ['active-1', 'active-2', 'active-3']
  );
  assert.deepEqual(
    results.discontinuedResults.map((browser) => browser.id),
    ['discontinued']
  );
});

test('computeResults only notes discontinued browsers that would rank in the top three', () => {
  const makeProfile = (id, discontinued = false) => ({
    id,
    name: id,
    platforms: ['windows'],
    traits: { privacy: 10 },
    discontinued,
  });
  const browserProfiles = [
    makeProfile('active-1'),
    makeProfile('active-2'),
    makeProfile('active-3'),
    makeProfile('discontinued', true),
  ];

  const results = computeResults([['windows'], 'q1a'], questions, browserProfiles);

  assert.deepEqual(
    results.topResults.map((browser) => browser.id),
    ['active-1', 'active-2', 'active-3']
  );
  assert.deepEqual(results.discontinuedResults, []);
});

test('no selected platform produces no eligible recommendations', () => {
  assert.deepEqual(rankBrowsers({ privacy: 1 }, profiles), []);
});
