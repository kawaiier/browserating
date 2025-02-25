"use client";

import { useEffect, useState } from "react";

import About from "./components/About/About";
import BrowserRankingList from "./components/BrowserRankingList";
import Explanation from "./components/Explanation";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Newsletter from "./components/Newsletter";

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Check initial theme preference
    const isDarkMode =
      localStorage?.getItem("darkMode") === "true" ||
      (!("darkMode" in localStorage) &&
        window?.matchMedia?.("(prefers-color-scheme: dark)")?.matches);

    setDarkMode(isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    }
    setMounted(true);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    document.documentElement.classList.toggle("dark");
    localStorage.setItem("darkMode", newDarkMode);
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-white focus:text-black focus:top-0 focus:left-0 focus:outline-none focus:ring-2 focus:ring-purple-500"
      >
        Skip to content
      </a>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <main id="main-content" className="container mx-auto px-4 py-8">
        <BrowserRankingList />
        <Newsletter />
        <About />
        <Explanation />
      </main>
      <Footer />
    </div>
  );
}
