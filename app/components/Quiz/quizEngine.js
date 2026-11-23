import { TRAIT_KEYS } from '../../lib/quiz-constants.js';

export { TRAIT_KEYS };

/**
 * Quiz scoring engine — pure JavaScript, no framework dependencies.
 *
 * Computes weighted user preferences, compares them against browser profiles,
 * and returns ranked results. Unmentioned traits are neutral; negative weights
 * represent traits the user explicitly rejects. Only the user's strongest
 * preferences (see PRIORITY_TRAIT_COUNT) decide the fit.
 */

const TOP_RESULT_COUNT = 3;

/**
 * Fallback order for exact match-score ties. This only favors familiar,
 * mainstream browsers when the quiz finds an identical fit; other profiles use
 * their IDs as a deterministic fallback instead of inheriting JSON order.
 */
const MAINSTREAM_TIE_BREAK_ORDER = [
  'chrome',
  'safari',
  'edge',
  'firefox',
  'samsung-internet',
  'opera',
  'brave',
];
const MAINSTREAM_TIE_BREAK_PRIORITY = new Map(
  MAINSTREAM_TIE_BREAK_ORDER.map((id, index) => [id, index])
);

function compareTieBreakPriority(a, b) {
  const aPriority = MAINSTREAM_TIE_BREAK_PRIORITY.get(a.id);
  const bPriority = MAINSTREAM_TIE_BREAK_PRIORITY.get(b.id);

  if (aPriority !== bPriority) {
    if (aPriority === undefined) return 1;
    if (bPriority === undefined) return -1;
    return aPriority - bPriority;
  }

  return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
}

/**
 * Accumulate trait scores from the user's selected answers.
 *
 * @param {Array<string|string[]>} answers - Selected option IDs, with arrays for multi-select questions.
 * @param {Array<{id: string, options: Array<{id: string, traits: Object}>}>} questions
 *   The full questions array from questions.json.
 * @returns {Object<string, number>} Signed trait weights, e.g. `{ privacy: 6, ai: -3, ... }`.
 */
export function computeUserTraits(answers, questions) {
  const traits = Object.fromEntries(TRAIT_KEYS.map((k) => [k, 0]));
  const optionTraitsById = new Map();

  for (const question of questions) {
    for (const option of question.options) {
      if (!optionTraitsById.has(option.id)) optionTraitsById.set(option.id, option.traits);
    }
  }

  for (const answerId of answers) {
    if (Array.isArray(answerId) || !optionTraitsById.has(answerId)) continue;

    for (const [key, value] of Object.entries(optionTraitsById.get(answerId))) {
      if (key in traits) traits[key] += value;
    }
  }

  return traits;
}

/**
 * Get the platform IDs selected in multiple-choice platform questions.
 *
 * @param {Array<string|string[]>} answers - Selected option IDs, including arrays for multi-select questions.
 * @param {Array} questions - Questions array from questions.json.
 * @returns {string[]} Selected platform IDs, such as `windows` or `macos-arm`.
 */
export function getSelectedPlatforms(answers, questions) {
  const selectedPlatforms = new Set();

  questions.forEach((question, index) => {
    if (question.selectionMode !== 'multiple' || !Array.isArray(answers[index])) return;

    for (const answerId of answers[index]) {
      const option = question.options.find((candidate) => candidate.id === answerId);
      for (const platform of option?.platforms ?? []) {
        selectedPlatforms.add(platform);
      }
    }
  });

  return Array.from(selectedPlatforms);
}

/**
 * Collect and combine hard constraints attached to the selected answer options.
 * Each constraint is a trait range, such as `{ openSource: { min: 8 } }`.
 *
 * @param {Array<string|string[]>} answers - Selected option IDs, indexed by question.
 * @param {Array} questions - Questions array from questions.json.
 * @returns {Object<string, {min?: number, max?: number}>} Combined trait constraints.
 */
