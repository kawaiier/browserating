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

  const topScore = initialBrowsers.reduce((max, b) => {
    const score = b['macos-arm']?.versions?.[0]?.scores?.speedometer3 ?? 0;
    return score > max ? score : max;
  }, 0);

  return (
    <ErrorBoundary>
      <DarkModeProvider>
        <div className="min-h-screen bg-canvas transition-colors duration-200">
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-accent-primary hover:bg-accent-primary-hover focus:text-white focus:shadow-xl focus:rounded-radius-md focus:font-semibold focus:transition-all focus:duration-200 focus:outline-none focus:ring-4 focus:ring-accent-primary/40"
          >
            Skip to main content
          </a>
          <Header lastModified={lastModified} topScore={topScore} />
          <main id="main-content" className="container mx-auto px-4 py-8 scroll-mt-4" tabIndex={-1}>
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
