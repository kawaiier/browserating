import ComparisonEntryLink from '@/app/components/ComparisonEntryLink';
import BrowserCompareDropdown from '@/app/components/BrowserCompareDropdown';
import DarkModeProvider from '@/app/components/DarkModeProvider';
import ErrorBoundary from '@/app/components/ErrorBoundary';
import Footer from '@/app/components/Footer';
import Header from '@/app/components/Header';
import { getBrowsersServer } from '@/app/lib/getBrowsersServer';
import { comparisonOptions } from '@/app/lib/comparisonOptions';
import { indexableComparisonSlugs } from '@/app/lib/comparisonIndex';
import { buildCompareUrl } from '@/app/lib/comparisonUrl';

export const metadata = {
  title: 'Compare Browsers - Speedometer 3.1 Benchmarks',
  description:
    'Choose two browsers and compare their recorded Speedometer 3.1 results across platforms.',
  alternates: { canonical: 'https://browserating.com/compare' },
};

export default async function CompareHub() {
  const catalog = await getBrowsersServer();
  const options = comparisonOptions(catalog);
  const bySlug = new Map(options.map((option) => [option.slug, option]));
  const examples = indexableComparisonSlugs(catalog)
    .slice(0, 6)
    .map(({ browserA, browserB }) => {
      const a = bySlug.get(browserA);
      const b = bySlug.get(browserB);
      return { a, b, count: a.platforms.filter((id) => b.platforms.includes(id)).length };
    });

  return (
    <ErrorBoundary analyticsScope="comparison">
      <DarkModeProvider>
        <div className="min-h-screen" style={{ backgroundColor: 'var(--surface-default)' }}>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:p-3"
            style={{ backgroundColor: 'var(--color-brand)', color: 'var(--text-inverse)' }}
          >
            Skip to main content
          </a>
          <Header compact />
          <main id="main-content" className="container mx-auto min-w-0 px-4 py-8" tabIndex={-1}>
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl font-bold mb-3" style={{ color: 'var(--text-default)' }}>
                Compare browser performance
              </h1>
              <p className="mb-8" style={{ color: 'var(--text-subtle)' }}>
                Choose two browsers to explore their recorded Speedometer 3.1 scores, test dates,
                and coverage across platforms.
              </p>
              <BrowserCompareDropdown browsers={options} first="" source="hub" />
              <section aria-labelledby="examples-heading">
                <h2
                  id="examples-heading"
                  className="text-2xl font-bold mb-3"
                  style={{ color: 'var(--text-default)' }}
                >
                  Comparisons with shared measurements
                </h2>
                <p className="mb-4" style={{ color: 'var(--text-subtle)' }}>
                  Examples are selected from pairs with recorded scores on at least one shared
                  platform.
                </p>
                {examples.length ? (
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {examples.map(({ a, b, count }) => (
                      <li
                        key={`${a.slug}-${b.slug}`}
                        className="rounded-lg p-4"
                        style={{
                          backgroundColor: 'var(--surface-raised)',
                          border: '1px solid var(--border-subtle)',
                        }}
                      >
                        <ComparisonEntryLink
                          source="hub"
                          className="font-semibold underline"
                          style={{ color: 'var(--text-default)' }}
                          href={buildCompareUrl({ first: a.slug, second: b.slug })}
                        >
                          {a.name} vs {b.name}
                        </ComparisonEntryLink>
                        <p className="text-sm mt-1" style={{ color: 'var(--text-subtle)' }}>
                          {count} shared measured {count === 1 ? 'platform' : 'platforms'}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ color: 'var(--text-subtle)' }}>
                    No pairs have shared measurements yet. You can still choose any two browsers
                    above.
                  </p>
                )}
              </section>
            </div>
          </main>
          <Footer />
        </div>
      </DarkModeProvider>
    </ErrorBoundary>
  );
}
