/**
 * Quiz scoring engine — pure JavaScript, no framework dependencies.
 *
 * Computes user trait vectors from quiz answers, compares them against
 * browser profiles using cosine similarity, and returns ranked results.
 */

/** The 10 trait keys used throughout the scoring system. */
const TRAIT_KEYS = [
  'privacy',
  'speed',
  'customization',
  'minimalism',
  'features',
  'openSource',
  'resourceEfficiency',
  'ecosystem',
  'innovation',
  'easeOfUse',
];

/**
 * Accumulate trait scores from the user's selected answers.
 *
 * @param {string[]} answers - Array of option IDs selected by the user (e.g. ["q1a", "q2c"]).
 * @param {Array<{id: string, options: Array<{id: string, traits: Object}>}>} questions
 *   The full questions array from questions.json.
 * @returns {Object<string, number>} Trait totals, e.g. `{ privacy: 6, speed: 3, ... }`.
 */
export function computeUserTraits(answers, questions) {
  const traits = Object.fromEntries(TRAIT_KEYS.map((k) => [k, 0]));

  for (const answerId of answers) {
    for (const question of questions) {
      const option = question.options.find((o) => o.id === answerId);
      if (option) {
        for (const [key, value] of Object.entries(option.traits)) {
          if (key in traits) {
            traits[key] += value;
          }
        }
        break;
      }
    }
  }

  return traits;
}

/**
 * Normalize a trait vector so that all values sum to 1.
 *
 * @param {Object<string, number>} traits - Raw trait scores.
 * @returns {Object<string, number>} Normalized trait scores (values sum to 1, or all zeros).
 */
export function normalizeTraits(traits) {
  const total = Object.values(traits).reduce((sum, v) => sum + v, 0);

  if (total === 0) {
    return Object.fromEntries(Object.keys(traits).map((k) => [k, 0]));
  }

  return Object.fromEntries(Object.entries(traits).map(([k, v]) => [k, v / total]));
}

/**
 * Compute the cosine similarity between two trait vectors.
 *
 * @param {Object<string, number>} vecA - First trait vector.
 * @param {Object<string, number>} vecB - Second trait vector.
 * @returns {number} Similarity score between 0 and 1.
 */
export function cosineSimilarity(vecA, vecB) {
  const keys = Object.keys(vecA);

  let dot = 0;
  let magA = 0;
  let magB = 0;

  for (const key of keys) {
    const a = vecA[key] || 0;
    const b = vecB[key] || 0;
    dot += a * b;
    magA += a * a;
    magB += b * b;
  }

  magA = Math.sqrt(magA);
  magB = Math.sqrt(magB);

  if (magA === 0 || magB === 0) {
    return 0;
  }

  return dot / (magA * magB);
}

/**
 * Rank browser profiles against the user's trait vector.
 *
 * Each browser receives an added `matchPercentage` field (0–100).
 * The returned array is sorted descending by match percentage.
 *
 * @param {Object<string, number>} userTraits - Raw user trait totals from `computeUserTraits`.
 * @param {Array<Object & {traits: Object<string, number>}>} browserProfiles
 *   Array from browser-profiles.json; each entry must have a `.traits` object.
 * @returns {Array<Object & {matchPercentage: number}>} Browsers sorted best-match-first.
 */
export function rankBrowsers(userTraits, browserProfiles) {
  const normalizedUser = normalizeTraits(userTraits);

  const ranked = browserProfiles.map((browser) => {
    const normalizedBrowser = normalizeTraits(browser.traits);
    const similarity = cosineSimilarity(normalizedUser, normalizedBrowser);
    const matchPercentage = Math.round(similarity * 100);

    return { ...browser, matchPercentage };
  });

  ranked.sort((a, b) => b.matchPercentage - a.matchPercentage);

  return ranked;
}

/**
 * Return the top N results from a ranked browser list.
 *
 * @param {Array<Object & {matchPercentage: number}>} rankedBrowsers - Output of `rankBrowsers`.
 * @param {number} [count=3] - How many results to return.
 * @returns {Array<Object & {matchPercentage: number}>} The top `count` browsers.
 */
export function getTopResults(rankedBrowsers, count = 3) {
  return rankedBrowsers.slice(0, count);
}

/**
 * Convenience function: compute full quiz results in one call.
 *
 * @param {string[]} answers - Option IDs selected by the user.
 * @param {Array} questions - Questions array from questions.json.
 * @param {Array} browserProfiles - Browser profiles array from browser-profiles.json.
 * @returns {{ topResults: Array, userTraits: Object<string, number>, rankedBrowsers: Array }}
 */
export function computeResults(answers, questions, browserProfiles) {
  const userTraits = computeUserTraits(answers, questions);
  const rankedBrowsers = rankBrowsers(userTraits, browserProfiles);
  const topResults = getTopResults(rankedBrowsers, 3);

  return { topResults, userTraits, rankedBrowsers };
}
