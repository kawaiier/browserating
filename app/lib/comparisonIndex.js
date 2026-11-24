import { comparisonOptions } from './comparisonOptions.js';
import { generatePairSlugs, parsePairSlug } from './comparisonUrl.js';
import { hasBothMeasurements } from './comparisonViewModel.js';

// Indexability uses default (first-listed) engines and latest Speedometer records;
// query-selected engines and historical observations never change the sitemap.
export function hasSharedMeasurement(data) {
  return data.platforms.some(hasBothMeasurements);
}

export function indexableComparisonSlugs(browsers) {
  const options = comparisonOptions(browsers);
  const coverage = new Map(options.map((option) => [option.slug, option.platforms]));
  return generatePairSlugs(options.map((option) => option.slug)).filter(({ slug }) => {
    const [a, b] = parsePairSlug(slug);
    return coverage.get(a).some((platform) => coverage.get(b).includes(platform));
  });
}

export function randomComparisonSample(comparisons, count, random = Math.random) {
  const sample = [...comparisons];
  const size = Math.min(count, sample.length);
  for (let i = 0; i < size; i += 1) {
    const j = i + Math.floor(random() * (sample.length - i));
    [sample[i], sample[j]] = [sample[j], sample[i]];
  }
  return sample.slice(0, size);
}