export function getSelectedDealbreakers(answers, questions) {
  const dealbreakers = {};

  questions.forEach((question, index) => {
    const answer = answers[index];
    const answerIds = Array.isArray(answer) ? answer : [answer];

    for (const answerId of answerIds) {
      const option = question.options.find((candidate) => candidate.id === answerId);
      for (const [trait, constraint] of Object.entries(option?.dealbreakers ?? {})) {
        const combined = (dealbreakers[trait] ??= {});
        if (Number.isFinite(constraint.min)) {
          combined.min = Math.max(combined.min ?? -Infinity, constraint.min);
        }
        if (Number.isFinite(constraint.max)) {
          combined.max = Math.min(combined.max ?? Infinity, constraint.max);
        }
      }
    }
  });

  return dealbreakers;
}

/**
 * Only the user's strongest preferences decide the fit. Counting every minor
 * preference rewards browsers that are rated well on everything, so all-rounders
 * would win almost every answer path.
 */
const PRIORITY_TRAIT_COUNT = 4;

/**
 * Pick the user's strongest preferences by absolute weight. Ties keep
 * TRAIT_KEYS order, so the selection is deterministic.
 *
 * @param {Object<string, number>} userTraits - Signed preference weights.
 * @returns {Array<[string, number]>} Up to PRIORITY_TRAIT_COUNT [trait, weight] pairs.
 */
export function getPriorityTraits(userTraits) {
  return Object.entries(userTraits)
    .filter(([, weight]) => Number.isFinite(weight) && weight !== 0)
    .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))
    .slice(0, PRIORITY_TRAIT_COUNT);
}

function weightedFitScore(userTraits, browserTraits) {
  let weightedTotal = 0;
  let totalWeight = 0;

  for (const [trait, weight] of getPriorityTraits(userTraits)) {
    // A missing rating is unknown, so treat it as neutral instead of penalizing it.
    const rating = Number.isFinite(browserTraits?.[trait]) ? browserTraits[trait] : 5;
    // Positive weights favor higher ratings; negative weights favor lower ratings.
    const traitFit = weight > 0 ? rating : 10 - rating;
    weightedTotal += Math.abs(weight) * traitFit;
    totalWeight += Math.abs(weight);
  }

  if (totalWeight === 0) return 5;
  return Math.max(0, Math.min(10, weightedTotal / totalWeight));
}

function median(values) {
  const middle = Math.floor(values.length / 2);
  return values.length % 2 === 0 ? (values[middle - 1] + values[middle]) / 2 : values[middle];
}

/**
 * Calibrate the displayed percentage across eligible profiles: the median fit
 * maps to 50%, the best to 100%, and the lowest to 0% (when those scores differ).
 */
function addCalibratedMatchPercentages(ranked) {
  if (ranked.length === 0) return ranked;

  // With one or two candidates, median calibration would spread them to 0% and
  // 100% even when their fits are nearly identical, so show the absolute fit.
  if (ranked.length <= 2) {
    return ranked.map((browser) => ({
      ...browser,
      matchPercentage: Math.round(browser.matchScore * 10),
    }));
  }

  const scores = ranked.map((browser) => browser.matchScore).sort((a, b) => a - b);
  const lowest = scores[0];
  const highest = scores.at(-1);
  const middle = median(scores);

  return ranked.map((browser) => {
    let percentage;
    if (highest === lowest) {
      percentage = highest * 10;
    } else if (browser.matchScore >= middle) {
      percentage =
        highest === middle ? 100 : 50 + ((browser.matchScore - middle) / (highest - middle)) * 50;
    } else {
      percentage =
        middle === lowest ? 50 : ((browser.matchScore - lowest) / (middle - lowest)) * 50;
    }

    return { ...browser, matchPercentage: Math.round(percentage) };
  });
}

function meetsDealbreakers(browser, dealbreakers) {
  return Object.entries(dealbreakers).every(([trait, constraint]) => {
    const rating = browser.traits?.[trait];
    return (
      Number.isFinite(rating) &&
      (constraint.min === undefined || rating >= constraint.min) &&
      (constraint.max === undefined || rating <= constraint.max)
    );
  });
}

/**
 * Score profiles that support at least one selected platform (when a platform
 * is selected) and meet every selected dealbreaker, sorted best-fit first. An
 * empty platform selection means no device preference. Unmentioned traits do
 * not affect the weighted fit. Percentages are added later, after discontinued
 * profiles are removed, so a dead browser can't shift the calibration.
 */
