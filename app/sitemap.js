import { getDataLastModified } from './lib/getDataLastModified';
import { getAllBrowserSlugs } from './lib/getBrowserBySlug';

export default async function sitemap() {
  const baseUrl = 'https://browserating.com';
  const dataLastModified = await getDataLastModified();
  const browserSlugs = await getAllBrowserSlugs();

  const browserPages = browserSlugs.map(({ slug }) => ({
    url: `${baseUrl}/browsers/${slug}`,
    lastModified: dataLastModified,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const platformPages = [
    { platform: 'macos-arm' },
    { platform: 'macos-intel' },
    { platform: 'windows' },
    { platform: 'android' },
    { platform: 'ipad' },
  ].map(({ platform }) => ({
    url: `${baseUrl}/platforms/${platform}`,
    lastModified: dataLastModified,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: dataLastModified,
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...browserPages,
    ...platformPages,
    {
      url: `${baseUrl}/privacy`,
      lastModified: '2024-11-27',
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];
}
