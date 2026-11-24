import { platformNames } from './platformDefinitions.js';
import { getBrowserSlug } from './getBrowserSlug.js';
import { getEngineVariants } from './getPlatformEngineData.js';
import { comparisonMetric, getComparisonMetric } from './comparisonMetrics.js';

export { comparisonMetric } from './comparisonMetrics.js';

export const OLDER_MEASUREMENT_DAYS = 180;

export function getScoreOutcome(a, b, compatible = true, metric = comparisonMetric) {
  if (!compatible) return { state: 'incompatible' };
  if (
    a?.state !== 'available' ||
    b?.state !== 'available' ||
    !Number.isFinite(a.score) ||
    !Number.isFinite(b.score) ||
    !metric.isValid(a.score) ||
    !metric.isValid(b.score)
  )
    return { state: 'unavailable' };
  if (a.score === b.score) return { state: 'tie' };
  if (a.score.toFixed(metric.precision) === b.score.toFixed(metric.precision))
    return { state: 'displayed-tie' };
  const aWins = metric.direction === 'higher' ? a.score > b.score : a.score < b.score;
  if (metric.unit === '%')
    return { state: aWins ? 'a' : 'b', difference: Math.abs(a.score - b.score) };
  const high = Math.max(a.score, b.score);
  const low = Math.min(a.score, b.score);
  const percent = ((high - low) / low) * 100;
  return { state: aWins ? 'a' : 'b', percent: Number.isFinite(percent) ? percent : null };
}

export function formatScoreOutcome(result, nameA, nameB, metric = comparisonMetric) {
  if (result.state === 'incompatible')
    return 'No head-to-head result: the recorded test setups or benchmark revisions are incompatible.';
  if (result.state === 'unavailable')
    return 'No head-to-head result: a score is missing or unavailable.';
  if (result.state === 'tie') return 'Same recorded score.';
  if (result.state === 'displayed-tie') return 'Same displayed score.';
  const winner = result.state === 'a' ? nameA : nameB;
  const loser = result.state === 'a' ? nameB : nameA;
  if (metric.unit === '%')
    return `${winner} has the higher recorded ${metric.name.toLowerCase()} score${result.difference == null ? '' : ` (${result.difference.toFixed(0)} percentage points higher)`}.`;
  return `${winner} has the higher recorded score${result.percent == null ? '' : ` (${result.percent.toFixed(1)}% higher than ${loser})`}.`;
}

// Dates are calendar dates, not deployment timestamps. Use UTC to avoid timezone shifts.
export function getMeasurementFreshness(date, now = new Date()) {
  if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return 'unknown';
  const timestamp = Date.parse(`${date}T00:00:00Z`);
  if (!Number.isFinite(timestamp) || new Date(timestamp).toISOString().slice(0, 10) !== date)
    return 'unknown';
  return now.getTime() - timestamp > OLDER_MEASUREMENT_DAYS * 86400000 ? 'older' : 'current';
}

export function getComparisonObservation(
  browser,
  platform,
  engine,
  metricId = comparisonMetric.id,
  observationId
) {
  const metric = getComparisonMetric(metricId) || comparisonMetric;
  if (!browser) return { state: 'missing-browser', engines: [], history: [] };
  const data = browser[platform];
  if (!data) return { state: 'missing-platform', engines: [], history: [] };
  const variants = getEngineVariants(data);
  const engines = variants.map((variant) => variant.engine);
  const selected = engine ? variants.find((variant) => variant.engine === engine) : variants[0];
  if (engine && !selected) return { state: 'missing-engine', engines, history: [] };
  const history = selected?.versions || data.versions || [];
  // Optional metrics use their newest non-null record; Speedometer keeps the newest version.
  const latest =
    metric.id === comparisonMetric.id
      ? history[0]
      : history.find((version) => version.scores?.[metric.id] != null) || history[0];
  const record = observationId
    ? history.find((version) => version.observationId === observationId)
    : latest;
  const base = {
    engines,
    engine: selected?.engine || data.engine || null,
    record: record || null,
    history,
  };
  if (observationId && !record) return { ...base, state: 'missing-observation' };
  if (!record) return { ...base, state: 'missing-version' };
  const score = record.scores?.[metric.id];
  if (score == null) return { ...base, state: 'missing-metric' };
  if (typeof score !== 'number' || !Number.isFinite(score) || !metric.isValid(score))
    return { ...base, state: 'invalid-metric' };
  return { ...base, state: 'available', score };
}

export function isExactDateMatch(a, b) {
  return (
    typeof a?.record?.date === 'string' &&
    a.record.date === b?.record?.date &&
    getMeasurementFreshness(a.record.date) !== 'unknown'
  );
}

export function getMetricCoverage(platforms) {
  return {
    observations: platforms.reduce(
      (total, platform) =>
        total + Number(platform.a.state === 'available') + Number(platform.b.state === 'available'),
      0
    ),
    sharedPlatforms: platforms.filter(
      (platform) => platform.a.state === 'available' && platform.b.state === 'available'
    ).length,
  };
}

export function deriveComparison(
  browsers,
  slugA,
  slugB,
  engines = {},
  metricId = comparisonMetric.id,
  observations = {}
) {
  const metric = getComparisonMetric(metricId) || comparisonMetric;
  const browserA = browsers.find((browser) => getBrowserSlug(browser.name) === slugA);
  const browserB = browsers.find((browser) => getBrowserSlug(browser.name) === slugB);
  if (!browserA || !browserB || slugA === slugB) return null;
  const platforms = Object.entries(platformNames).map(([id, label]) => {
    const a = getComparisonObservation(
      browserA,
      id,
      engines[slugA]?.[id],
      metric.id,
      observations[slugA]?.[id]
    );
    const b = getComparisonObservation(
      browserB,
      id,
      engines[slugB]?.[id],
      metric.id,
      observations[slugB]?.[id]
    );
    const historical = Boolean(observations[slugA]?.[id] || observations[slugB]?.[id]);
    const outcome =
      a.state !== 'available' || b.state !== 'available' || (historical && !isExactDateMatch(a, b))
        ? 'unavailable'
        : a.score === b.score
          ? 'tie'
          : metric.direction === 'higher'
            ? a.score > b.score
              ? 'a'
              : 'b'
            : a.score < b.score
              ? 'a'
              : 'b';
    return { id, label, a, b, outcome };
  });
  const identity = ({ name, logo, website, description }) => ({
    slug: getBrowserSlug(name),
    name,
    logo,
    website,
    description,
  });
  return {
    browserA: identity(browserA),
    browserB: identity(browserB),
    metric,
    platforms,
  };
}
