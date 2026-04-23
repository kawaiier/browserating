import { getComparisonData, generateComparisonSlugs } from '@/app/lib/getComparisonData';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getDataLastModified } from '@/app/lib/getDataLastModified';
import DarkModeProvider from '@/app/components/DarkModeProvider';
import ErrorBoundary from '@/app/components/ErrorBoundary';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';

export async function generateStaticParams() {
  const comparisons = await generateComparisonSlugs();
  return comparisons.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const parts = slug.split('-vs-');
  if (parts.length !== 2) return { title: 'Comparison Not Found' };

  const data = await getComparisonData(parts[0], parts[1]);
  if (!data) return { title: 'Comparison Not Found' };

  return {
    title: `${data.browserA.name} vs ${data.browserB.name} - Browser Performance Comparison`,
    description: `Compare ${data.browserA.name} and ${data.browserB.name} performance. Speedometer 3.1 benchmarks, RAM usage, and more.`,
    alternates: {
      canonical: `https://browserating.com/compare/${slug}`,
    },
  };
}

export default async function ComparePage({ params }) {
  const { slug } = await params;
  const [data, lastModified] = await Promise.all([
    getComparisonData(slug.split('-vs-')[0], slug.split('-vs-')[1]),
    getDataLastModified(),
  ]);

  if (!data) {
    notFound();
  }

  const { browserA, browserB } = data;
  const platforms = ['macos-arm', 'macos-intel', 'windows', 'android', 'ipad'];
  const platformLabels = {
    'macos-arm': 'macOS (ARM)',
    'macos-intel': 'macOS (Intel)',
    windows: 'Windows',
    android: 'Android',
    ipad: 'iPad',
  };

  return (
    <ErrorBoundary>
      <DarkModeProvider>
        <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-accent-primary hover:bg-purple-700 focus:text-white focus:shadow-xl focus:rounded-lg focus:font-semibold focus:transition-all focus:duration-200 focus:outline-none focus:ring-4 focus:ring-purple-500/50"
          >
            Skip to main content
          </a>
          <Header lastModified={lastModified} />
          <main id="main-content" className="container mx-auto px-4 py-8 scroll-mt-4" tabIndex={-1}>
            <article className="max-w-4xl mx-auto">
              <nav className="mb-6">
                <Link href="/" className="text-accent-primary hover:underline">
                  ← Back to Full Rankings
                </Link>
              </nav>

              <header className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  {browserA.name} vs {browserB.name}
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  Detailed performance comparison
                </p>
              </header>

              <section className="mb-8">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="relative w-12 h-12">
                        <Image
                          src={browserA.logo}
                          alt={`${browserA.name} logo`}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {browserA.name}
                      </h2>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="relative w-12 h-12">
                        <Image
                          src={browserB.logo}
                          alt={`${browserB.name} logo`}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {browserB.name}
                      </h2>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                  Performance Comparison
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-2 text-gray-900 dark:text-white">Platform</th>
                        <th className="text-right py-2 text-gray-900 dark:text-white">
                          {browserA.name}
                        </th>
                        <th className="text-right py-2 text-gray-900 dark:text-white">
                          {browserB.name}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {platforms.map((platform) => {
                        const dataA = browserA[platform];
                        const dataB = browserB[platform];
                        if (!dataA && !dataB) return null;

                        const scoreA = dataA?.versions?.[0]?.scores?.speedometer3;
                        const scoreB = dataB?.versions?.[0]?.scores?.speedometer3;

                        return (
                          <tr
                            key={platform}
                            className="border-b border-gray-200 dark:border-gray-700"
                          >
                            <td className="py-2 font-medium text-gray-900 dark:text-white">
                              {platformLabels[platform]}
                            </td>
                            <td
                              className={`text-right py-2 text-gray-900 dark:text-white ${
                                scoreA > scoreB ? 'text-green-600 font-bold' : ''
                              }`}
                            >
                              {scoreA?.toFixed(2) || 'N/A'}
                            </td>
                            <td
                              className={`text-right py-2 text-gray-900 dark:text-white ${
                                scoreB > scoreA ? 'text-green-600 font-bold' : ''
                              }`}
                            >
                              {scoreB?.toFixed(2) || 'N/A'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
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