function scoreEligibleBrowsers(userTraits, browserProfiles, selectedPlatforms, dealbreakers = {}) {
  const selectedPlatformSet = new Set(selectedPlatforms);
  const eligibleProfiles = browserProfiles.filter(
    (browser) =>
      Array.isArray(browser.platforms) &&
      browser.platforms.length > 0 &&
      (selectedPlatformSet.size === 0 ||
        browser.platforms.some((platform) => selectedPlatformSet.has(platform))) &&
      meetsDealbreakers(browser, dealbreakers)
  );

  const ranked = eligibleProfiles.map((browser) => ({
    ...browser,
    matchScore: weightedFitScore(userTraits, browser.traits),
  }));

  // Sort on the unrounded fit first; percentages are presentation-only.
  ranked.sort((a, b) => b.matchScore - a.matchScore || compareTieBreakPriority(a, b));

  return ranked;
}

function rankActiveBrowsers(scoredBrowsers) {
  return addCalibratedMatchPercentages(scoredBrowsers.filter((browser) => !browser.discontinued));
}

/**
 * Rank active browser profiles against the user's trait vector.
 * Discontinued profiles are excluded from the returned ranking.
 *
 * @param {Object<string, number>} userTraits - Signed preference weights from `computeUserTraits`.
 * @param {Array<Object & {traits: Object<string, number>, platforms?: string[]}>} browserProfiles
 *   Array from browser-profiles.json; each entry must have a `.traits` object.
 * @param {string[]} selectedPlatforms - Platforms a browser must support; an empty list leaves the platform unfiltered.
 * @param {Object<string, {min?: number, max?: number}>} [dealbreakers={}] - Hard trait constraints.
 * @returns {Array<Object & {matchScore: number, matchPercentage: number}>} Eligible active browsers sorted best-match-first.
 */
export function rankBrowsers(
  userTraits,
  browserProfiles,
  selectedPlatforms = [],
  dealbreakers = {}
) {
  return rankActiveBrowsers(
    scoreEligibleBrowsers(userTraits, browserProfiles, selectedPlatforms, dealbreakers)
  );
}

/**
 * Return the top N results from a ranked browser list.
 *
 * @param {Array<Object & {matchPercentage: number}>} rankedBrowsers - Output of `rankBrowsers`.
 * @param {number} [count=3] - How many results to return.
 * @returns {Array<Object & {matchPercentage: number}>} The top `count` browsers.
 */
export function getTopResults(rankedBrowsers, count = TOP_RESULT_COUNT) {
  return rankedBrowsers.slice(0, count);
}

/**
 * Convenience function: compute full quiz results in one call.
 *
 * @param {Array<string|string[]>} answers - Selected option IDs, with arrays for multi-select questions.
 * @param {Array} questions - Questions array from questions.json.
 * @param {Array} browserProfiles - Browser profiles array from browser-profiles.json.
 * @returns {{
 *   topResults: Array,
 *   userTraits: Object<string, number>,
 *   rankedBrowsers: Array,
 *   selectedPlatforms: string[],
 *   dealbreakers: Object<string, {min?: number, max?: number}>,
 *   discontinuedResults: Array
 * }}
 */
export function computeResults(answers, questions, browserProfiles) {
  const userTraits = computeUserTraits(answers, questions);
  const selectedPlatforms = getSelectedPlatforms(answers, questions);
  const dealbreakers = getSelectedDealbreakers(answers, questions);
  const scoredBrowsers = scoreEligibleBrowsers(
    userTraits,
    browserProfiles,
    selectedPlatforms,
    dealbreakers
  );
  const rankedBrowsers = rankActiveBrowsers(scoredBrowsers);
  const topResults = getTopResults(rankedBrowsers, TOP_RESULT_COUNT);
  const discontinuedResults = scoredBrowsers
    .slice(0, TOP_RESULT_COUNT)
    .filter((browser) => browser.discontinued);

  return {
    topResults,
    userTraits,
    rankedBrowsers,
    selectedPlatforms,
    dealbreakers,
    discontinuedResults,
  };
}
