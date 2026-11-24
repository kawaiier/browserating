import { getDataLastModified } from './lib/getDataLastModified';
import { getAllBrowserSlugs } from './lib/getBrowserBySlug';
import { generateComparisonSlugs } from './lib/getComparisonData';
import { getQuizData } from './lib/getQuizData.js';

export default async function sitemap() {
  const baseUrl = 'https://browserating.com';
  const dataLastModified = await getDataLastModified();
  const browserSlugs = await getAllBrowserSlugs();
  const comparisonSlugs = await generateComparisonSlugs();
  const { profiles } = await getQuizData();

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

  const comparisonPages = comparisonSlugs.map(({ slug }) => ({
    url: `${baseUrl}/compare/${slug}`,
    lastModified: dataLastModified,
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  const quizResultPages = profiles.map(({ id }) => ({
    url: `${baseUrl}/quiz/result/${encodeURIComponent(id)}`,
    lastModified: dataLastModified,
    changeFrequency: 'weekly',
    priority: 0.6,
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
    ...comparisonPages,
    {
      url: `${baseUrl}/compare`,
      lastModified: dataLastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/quiz`,
      lastModified: dataLastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...quizResultPages,
    {
      url: `${baseUrl}/privacy`,
      lastModified: '2024-11-27',
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];
}
