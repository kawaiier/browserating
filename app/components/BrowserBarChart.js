import { useMemo } from "react";

export default function BrowserBarChart({
  browsers,
  platform,
  getEngineColor,
}) {
  if (!browsers || !platform || !getEngineColor) {
    console.warn("BrowserBarChart: Missing required props");
    return null;
  }

  const chartData = useMemo(() => {
    return browsers
      .filter((browser) => {
        const scores = browser[platform]?.[0]?.scores;
        return scores && typeof scores.speedometer3 === "number";
      })
      .map((browser) => ({
        name: browser.name,
        score: browser[platform][0].scores.speedometer3,
        engine: browser.engine || "unknown",
      }))
      .sort((a, b) => a.score - b.score);
  }, [browsers, platform]);

  const maxScore = useMemo(() => {
    return Math.max(...chartData.map((item) => item.score), 1);
  }, [chartData]);

  if (chartData.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No performance data available for the selected platform
      </div>
    );
  }

  return (
    <div className="space-y-4 w-full">
      <h3 className="text-lg font-semibold">Performance Comparison</h3>
      <p className="text-sm text-gray-500">Scroll to view</p>
      <div className="overflow-x-auto scrollbar">
        <div className="h-[400px] flex justify-start gap-4 p-4 min-w-fit">
          {chartData.map((item) => (
            <div key={item.name} className="flex flex-col w-24 flex-shrink-0">
              <div className="text-sm font-medium text-center mb-2">
                {Math.round(item.score).toLocaleString()}
              </div>

              <div className="flex-1 relative group">
                <div className="absolute inset-0 bg-gray-100 rounded-t-lg">
                  <div
                    className={`w-full ${getEngineColor(
                      item.engine
                    )} rounded-t-lg absolute bottom-0 transition-all duration-200 hover:brightness-90`}
                    style={{
                      height: `${(item.score / maxScore) * 100}%`,
                    }}
                  >
                    {/* Hover Score */}
                    <div className="opacity-0 group-hover:opacity-100 absolute inset-0 flex items-center justify-center text-white font-medium transition-opacity duration-200">
                      {item.score.toLocaleString(undefined, {
                        maximumFractionDigits: 1,
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-[60px] flex items-center justify-center mt-2">
                <div
                  className="text-sm font-medium text-center w-full break-words"
                  title={item.name}
                >
                  {item.name}
                </div>
              </div>
            </div>
          ))}
        </div>
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
          border-radius: 4px;
        }

        .scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }

        .scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
}
