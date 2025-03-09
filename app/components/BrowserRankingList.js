"use client";

import { useEffect, useMemo, useState } from "react";

import BrowserBarChart from "./BrowserBarChart";
import BrowserCard from "./BrowserCard";
import { getBrowsers } from "../lib/getBrowsers";

const engineColors = {
  Blink:
    "bg-blue-100 dark:bg-sky-900 text-blue-800 dark:text-blue-100 hover:bg-blue-200 dark:hover:bg-sky-800",
  Gecko:
    "bg-green-100 dark:bg-emerald-900 text-green-800 dark:text-green-100 hover:bg-green-200 dark:hover:bg-emerald-800",
  WebKit:
    "bg-orange-100 dark:bg-amber-900 text-orange-800 dark:text-orange-100 hover:bg-orange-200 dark:hover:bg-amber-800",
  All: "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600",
};

const getEngineColor = (engine) => {
  return (
    engineColors[engine] ||
    "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 hover:bg-red-200 dark:hover:bg-red-800"
  );
};

const platformNames = {
  "macos-arm": "macOS ARM",
  "macos-intel": "macOS Intel",
  windows: "Windows",
  android: "Android",
};

// Add this new constant for the NEW badge
const NEW_PLATFORM = "macos-arm";

// Skeleton Loader Component
const SkeletonLoader = () => (
  <div className="animate-pulse flex flex-col space-y-4 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md w-full">
    <div className="flex items-center space-x-4">
      <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
    </div>
    <div className="flex flex-wrap gap-2">
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
    </div>
    <div className="grid grid-cols-3 gap-4">
      <div className="flex flex-col items-center space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
      </div>
      <div className="flex flex-col items-center space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
      </div>
      <div className="flex flex-col items-center space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
      </div>
    </div>
  </div>
);

export default function BrowserRankingList() {
  const [browsers, setBrowsers] = useState([]);
  const [filteredBrowsers, setFilteredBrowsers] = useState([]);
  const [selectedEngine, setSelectedEngine] = useState("All");
  const [selectedPlatform, setSelectedPlatform] = useState("macos-arm");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBrowsers, setSelectedBrowsers] = useState([]);

  useEffect(() => {
    async function fetchBrowsers() {
      try {
        const data = await getBrowsers();
        setBrowsers(data);
        setFilteredBrowsers(data);
        setIsLoading(false);
      } catch (err) {
        setError("Failed to load browser data");
        setIsLoading(false);
      }
    }
    fetchBrowsers();
  }, []);

  const sortBrowsersByPlatform = (browsers, platform) => {
    return browsers.sort((a, b) => {
      const aScore = a[platform]?.[0]?.scores?.speedometer3 || 0;
      const bScore = b[platform]?.[0]?.scores?.speedometer3 || 0;
      return bScore - aScore;
    });
  };

  const sortedBrowsers = useMemo(
    () => sortBrowsersByPlatform(browsers, selectedPlatform),
    [browsers, selectedPlatform]
  );

  useEffect(() => {
    const filtered =
      selectedEngine === "All"
        ? sortedBrowsers
        : sortedBrowsers.filter((browser) => browser.engine === selectedEngine);
    setFilteredBrowsers(filtered);
  }, [selectedEngine, sortedBrowsers]);

  const engines = useMemo(
    () => ["All", ...new Set(browsers.map((browser) => browser.engine))],
    [browsers]
  );
  const platforms = ["macos-intel", "macos-arm", "windows", "android"];

  const handleEngineFilter = (engine) => {
    setSelectedEngine(engine);
  };

  const handlePlatformChange = (platform) => {
    setSelectedPlatform(platform);
  };

  const handleBrowserSelect = (browser) => {
    setSelectedBrowsers((prev) => {
      const exists = prev.find((b) => b.name === browser.name);
      if (exists) {
        return prev.filter((b) => b.name !== browser.name);
      }
      return [...prev, browser];
    });
  };

  const renderPlatformButtons = () => (
    <div
      className="mb-4 flex flex-wrap gap-3"
      role="radiogroup"
      aria-label="Select platform"
    >
      {platforms.map((platform) => (
        <button
          key={platform}
          onClick={() => handlePlatformChange(platform)}
          className={`px-3 py-1 rounded-full text-sm relative 
          ${
            selectedPlatform === platform
              ? "ring-2 ring-offset-2 ring-gray-300 dark:ring-gray-500 dark:ring-offset-gray-900"
              : ""
          }
          bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 
          hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors`}
          aria-pressed={selectedPlatform === platform}
          role="radio"
          aria-checked={selectedPlatform === platform}
        >
          {platformNames[platform]}
          {platform === NEW_PLATFORM && (
            <span
              className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs px-1.5 py-0.5 rounded-full font-semibold 
            animate-bounce-gentle hover:scale-105 transition-all duration-300 cursor-pointer
            shadow-md hover:shadow-lg"
              aria-label="Recently updated"
              style={{ transform: "none" }} /* Ensure no rotation is applied */
            >
              updated
            </span>
          )}
        </button>
      ))}
    </div>
  );

  const renderEngineButtons = () => (
    <div
      className="mb-4 flex flex-wrap gap-3"
      role="radiogroup"
      aria-label="Filter by engine"
    >
      {engines.map((engine) => (
        <button
          key={engine}
          onClick={() => handleEngineFilter(engine)}
          className={`px-3 py-1 rounded-full text-sm ${getEngineColor(engine)}
          ${
            selectedEngine === engine
              ? "ring-2 ring-offset-2 ring-gray-300 dark:ring-gray-500 dark:ring-offset-gray-900"
              : ""
          }`}
          aria-pressed={selectedEngine === engine}
          role="radio"
          aria-checked={selectedEngine === engine}
        >
          {engine}
        </button>
      ))}
    </div>
  );

  if (isLoading) {
    return (
      <section className="p-6 lg:px-10" aria-label="Browser Rankings">
        <h2 className="sr-only">Browser Performance Rankings</h2>
        {renderPlatformButtons()}
        {renderEngineButtons()}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center"
          aria-live="polite"
          aria-busy="true"
        >
          <div className="sr-only">Loading browser data...</div>
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <SkeletonLoader key={i} />
            ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="p-6 text-center" aria-label="Error Loading Data">
        <p className="text-red-600 dark:text-red-400 mb-4" role="alert">
          {error}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-purple-600 dark:bg-purple-500 text-white rounded-lg hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors"
        >
          Retry
        </button>
      </section>
    );
  }

  return (
    <section className="p-6 lg:px-10" aria-label="Browser Rankings">
      <h2 className="sr-only">Browser Performance Rankings</h2>
      {renderPlatformButtons()}
      {renderEngineButtons()}

      {/* Browser Cards */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        aria-live="polite"
      >
        {filteredBrowsers.length === 0 ? (
          <p className="col-span-full text-center py-8 text-gray-600 dark:text-gray-400">
            No browsers match the selected filters.
          </p>
        ) : (
          filteredBrowsers.map((browser, index) => (
            <BrowserCard
              key={browser.name}
              browser={browser}
              getEngineColor={getEngineColor}
              rank={index + 1}
              selectedPlatform={selectedPlatform}
            />
          ))
        )}
      </div>

      {/* Chart Section */}
      <div className="mt-12">
        <BrowserBarChart
          browsers={filteredBrowsers}
          platform={selectedPlatform}
          getEngineColor={getEngineColor}
        />
      </div>
    </section>
  );
}
