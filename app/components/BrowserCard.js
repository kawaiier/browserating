import React, { useState } from "react";

import BrowserDetailsModal from "./BrowserDetailsModal";
import Image from "next/image";

const BrowserCard = React.memo(
  ({ browser, getEngineColor, rank, selectedPlatform }) => {
    const [showModal, setShowModal] = useState(false);

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
      <>
        <div
          className={`bg-white dark:bg-gray-800 shadow-[1px_0px_50px_5px_rgba(241,247,255,0.5),_18px_12px_50px_3px_rgba(241,247,255,0.5)]
            dark:shadow-[0_0_100px_13px_rgba(126,4,255,0.07)]
            rounded-lg overflow-hidden w-full sm:max-w-sm md:max-w-md lg:max-w-lg
            transition-transform transform hover:scale-105 cursor-pointer`}
          role="article"
          aria-labelledby={`browser-${browser.name}`}
          onClick={() => setShowModal(true)}
        >
          <div className="p-4 sm:p-6">
            <div className="flex items-center mb-4">
              <Image
                src={browser.logo}
                alt={`${browser.name} logo`}
                width={50}
                height={50}
                className="mr-4 dark:brightness-90"
                style={{ width: "auto", height: "50px" }}
              />
              <h3
                id={`browser-${browser.name}`}
                className="text-xl sm:text-2xl font-semibold"
              >
                <a
                  href={browser.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent
                    hover:text-violet-900 dark:hover:text-violet-400 transition-colors"
                >
                  {browser.name}
                </a>
              </h3>
            </div>
            <div className="mb-4 flex flex-wrap gap-2">
              <span
                className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300
                px-2 py-1 rounded-full text-sm"
              >
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Speedometer Score */}
              <div className="text-center flex flex-col justify-between h-full">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                  Speedometer 3
                </p>
                <div>
                  <p className="text-2xl sm:text-3xl md:text-xl font-bold dark:text-white">
                    {latestVersion.scores.speedometer3.toFixed(2)}
                  </p>
                  {prevSpeedometer3Score && (
                    <p className="text-sm">
                      <span
                        className={`${
                          latestVersion.scores.speedometer3 -
                            prevSpeedometer3Score >
                          0
                            ? "text-green-600 dark:text-green-400"
                            : latestVersion.scores.speedometer3 -
                                prevSpeedometer3Score <
                              0
                            ? "text-red-600 dark:text-red-400"
                            : "text-gray-600 dark:text-gray-400"
                        }`}
                      >
                        {latestVersion.scores.speedometer3 -
                          prevSpeedometer3Score >
                        0
                          ? "+"
                          : ""}
                        {(
                          latestVersion.scores.speedometer3 -
                          prevSpeedometer3Score
                        ).toFixed(2)}
                      </span>
                    </p>
                  )}
                </div>
              </div>

              {/* RAM Score */}
              {latestVersion.scores.ram && (
                <div className="text-center flex flex-col justify-between h-full">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                    RAM Usage
                  </p>
                  <div>
                    <p className="text-2xl sm:text-3xl md:text-xl font-bold dark:text-white">
                      {latestVersion.scores.ram.toFixed(0)}
                    </p>
                    <span className="text-gray-600 dark:text-gray-400 text-sm">
                      MB
                    </span>
                  </div>
                </div>
              )}

              {/* Adblock Score */}
              {latestVersion.scores.adblock && (
                <div className="text-center flex flex-col justify-between h-full">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                    Adblock
                  </p>
                  <div className="pb-1">
                    <p className="text-2xl sm:text-3xl md:text-xl font-bold dark:text-white">
                      {latestVersion.scores.adblock.toFixed(0)}/100
                    </p>
                    <div className="w-full sm:w-10/12 md:w-9/12 lg:w-8/12 h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mt-1 mx-auto">
                      <div
                        className="h-full bg-violet-600 dark:bg-violet-500 rounded-full transition-all duration-500"
                        style={{ width: `${latestVersion.scores.adblock}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {showModal && (
          <BrowserDetailsModal
            browser={browser}
            selectedPlatform={selectedPlatform}
            onClose={() => setShowModal(false)}
          />
        )}
      </>
    );
  }
);

// Add display name for the memoized component
BrowserCard.displayName = "BrowserCard";

export default BrowserCard;
