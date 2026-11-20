import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import { getBrowserSlug } from '../../lib/getBrowserSlug.js';
import { TRAIT_META } from '../../lib/quiz-constants.js';
import { ICON_MAP } from './quizOptionIcons.js';
import { TRAIT_KEYS, computeResults, computeUserTraits, rankBrowsers } from './quizEngine.js';

const realQuestions = JSON.parse(
  readFileSync(new URL('../../../public/data/quiz/questions.json', import.meta.url), 'utf8')
);
const realProfiles = JSON.parse(
  readFileSync(new URL('../../../public/data/quiz/browser-profiles.json', import.meta.url), 'utf8')
);
const siteBrowsers = JSON.parse(
  readFileSync(new URL('../../../public/data/browsers.json', import.meta.url), 'utf8')
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
  const makeProfile = (id, discontinued = false, privacy = 10) => ({
    id,
    name: id,
    platforms: ['windows'],
    traits: { privacy },
    discontinued,
  });
  const browserProfiles = [
    makeProfile('discontinued', true),
    makeProfile('active-1', false, 9),
    makeProfile('active-2', false, 9),
    makeProfile('active-3', false, 9),
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

test('raw match scores order candidates even when displayed percentages round to a tie', () => {
  const ranked = rankBrowsers(
    { privacy: 1 },
    [
      { id: 'chrome', platforms: ['windows'], traits: { privacy: 8.01 } },
      { id: 'higher-fit', platforms: ['windows'], traits: { privacy: 8.04 } },
    ],
    ['windows']
  );

  assert.deepEqual(
    ranked.map((browser) => browser.id),
    ['higher-fit', 'chrome']
  );
  assert.ok(ranked[0].matchScore > ranked[1].matchScore);
  assert.equal(ranked[0].matchPercentage, ranked[1].matchPercentage);
});

test('exact match-score ties use mainstream priority, then browser ID, not profile order', () => {
  const candidates = ['zeta', 'firefox', 'chrome', 'safari', 'alpha'].map((id) => ({
    id,
    platforms: ['windows'],
    traits: { privacy: 8 },
  }));
  const ranked = rankBrowsers({ privacy: 1 }, candidates, ['windows']);

  assert.deepEqual(
    ranked.map((browser) => browser.id),
    ['chrome', 'safari', 'firefox', 'alpha', 'zeta']
  );
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

const platformQuestion = realQuestions.find((question) => question.selectionMode === 'multiple');
const platformOptionIds = platformQuestion.options.map((option) => option.id);
const profileById = Object.fromEntries(realProfiles.map((profile) => [profile.id, profile]));
const OPTION_WEIGHT_TOTAL = 6;
const MAX_QUESTION_WEIGHT_GAP = 2; // Two points on the 0–6 option-weight scale.

const topIds = (answers, count = 3) =>
  computeResults(answers, realQuestions, realProfiles)
    .topResults.slice(0, count)
    .map((browser) => browser.id);

test('golden persona: a casual Big Tech user gets Chrome, Edge, or Safari in the top three', () => {
  for (const platform of platformOptionIds) {
    const answers = [[platform], 'q1d', 'q2d', 'q3a', 'q4a', 'q5a', 'q6a', 'q7a', 'q8c'];
    const top3 = topIds(answers);

    assert.ok(
      ['chrome', 'edge', 'safari'].some((id) => top3.includes(id)),
      `${platform}: got ${top3.join(', ')}`
    );
  }
});

test('golden persona: an AI enthusiast gets an AI-first browser in the top three', () => {
  const personas = [
    ['q1c', 'q2a', 'q3b', 'q4b', 'q5b', 'q6a', 'q7d', 'q8a'],
    ['q1d', 'q2a', 'q3a', 'q4a', 'q5a', 'q6a', 'q7d', 'q8a'],
    ['q1a', 'q2a', 'q3a', 'q4b', 'q5b', 'q6a', 'q7a', 'q8a'],
  ];

  for (const platform of platformOptionIds) {
    for (const persona of personas) {
      const top3 = topIds([[platform], ...persona]);
      assert.ok(
        top3.some((id) => profileById[id].traits.ai >= 8),
        `${platform} ${persona.join(',')}: got ${top3.join(', ')}`
      );
    }
  }
});

test('golden persona: privacy-first but usable never puts Tor or Mullvad first', () => {
  const personas = [
    ['q1b', 'q2c', 'q3a', 'q4d', 'q5c', 'q6b', 'q7a', 'q8c'],
    ['q1b', 'q2d', 'q3b', 'q4c', 'q5c', 'q6b', 'q7a', 'q8c'],
  ];

  for (const platform of platformOptionIds) {
    for (const persona of personas) {
      const ranked = computeResults(
        [[platform], ...persona],
        realQuestions,
        realProfiles
      ).rankedBrowsers.map((browser) => browser.id);
      const torRank = ranked.indexOf('tor-browser');

      assert.ok(
        !['tor-browser', 'mullvad-browser'].includes(ranked[0]),
        `${platform}: ${ranked[0]}`
      );
      assert.ok(torRank === -1 || ranked.indexOf('brave') < torRank, platform);
    }
  }
});

test('distribution guard: no browser dominates the top pick across all answer paths', () => {
  const scoredQuestions = realQuestions.filter((question) => question !== platformQuestion);
  const counts = {};
  let total = 0;

  const walk = (index, answers) => {
    if (index === scoredQuestions.length) {
      const [top] = computeResults(answers, realQuestions, realProfiles).topResults;
      if (top) {
        counts[top.id] = (counts[top.id] ?? 0) + 1;
        total += 1;
      }
      return;
    }
    for (const option of scoredQuestions[index].options) {
      walk(index + 1, [...answers, option.id]);
    }
  };
  for (const platform of platformOptionIds) walk(0, [[platform]]);

  const share = (id) => (counts[id] ?? 0) / total;
  const [leader, leaderCount] = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];

  // The audit's target is about 12 %. Brave's profile is rated at least as high as
  // most other browsers on 9 of 11 traits, so reaching that target needs the trait
  // rubric pass (P1-5). Until then, this guards against regressions.
  assert.ok(leaderCount / total <= 0.4, `${leader} is the top pick in ${share(leader)}`);
  assert.ok(share('tor-browser') <= 0.12, `Tor is the top pick in ${share('tor-browser')}`);
});

test('match percentages are calibrated on active browsers only', () => {
  const candidates = [
    { id: 'dead', platforms: ['windows'], traits: { privacy: 10 }, discontinued: true },
    ...[2, 4, 6, 8].map((privacy) => ({
      id: `active-${privacy}`,
      platforms: ['windows'],
      traits: { privacy },
    })),
  ];
  const results = computeResults([['windows'], 'q1a'], questions, candidates);

  assert.equal(results.topResults[0].id, 'active-8');
  assert.equal(results.topResults[0].matchPercentage, 100);
  assert.deepEqual(
    results.discontinuedResults.map((browser) => browser.id),
    ['dead']
  );
});

test('only the strongest preferences decide the fit', () => {
  const candidates = [
    {
      id: 'specialist',
      platforms: ['windows'],
      traits: { privacy: 10, speed: 10, features: 10, easeOfUse: 10, ai: 1 },
    },
    {
      id: 'all-rounder',
      platforms: ['windows'],
      traits: { privacy: 8, speed: 8, features: 8, easeOfUse: 8, ai: 10 },
    },
  ];
  const userTraits = { privacy: 6, speed: 5, features: 4, easeOfUse: 3, ai: 1 };
  const ranked = rankBrowsers(userTraits, candidates, ['windows']);

  assert.equal(ranked[0].id, 'specialist');
  assert.equal(ranked[0].matchScore, 10);
});

test('data integrity: options have unique IDs, valid icons, equal weight, and balanced trait coverage', () => {
  const validPlatforms = new Set([
    'windows',
    'macos-arm',
    'macos-intel',
    'linux',
    'android',
    'ios',
    'ipad',
  ]);
  const questionIds = new Set();
  const optionIds = new Set();
  const questionTraitMaxima = new Map(TRAIT_KEYS.map((trait) => [trait, []]));

  for (const question of realQuestions) {
    assert.ok(!questionIds.has(question.id), `duplicate question id ${question.id}`);
    questionIds.add(question.id);
    if (question !== platformQuestion) {
      for (const trait of TRAIT_KEYS) {
        const maxWeight = Math.max(
          0,
          ...question.options.map((candidate) => Math.abs(candidate.traits?.[trait] ?? 0))
        );
        if (maxWeight > 0) {
          questionTraitMaxima.get(trait).push({ questionId: question.id, maxWeight });
        }
      }
    }

    for (const option of question.options) {
      assert.ok(!optionIds.has(option.id), `duplicate option id ${option.id}`);
      optionIds.add(option.id);
      assert.ok(
        Object.hasOwn(ICON_MAP, option.icon),
        `${option.id} references unknown icon "${option.icon}"`
      );

      if (question === platformQuestion) {
        assert.ok(
          option.platforms.every((platform) => validPlatforms.has(platform)),
          option.id
        );
        continue;
      }

      const weights = Object.entries(option.traits);
      assert.ok(
        weights.every(([trait]) => TRAIT_KEYS.includes(trait)),
        option.id
      );
      for (const trait of Object.keys(option.dealbreakers ?? {})) {
        assert.ok(TRAIT_KEYS.includes(trait), `${option.id} dealbreaker ${trait}`);
      }
      const total = weights.reduce((sum, [, weight]) => sum + Math.abs(weight), 0);
      assert.equal(total, OPTION_WEIGHT_TOTAL, `${option.id} has total weight ${total}`);
    }
  }

  for (const trait of TRAIT_KEYS) {
    const maxima = questionTraitMaxima.get(trait).sort((a, b) => b.maxWeight - a.maxWeight);
    assert.ok(maxima.length >= 2, `${trait} is weighted in fewer than two questions`);
    assert.ok(
      maxima[0].maxWeight - maxima[1].maxWeight <= MAX_QUESTION_WEIGHT_GAP,
      `${trait} maxima are not similar: ${maxima[0].questionId}=${maxima[0].maxWeight}, ` +
        `${maxima[1].questionId}=${maxima[1].maxWeight}`
    );
  }
});

test('data integrity: browser profiles are complete and consistent', () => {
  const validPlatforms = new Set([
    'windows',
    'macos-arm',
    'macos-intel',
    'linux',
    'android',
    'ios',
    'ipad',
  ]);
  const ids = new Set();

  for (const profile of realProfiles) {
    assert.ok(!ids.has(profile.id), `duplicate profile id ${profile.id}`);
    ids.add(profile.id);
    assert.deepEqual(Object.keys(profile.traits).sort(), [...TRAIT_KEYS].sort(), profile.id);
    assert.ok(profile.platforms.length > 0, profile.id);
    assert.ok(
      profile.platforms.every((platform) => validPlatforms.has(platform)),
      profile.id
    );
    if (profile.platforms.includes('ipad'))
      assert.ok(profile.platforms.includes('ios'), profile.id);
    assert.ok(
      profile.lastVerified === null || /^\d{4}-\d{2}-\d{2}$/.test(profile.lastVerified),
      profile.id
    );
    if (profile.discontinued) assert.ok(profile.discontinuedNote, profile.id);
  }

  for (const id of ['mull', 'kiwi', 'chatgpt-atlas', 'arc']) {
    assert.equal(profileById[id].discontinued, true, id);
  }
});

test('speed and resource-efficiency copy does not imply benchmark measurements', () => {
  assert.match(TRAIT_META.speed.description, /qualitative/i);
  assert.match(TRAIT_META.speed.description, /not based on Speedometer/i);
  assert.match(TRAIT_META.resourceEfficiency.description, /qualitative estimate/i);
  assert.match(TRAIT_META.resourceEfficiency.description, /not standardized/i);
});

test('quiz profiles resolve to site browser slugs by name, not by quiz ID', () => {
  const siteBrowsersByName = new Map(
    siteBrowsers.map((browser) => [browser.name.toLowerCase(), browser])
  );

  for (const profile of realProfiles) {
    const siteBrowser = siteBrowsersByName.get(profile.name.toLowerCase());
    assert.ok(siteBrowser, `no site browser matches ${profile.name}`);
    assert.equal(getBrowserSlug(siteBrowser.name), getBrowserSlug(profile.name), profile.id);
  }

  assert.equal(getBrowserSlug(siteBrowsersByName.get('google chrome').name), 'google-chrome');
  assert.equal(getBrowserSlug(siteBrowsersByName.get('zen browser').name), 'zen-browser');
  assert.notEqual(profileById.chrome.id, getBrowserSlug(profileById.chrome.name));
  assert.notEqual(profileById.zen.id, getBrowserSlug(profileById.zen.name));
});
