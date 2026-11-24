import { getBrowsersServer } from './getBrowsersServer';
import { deriveComparison } from './comparisonViewModel';
import { indexableComparisonSlugs } from './comparisonIndex';

// Server boundary that loads the catalog and delegates all comparison rules to the pure model.
export async function getComparisonData(browserA, browserB, engines, metric, observations) {
  return deriveComparison(
    await getBrowsersServer(),
    browserA,
    browserB,
    engines,
    metric,
    observations
  );
}

/** Canonical pairs with shared primary-engine measurements, for the sitemap. */
export async function generateComparisonSlugs() {
  return indexableComparisonSlugs(await getBrowsersServer());
}
