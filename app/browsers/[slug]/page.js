import { getBrowserBySlug, getAllBrowserSlugs } from '@/app/lib/getBrowserBySlug';
import { getBrowsersServer } from '@/app/lib/getBrowsersServer';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getDataLastModified } from '@/app/lib/getDataLastModified';
import DarkModeProvider from '@/app/components/DarkModeProvider';
import ErrorBoundary from '@/app/components/ErrorBoundary';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import BrowserCompareDropdown from '@/app/components/BrowserCompareDropdown';

export async function generateStaticParams() {
  const slugs = await getAllBrowserSlugs();
  return slugs;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const browser = await getBrowserBySlug(slug);

  if (!browser) {
    return { title: 'Browser Not Found' };
  }

  return {
    title: `${browser.name} Browser Performance - Speedometer 3.1 Benchmarks`,
    description: browser.description || `${browser.name} browser benchmarks across platforms. Compare Speedometer 3.1 scores, RAM usage, and performance metrics.`,
    alternates: {
      canonical: `https://browserating.com/browsers/${slug}`,
    },
    openGraph: {
      title: `${browser.name} Browser Performance`,
      description: `See ${browser.name}'s Speedometer 3.1 benchmark scores across platforms.`,
    },
  };
}

export default async function BrowserPage({ params }) {
  const { slug } = await params;
  const [browser, allBrowsers, lastModified] = await Promise.all([
    getBrowserBySlug(slug),
    getBrowsersServer(),
    getDataLastModified(),
  ]);

  if (!browser) {
    notFound();
  }

  const compareBrowsers = allBrowsers
    .map((b) => ({
      name: b.name,
      slug: b.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    }))
    .filter((b) => b.slug !== slug)
    .sort((a, b) => a.name.localeCompare(b.name));

  const platforms = ['macos-arm', 'macos-intel', 'windows', 'android', 'ipad'];
  const platformLabels = {
    'macos-arm': 'macOS (Apple Silicon)',
    'macos-intel': 'macOS (Intel)',
    windows: 'Windows',
    android: 'Android',
    ipad: 'iPad',
  };

  return (
    <ErrorBoundary>
      <DarkModeProvider>
        <div className="min-h-screen bg-bg-canvas dark:bg-neutral-900 transition-colors duration-200">
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-accent-primary hover:bg-purple-700 focus:text-white focus:shadow-xl focus:rounded-lg focus:font-semibold focus:transition-all focus:duration-200 focus:outline-none focus:ring-4 focus:ring-purple-500/50"
          >
            Skip to main content
          </a>
          <Header lastModified={lastModified} />
          <main id="main-content" className="container mx-auto px-4 py-8 scroll-mt-4" tabIndex={-1}>
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  '@context': 'https://schema.org',
                  '@type': 'Product',
                  name: browser.name,
                  description: browser.description || `${browser.name} browser performance benchmarks`,
                  brand: {
                    '@type': 'Brand',
                    name: browser.name,
                  },
                }),
              }}
            />

            <nav className="mb-6">
              <Link href="/" className="text-accent-primary hover:underline">
                ← Back to Rankings
              </Link>
            </nav>

            <article className="max-w-4xl mx-auto">
              <header className="mb-8 flex items-center gap-6">
                <div className="relative w-24 h-24">
                  <Image
                    src={browser.logo}
                    alt={`${browser.name} logo`}
                    fill
                    className="object-contain"
                  />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-text-primary dark:text-white mb-2">
                    {browser.name} Browser
                  </h1>
                  {browser.website && (
                    <a
                      href={browser.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent-primary hover:underline"
                    >
                      Visit Website →
                    </a>
                  )}
                </div>
              </header>

              {browser.description && (
                <section className="mb-8">
                  <p className="text-text-secondary dark:text-neutral-300 text-lg leading-relaxed">
                    {browser.description}
                  </p>
                </section>
              )}

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-text-primary dark:text-white mb-4">
                  Performance Benchmarks
                </h2>
                <div className="grid gap-4">
                  {platforms.map((platform) => {
                    const data = browser[platform];
                    if (!data || !data.versions || data.versions.length === 0) return null;

                    const latestVersion = data.versions[0];

                    return (
                      <div
                        key={platform}
                        className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow border border-border-subtle dark:border-neutral-700"
                      >
                        <h3 className="text-lg font-semibold text-text-primary dark:text-white mb-2">
                          {platformLabels[platform]}
                        </h3>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <div className="text-gray-600 dark:text-gray-400">Speedometer 3.1</div>
                            <div className="text-xl font-bold text-accent-primary">
                              {latestVersion?.scores?.speedometer3?.toFixed(2) || 'N/A'}
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-600 dark:text-gray-400">RAM Usage</div>
                            <div className="text-xl font-bold text-accent-primary">
                              {latestVersion?.scores?.ram || 'N/A'}
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-600 dark:text-gray-400">Engine</div>
                            <div className="text-xl font-bold text-text-primary dark:text-white">
                              {data.engine || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              <BrowserCompareDropdown
                currentSlug={slug}
                currentName={browser.name}
                browsers={compareBrowsers}
              />
            </article>
          </main>
          <Footer />
        </div>
      </DarkModeProvider>
    </ErrorBoundary>
  );
}
