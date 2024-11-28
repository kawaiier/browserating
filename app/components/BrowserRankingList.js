"use client";
import { useState, useEffect, useMemo } from "react";
import BrowserCard from "./BrowserCard";
import { getBrowsers } from "../lib/getBrowsers";
import BrowserBarChart from "./BrowserBarChart";

const engineColors = {
  Blink: "bg-blue-200 text-blue-700 hover:bg-blue-300",
  Gecko: "bg-green-200 text-green-700 hover:bg-green-300",
  WebKit: "bg-orange-200 text-orange-700 hover:bg-orange-300",
  All: "bg-gray-200 text-gray-700 hover:bg-gray-300",
};

const getEngineColor = (engine) => {
  return engineColors[engine] || "bg-red-200 text-red-700 hover:bg-red-300"; // Default to red for "Unknown"
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
    <div className="h-24 bg-gray-200 rounded"></div>
    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
    <div className="h-6 bg-gray-200 rounded w-1/2"></div>
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
              )} ${
                selectedEngine === engine
                  ? "ring-2 ring-offset-2 ring-gray-300"
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
              className={`px-3 py-1 rounded-full text-sm ${
                selectedPlatform === platform
                  ? "ring-2 ring-offset-2 ring-gray-300"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
              aria-pressed={selectedPlatform === platform}
            >
              {platformNames[platform]}
            </button>
          ))}
        </div>

        {/* Browser Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
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
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-4 flex flex-wrap gap-2">
        {engines.map((engine) => (
          <button
            key={engine}
            onClick={() => handleEngineFilter(engine)}
            className={`px-2 py-1 rounded-full text-sm ${getEngineColor(
              engine
            )} ${
              selectedEngine === engine
                ? "ring-2 ring-offset-2 ring-gray-300"
                : ""
            }`}
            aria-pressed={selectedEngine === engine}
          >
            {engine}
          </button>
        ))}
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        {platforms.map((platform) => (
          <button
            key={platform}
            onClick={() => handlePlatformChange(platform)}
            className={`px-2 py-1 rounded-full text-sm ${
              selectedPlatform === platform
                ? "ring-2 ring-offset-2 ring-gray-300"
                : ""
            }`}
            aria-pressed={selectedPlatform === platform}
          >
            {platformNames[platform]}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
