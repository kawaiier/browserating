import { useEffect, useMemo, useRef, useState } from "react";

export default function BrowserBarChart({
  browsers,
  platform,
  getEngineColor,
}) {
  const [sortOrder, setSortOrder] = useState("desc");
  const [hoveredBar, setHoveredBar] = useState(null);
  const [selectedBars, setSelectedBars] = useState([]);
  const chartRef = useRef(null);

  const chartData = useMemo(() => {
    if (!browsers || !platform) return [];

    let data = browsers
      .filter((browser) => {
        const platformData = browser[platform];
        const scores = platformData?.versions?.[0]?.scores;
        return scores && typeof scores.speedometer3 === "number";
      })
      .map((browser) => {
        const platformData = browser[platform];
        const currentScore = platformData.versions[0].scores.speedometer3;
        const previousScore = platformData.versions[1]?.scores?.speedometer3;

        return {
          name: browser.name,
          score: currentScore,
          previousScore: previousScore,
          trend: previousScore
            ? ((currentScore - previousScore) / previousScore) * 100
            : 0,
          engine: platformData.engine || "unknown",
          ramUsage: platformData.versions[0].scores.ram,
          adblockScore: platformData.versions[0].scores.adblock,
        };
      });

    // Sort data based on selected order
    switch (sortOrder) {
      case "asc":
        return data.sort((a, b) => a.score - b.score);
      case "alphabetical":
        return data.sort((a, b) => a.name.localeCompare(b.name));
      default: // desc
        return data.sort((a, b) => b.score - a.score);
    }
  }, [browsers, platform, sortOrder]);

  const maxScore = useMemo(() => {
    return Math.max(...chartData.map((item) => item.score), 1);
  }, [chartData]);

  // Performance categories
  const getPerformanceCategory = (score) => {
    if (score >= maxScore * 0.9)
      return {
        label: "Excellent",
        color: "text-green-600 dark:text-green-400",
      };
    if (score >= maxScore * 0.7)
      return { label: "Good", color: "text-blue-600 dark:text-blue-400" };
    if (score >= maxScore * 0.5)
      return { label: "Fair", color: "text-yellow-600 dark:text-yellow-400" };
    return { label: "Poor", color: "text-red-600 dark:text-red-400" };
  };

  const handleBarClick = (itemName) => {
    setSelectedBars((prev) =>
      prev.includes(itemName)
        ? prev.filter((name) => name !== itemName)
        : [...prev, itemName]
    );
  };

  const handleKeyDown = (e, itemName) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleBarClick(itemName);
    }
  };

  // Clear selection when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chartRef.current && !chartRef.current.contains(event.target)) {
        setSelectedBars([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!browsers || !platform || !getEngineColor) {
    console.warn("BrowserBarChart: Missing required props");
    return null;
  }

  if (chartData.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8">
        <div className="text-center" role="status" aria-live="polite">
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
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No Performance Data
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            No performance data available for the selected platform and filters.
          </p>
        </div>
      </div>
    );
  }

  const platformNames = {
    "macos-arm": "macOS ARM",
    "macos-intel": "macOS Intel",
    windows: "Windows",
    android: "Android",
    ipad: "iPad OS",
  };

  const platformName = platformNames[platform] || platform;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Performance Comparison
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Speedometer 3.1 scores on {platformName} • {chartData.length}{" "}
              browsers
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <label
                htmlFor="sort-select"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Sort:
              </label>
              <select
                id="sort-select"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="desc">Highest First</option>
                <option value="asc">Lowest First</option>
                <option value="alphabetical">Alphabetical</option>
              </select>
            </div>

            {selectedBars.length > 0 && (
              <button
                onClick={() => setSelectedBars([])}
                className="text-sm px-3 py-1.5 text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium"
              >
                Clear Selection ({selectedBars.length})
              </button>
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">
              Excellent (90-100%)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">
              Good (70-89%)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">
              Fair (50-69%)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">
              Poor (&lt;50%)
            </span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="p-6">
        <div
          ref={chartRef}
          className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-800"
          tabIndex="0"
          role="region"
          aria-label={`Interactive browser performance chart for ${platformName}. Use arrow keys to navigate, Enter or Space to select bars.`}
        >
          <div
            className="flex items-end justify-start gap-3 p-4 min-w-fit"
            style={{
              minWidth: `${chartData.length * 120}px`,
              height: "400px",
            }}
          >
            {chartData.map((item, index) => {
              const percentHeight = (item.score / maxScore) * 100;
              const barHeight = Math.max(percentHeight * 3.2, 20); // Minimum 20px height, scale by 3.2 for visibility
              const scoreFormatted = item.score.toLocaleString(undefined, {
                maximumFractionDigits: 1,
              });
              const isHovered = hoveredBar === item.name;
              const isSelected = selectedBars.includes(item.name);
              const performance = getPerformanceCategory(item.score);

              return (
                <div
                  key={item.name}
                  className="flex flex-col w-28 flex-shrink-0 group cursor-pointer"
                  onClick={() => handleBarClick(item.name)}
                  onKeyDown={(e) => handleKeyDown(e, item.name)}
                  onMouseEnter={() => setHoveredBar(item.name)}
                  onMouseLeave={() => setHoveredBar(null)}
                  tabIndex="0"
                  role="button"
                  aria-pressed={isSelected}
                  aria-label={`${item.name}: ${scoreFormatted} points using ${
                    item.engine
                  } engine${
                    item.trend !== 0
                      ? `, trend: ${
                          item.trend > 0 ? "+" : ""
                        }${item.trend.toFixed(1)}%`
                      : ""
                  }`}
                  style={{ height: "400px" }}
                >
                  {/* Rank and Score */}
                  <div className="text-center mb-2">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      #{index + 1}
                    </div>
                    <div className={`text-sm font-bold ${performance.color}`}>
                      {scoreFormatted}
                    </div>
                    {item.trend !== 0 && (
                      <div
                        className={`text-xs ${
                          item.trend > 0
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {item.trend > 0 ? "↗" : "↘"}{" "}
                        {Math.abs(item.trend).toFixed(1)}%
                      </div>
                    )}
                  </div>

                  {/* Bar Container */}
                  <div
                    className="flex-1 flex flex-col justify-end"
                    style={{ minHeight: "280px" }}
                  >
                    {/* Bar */}
                    <div
                      className={`relative transition-all duration-300 rounded-t-xl ${
                        isSelected
                          ? "ring-4 ring-purple-500 ring-offset-2 dark:ring-offset-gray-800"
                          : ""
                      } ${isHovered ? "transform scale-105" : ""}`}
                      style={{
                        height: `${barHeight}px`,
                        minHeight: "20px",
                      }}
                      role="graphics-symbol"
                      aria-roledescription="performance bar"
                    >
                      <div
                        className={`w-full h-full rounded-t-xl transition-all duration-500 relative ${getEngineColor(
                          item.engine
                        )} ${
                          isHovered || isSelected
                            ? "shadow-lg brightness-110"
                            : "hover:brightness-105"
                        }`}
                      >
                        {/* Performance indicator */}
                        <div
                          className={`absolute top-1 right-1 w-2 h-2 rounded-full ${
                            item.score >= maxScore * 0.9
                              ? "bg-green-400"
                              : item.score >= maxScore * 0.7
                              ? "bg-blue-400"
                              : item.score >= maxScore * 0.5
                              ? "bg-yellow-400"
                              : "bg-red-400"
                          }`}
                        ></div>

                        {/* Hover tooltip */}
                        {isHovered && (
                          <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-lg z-10">
                            <div className="font-semibold">{item.name}</div>
                            <div>Score: {scoreFormatted}</div>
                            <div>Engine: {item.engine}</div>
                            {item.ramUsage && (
                              <div>RAM: {item.ramUsage.toFixed(0)} MB</div>
                            )}
                            {item.adblockScore && (
                              <div>
                                Adblock: {item.adblockScore.toFixed(0)}%
                              </div>
                            )}
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-100"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Browser name and engine */}
                  <div className="mt-3 text-center">
                    <div
                      className={`text-sm font-medium text-gray-900 dark:text-white break-words leading-tight ${
                        isSelected ? "text-purple-700 dark:text-purple-300" : ""
                      }`}
                      title={item.name}
                    >
                      {item.name}
                    </div>
                    <div
                      className={`text-xs mt-1 px-2 py-1 rounded-full ${getEngineColor(
                        item.engine
                      )}`}
                    >
                      {item.engine}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart Instructions */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Click or tap bars to select • Hover for details •
            <span className="hidden sm:inline">
              {" "}
              Scroll horizontally to view all browsers
            </span>
            <span className="sm:hidden"> Swipe to scroll</span>
          </p>
        </div>
      </div>

      {/* Selected Browser Comparison */}
      {selectedBars.length > 1 && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-6">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Comparison ({selectedBars.length} selected)
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {chartData
              .filter((item) => selectedBars.includes(item.name))
              .map((item) => (
                <div
                  key={item.name}
                  className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {item.name}
                    </span>
                    <button
                      onClick={() => handleBarClick(item.name)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      aria-label={`Remove ${item.name} from comparison`}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div>
                      Score:{" "}
                      <span className="font-semibold">
                        {item.score.toFixed(1)}
                      </span>
                    </div>
                    <div>
                      Engine: <span className="font-medium">{item.engine}</span>
                    </div>
                    {item.ramUsage && (
                      <div>
                        RAM:{" "}
                        <span className="font-medium">
                          {item.ramUsage.toFixed(0)} MB
                        </span>
                      </div>
                    )}
                    {item.adblockScore && (
                      <div>
                        Adblock:{" "}
                        <span className="font-medium">
                          {item.adblockScore.toFixed(0)}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Screen reader summary */}
      <div className="sr-only">
        <h4>Summary of browser performance on {platformName}</h4>
        <p>
          Sorted by{" "}
          {sortOrder === "desc"
            ? "highest to lowest"
            : sortOrder === "asc"
            ? "lowest to highest"
            : "alphabetical order"}
          :
        </p>
        <ol>
          {chartData.map((item, index) => (
            <li key={`summary-${item.name}`}>
              {item.name} ranked #{index + 1} with a score of{" "}
              {item.score.toFixed(1)} using {item.engine} engine
              {item.trend !== 0 &&
                `, showing a ${
                  item.trend > 0 ? "positive" : "negative"
                } trend of ${Math.abs(item.trend).toFixed(1)}%`}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
