export default function sitemap() {
  const baseUrl = 'https://browserating.com';

    // Static pages - core site pages that don't change frequently
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

    // Platform-specific pages - dynamically generated for each browser platform
  const platforms = ['macos', 'windows', 'android', 'ipad'];
  const platformPages = platforms.map(platform => ({
    url: `${baseUrl}/${platform}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticPages, ...platformPages];
}