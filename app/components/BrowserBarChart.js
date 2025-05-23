import { useMemo } from "react";

export default function BrowserBarChart({
  browsers,
  platform,
  getEngineColor,
}) {
  const chartData = useMemo(() => {
    if (!browsers || !platform) return [];

    return browsers
      .filter((browser) => {
        const platformData = browser[platform];
        const scores = platformData?.versions?.[0]?.scores;
        return scores && typeof scores.speedometer3 === "number";
      })
      .map((browser) => {
        const platformData = browser[platform];
        return {
          name: browser.name,
          score: platformData.versions[0].scores.speedometer3,
          engine: platformData.engine || "unknown",
        };
      })
      .sort((a, b) => a.score - b.score);
  }, [browsers, platform]);

  const maxScore = useMemo(() => {
    return Math.max(...chartData.map((item) => item.score), 1);
  }, [chartData]);

  if (!browsers || !platform || !getEngineColor) {
    console.warn("BrowserBarChart: Missing required props");
    return null;
  }

  if (chartData.length === 0) {
    return (
      <div
        className="text-center text-gray-500 py-8"
        role="status"
        aria-live="polite"
      >
        No performance data available for the selected platform
      </div>
    );
  }

  // Get platform display name
  const platformNames = {
    "macos-arm": "macOS ARM",
    "macos-intel": "macOS Intel",
    windows: "Windows",
    android: "Android",
    ipad: "iPad OS",
  };

  const platformName = platformNames[platform] || platform;

  return (
    <div className="space-y-4 w-full">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold dark:text-gray-100">
          Performance Comparison - {platformName}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          <span className="hidden sm:inline">Scroll to view all browsers</span>
          <span className="sm:hidden">Swipe to view</span>
        </p>
      </div>

      <div
        className="overflow-x-auto scrollbar"
        tabIndex="0"
        role="region"
        aria-label={`Browser performance chart for ${platformName}`}
      >
        <div className="h-[300px] flex justify-start gap-4 p-4 min-w-fit">
          {chartData.map((item, index) => {
            const percentHeight = (item.score / maxScore) * 100;
            const scoreFormatted = item.score.toLocaleString(undefined, {
              maximumFractionDigits: 1,
            });

            return (
              <div
                key={item.name}
                className="flex flex-col w-24 flex-shrink-0"
                role="presentation"
              >
                <div
                  className="text-sm font-medium text-center mb-2 dark:text-gray-300"
                  aria-hidden="true"
                >
                  {Math.round(item.score).toLocaleString()}
                </div>

                <div
                  className="flex-1 relative group"
                  role="graphics-symbol"
                  aria-label={`${
                    item.name
                  } score: ${scoreFormatted}, ${percentHeight.toFixed(
                    1
                  )}% of maximum score`}
                  aria-roledescription="bar"
                >
                  <div className="absolute inset-0 bg-gray-100 dark:bg-gray-700 rounded-t-lg">
                    <div
                      className={`w-full ${getEngineColor(
                        item.engine
                      )} rounded-t-lg absolute bottom-0 transition-all duration-200 hover:brightness-90`}
                      style={{
                        height: `${percentHeight}%`,
                      }}
                    >
                      {/* Hover Score */}
                      <div className="opacity-0 group-hover:opacity-100 absolute inset-0 flex items-center justify-center text-gray-500 dark:text-gray-200 font-medium transition-opacity duration-200">
                        {scoreFormatted}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="h-[60px] flex items-center justify-center mt-2">
                  <div
                    className="text-sm font-medium text-center w-full break-words dark:text-gray-300"
                    title={item.name}
                  >
                    {item.name}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Screen reader only summary */}
      <div className="sr-only">
        <h4>Summary of browser performance on {platformName}</h4>
        <p>From highest to lowest score:</p>
        <ol>
          {[...chartData].reverse().map((item, index) => (
            <li key={`summary-${item.name}`}>
              {item.name} with a score of {item.score.toFixed(1)} using{" "}
              {item.engine} engine
            </li>
          ))}
        </ol>
      </div>

      <style jsx>{`
        .scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 #f1f5f9;
        }

        .scrollbar::-webkit-scrollbar {
          height: 8px;
        }

        .scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          @media (prefers-color-scheme: dark) {
            background: #1f2937;
          }
        }

        .scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
          @media (prefers-color-scheme: dark) {
            background: #4b5563;
          }
        }

        .scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
          @media (prefers-color-scheme: dark) {
            background: #6b7280;
          }
        }
      `}</style>
    </div>
  );
}
