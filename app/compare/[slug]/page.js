import { getComparisonData, generateComparisonSlugs } from '@/app/lib/getComparisonData';
import { notFound, permanentRedirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
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
      canonical: `https://browserating.com/compare/${[...parts].sort().join('-vs-')}`,
    },
  };
}

export default async function ComparePage({ params, searchParams }) {
  const { slug } = await params;
  const query = await searchParams;
  const parts = slug.split('-vs-');
  const initial = parts.length === 2 ? await getComparisonData(...parts) : null;
  if (!initial) notFound();

  const sorted = [...parts].sort();
  if (parts[0] !== sorted[0]) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(query || {})) {
      if (typeof value === 'string' && key !== 'order') params.set(key, value);
    }
    if (query?.order !== 'reverse') params.set('order', 'reverse');
    const suffix = params.toString();
    permanentRedirect(`/compare/${sorted.join('-vs-')}${suffix ? `?${suffix}` : ''}`);
  }

  const ordered = query?.order === 'reverse' ? [...sorted].reverse() : sorted;
  const base = ordered[0] === parts[0] ? initial : await getComparisonData(...ordered);
  const engines = {};
  for (const platform of base.platforms) {
    for (const [index, side] of ['a', 'b'].entries()) {
      const value = query?.[`engine.${ordered[index]}.${platform.id}`];
      if (typeof value === 'string' && platform[side].engines.includes(value)) {
        (engines[ordered[index]] ||= {})[platform.id] = value;
      }
    }
  }
  const [data, lastModified] = await Promise.all([
    getComparisonData(...ordered, engines),
    getDataLastModified(),
  ]);
  const { browserA, browserB } = data;


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
          <main
            id="main-content"
            className="container mx-auto px-4 py-8 scroll-mt-4"
            tabIndex={-1}
          >
            <article className="max-w-4xl mx-auto">
              <nav className="mb-6">
                <Link
                  href="/"
                  className="hover:underline"
                  style={{ color: 'var(--text-brand)' }}
                >
                  <ArrowLeft className="inline w-4 h-4" aria-hidden="true" /> Back to Full Rankings
                </Link>
              </nav>

              <header className="mb-8">
                <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--text-default)' }}>
                  {browserA.name} vs {browserB.name}
                </h1>
                <p className="text-lg" style={{ color: 'var(--text-subtle)' }}>
                  Detailed performance comparison
                </p>
              </header>

              <section className="mb-8">
                <div className="grid md:grid-cols-2 gap-6">
                  <div
                    className="rounded-lg p-6"
                    style={{
                      backgroundColor: 'var(--surface-raised)',
                      border: '1px solid var(--border-subtle)',
                      boxShadow: 'var(--shadow-raised)',
                    }}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="relative w-12 h-12">
                        <Image
                          src={browserA.logo}
                          alt={`${browserA.name} logo`}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <h2 className="text-2xl font-bold" style={{ color: 'var(--text-default)' }}>
                        {browserA.name}
                      </h2>
                    </div>
                  </div>

                  <div
                    className="rounded-lg p-6"
                    style={{
                      backgroundColor: 'var(--surface-raised)',
                      border: '1px solid var(--border-subtle)',
                      boxShadow: 'var(--shadow-raised)',
                    }}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="relative w-12 h-12">
                        <Image
                          src={browserB.logo}
                          alt={`${browserB.name} logo`}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <h2 className="text-2xl font-bold" style={{ color: 'var(--text-default)' }}>
                        {browserB.name}
                      </h2>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-default)' }}>
                  Performance Comparison
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border-default)' }}>
                        <th
                          className="text-left py-2"
                          style={{ color: 'var(--text-default)' }}
                        >
                          Platform
                        </th>
                        <th
                          className="text-right py-2"
                          style={{ color: 'var(--text-default)' }}
                        >
                          {browserA.name}
                        </th>
                        <th
                          className="text-right py-2"
                          style={{ color: 'var(--text-default)' }}
                        >
                          {browserB.name}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.platforms.map((platform) => {
                        if (platform.a.state === 'missing-platform' && platform.b.state === 'missing-platform') return null;
                        const scoreA = platform.a.score;
                        const scoreB = platform.b.score;

                        return (
                          <tr
                            key={platform.id}
                            style={{ borderBottom: '1px solid var(--border-subtle)' }}
                          >
                            <td className="py-2 font-medium" style={{ color: 'var(--text-default)' }}>
                              {platform.label}
                            </td>
                            <td
                              className="text-right py-2"
                              style={{
                                color:
                                  platform.outcome === 'a'
                                    ? 'var(--color-success)'
                                    : 'var(--text-default)',
                                fontWeight: platform.outcome === 'a' ? 'bold' : 'normal',
                              }}
                            >
                              {scoreA?.toFixed(2) || 'N/A'}
                            </td>
                            <td
                              className="text-right py-2"
                              style={{
                                color:
                                  platform.outcome === 'b'
                                    ? 'var(--color-success)'
                                    : 'var(--text-default)',
                                fontWeight: platform.outcome === 'b' ? 'bold' : 'normal',
                              }}
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
