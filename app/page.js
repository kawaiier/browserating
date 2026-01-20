'use client';

import { useEffect, useState } from 'react';

import About from './components/About/About';
import ErrorBoundary from './components/ErrorBoundary';
import BrowserRankingList from './components/BrowserRankingList';
import Explanation from './components/Explanation';
import Footer from './components/Footer';
import Header from './components/Header';
import Newsletter from './components/Newsletter';

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Check initial theme preference
    const isDarkMode =
      localStorage?.getItem('darkMode') === 'true' ||
      (!('darkMode' in localStorage) &&
        window?.matchMedia?.('(prefers-color-scheme: dark)')?.matches);

    setDarkMode(isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    }
    setMounted(true);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('darkMode', newDarkMode);
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return null;
  }

  return (
    <ErrorBoundary>
      <style jsx>{`
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border-width: 0;
        }
        .sr-only\:not-sr-only {
          position: static;
          width: auto;
          height: auto;
          padding: 0.75rem 1rem;
          margin: 0;
          overflow: visible;
          clip: auto;
          white-space: normal;
        }
      `}</style>
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-purple-600 hover:bg-purple-700 focus:text-white focus:shadow-xl focus:rounded-lg focus:font-semibold focus:transition-all focus:duration-200 focus:outline-none focus:ring-4 focus:ring-purple-500/50"
        >
          Skip to main content
        </a>
        <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <main id="main-content" className="container mx-auto px-4 py-8 scroll-mt-4" tabIndex={-1}>
          <BrowserRankingList />
          <Newsletter />
          <About />
          <Explanation />
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
}
