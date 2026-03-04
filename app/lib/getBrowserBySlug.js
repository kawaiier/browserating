import { getBrowsersServer } from './getBrowsersServer';

export async function getBrowserBySlug(slug) {
  const browsers = await getBrowsersServer();

  const browser = browsers.find((b) => {
    const browserSlug = b.name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
    return browserSlug === slug;
  });

  if (!browser) return null;

  const browserSlug = browser.name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');

  return { ...browser, slug: browserSlug };
}

export async function getAllBrowserSlugs() {
  const browsers = await getBrowsersServer();
  return browsers.map((b) => ({
    slug: b.name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, ''),
  }));
}
