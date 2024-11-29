"use client";
import { useState, useEffect, useMemo } from "react";
import BrowserCard from "./BrowserCard";
import { getBrowsers } from "../lib/getBrowsers";
import BrowserBarChart from "./BrowserBarChart";

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

// Skeleton Loader Component
const SkeletonLoader = () => (
  <div className="animate-pulse flex flex-col space-y-4">
    <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
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

  if (isLoading) {
    return (
      <div className="p-6 lg:px-10">
        {/* Engine Filters */}
        <div className="mb-4 flex flex-wrap gap-3">
          {engines.map((engine) => (
            <button
              key={engine}
              onClick={() => handleEngineFilter(engine)}
              className={`px-3 py-1 rounded-full text-sm ${getEngineColor(
                engine
              )} 
              ${
                selectedEngine === engine
                  ? "ring-2 ring-offset-2 ring-gray-300 dark:ring-gray-500 dark:ring-offset-gray-900"
                  : ""
              }`}
              aria-pressed={selectedEngine === engine}
            >
              {engine}
            </button>
          ))}
        </div>

        {/* Platform Filters */}
        <div className="mb-4 flex flex-wrap gap-3">
          {platforms.map((platform) => (
            <button
              key={platform}
              onClick={() => handlePlatformChange(platform)}
              className={`px-3 py-1 rounded-full text-sm 
              ${
                selectedPlatform === platform
                  ? "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 ring-2 ring-offset-2 ring-gray-300 dark:ring-gray-500 dark:ring-offset-gray-900"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
              aria-pressed={selectedPlatform === platform}
            >
              {platformNames[platform]}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <SkeletonLoader key={i} />
            ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-purple-600 dark:bg-purple-500 text-white rounded-lg hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 lg:px-10">
      {/* Engine Filters */}
      <div className="mb-4 flex flex-wrap gap-3">
        {engines.map((engine) => (
          <button
            key={engine}
            onClick={() => handleEngineFilter(engine)}
            className={`px-3 py-1 rounded-full text-sm ${getEngineColor(
              engine
            )} 
            ${
              selectedEngine === engine
                ? "ring-2 ring-offset-2 ring-gray-300 dark:ring-gray-500 dark:ring-offset-gray-900"
                : ""
            }`}
            aria-pressed={selectedEngine === engine}
          >
            {engine}
          </button>
        ))}
      </div>

      {/* Platform Filters */}
      <div className="mb-4 flex flex-wrap gap-3">
        {platforms.map((platform) => (
          <button
            key={platform}
            onClick={() => handlePlatformChange(platform)}
            className={`px-3 py-1 rounded-full text-sm 
            ${
              selectedPlatform === platform
                ? "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 ring-2 ring-offset-2 ring-gray-300 dark:ring-gray-500 dark:ring-offset-gray-900"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
            aria-pressed={selectedPlatform === platform}
          >
            {platformNames[platform]}
          </button>
        ))}
      </div>

      {/* Browser Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBrowsers.map((browser, index) => (
          <BrowserCard
            key={browser.name}
            browser={browser}
            getEngineColor={getEngineColor}
            rank={index + 1}
            selectedPlatform={selectedPlatform}
          />
        ))}
      </div>

      {/* Chart Section */}
      <div className="mt-12">
        <BrowserBarChart
          browsers={filteredBrowsers}
          platform={selectedPlatform}
          getEngineColor={getEngineColor}
        />
      </div>
    </div>
  );
}
