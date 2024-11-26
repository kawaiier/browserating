import Image from "next/image";
import React from "react";

const BrowserCard = React.memo(
  ({ browser, getEngineColor, rank, selectedPlatform }) => {
    const platformData = browser[selectedPlatform];
    if (!platformData || platformData.length === 0) return null;

    const latestVersion = platformData[0];
    const prevSpeedometer3Score =
      platformData.length > 1 ? platformData[1].scores.speedometer3 : null;

    const getRankStyle = (rank) => {
      switch (rank) {
        case 1:
          return "ring-4 ring-yellow-400"; // Gold
        case 2:
          return "ring-4 ring-gray-300"; // Silver
        case 3:
          return "ring-4 ring-amber-600"; // Bronze
        default:
          return "";
      }
    };

    return (
      <div
        className={`bg-white shadow-lg rounded-lg overflow-hidden max-w-sm transition-transform transform hover:scale-105 ${getRankStyle(
          rank
        )}`}
        role="article"
        aria-labelledby={`browser-${browser.name}`}
      >
        <div className="p-4">
          <div className="flex items-center mb-4">
            <Image
              src={browser.logo}
              alt={`${browser.name} logo`}
              width={50}
              height={50}
              className="mr-4"
            />
            <h3
              id={`browser-${browser.name}`}
              className="text-xl font-semibold"
            >
              <a
                href={browser.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
              >
                {browser.name}
              </a>
            </h3>
          </div>
          <div className="mb-4">
            <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm mr-2">
              {latestVersion.version}
            </span>
            <span
              className={`px-2 py-1 rounded-full text-sm ${getEngineColor(
                browser.engine
              )}`}
            >
              {browser.engine}
            </span>
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-bold text-center mt-4">
              {latestVersion.scores.speedometer3.toFixed(2)}
            </p>
            {prevSpeedometer3Score && (
              <p className="text-sm text-center">
                <span
                  className={`${
                    latestVersion.scores.speedometer3 - prevSpeedometer3Score >
                    0
                      ? "text-green-600"
                      : latestVersion.scores.speedometer3 -
                          prevSpeedometer3Score <
                        0
                      ? "text-red-600"
                      : "text-gray-600"
                  }`}
                >
                  {latestVersion.scores.speedometer3 - prevSpeedometer3Score > 0
                    ? "+"
                    : ""}
                  {(
                    latestVersion.scores.speedometer3 - prevSpeedometer3Score
                  ).toFixed(2)}
                </span>
              </p>
            )}
            <p
              className={`text-xs text-gray-600 text-center ${
                prevSpeedometer3Score ? "" : "opacity-50"
              }`}
            >
              <span
                className="border-b border-dashed border-gray-400 cursor-help"
                title="Previous version score"
              >
                {(prevSpeedometer3Score && prevSpeedometer3Score.toFixed(2)) ||
                  "N/A"}
              </span>
            </p>
          </div>
        </div>
      </div>
    );
  }
);

// Add display name for the memoized component
BrowserCard.displayName = "BrowserCard";

export default BrowserCard;
