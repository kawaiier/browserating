import { getBrowsersByPlatform, getPlatformLabel } from '@/app/lib/getBrowsersByPlatform';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getDataLastModified } from '@/app/lib/getDataLastModified';
import DarkModeProvider from '@/app/components/DarkModeProvider';
import ErrorBoundary from '@/app/components/ErrorBoundary';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';

export async function generateStaticParams() {
  return [
    { platform: 'macos-arm' },
    { platform: 'macos-intel' },
    { platform: 'windows' },
    { platform: 'android' },
    { platform: 'ipad' },
  ];
}

export async function generateMetadata({ params }) {
  const platformLabel = getPlatformLabel(params.platform);

  if (!platformLabel || platformLabel === params.platform) {
    return { title: 'Platform Not Found' };
  }

  const browsers = await getBrowsersByPlatform(params.platform);
  const browserCount = browsers?.length || 0;

  return {
    title: `Best Browsers for ${platformLabel} 2026 - Performance Rankings`,
    description: `Compare the fastest browsers for ${platformLabel} in 2026. Speedometer 3.1 benchmarks for ${browserCount} browsers.`,
    alternates: {
      canonical: `https://browserating.com/platforms/${params.platform}`,
    },
  };
}

export default async function PlatformPage({ params }) {
  const [browsers, lastModified] = await Promise.all([
    getBrowsersByPlatform(params.platform),
    getDataLastModified(),
  ]);
  const platformLabel = getPlatformLabel(params.platform);

  if (!browsers || platformLabel === params.platform) {
    notFound();
  }

  return (
    <ErrorBoundary>
      <DarkModeProvider>
        <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-purple-600 hover:bg-purple-700 focus:text-white focus:shadow-xl focus:rounded-lg focus:font-semibold focus:transition-all focus:duration-200 focus:outline-none focus:ring-4 focus:ring-purple-500/50"
          >
            Skip to main content
          </a>
          <Header lastModified={lastModified} />
          <main id="main-content" className="container mx-auto px-4 py-8 scroll-mt-4" tabIndex={-1}>
            <article className="max-w-4xl mx-auto">
              <nav className="mb-6">
                <Link href="/" className="text-purple-600 hover:underline">
                  ← Back to Rankings
                </Link>
              </nav>

              <header className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  Best Browsers for {platformLabel} in 2026
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  Compare Speedometer 3.1 benchmark scores for {browsers.length} browsers.
                </p>
              </header>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Browser Performance Rankings
                </h2>
                <div className="grid gap-4">
                  {browsers.slice(0, 20).map((browser, index) => {
                    const slug = browser.name
                      .toLowerCase()
                      .replace(/\s+/g, '-')
                      .replace(/[^a-z0-9-]/g, '');
                    const score = browser[params.platform]?.versions?.[0]?.scores?.speedometer3;

                    return (
                      <div
                        key={browser.name}
                        className="flex items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700"
                      >
                        <div className="text-2xl font-bold text-gray-400">#{index + 1}</div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {browser.name}
                          </h3>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Speedometer 3.1: {score?.toFixed(2) || 'N/A'}
                          </div>
                        </div>
                        <Link
                          href={`/browsers/${slug}`}
                          className="text-purple-600 hover:underline"
                        >
                          View Details →
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </section>
            </article>
          </main>
          <Footer />
        </div>
      </DarkModeProvider>
    </ErrorBoundary>
  );
}
