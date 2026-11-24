import { getBrowsersServer } from './getBrowsersServer';
import { deriveComparison } from './comparisonViewModel';
import { getBrowserSlug } from './getBrowserSlug';

export async function getComparisonData(browserA, browserB, engines) {
  return deriveComparison(await getBrowsersServer(), browserA, browserB, engines);
}

export async function generateComparisonSlugs() {
  const browsers = await getBrowsersServer();
  const popularBrowsers = browsers.slice(0, 15);

  const comparisons = [];

  for (let i = 0; i < popularBrowsers.length; i++) {
    for (let j = i + 1; j < popularBrowsers.length; j++) {
      const slugA = getBrowserSlug(popularBrowsers[i].name);
      const slugB = getBrowserSlug(popularBrowsers[j].name);
      comparisons.push({
        slug: `${slugA}-vs-${slugB}`,
        browserA: slugA,
        browserB: slugB,
      });
    }
  }

  return comparisons;
}
