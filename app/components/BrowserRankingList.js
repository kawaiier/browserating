"use client";
import { useState, useEffect } from "react";
import BrowserCard from "./BrowserCard";
import { getBrowsers } from "../lib/getBrowsers";

const engineColors = {
  Blink: "bg-blue-200 text-blue-700 hover:bg-blue-300",
  Gecko: "bg-green-200 text-green-700 hover:bg-green-300",
  WebKit: "bg-orange-200 text-orange-700 hover:bg-orange-300",
  All: "bg-gray-200 text-gray-700 hover:bg-gray-300",
};

const getEngineColor = (engine) => {
  return engineColors[engine] || "bg-red-200 text-red-700 hover:bg-red-300"; // Default to red for "Other"
};

export default function BrowserRankingList() {
  const [browsers, setBrowsers] = useState([]);
  const [filteredBrowsers, setFilteredBrowsers] = useState([]);
  const [selectedEngine, setSelectedEngine] = useState("All");
  const [selectedPlatform, setSelectedPlatform] = useState("macOS"); // Default to macOS
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchBrowsers() {
      try {
        const data = await getBrowsers();
        const sortedBrowsers = sortBrowsersByPlatform(data, selectedPlatform);
        setBrowsers(sortedBrowsers);
        setFilteredBrowsers(sortedBrowsers);
        setIsLoading(false);
      } catch (err) {
        setError("Failed to load browser data");
        setIsLoading(false);
      }
    }
    fetchBrowsers();
  }, [selectedPlatform]);

  const sortBrowsersByPlatform = (browsers, platform) => {
    return browsers.sort((a, b) => {
      const aPlatform = a.platforms.find((p) => p.name === platform);
      const bPlatform = b.platforms.find((p) => p.name === platform);
      return (
        (bPlatform?.versions[0]?.scores.speedometer3 || 0) -
        (aPlatform?.versions[0]?.scores.speedometer3 || 0)
      );
    });
  };

  useEffect(() => {
    const filtered =
      selectedEngine === "All"
        ? browsers
        : browsers.filter((browser) => browser.engine === selectedEngine);
    setFilteredBrowsers(filtered);
  }, [selectedEngine, browsers]);

  const engines = [
    "All",
    ...new Set(browsers.map((browser) => browser.engine)),
  ];

  const platforms = ["macOS", "Windows"];

  const handleEngineFilter = (engine) => {
    setSelectedEngine(engine);
  };

  const handlePlatformChange = (platform) => {
    setSelectedPlatform(platform);
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <div className="flex space-x-2">
        {engines.map((engine) => (
          <button
            key={engine}
            onClick={() => handleEngineFilter(engine)}
            className={`px-2 py-1 rounded-full text-sm ${getEngineColor(engine)} ${
              selectedEngine === engine
                ? "ring-2 ring-offset-2 ring-gray-300"
                : ""
            }`}
          >
            {engine}
          </button>
        ))}
      </div>

      <div className="flex space-x-2 mt-4">
        {platforms.map((platform) => (
          <button
            key={platform}
            onClick={() => handlePlatformChange(platform)}
            className={`px-2 py-1 rounded-full text-sm ${
              selectedPlatform === platform
                ? "ring-2 ring-offset-2 ring-gray-300"
                : ""
            }`}
          >
            {platform}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
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
