import { getDataLastModified } from './lib/getDataLastModified';

export default async function sitemap() {
  const baseUrl = 'https://browserating.com';
  const dataLastModified = await getDataLastModified();

  return [
    {
      url: baseUrl,
      lastModified: dataLastModified,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: '2024-11-27',
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];
}
