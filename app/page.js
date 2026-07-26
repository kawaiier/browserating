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
