import { platformNames } from './platformDefinitions.js';
import { getBrowserSlug } from './getBrowserSlug.js';
import { getEngineVariants } from './getPlatformEngineData.js';

export const comparisonMetric = {
  id: 'speedometer3',
  name: 'Speedometer 3.1',
  direction: 'higher',
};

export const OLDER_MEASUREMENT_DAYS = 180;

// Dates are calendar dates, not deployment timestamps. Use UTC to avoid timezone shifts.
export function getMeasurementFreshness(date, now = new Date()) {
  if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return 'unknown';
  const timestamp = Date.parse(`${date}T00:00:00Z`);
  if (!Number.isFinite(timestamp) || new Date(timestamp).toISOString().slice(0, 10) !== date)
    return 'unknown';
  return now.getTime() - timestamp > OLDER_MEASUREMENT_DAYS * 86400000 ? 'older' : 'current';
}

export function getComparisonObservation(browser, platform, engine) {
  if (!browser) return { state: 'missing-browser', engines: [] };
  const data = browser[platform];
  if (!data) return { state: 'missing-platform', engines: [] };
  const variants = getEngineVariants(data);
  const engines = variants.map((variant) => variant.engine);
  const selected = engine ? variants.find((variant) => variant.engine === engine) : variants[0];
  if (engine && !selected) return { state: 'missing-engine', engines };
  // Until publishing validates ordering, the first record is the latest recorded observation.
  const record = (selected?.versions || data.versions)?.[0];
  const base = { engines, engine: selected?.engine || data.engine || null, record: record || null };
  if (!record) return { ...base, state: 'missing-version' };
  const score = record.scores?.speedometer3;
  if (score == null) return { ...base, state: 'missing-metric' };
  if (typeof score !== 'number' || !Number.isFinite(score) || score <= 0)
    return { ...base, state: 'invalid-metric' };
  return { ...base, state: 'available', score };
}

export function deriveComparison(browsers, slugA, slugB, engines = {}) {
  const browserA = browsers.find((browser) => getBrowserSlug(browser.name) === slugA);
  const browserB = browsers.find((browser) => getBrowserSlug(browser.name) === slugB);
  if (!browserA || !browserB || slugA === slugB) return null;
  const platforms = Object.entries(platformNames).map(([id, label]) => {
    const a = getComparisonObservation(browserA, id, engines[slugA]?.[id]);
    const b = getComparisonObservation(browserB, id, engines[slugB]?.[id]);
    const outcome =
      a.state !== 'available' || b.state !== 'available'
        ? 'unavailable'
        : a.score === b.score
          ? 'tie'
          : a.score > b.score
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
    metric: comparisonMetric,
    platforms,
  };
}
