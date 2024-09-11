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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEngine, setSelectedEngine] = useState("All");

  useEffect(() => {
    async function fetchBrowsers() {
      try {
        const data = await getBrowsers();
        const sortedBrowsers = data.sort(
          (a, b) =>
            b.versions[0].scores.speedometer3 -
            a.versions[0].scores.speedometer3,
        );
        setBrowsers(sortedBrowsers);
        setFilteredBrowsers(sortedBrowsers);
        setIsLoading(false);
      } catch (err) {
        setError("Failed to load browser data");
        setIsLoading(false);
      }
    }

    fetchBrowsers();
  }, []);

  useEffect(() => {
    if (selectedEngine === "All") {
      setFilteredBrowsers(browsers);
    } else {
      const filtered = browsers.filter(
        (browser) => browser.engine === selectedEngine,
      );
      setFilteredBrowsers(filtered);
    }
  }, [selectedEngine, browsers]);

  const engines = [
    "All",
    ...new Set(browsers.map((browser) => browser.engine)),
  ];

  const handleEngineFilter = (engine) => {
    setSelectedEngine(engine);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {filteredBrowsers.map((browser, index) => (
          <BrowserCard
            key={browser.name}
            browser={browser}
            getEngineColor={getEngineColor}
            rank={index + 1}
          />
        ))}
      </div>
    </div>
  );
}
