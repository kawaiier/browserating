import React, { useEffect, useRef, useState } from "react";

import BrowserDetailsModal from "./BrowserDetailsModal";
import Image from "next/image";

const BrowserCard = React.memo(
  ({ browser, getEngineColor, rank, selectedPlatform, isLoading = false }) => {
    const [showModal, setShowModal] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [focusVisible, setFocusVisible] = useState(false);
    const cardRef = useRef(null);

    const platformData = browser[selectedPlatform];

    // Handle keyboard navigation
    useEffect(() => {
      const handleKeyDown = (e) => {
        if (e.key === "Tab") {
          setFocusVisible(true);
        }
      };

      const handleMouseDown = () => {
        setFocusVisible(false);
      };

      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("mousedown", handleMouseDown);

      return () => {
        document.removeEventListener("keydown", handleKeyDown);
        document.removeEventListener("mousedown", handleMouseDown);
      };
    }, []);

    if (
      !platformData ||
      !platformData.versions ||
      platformData.versions.length === 0
    ) {
      return null;
    }

    const latestVersion = platformData.versions[0];
    const prevSpeedometer3Score =
      platformData.versions.length > 1
        ? platformData.versions[1].scores.speedometer3
        : null;

    const platformEngine = platformData.engine;

    const getRankStyle = (rank) => {
      const baseStyles = "relative overflow-hidden";
      switch (rank) {
        case 1:
          return `${baseStyles} ring-4 ring-yellow-400 shadow-xl shadow-yellow-400/20`;
        case 2:
          return `${baseStyles} ring-4 ring-gray-300 shadow-xl shadow-gray-300/20`;
        case 3:
          return `${baseStyles} ring-4 ring-amber-600 shadow-xl shadow-amber-600/20`;
        default:
          return baseStyles;
      }
    };

    const getRankBadge = (rank) => {
      if (rank > 3) return null;

      const badges = {
        1: {
          text: "🏆 #1",
          color:
            "bg-gradient-to-r from-yellow-400 to-yellow-600 text-yellow-900",
        },
        2: {
          text: "🥈 #2",
          color: "bg-gradient-to-r from-gray-300 to-gray-500 text-gray-900",
        },
        3: {
          text: "🥉 #3",
          color: "bg-gradient-to-r from-amber-500 to-amber-700 text-amber-900",
        },
      };

      const badge = badges[rank];
      return (
        <div
          className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-bold ${badge.color} shadow-lg z-10`}
        >
          {badge.text}
        </div>
      );
    };

    const scoreDifference = prevSpeedometer3Score
      ? latestVersion.scores.speedometer3 - prevSpeedometer3Score
      : null;

    const scoreChangeText = scoreDifference
      ? `${scoreDifference > 0 ? "Increased" : "Decreased"} by ${Math.abs(
          scoreDifference
        ).toFixed(2)} points from previous version`
      : "";

    const handleCardInteraction = (e) => {
      if (
        e.type === "click" ||
        (e.type === "keydown" && (e.key === "Enter" || e.key === " "))
      ) {
        if (e.type === "keydown") e.preventDefault();
        setShowModal(true);
      }
    };

    const getPerformanceLevel = (score) => {
      if (score >= 40)
        return {
          level: "Excellent",
          color: "text-green-600 dark:text-green-400",
        };
      if (score >= 30)
        return { level: "Good", color: "text-blue-600 dark:text-blue-400" };
      if (score >= 20)
        return { level: "Fair", color: "text-yellow-600 dark:text-yellow-400" };
      return { level: "Poor", color: "text-red-600 dark:text-red-400" };
    };

    const performance = getPerformanceLevel(latestVersion.scores.speedometer3);

    if (isLoading) {
      return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden animate-pulse">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full mr-4"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            </div>
            <div className="flex gap-2 mb-4">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="text-center">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return (
      <>
        <article
          ref={cardRef}
          className={`
            bg-white dark:bg-gray-800
            shadow-lg hover:shadow-2xl
            dark:shadow-purple-900/10 dark:hover:shadow-purple-900/20
            rounded-xl
            transition-all duration-500 ease-out
            hover:scale-[1.02] hover:-translate-y-1
            cursor-pointer
            border border-gray-100 dark:border-gray-700
            hover:border-purple-200 dark:hover:border-purple-600
            ${getRankStyle(rank)}
            ${
              focusVisible
                ? "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-purple-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
                : ""
            }
          `}
          role="button"
          aria-labelledby={`browser-${browser.name}-title`}
          aria-describedby={`browser-${browser.name}-desc`}
          onClick={handleCardInteraction}
          onKeyDown={handleCardInteraction}
          tabIndex="0"
        >
          {getRankBadge(rank)}

          <div className="p-6">
            {/* Header Section */}
            <header className="flex items-center mb-6">
              <div className="relative mr-4 group">
                <div
                  className={`w-14 h-14 rounded-xl bg-gray-50 dark:bg-gray-700 flex items-center justify-center transition-all duration-300 ${
                    imageLoaded ? "bg-transparent" : ""
                  }`}
                >
                  <Image
                    src={browser.logo}
                    alt=""
                    width={48}
                    height={48}
                    className="object-contain dark:brightness-90 group-hover:scale-110 transition-transform duration-300"
                    onLoad={() => setImageLoaded(true)}
                    priority={rank <= 3}
                  />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h3
                  id={`browser-${browser.name}-title`}
                  className="text-xl font-bold text-gray-900 dark:text-white mb-1 truncate"
                >
                  {browser.name}
                </h3>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium ${performance.color}`}>
                    {performance.level}
                  </span>
                  <span className="text-gray-400 dark:text-gray-500 text-xs">
                    •
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Rank #{rank}
                  </span>
                </div>
              </div>

              {browser.website && (
                <a
                  href={browser.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 p-2 text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={(e) => e.stopPropagation()}
                  aria-label={`Visit ${browser.name} website`}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              )}
            </header>

            {/* Metadata Section */}
            <div className="mb-6 flex flex-wrap gap-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                v{latestVersion.version}
              </span>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getEngineColor(
                  platformEngine
                )}`}
              >
                {platformEngine}
              </span>
            </div>

            {/* Performance Metrics */}
            <div
              id={`browser-${browser.name}-desc`}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {/* Speedometer Score */}
              <div className="text-center bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <div className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                  Speedometer 3.1
                </div>
                <div className="relative">
                  <div
                    className={`text-3xl font-bold mb-1 ${performance.color}`}
                  >
                    {latestVersion.scores.speedometer3.toFixed(1)}
                  </div>
                  {scoreDifference !== null && (
                    <div className="text-sm" aria-label={scoreChangeText}>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          scoreDifference > 0
                            ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400"
                            : scoreDifference < 0
                            ? "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                        }`}
                      >
                        {scoreDifference > 0
                          ? "↗"
                          : scoreDifference < 0
                          ? "↘"
                          : "→"}
                        {Math.abs(scoreDifference).toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* RAM Usage */}
              {latestVersion.scores.ram && (
                <div className="text-center bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <div className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                    Memory Usage
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {latestVersion.scores.ram >= 1000
                      ? `${(latestVersion.scores.ram / 1000).toFixed(1)}GB`
                      : `${latestVersion.scores.ram.toFixed(0)}MB`}
                  </div>
                </div>
              )}

              {/* Adblock Score */}
              {latestVersion.scores.adblock && (
                <div className="text-center bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <div className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                    Ad Blocking
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {latestVersion.scores.adblock.toFixed(0)}%
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-1000 ${
                        latestVersion.scores.adblock >= 80
                          ? "bg-green-500"
                          : latestVersion.scores.adblock >= 60
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${latestVersion.scores.adblock}%` }}
                      role="progressbar"
                      aria-valuenow={latestVersion.scores.adblock}
                      aria-valuemin="0"
                      aria-valuemax="100"
                      aria-label={`Ad blocking effectiveness: ${latestVersion.scores.adblock}%`}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Action Hint */}
            <div className="mt-6 text-center">
              <span className="text-xs text-gray-400 dark:text-gray-500">
                Click for detailed history
              </span>
            </div>
          </div>
        </article>

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

BrowserCard.displayName = "BrowserCard";

export default BrowserCard;
