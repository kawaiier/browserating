import { getBrowsersServer } from './getBrowsersServer';
import { deriveComparison } from './comparisonViewModel';
import { getBrowserSlug } from './getBrowserSlug';
import { generatePairSlugs } from './comparisonUrl';

// Number of catalog entries used for prebuilt pairs. This is catalog order, not popularity;
// CMP-012 replaces it with a coverage-based candidate policy.
const PREBUILT_CATALOG_ENTRIES = 15;

export async function getComparisonData(browserA, browserB, engines) {
  return deriveComparison(await getBrowsersServer(), browserA, browserB, engines);
}

/** Canonical (sorted) pair slugs for static generation and the sitemap. */
export async function generateComparisonSlugs() {
  const browsers = await getBrowsersServer();
  const slugs = browsers.slice(0, PREBUILT_CATALOG_ENTRIES).map((b) => getBrowserSlug(b.name));
  return generatePairSlugs(slugs);
}
