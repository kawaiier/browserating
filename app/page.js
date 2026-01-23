import About from './components/About/About';
import BrowserRankingList from './components/BrowserRankingList';
import Explanation from './components/Explanation';
import Footer from './components/Footer';
import Header from './components/Header';
import Newsletter from './components/Newsletter';
import DarkModeProvider from './components/DarkModeProvider';
import ErrorBoundary from './components/ErrorBoundary';
import { getBrowsersServer } from './lib/getBrowsersServer';

export default async function Home() {
  const initialBrowsers = await getBrowsersServer();

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
          <Header />
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
