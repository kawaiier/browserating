import { getComparisonData, generateComparisonSlugs } from '@/app/lib/getComparisonData';
import {
  buildCompareUrl,
  canonicalPair,
  parsePairSlug,
  parseViewState,
  validateEngines,
} from '@/app/lib/comparisonUrl';
import { notFound, permanentRedirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { getDataLastModified } from '@/app/lib/getDataLastModified';
import DarkModeProvider from '@/app/components/DarkModeProvider';
import ErrorBoundary from '@/app/components/ErrorBoundary';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import BrowserCompareDropdown from '@/app/components/BrowserCompareDropdown';
import ComparisonFocus from '@/app/components/ComparisonFocus';
import { getBrowsersServer } from '@/app/lib/getBrowsersServer';
import {
  deriveComparison,
  formatScoreOutcome,
  getComparisonObservation,
  getMeasurementFreshness,
  getScoreOutcome,
} from '@/app/lib/comparisonViewModel';
import { getBrowserSlug } from '@/app/lib/getBrowserSlug';
import { platformNames } from '@/app/lib/platformDefinitions';

export async function generateStaticParams() {
  const comparisons = await generateComparisonSlugs();
  return comparisons.map((c) => ({ slug: c.slug }));
}

// Shared by metadata and page: a syntactically valid, distinct pair of known browsers.
async function resolvePair(slug) {
  const parts = parsePairSlug(slug);
  if (!parts) return null;
  const data = await getComparisonData(...parts);
  return data ? { parts, data, canonical: canonicalPair(...parts) } : null;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const resolved = await resolvePair(slug);
  if (!resolved) return { title: 'Comparison Not Found' };
  const { data, canonical } = resolved;

  return {
    title: `${data.browserA.name} vs ${data.browserB.name} - Browser Performance Comparison`,
    description: `Compare ${data.browserA.name} and ${data.browserB.name} performance. Speedometer 3.1 benchmark results.`,
    alternates: {
      canonical: `https://browserating.com/compare/${canonical.slug}`,
    },
  };
}

export default async function ComparePage({ params, searchParams }) {
  const { slug } = await params;
  const rawQuery = await searchParams;
  const query = parseViewState(rawQuery);
  const resolved = await resolvePair(slug);
  if (!resolved) notFound();
  const { parts, data: initial, canonical } = resolved;

  // A legacy reversed path keeps its visual order; any `order` it carries is ignored.
  // Only validated engine choices survive the permanent redirect.
  if (canonical.reversed) {
    permanentRedirect(
      buildCompareUrl({
        first: parts[0],
        second: parts[1],
        engines: validateEngines(query.engines, initial),
        platform: query.platform,
      })
    );
  }

  const ordered = query.reverse ? [canonical.second, canonical.first] : parts;
  const engines = validateEngines(query.engines, initial);
  const [data, lastModified] = await Promise.all([
    getComparisonData(...ordered, engines),
    getDataLastModified(),
  ]);
  const { browserA, browserB } = data;
  const catalog = await getBrowsersServer();
  const shared = data.platforms.filter(
    (p) => p.a.state === 'available' && p.b.state === 'available'
  );
  const onlyShared = rawQuery?.shared === '1';
  const visible = onlyShared ? shared : data.platforms;
  const selected = data.platforms.find((p) => p.id === query.platform) || shared[0] || null;
  const invalidPlatform = rawQuery?.platform != null && !query.platform;
  const invalidEngine = Object.entries(query.engines).some(([slug, platforms]) =>
    Object.entries(platforms).some(([id, engine]) => engines[slug]?.[id] !== engine)
  );
  const optionsFor = (browser) =>
    catalog
      .filter((candidate) => getBrowserSlug(candidate.name) !== browser.slug)
      .map((candidate) => {
        const slug = getBrowserSlug(candidate.name);
        const comparison = deriveComparison(catalog, browser.slug, slug, engines);
        const count = comparison.platforms.filter(
          (p) => p.a.state === 'available' && p.b.state === 'available'
        ).length;
        const measured = Object.keys(platformNames).some(
          (id) => getComparisonObservation(candidate, id).state === 'available'
        );
        return {
          slug,
          name: `${candidate.name}${measured ? ` — ${count} shared platforms` : ' — No benchmarks yet'}`,
        };
      });
  const baseUrl = buildCompareUrl({
    first: ordered[0],
    second: ordered[1],
    engines,
    platform: query.platform,
  });
  const filterUrl = `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}shared=1`;
  const label = (observation) =>
    ({
      'missing-browser': 'No browser data',
      'missing-platform': 'No measurement',
      'missing-engine': 'No measurement for this engine',
      'missing-version': 'No recorded version',
      'missing-metric': 'Speedometer score not recorded',
      'invalid-metric': 'Invalid Speedometer score',
    })[observation.state] || observation.score?.toFixed(2);
  const evidence = (observation) => {
    if (!observation.record) return null;
    const freshness = getMeasurementFreshness(observation.record.date);
    return (
      <div className="mt-1 text-sm font-normal" style={{ color: 'var(--text-subtle)' }}>
        <div>Version: {observation.record.version || 'Not recorded'}</div>
        <div>Engine: {observation.engine || 'Not recorded'}</div>
        <div>
          {freshness === 'unknown'
            ? 'Test date not recorded'
            : `Tested on ${observation.record.date}`}
        </div>
        {freshness === 'older' && <div>Older measurement (over 180 days old)</div>}
      </div>
    );
  };
  const hiddenState = (omit) => (
    <>
      {query.reverse && <input type="hidden" name="order" value="reverse" />}
      {omit !== 'platform' && selected && (
        <input type="hidden" name="platform" value={selected.id} />
      )}
      {Object.entries(engines).flatMap(([slug, platforms]) =>
        Object.entries(platforms).map(([id, engine]) => {
          const name = `engine.${slug}.${id}`;
          return name === omit ? null : (
            <input key={name} type="hidden" name={name} value={engine} />
          );
        })
      )}
      {onlyShared && <input type="hidden" name="shared" value="1" />}
    </>
  );
  const outcomeText = (platform) =>
    formatScoreOutcome(getScoreOutcome(platform.a, platform.b), browserA.name, browserB.name);

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
                <Link href="/" className="hover:underline" style={{ color: 'var(--text-brand)' }}>
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

              <BrowserCompareDropdown
                currentSlug={browserA.slug}
                currentName={browserA.name}
                browsers={optionsFor(browserA)}
              />
              <BrowserCompareDropdown
                currentSlug={browserB.slug}
                currentName={browserB.name}
                browsers={optionsFor(browserB)}
              />
              <p className="mb-4" style={{ color: 'var(--text-subtle)' }}>
                <Link href={`/browsers/${browserA.slug}`} className="underline">
                  {browserA.name} details
                </Link>
                {' · '}
                <Link href={`/browsers/${browserB.slug}`} className="underline">
                  {browserB.name} details
                </Link>
              </p>
              <section>
                <ComparisonFocus />
                <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-default)' }}>
                  Performance Comparison
                </h2>
                {(invalidPlatform || invalidEngine) && (
                  <p role="status" className="mb-4" style={{ color: 'var(--text-default)' }}>
                    {invalidPlatform && 'That platform is unavailable; the default is shown. '}
                    {invalidEngine &&
                      'An engine choice was unavailable; the primary engine is shown.'}
                  </p>
                )}
                <form
                  method="get"
                  data-comparison-control
                  className="mb-4 flex flex-wrap items-end gap-3"
                >
                  {hiddenState('platform')}
                  <div>
                    <label htmlFor="comparison-platform" className="block font-medium">
                      Platform
                    </label>
                    <select
                      id="comparison-platform"
                      name="platform"
                      defaultValue={selected?.id || ''}
                      className="p-2 rounded"
                      style={{
                        backgroundColor: 'var(--surface-raised)',
                        color: 'var(--text-default)',
                        border: '1px solid var(--border-default)',
                      }}
                    >
                      {!selected && (
                        <option value="" disabled>
                          Choose a platform
                        </option>
                      )}
                      {data.platforms.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="rounded px-3 py-2"
                    style={{ backgroundColor: 'var(--color-brand)', color: 'white' }}
                  >
                    Show platform
                  </button>
                </form>
                {selected && (
                  <section
                    aria-label={`Selected result for ${selected.label}`}
                    className="mb-6 rounded-lg p-4"
                    style={{
                      backgroundColor: 'var(--surface-raised)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <h3 className="text-xl font-bold">{selected.label} — Speedometer 3.1</h3>
                    <p id="comparison-result" tabIndex={-1} role="status" className="my-2">
                      {selected.label}. {browserA.name}:{' '}
                      {selected.a.engine || 'engine not recorded'}. {browserB.name}:{' '}
                      {selected.b.engine || 'engine not recorded'}. {outcomeText(selected)}
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      {[
                        [browserA, selected.a],
                        [browserB, selected.b],
                      ].map(([browser, observation]) => {
                        const name = `engine.${browser.slug}.${selected.id}`;
                        return (
                          <div key={browser.slug}>
                            <p className="font-semibold">
                              {browser.name}: {label(observation)}
                            </p>
                            {observation.engines.length > 1 ? (
                              <form
                                method="get"
                                data-comparison-control
                                className="mt-2 flex flex-wrap items-end gap-2"
                              >
                                {hiddenState(name)}
                                <div>
                                  <label htmlFor={name} className="block">
                                    {browser.name} engine
                                  </label>
                                  <select
                                    id={name}
                                    name={name}
                                    defaultValue={observation.engine}
                                    className="p-2 rounded"
                                    style={{
                                      backgroundColor: 'var(--surface-raised)',
                                      color: 'var(--text-default)',
                                      border: '1px solid var(--border-default)',
                                    }}
                                  >
                                    {observation.engines.map((engine) => (
                                      <option key={engine} value={engine}>
                                        {engine}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                                <button
                                  type="submit"
                                  className="rounded px-3 py-2"
                                  style={{ backgroundColor: 'var(--color-brand)', color: 'white' }}
                                >
                                  Show engine
                                </button>
                              </form>
                            ) : (
                              <p>Engine: {observation.engine || 'Not recorded'}</p>
                            )}
                            {evidence(observation)}
                          </div>
                        );
                      })}
                    </div>
                  </section>
                )}
                <p className="mb-4" style={{ color: 'var(--text-subtle)' }}>
                  Speedometer 3.1 — higher is better. Dates are when each measurement was tested;
                  older measurements are more than 180 days old. Different dates alone do not
                  establish different test setups. Hardware and setup details are not recorded for
                  individual measurements. See the{' '}
                  <Link href="/#methodology" className="underline">
                    general testing methodology
                  </Link>{' '}
                  for the procedure, which does not document each measurement’s setup.
                </p>
                <p className="mb-4" style={{ color: 'var(--text-subtle)' }}>
                  {shared.length} shared platform{' '}
                  {shared.length === 1 ? 'measurement' : 'measurements'}.
                  {shared.length === 0 &&
                    ' These browsers have no shared platform measurements, so there is no head-to-head result. Missing measurements do not establish platform incompatibility.'}
                </p>
                <p className="mb-4">
                  <Link className="underline" href={onlyShared ? baseUrl : filterUrl}>
                    {onlyShared ? 'Show all platforms (reset filter)' : 'Shared measurements only'}
                  </Link>
                </p>
                {onlyShared && visible.length === 0 ? (
                  <p>
                    No shared measurements match this filter. Use the reset link to show all
                    platforms.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-default)' }}>
                          <th className="text-left py-2" style={{ color: 'var(--text-default)' }}>
                            Platform
                          </th>
                          <th className="text-right py-2" style={{ color: 'var(--text-default)' }}>
                            {browserA.name}
                          </th>
                          <th className="text-right py-2" style={{ color: 'var(--text-default)' }}>
                            {browserB.name}
                          </th>
                          <th
                            className="text-left py-2 pl-4"
                            style={{ color: 'var(--text-default)' }}
                          >
                            Recorded result
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {visible.map((platform) => {
                          const result = getScoreOutcome(platform.a, platform.b);
                          return (
                            <tr
                              key={platform.id}
                              style={{ borderBottom: '1px solid var(--border-subtle)' }}
                            >
                              <td
                                className="py-2 font-medium"
                                style={{ color: 'var(--text-default)' }}
                              >
                                {platform.label}
                              </td>
                              <td
                                className="text-right py-2"
                                style={{
                                  color: 'var(--text-default)',
                                }}
                              >
                                {label(platform.a)}
                                {result.state === 'a' && (
                                  <div className="font-semibold">Higher recorded score</div>
                                )}
                                {evidence(platform.a)}
                              </td>
                              <td
                                className="text-right py-2"
                                style={{
                                  color: 'var(--text-default)',
                                }}
                              >
                                {label(platform.b)}
                                {result.state === 'b' && (
                                  <div className="font-semibold">Higher recorded score</div>
                                )}
                                {evidence(platform.b)}
                              </td>
                              <td className="py-2 pl-4" style={{ color: 'var(--text-default)' }}>
                                {formatScoreOutcome(result, browserA.name, browserB.name)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            </article>
          </main>
          <Footer />
        </div>
      </DarkModeProvider>
    </ErrorBoundary>
  );
}
