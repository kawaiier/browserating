import { comparisonOptions } from './comparisonOptions.js';
import { generatePairSlugs } from './comparisonUrl.js';

// Index every canonical catalog pair with a shared valid primary-engine score.
// This is a coverage policy, not a popularity ranking. Query choices do not affect it.
export function hasSharedMeasurement(data) {
  return data.platforms.some((p) => p.a.state === 'available' && p.b.state === 'available');
}

export function indexableComparisonSlugs(browsers) {
  const options = comparisonOptions(browsers);
  const coverage = new Map(options.map((option) => [option.slug, option.platforms]));
  return generatePairSlugs(options.map((option) => option.slug)).filter(({ slug }) => {
    const [a, b] = slug.split('-vs-');
    return coverage.get(a).some((platform) => coverage.get(b).includes(platform));
  });
}
