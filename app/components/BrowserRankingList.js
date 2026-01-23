"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import BrowserBarChart from "./BrowserBarChart";
import BrowserCard from "./BrowserCard";
import { getBrowsers } from "../lib/getBrowsers";
import { useLocalStorage } from "../hooks/useLocalStorage";

const engineColors = {
  Blink:
    "bg-blue-100 dark:bg-sky-900/50 text-blue-800 dark:text-blue-100 hover:bg-blue-200 dark:hover:bg-sky-800 border border-blue-200 dark:border-sky-700",
  Gecko:
    "bg-green-100 dark:bg-emerald-900/50 text-green-800 dark:text-green-100 hover:bg-green-200 dark:hover:bg-emerald-800 border border-green-200 dark:border-emerald-700",
  WebKit:
    "bg-orange-100 dark:bg-amber-900/50 text-orange-800 dark:text-orange-100 hover:bg-orange-200 dark:hover:bg-amber-800 border border-orange-200 dark:border-amber-700",
  All: "bg-gray-100 dark:bg-gray-700/50 text-gray-800 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600",
};

const getEngineColor = (engine) => {
  return (
    engineColors[engine] ||
    "bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-100 hover:bg-red-200 dark:hover:bg-red-800 border border-red-200 dark:border-red-700"
  );
};

const platformNames = {
  "macos-arm": "macOS ARM",
  "macos-intel": "macOS Intel",
  windows: "Windows",
  android: "Android",
  ipad: "iPad OS",
};

const platformIcons = {
  "macos-arm": "🍎",
  "macos-intel": "💻",
  windows: "🪟",
  android: "🤖",
  ipad: "📱",
};

const NEW_PLATFORM = "macos-arm";
const OUTDATED_PLATFORMS = ["android", "macos-intel"];

