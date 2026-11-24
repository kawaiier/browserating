import { platformNames } from './constants.js';
import { getBrowserSlug } from './getBrowserSlug.js';
import { getEngineVariants } from './getPlatformEngineData.js';

export const comparisonMetric = { id: 'speedometer3', name: 'Speedometer 3.1', direction: 'higher' };

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
  if (typeof score !== 'number' || !Number.isFinite(score) || score <= 0) return { ...base, state: 'invalid-metric' };
  return { ...base, state: 'available', score };
}

export function deriveComparison(browsers, slugA, slugB, engines = {}) {
  const browserA = browsers.find((browser) => getBrowserSlug(browser.name) === slugA);
  const browserB = browsers.find((browser) => getBrowserSlug(browser.name) === slugB);
  if (!browserA || !browserB || slugA === slugB) return null;
  const platforms = Object.entries(platformNames).map(([id, label]) => {
    const a = getComparisonObservation(browserA, id, engines[slugA]?.[id]);
    const b = getComparisonObservation(browserB, id, engines[slugB]?.[id]);
    const outcome = a.state !== 'available' || b.state !== 'available' ? 'unavailable' : a.score === b.score ? 'tie' : a.score > b.score ? 'a' : 'b';
    return { id, label, a, b, outcome, limitations: ['Hardware and benchmark provenance may be undocumented.'] };
  });
  const identity = ({ name, logo, website, description }) => ({ name, logo, website, description });
  return { browserA: identity(browserA), browserB: identity(browserB), metric: comparisonMetric, platforms };
}
