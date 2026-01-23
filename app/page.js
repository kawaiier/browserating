import About from "./components/About/About";
import BrowserRankingList from "./components/BrowserRankingList";
import Explanation from "./components/Explanation";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Newsletter from "./components/Newsletter";
import DarkModeProvider from "./components/DarkModeProvider";
import { getBrowsersServer } from "./lib/getBrowsersServer";

export default async function Home() {
  const initialBrowsers = await getBrowsersServer();

  return (
    <DarkModeProvider>
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-white focus:text-black focus:top-0 focus:left-0 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          Skip to content
        </a>
        <Header />
        <main id="main-content" className="container mx-auto px-4 py-8">
          <BrowserRankingList initialBrowsers={initialBrowsers} />
          <Newsletter />
          <About />
          <Explanation />
        </main>
        <Footer />
      </div>
    </DarkModeProvider>
  );
}
