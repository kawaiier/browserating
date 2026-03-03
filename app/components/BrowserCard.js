import React, { useEffect, useRef, useState } from 'react';

import BrowserDetailsModal from './BrowserDetailsModal';
import Image from 'next/image';

const BrowserCard = React.memo(
  ({ browser, getEngineColor, rank, selectedPlatform, isLoading = false }) => {
    const [showModal, setShowModal] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [focusVisible, setFocusVisible] = useState(false);
    const cardRef = useRef(null);

    const platformData = browser[selectedPlatform];

    useEffect(() => {
      const handleKeyDown = (e) => {
        if (e.key === 'Tab') setFocusVisible(true);
      };
      const handleMouseDown = () => setFocusVisible(false);

      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('mousedown', handleMouseDown);

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('mousedown', handleMouseDown);
      };
    }, []);

    if (!platformData || !platformData.versions || platformData.versions.length === 0) {
      return null;
    }

    const latestVersion = platformData.versions[0];
    const prevSpeedometer3Score =
      platformData.versions.length > 1 ? platformData.versions[1].scores.speedometer3 : null;

    const platformEngine = platformData.engine;

    const getRankStyle = (rank) => {
      const base = 'relative overflow-hidden';
      switch (rank) {
        case 1:
          return `${base} ring-2 ring-yellow-400/70 shadow-lg shadow-yellow-400/10`;
        case 2:
          return `${base} ring-2 ring-gray-300/70 shadow-lg shadow-gray-300/10`;
        case 3:
          return `${base} ring-2 ring-amber-600/70 shadow-lg shadow-amber-600/10`;
        default:
          return base;
      }
    };

    const getRankBadge = (rank) => {
      if (rank > 3) return null;

      const badges = {
        1: { text: '🏆 #1', color: 'bg-yellow-400/90 text-yellow-900' },
        2: { text: '🥈 #2', color: 'bg-gray-300/90 text-gray-800' },
        3: { text: '🥉 #3', color: 'bg-amber-500/90 text-amber-900' },
      };

      const badge = badges[rank];
      return (
        <div
          className={`absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide ${badge.color} shadow-sm z-10`}
        >
          {badge.text}
        </div>
      );
    };

    const scoreDifference = prevSpeedometer3Score
      ? latestVersion.scores.speedometer3 - prevSpeedometer3Score
      : null;

    const scoreChangeText = scoreDifference
      ? `${scoreDifference > 0 ? 'Increased' : 'Decreased'} by ${Math.abs(scoreDifference).toFixed(
          2
        )} points from previous version`
      : '';

    const handleCardInteraction = (e) => {
      if (e.type === 'click' || (e.type === 'keydown' && (e.key === 'Enter' || e.key === ' '))) {
        if (e.type === 'keydown') e.preventDefault();
        cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        setShowModal(true);
      }
    };

    const getPerformanceLevel = (score) => {
      if (score >= 40)
        return { level: 'Excellent', color: 'text-emerald-600 dark:text-emerald-400' };
      if (score >= 30) return { level: 'Good', color: 'text-sky-600 dark:text-sky-400' };
      if (score >= 20) return { level: 'Fair', color: 'text-amber-600 dark:text-amber-400' };
      return { level: 'Poor', color: 'text-rose-600 dark:text-rose-400' };
    };

    const performance = getPerformanceLevel(latestVersion.scores.speedometer3);

    if (isLoading) {
      return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden animate-pulse">
          <div className="p-4 sm:p-5">
            <div className="flex items-center mb-4 gap-3">
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-xl shrink-0"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
              </div>
            </div>
            <div className="flex gap-2 mb-4">
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-full w-14"></div>
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-full w-20"></div>
            </div>
            <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
          </div>
        </div>
      );
    }

    return (
      <>
        <article
          ref={cardRef}
          className={`
            bg-white dark:bg-gray-800/90
            shadow-sm hover:shadow-md
            rounded-2xl
            transition-all duration-300 ease-out
            active:scale-[0.98]
            sm:hover:scale-[1.02] sm:hover:-translate-y-0.5
            cursor-pointer
            border border-gray-100 dark:border-gray-700/60
            hover:border-gray-200 dark:hover:border-gray-600
            ${getRankStyle(rank)}
            ${focusVisible ? 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900' : ''}
          `}
          role="button"
          aria-labelledby={`browser-${browser.name}-title`}
          aria-describedby={`browser-${browser.name}-desc`}
          onClick={handleCardInteraction}
          onKeyDown={handleCardInteraction}
          tabIndex="0"
        >
          {getRankBadge(rank)}

          <div className="p-4 sm:p-5">
            {/* Header */}
            <header className="flex items-center gap-3 mb-4 mt-2">
              <div className="group shrink-0">
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gray-50 dark:bg-gray-700/60 flex items-center justify-center transition-all duration-300 ${
                    imageLoaded ? 'bg-transparent dark:bg-transparent' : ''
                  }`}
                >
                  <Image
                    src={browser.logo}
                    alt=""
                    width={40}
                    height={40}
                    className="object-contain dark:brightness-90 group-hover:scale-110 transition-transform duration-300 w-7 h-7 sm:w-8 sm:h-8"
                    onLoad={() => setImageLoaded(true)}
                    priority={rank <= 3}
                  />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h3
                  id={`browser-${browser.name}-title`}
                  className="text-base sm:text-lg font-bold text-gray-900 dark:text-white leading-tight truncate"
                >
                  {browser.name}
                </h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`text-xs font-semibold ${performance.color}`}>
                    {performance.level}
                  </span>
                  <span className="text-gray-300 dark:text-gray-600 text-xs">·</span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">#{rank}</span>
                </div>
              </div>

              {browser.website && (
                <a
                  href={browser.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 flex items-center justify-center w-9 h-9 text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400 transition-colors rounded-lg"
                  onClick={(e) => e.stopPropagation()}
                  aria-label={`Visit ${browser.name} website`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

            {/* Metadata */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700/80 text-gray-500 dark:text-gray-400">
                v{latestVersion.version}
              </span>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEngineColor(platformEngine)}`}
              >
                {platformEngine}
              </span>
            </div>

            {/* Score Block */}
            <div
              id={`browser-${browser.name}-desc`}
              className="bg-gray-50/80 dark:bg-gray-700/30 rounded-xl px-4 py-4 flex flex-col items-center gap-1.5"
            >
              <span className="text-[9px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-[0.15em]">
                Speedometer 3.1
              </span>
              <span
                className={`text-4xl sm:text-5xl font-extrabold tabular-nums leading-none ${performance.color}`}
              >
                {latestVersion.scores.speedometer3.toFixed(1)}
              </span>
              {scoreDifference !== null && (
                <span
                  aria-label={scoreChangeText}
                  className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                    scoreDifference > 0
                      ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400'
                      : scoreDifference < 0
                        ? 'bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {scoreDifference > 0 ? '↗ ' : scoreDifference < 0 ? '↘ ' : '→ '}
                  {Math.abs(scoreDifference).toFixed(1)} pts
                </span>
              )}
            </div>

            {/* Action hint — hidden on touch devices */}
            <div className="hidden sm:block mt-3 text-center">
              <span className="text-[10px] text-gray-300 dark:text-gray-600">Tap for history</span>
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

BrowserCard.displayName = 'BrowserCard';

export default BrowserCard;
