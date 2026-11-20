import { getBrowsersServer } from './getBrowsersServer';
import { getBrowserSlug } from './getBrowserSlug';

export async function getBrowserBySlug(slug) {
  const browsers = await getBrowsersServer();

  const browser = browsers.find((b) => getBrowserSlug(b.name) === slug);

  if (!browser) return null;

  return { ...browser, slug: getBrowserSlug(browser.name) };
}

export async function getAllBrowserSlugs() {
  const browsers = await getBrowsersServer();
  return browsers.map((browser) => ({ slug: getBrowserSlug(browser.name) }));
}
