import { getBrowsersServer } from './getBrowsersServer';

export async function getComparisonData(browserA, browserB) {
  const browsers = await getBrowsersServer();

  const slugToBrowser = (slug) => {
    return browsers.find(
      (b) =>
        b.name
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, '') === slug
    );
  };

  const browserDataA = slugToBrowser(browserA);
  const browserDataB = slugToBrowser(browserB);

  if (!browserDataA || !browserDataB) {
    return null;
  }

  return {
    browserA: browserDataA,
    browserB: browserDataB,
  };
}

export async function generateComparisonSlugs() {
  const browsers = await getBrowsersServer();
  const popularBrowsers = browsers.slice(0, 15);

  const comparisons = [];

  for (let i = 0; i < popularBrowsers.length; i++) {
    for (let j = i + 1; j < popularBrowsers.length; j++) {
      const slugA = popularBrowsers[i].name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
      const slugB = popularBrowsers[j].name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
      comparisons.push({
        slug: `${slugA}-vs-${slugB}`,
        browserA: slugA,
        browserB: slugB,
      });
    }
  }

  return comparisons;
}
