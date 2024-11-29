"use client";

import { useState, useEffect } from "react";
import About from "./components/About/About";
import BrowserRankingList from "./components/BrowserRankingList";
import Explanation from "./components/Explanation";
import Newsletter from "./components/Newsletter";
import Header from "./components/Header";
import Footer from "./components/Footer";

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
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <main className="container mx-auto px-4 py-8">
        <BrowserRankingList />
        <Newsletter />
        <About />
        <Explanation />
      </main>
      <Footer />
    </div>
  );
}