// Enhanced Skeleton Loader
const SkeletonLoader = ({ index }) => (
  <div
    className="animate-pulse bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
    style={{ animationDelay: `${index * 100}ms` }}
  >
    <div className="p-6">
      <div className="flex items-center mb-6">
        <div className="w-14 h-14 bg-gray-200 dark:bg-gray-700 rounded-xl mr-4"></div>
        <div className="flex-1">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-3/4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
      <div className="flex gap-2 mb-6">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-full w-20"></div>
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-full w-16"></div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4"
          >
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Search Component
const SearchBar = ({
  searchTerm,
  onSearchChange,
  totalBrowsers,
  filteredCount,
}) => (
  <div className="relative mb-6">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <svg
        className="h-5 w-5 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </div>
    <input
      type="text"
      placeholder="Search browsers..."
      value={searchTerm}
      onChange={(e) => onSearchChange(e.target.value)}
      className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-xl leading-5 bg-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 dark:text-white transition-all duration-200"
      aria-label="Search browsers"
    />
    {searchTerm && (
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {filteredCount} of {totalBrowsers}
        </span>
      </div>
    )}
  </div>
);

// Statistics Component
const StatsBar = ({ browsers, selectedPlatform }) => {
  const stats = useMemo(() => {
    const validBrowsers = browsers.filter(
      (b) => b[selectedPlatform]?.versions?.length > 0,
    );
    if (validBrowsers.length === 0) return null;

    const scores = validBrowsers.map(
      (b) => b[selectedPlatform].versions[0].scores.speedometer3,
    );
    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    const maxScore = Math.max(...scores);
    const minScore = Math.min(...scores);

    const engines = [
      ...new Set(validBrowsers.map((b) => b[selectedPlatform].engine)),
    ];

    return {
      total: validBrowsers.length,
      avgScore: avgScore.toFixed(1),
      maxScore: maxScore.toFixed(1),
      minScore: minScore.toFixed(1),
      engines: engines.length,
    };
  }, [browsers, selectedPlatform]);

  if (!stats) return null;

  return (
    <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl border border-purple-200 dark:border-purple-700/50">
      <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
        <div className="flex items-center gap-6">
          <div className="text-gray-700 dark:text-gray-300">
            <span className="font-semibold text-purple-700 dark:text-purple-300">
              {stats.total}
            </span>{" "}
            browsers tested
          </div>
          <div className="text-gray-700 dark:text-gray-300">
            <span className="font-semibold text-blue-700 dark:text-blue-300">
              {stats.engines}
            </span>{" "}
            engines
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-gray-700 dark:text-gray-300">
            Avg: <span className="font-semibold">{stats.avgScore}</span>
          </div>
          <div className="text-gray-700 dark:text-gray-300">
            Range: <span className="font-semibold">{stats.minScore}</span> -{" "}
            <span className="font-semibold text-green-700 dark:text-green-300">
              {stats.maxScore}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function BrowserRankingList({ initialBrowsers = [] }) {
  const [browsers, setBrowsers] = useState(initialBrowsers);
  const [filteredBrowsers, setFilteredBrowsers] = useState(initialBrowsers);
  const [selectedEngine, setSelectedEngine] = useLocalStorage(
    "selectedEngine",
    "All",
  );
  const [selectedPlatform, setSelectedPlatform] = useLocalStorage(
    "selectedPlatform",
    "macos-arm",
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(initialBrowsers.length === 0);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [viewMode, setViewMode] = useLocalStorage("viewMode", "grid");
  const abortControllerRef = useRef(null);

  const fetchBrowsers = useCallback(async () => {
    if (initialBrowsers.length > 0 && retryCount === 0) {
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      setError(null);

      // Cancel previous request if exists
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();

      const data = await getBrowsers();
      setBrowsers(data);
      setIsLoading(false);
    } catch (err) {
      if (err.name !== "AbortError") {
        setError(
          "Failed to load browser data. Please check your connection and try again.",
        );
        setIsLoading(false);
      }
    }
  }, [initialBrowsers.length, retryCount]);

  useEffect(() => {
    fetchBrowsers();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchBrowsers]);

  const sortBrowsersByPlatform = useCallback((browsers, platform) => {
    return [...browsers].sort((a, b) => {
      const aScore = a[platform]?.versions?.[0]?.scores?.speedometer3 || 0;
      const bScore = b[platform]?.versions?.[0]?.scores?.speedometer3 || 0;
      return bScore - aScore;
    });
  }, []);

  const sortedBrowsers = useMemo(
    () => sortBrowsersByPlatform(browsers, selectedPlatform),
    [browsers, selectedPlatform, sortBrowsersByPlatform],
  );

  const filteredAndSearchedBrowsers = useMemo(() => {
    let filtered = sortedBrowsers.filter((browser) => {
      const platformData = browser[selectedPlatform];
      if (
        !platformData ||
        !platformData.versions ||
        platformData.versions.length === 0
      ) {
        return false;
      }
      return true;
    });

    if (selectedEngine !== "All") {
      filtered = filtered.filter((browser) => {
        const platformData = browser[selectedPlatform];
        return platformData?.engine === selectedEngine;
      });
    }

    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(
        (browser) =>
          browser.name.toLowerCase().includes(searchLower) ||
          browser[selectedPlatform]?.engine
            ?.toLowerCase()
            .includes(searchLower),
      );
    }

    return filtered;
  }, [selectedEngine, sortedBrowsers, selectedPlatform, searchTerm]);

  useEffect(() => {
    setFilteredBrowsers(filteredAndSearchedBrowsers);
  }, [filteredAndSearchedBrowsers]);

  const engines = useMemo(() => {
    const platformEngines = browsers
      .filter((browser) => browser[selectedPlatform]?.versions?.length > 0)
      .map((browser) => browser[selectedPlatform].engine)
      .filter(Boolean);

    return ["All", ...new Set(platformEngines)];
  }, [browsers, selectedPlatform]);

  const platforms = ["macos-arm", "android", "ipad", "windows", "macos-intel"];

  const handleEngineFilter = useCallback(
    (engine) => {
      setSelectedEngine(engine);
    },
    [setSelectedEngine],
  );

  const handlePlatformChange = useCallback(
    (platform) => {
      setSelectedPlatform(platform);
      setSelectedEngine("All");
      setSearchTerm("");
    },
    [setSelectedPlatform, setSelectedEngine],
  );

  const handleRetry = useCallback(() => {
    setRetryCount((prev) => prev + 1);
    fetchBrowsers();
  }, [fetchBrowsers]);

  const handleSearchChange = useCallback((value) => {
    setSearchTerm(value);
  }, []);

  const renderPlatformButtons = () => (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
        Select Platform
      </h3>
      <div
        className="flex flex-wrap gap-3"
        role="radiogroup"
        aria-label="Select platform"
      >
        {platforms.map((platform) => (
          <button
            key={platform}
            onClick={() => handlePlatformChange(platform)}
            className={`group relative px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-purple-500/50
            ${
              selectedPlatform === platform
                ? "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 ring-2 ring-purple-500 shadow-lg scale-105"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 hover:scale-102"
            }`}
            role="radio"
            aria-checked={selectedPlatform === platform}
          >
            <span className="flex items-center gap-2">
              <span className="text-lg">{platformIcons[platform]}</span>
              {platformNames[platform]}
            </span>

            {platform === NEW_PLATFORM && (
              <span
                className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs px-2 py-1 rounded-full font-bold animate-pulse shadow-lg"
                aria-label="Recently updated"
              >
                NEW
              </span>
            )}

            {OUTDATED_PLATFORMS.includes(platform) && (
              <span
                className="absolute -top-2 -right-2 bg-gray-400 dark:bg-gray-600 text-gray-800 dark:text-gray-200 text-xs px-2 py-1 rounded-full font-bold shadow-lg"
                aria-label="Potentially outdated data"
              >
                OUTDATED
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );

  const renderEngineButtons = () => (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
        Filter by Engine
      </h3>
      <div
        className="flex flex-wrap gap-3"
        role="radiogroup"
        aria-label="Filter by engine"
      >
        {engines.map((engine) => (
          <button
            key={engine}
            onClick={() => handleEngineFilter(engine)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-purple-500/50 ${getEngineColor(
              engine,
            )}
            ${
              selectedEngine === engine
                ? "ring-2 ring-offset-2 ring-purple-500 shadow-lg scale-105"
                : "hover:scale-102"
            }`}
            role="radio"
            aria-checked={selectedEngine === engine}
          >
            {engine === "All" ? "All Engines" : `${engine} Engine`}
          </button>
        ))}
      </div>
    </div>
  );

  const renderViewModeToggle = () => (
    <div className="flex items-center gap-2 mb-6">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        View:
      </span>
      <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
        <button
          onClick={() => setViewMode("grid")}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
            viewMode === "grid"
              ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Grid
          </span>
        </button>
        <button
          onClick={() => setViewMode("list")}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
            viewMode === "list"
              ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
            List
          </span>
        </button>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <section
        className="p-6 lg:px-10 max-w-7xl mx-auto"
        aria-label="Browser Rankings"
      >
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Browser Rankings
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Loading performance data...
          </p>
        </div>

        {renderPlatformButtons()}
        {renderEngineButtons()}

        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          aria-live="polite"
          aria-busy="true"
        >
          <div className="sr-only">Loading browser data...</div>
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <SkeletonLoader key={i} index={i} />
            ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section
        className="p-6 lg:px-10 max-w-7xl mx-auto"
        aria-label="Error Loading Data"
      >
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-600 dark:text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Unable to Load Data
          </h2>
          <p className="text-red-600 dark:text-red-400 mb-6" role="alert">
            {error}
          </p>
          <button
            onClick={handleRetry}
            disabled={isLoading}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white rounded-xl font-medium transition-colors focus:outline-none focus:ring-4 focus:ring-purple-500/50"
          >
            {isLoading
              ? "Retrying..."
              : `Retry ${retryCount > 0 ? `(${retryCount})` : ""}`}
          </button>
        </div>
      </section>
    );
  }

  return (
    <section
      className="p-6 lg:px-10 max-w-7xl mx-auto"
      aria-label="Browser Rankings"
      id="rankings"
    >
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Browser Performance Rankings
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Compare browser performance across different platforms using
          Speedometer 3.1 benchmark
        </p>
      </div>

      {renderPlatformButtons()}
      {renderEngineButtons()}

      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        totalBrowsers={sortedBrowsers.length}
        filteredCount={filteredBrowsers.length}
      />

      <StatsBar browsers={sortedBrowsers} selectedPlatform={selectedPlatform} />

      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {filteredBrowsers.length === 0
            ? "No browsers found"
            : `${filteredBrowsers.length} ${
                filteredBrowsers.length === 1 ? "browser" : "browsers"
              } on ${platformNames[selectedPlatform]}`}
        </h3>
        {filteredBrowsers.length > 0 && renderViewModeToggle()}
      </div>

      {/* Browser Cards */}
      <div
        className={`${
          viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            : "space-y-4"
        } mb-12`}
        aria-live="polite"
      >
        {filteredBrowsers.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No browsers found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {searchTerm
                ? `No browsers match "${searchTerm}" with the selected filters.`
                : "No browsers match the selected filters."}
            </p>
            {(searchTerm || selectedEngine !== "All") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedEngine("All");
                }}
                className="px-4 py-2 text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          filteredBrowsers.map((browser, index) => (
            <BrowserCard
              key={`${browser.name}-${selectedPlatform}`}
              browser={browser}
              getEngineColor={getEngineColor}
              rank={index + 1}
              selectedPlatform={selectedPlatform}
              isLoading={false}
            />
          ))
        )}
      </div>

      {/* Chart Section */}
      {filteredBrowsers.length > 0 && (
        <div className="mt-12">
          <BrowserBarChart
            browsers={filteredBrowsers}
            platform={selectedPlatform}
            getEngineColor={getEngineColor}
          />
        </div>
      )}
    </section>
  );
}
