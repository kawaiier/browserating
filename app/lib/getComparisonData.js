import { getBrowsersServer } from './getBrowsersServer';
import { deriveComparison } from './comparisonViewModel';
import { indexableComparisonSlugs } from './comparisonIndex';

export async function getComparisonData(browserA, browserB, engines) {
  return deriveComparison(await getBrowsersServer(), browserA, browserB, engines);
}

/** Canonical pairs with shared primary-engine measurements, for the sitemap. */
export async function generateComparisonSlugs() {
  return indexableComparisonSlugs(await getBrowsersServer());
}
