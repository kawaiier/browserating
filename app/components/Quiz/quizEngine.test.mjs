import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import { computeResults, computeUserTraits, rankBrowsers } from './quizEngine.js';

const realQuestions = JSON.parse(
  readFileSync(new URL('../../../public/data/quiz/questions.json', import.meta.url), 'utf8')
);
const realProfiles = JSON.parse(
  readFileSync(new URL('../../../public/data/quiz/browser-profiles.json', import.meta.url), 'utf8')
);

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

test('traits the user did not mention are neutral', () => {
  const candidates = [
    {
      id: 'low-unmentioned-traits',
      platforms: ['windows'],
      traits: { privacy: 8, speed: 1, ai: 1 },
    },
    {
      id: 'high-unmentioned-traits',
      platforms: ['windows'],
      traits: { privacy: 8, speed: 10, ai: 10 },
    },
  ];
  const ranked = rankBrowsers({ privacy: 3 }, candidates, ['windows']);

  assert.equal(ranked[0].matchScore, ranked[1].matchScore);
  assert.equal(ranked[0].matchPercentage, ranked[1].matchPercentage);
  assert.equal(ranked[0].matchPercentage, 80);
});

test('negative weights penalize traits the user explicitly rejects', () => {
  const candidates = [
    { id: 'low-ai', platforms: ['windows'], traits: { privacy: 8, ai: 1 } },
    { id: 'high-ai', platforms: ['windows'], traits: { privacy: 8, ai: 10 } },
  ];
  const ranked = rankBrowsers({ privacy: 3, ai: -2 }, candidates, ['windows']);

  assert.deepEqual(
    ranked.map((browser) => browser.id),
    ['low-ai', 'high-ai']
  );
  assert.ok(ranked[0].matchScore > ranked[1].matchScore);
  assert.deepEqual(
    rankBrowsers({ ai: -2 }, candidates, ['windows']).map((browser) => browser.id),
    ['low-ai', 'high-ai']
  );
});

test('the privacy-first but usable persona recommends Brave ahead of Tor', () => {
  const answers = [['platform-windows'], 'q1b', 'q2c', 'q3a', 'q4d', 'q5c', 'q6b', 'q7a', 'q8c'];
  const results = computeResults(answers, realQuestions, realProfiles);
  const braveRank = results.rankedBrowsers.findIndex((browser) => browser.id === 'brave');
  const torRank = results.rankedBrowsers.findIndex((browser) => browser.id === 'tor-browser');

  assert.equal(results.topResults[0].id, 'brave');
  assert.ok(braveRank >= 0 && braveRank < torRank);
});

test('match percentages calibrate the median eligible profile to 50 and the best to 100', () => {
  const candidates = [2, 4, 6, 8, 10].map((privacy, index) => ({
    id: `browser-${index}`,
    platforms: ['windows'],
    traits: { privacy },
  }));
  const ranked = rankBrowsers({ privacy: 1 }, candidates, ['windows']);

  assert.equal(ranked[0].matchScore, 10);
  assert.equal(ranked[0].matchPercentage, 100);
  assert.equal(ranked[2].matchScore, 6);
  assert.equal(ranked[2].matchPercentage, 50);
  assert.equal(ranked.at(-1).matchPercentage, 0);
});

test('selected open-source and no-AI answers are enforced as hard dealbreakers', () => {
  const openSourceAnswers = [
    ['platform-windows'],
    'q1b',
    'q2c',
    'q3a',
    'q4d',
    'q5c',
    'q6c',
    'q7a',
    'q8c',
  ];
  const openSourceResults = computeResults(openSourceAnswers, realQuestions, realProfiles);

  assert.deepEqual(openSourceResults.dealbreakers, { openSource: { min: 8 } });
  assert.ok(openSourceResults.rankedBrowsers.length > 0);
  assert.ok(
    [...openSourceResults.rankedBrowsers, ...openSourceResults.discontinuedResults].every(
      (browser) => browser.traits.openSource >= 8
    )
  );

  const noAiAnswers = [...openSourceAnswers.slice(0, 6), 'q6b', 'q7a', 'q8d'];
  const noAiResults = computeResults(noAiAnswers, realQuestions, realProfiles);

  assert.deepEqual(noAiResults.dealbreakers, { ai: { max: 2 } });
  assert.equal(noAiResults.userTraits.ai, -3);
  assert.ok(noAiResults.rankedBrowsers.length > 0);
  assert.ok(
    [...noAiResults.rankedBrowsers, ...noAiResults.discontinuedResults].every(
      (browser) => browser.traits.ai <= 2
    )
  );
});

test('only explicit rejections produce negative trait weights', () => {
  assert.equal(computeUserTraits(['q5a'], realQuestions).privacy, 0);
  assert.equal(computeUserTraits(['q8d'], realQuestions).ai, -3);
});

test('small eligible sets keep close scores close instead of 0 and 100', () => {
  const candidates = [
    { id: 'close-high', platforms: ['windows'], traits: { privacy: 9 } },
    { id: 'close-low', platforms: ['windows'], traits: { privacy: 8 } },
  ];
  const ranked = rankBrowsers({ privacy: 1 }, candidates, ['windows']);

  assert.deepEqual(
    ranked.map((browser) => browser.matchPercentage),
    [90, 80]
  );
});

test('answers no profile can satisfy produce an empty result set', () => {
  const answers = [['platform-ios'], 'q1b', 'q2c', 'q3a', 'q4d', 'q5c', 'q6c', 'q7a', 'q8d'];
  const results = computeResults(answers, realQuestions, realProfiles);

  assert.deepEqual(results.topResults, []);
  assert.deepEqual(results.rankedBrowsers, []);
  assert.deepEqual(results.discontinuedResults, []);
});
