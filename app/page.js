import About from './components/About/About';
import BrowserRankingList from './components/BrowserRankingList';
import Explanation from './components/Explanation';
import Footer from './components/Footer';
import Header from './components/Header';
import Newsletter from './components/Newsletter';
import DarkModeProvider from './components/DarkModeProvider';
import ErrorBoundary from './components/ErrorBoundary';
import { getBrowsersServer } from './lib/getBrowsersServer';
import { getDataLastModified } from './lib/getDataLastModified';

const RENDER_DATE = new Date().toISOString().split('T')[0];

// Describes the full ranking dataset, so it belongs on the homepage only.
function DatasetJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Dataset',
          name: 'Browser Performance Comparison 2026',
          description:
            'Comprehensive performance comparison of web browsers (Chrome, Firefox, Safari, Edge, Brave, etc.) across macOS, Windows, Android and iPad platforms. Metrics include Speedometer 3.1 scores, RAM consumption, and ad-blocking effectiveness.',
          keywords: [
            'browser performance',
            'browser benchmark',
            'Speedometer 3.1',
            'browser comparison',
            'adblocking quality',
            'RAM usage',
            'fastest browser 2026',
            'macOS browsers',
            'Windows browsers',
            'Android browsers',
            'iPad browsers',
          ],
          creator: {
            '@type': 'Person',
            name: 'Sergei Manvelov',
            url: 'https://kawaiier.dev',
          },
          includedInDataCatalog: {
            '@type': 'DataCatalog',
            name: 'BrowseRating Data',
          },
          license: 'https://browserating.com/privacy',
          dateModified: RENDER_DATE,
          version: '1.2.0',
          isAccessibleForFree: true,
        }),
      }}
    />
  );
}

export default async function Home() {
  const [initialBrowsers, lastModified] = await Promise.all([
    getBrowsersServer(),
    getDataLastModified(),
  ]);

  return (
    <ErrorBoundary>
      <DarkModeProvider>
        <div
          className="min-h-screen transition-colors duration-200"
          style={{ backgroundColor: 'var(--surface-default)' }}
        >
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:font-semibold focus:transition-all focus:duration-200 focus:outline-none"
            style={{
              backgroundColor: 'var(--color-brand)',
              color: 'var(--text-inverse)',
              padding: 'var(--space-100) var(--space-200)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-overlay)',
            }}
          >
            Skip to main content
          </a>
          <DatasetJsonLd />
          <Header lastModified={lastModified} />
          <main
            id="main-content"
            className="container mx-auto scroll-mt-4"
            style={{ padding: 'var(--space-300) var(--space-200)' }}
            tabIndex={-1}
          >
            <BrowserRankingList initialBrowsers={initialBrowsers} />
            <Newsletter />
            <About />
            <Explanation />
          </main>
          <Footer />
        </div>
      </DarkModeProvider>
    </ErrorBoundary>
  );
}
