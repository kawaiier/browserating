import { getBrowsersByPlatform, getPlatformLabel } from '@/app/lib/getBrowsersByPlatform';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
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
  const { platform } = await params;
  const platformLabel = getPlatformLabel(platform);

  if (!platformLabel || platformLabel === platform) {
    return { title: 'Platform Not Found' };
  }

  const browsers = await getBrowsersByPlatform(platform);
  const browserCount = browsers?.length || 0;

  return {
    title: `Best Browsers for ${platformLabel} 2026 - Performance Rankings`,
    description: `Compare the fastest browsers for ${platformLabel} in 2026. Speedometer 3.1 benchmarks for ${browserCount} browsers.`,
    alternates: {
      canonical: `https://browserating.com/platforms/${platform}`,
    },
  };
}

export default async function PlatformPage({ params }) {
  const { platform } = await params;
  const [browsers, lastModified] = await Promise.all([
    getBrowsersByPlatform(platform),
    getDataLastModified(),
  ]);
  const platformLabel = getPlatformLabel(platform);

  if (!browsers || platformLabel === platform) {
    notFound();
  }

  return (
    <ErrorBoundary>
      <DarkModeProvider>
        <div
          className="min-h-screen transition-colors duration-200"
          style={{ backgroundColor: 'var(--surface-default)' }}
        >
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:text-white focus:shadow-xl focus:rounded-lg focus:font-semibold focus:transition-all focus:duration-200 focus:outline-none"
            style={{ backgroundColor: 'var(--color-brand)' }}
          >
            Skip to main content
          </a>
          <Header lastModified={lastModified} />
          <main id="main-content" className="container mx-auto px-4 py-8 scroll-mt-4" tabIndex={-1}>
            <article className="max-w-4xl mx-auto">
              <nav className="mb-6">
                <Link
                  href="/"
                  className="hover:underline"
                  style={{ color: 'var(--text-brand)' }}
                >
                  <ArrowLeft className="inline w-4 h-4" aria-hidden="true" /> Back to Rankings
                </Link>
              </nav>

              <header className="mb-8">
                <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--text-default)' }}>
                  Best Browsers for {platformLabel} in 2026
                </h1>
                <p className="text-lg" style={{ color: 'var(--text-subtle)' }}>
                  Compare Speedometer 3.1 benchmark scores for {browsers.length} browsers.
                </p>
              </header>

              <section>
                <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-default)' }}>
                  Browser Performance Rankings
                </h2>
                <div className="grid gap-4">
                  {browsers.slice(0, 20).map((browser, index) => {
                    const slug = browser.name
                      .toLowerCase()
                      .replace(/\s+/g, '-')
                      .replace(/[^a-z0-9-]/g, '');
                    const score = browser[platform]?.versions?.[0]?.scores?.speedometer3;

                    return (
                      <div
                        key={browser.name}
                        className="flex items-center gap-4 p-4 rounded-lg"
                        style={{
                          backgroundColor: 'var(--surface-raised)',
                          border: '1px solid var(--border-subtle)',
                          boxShadow: 'var(--shadow-raised)',
                        }}
                      >
                        <div className="text-2xl font-bold" style={{ color: 'var(--text-subtle)' }}>
                          #{index + 1}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold" style={{ color: 'var(--text-default)' }}>
                            {browser.name}
                          </h3>
                          <div className="text-sm" style={{ color: 'var(--text-subtle)' }}>
                            Speedometer 3.1: {score?.toFixed(2) || 'N/A'}
                          </div>
                        </div>
                        <Link
                          href={`/browsers/${slug}`}
                          className="hover:underline"
                          style={{ color: 'var(--text-brand)' }}
                        >
                          View Details <ArrowRight className="inline w-4 h-4" aria-hidden="true" />
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
