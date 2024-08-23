"use client";

import { useState, useEffect } from "react";
import BrowserCard from "./BrowserCard";
import { getBrowsers } from "../lib/getBrowsers";

export default function BrowserRankingList() {
  const [browsers, setBrowsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchBrowsers() {
      try {
        const data = await getBrowsers();
        // Sort browsers by the latest version's overall score
        const sortedBrowsers = data.sort(
          (a, b) =>
            b.versions[0].scores.overallScore -
            a.versions[0].scores.overallScore,
        );
        setBrowsers(sortedBrowsers);
        setIsLoading(false);
      } catch (err) {
        setError("Failed to load browser data");
        setIsLoading(false);
      }
    }

    fetchBrowsers();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {browsers.map((browser) => (
        <BrowserCard key={browser.name} browser={browser} />
      ))}
    </div>
  );
}
