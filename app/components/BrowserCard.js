import React, { useEffect, useRef, useState } from 'react';

import BrowserDetailsModal from './BrowserDetailsModal';
import Image from 'next/image';
import Link from 'next/link';

const getScoreColor = (score) => {
  if (score >= 40) return '#D4A800'; // amber for high scores
  if (score >= 30) return '#B89200'; // warm good
  if (score >= 20) return '#A76A00'; // warm fair
  return '#C83A2E'; // warm red for poor
};

const getTrendColor = (diff) => {
  if (diff > 0) return '#D4A800'; // amber for up
  if (diff < 0) return '#C83A2E'; // warm red for down
  return '#9A9080'; // muted for flat
};

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

    const score = latestVersion.scores.speedometer3;
    const scoreColor = getScoreColor(score);
    const isHighScore = score >= 40;

    const getRankStyle = (rank) => {
      const base = 'relative overflow-hidden';
      switch (rank) {
        case 1:
          return `${base} bg-[#1A1A18] text-white shadow-md`;
        case 2:
          return `${base} ring-2 ring-[#F5C400]/60 shadow-md`;
        case 3:
          return `${base} ring-2 ring-[#F5C400]/60 shadow-md`;
        default:
          return `${base} bg-surface shadow-sm hover:shadow-md`;
      }
    };

    const getRankBadge = (rank) => {
      if (rank > 3) return null;

      return (
        <div
          className="absolute top-3 right-3 bg-[#1A1A18] text-white rounded-full px-3 py-1 text-xs font-semibold shadow-sm z-10"
        >
          #{rank}
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

    // Progress bar calculation
    const progressWidth = Math.min((score / 60) * 100, 100);

    if (isLoading) {
      return (
        <div className="bg-surface rounded-radius-xl shadow-sm overflow-hidden animate-pulse">
          <div className="p-7">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-surface-subtle rounded-xl mr-4"></div>
              <div className="flex-1">
                <div className="h-6 bg-surface-subtle rounded w-2/3 mb-2"></div>
                <div className="h-4 bg-surface-subtle rounded w-1/3"></div>
              </div>
            </div>
            <div className="flex gap-2 mb-6">
              <div className="h-8 bg-surface-subtle rounded-pill w-20"></div>
              <div className="h-8 bg-surface-subtle rounded-pill w-16"></div>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-surface-subtle rounded-radius-sm p-2 sm:p-4">
                  <div className="h-4 bg-surface-subtle rounded mb-2"></div>
                  <div className="h-8 bg-surface-subtle rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // Text color variants for #1 card (inverted)
    const isRankOne = rank === 1;
    const textPrimary = isRankOne ? 'text-white' : 'text-primary';
    const textSecondary = isRankOne ? 'text-neutral-300' : 'text-secondary';
    const textMuted = isRankOne ? 'text-neutral-400' : 'text-muted';

    return (
      <>
        <div
          ref={cardRef}
          className={`
            rounded-radius-xl
            transition-all duration-200 ease-out
            cursor-pointer
            border-0
            ${getRankStyle(rank)}
            ${focusVisible ? 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2' : ''}
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
            <div className="flex items-center gap-4">
              {/* Browser identity cluster */}
              <div className="group shrink-0">
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    isRankOne ? 'bg-neutral-800' : 'bg-surface-subtle'
                  } ${imageLoaded ? 'bg-transparent' : ''}`}
                >
                  <Image
                    src={browser.logo}
                    alt={`${browser.name} logo`}
                    width={40}
                    height={40}
                    className="object-contain w-10 h-10 group-hover:scale-110 transition-transform duration-300"
                    onLoad={() => setImageLoaded(true)}
                    priority={rank <= 3}
                    style={isRankOne ? { filter: 'brightness(0) invert(1)' } : {}}
                  />
                </div>
              </div>

              {/* Browser info */}
              <div className="flex-1 min-w-0">
                <h3
                  id={`browser-${browser.name}-title`}
                  className={`text-lg font-bold leading-tight truncate ${textPrimary}`}
                >
                  {browser.name}
                </h3>
                <p className={`text-sm mt-0.5 ${textSecondary}`}>{platformEngine}</p>
              </div>

              {/* Score cluster - aligned right */}
              <div className="text-right shrink-0">
                <span
                  className="text-5xl font-bold tabular-nums leading-none"
                  style={{ color: isHighScore ? '#D4A800' : scoreColor }}
                >
                  {score.toFixed(1)}
                </span>
                {/* Progress bar */}
                <div className="mt-2 w-24 h-0.5 bg-border-subtle rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${progressWidth}%`,
                      backgroundColor: isHighScore ? '#D4A800' : scoreColor,
                    }}
                  />
                </div>
              </div>

              {/* Trend cluster */}
              {scoreDifference !== null && (
                <div className="w-16 shrink-0 text-center">
                  <span
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
                    style={{
                      backgroundColor: `${getTrendColor(scoreDifference)}20`,
                      color: getTrendColor(scoreDifference),
                    }}
                  >
                    {scoreDifference > 0 ? '↑' : scoreDifference < 0 ? '↓' : '→'}
                    {Math.abs(scoreDifference).toFixed(1)}
                  </span>
                </div>
              )}

              {/* CTA cluster */}
              <div className="shrink-0">
                <Link
                  href={`/browsers/${browser.name
                    .toLowerCase()
                    .replace(/\s+/g, '-')
                    .replace(/[^a-z0-9-]/g, '')}`}
                  className={`flex items-center justify-center w-10 h-10 rounded-lg border transition-colors ${
                    isRankOne
                      ? 'border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:border-neutral-600'
                      : 'border-border-subtle text-secondary hover:bg-surface-subtle hover:border-border-strong'
                  }`}
                  onClick={(e) => e.stopPropagation()}
                  aria-label={`View ${browser.name} details`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Metadata cluster */}
            <div className="flex flex-wrap gap-2 mt-4 ml-18">
              <span className={`inline-flex items-center px-3 py-1 rounded-pill text-xs font-medium ${
                isRankOne ? 'bg-neutral-800 text-neutral-300' : 'bg-surface-subtle text-secondary border border-border-subtle'
              }`}>
                v{latestVersion.version}
              </span>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-pill text-xs font-medium ${
                  isRankOne ? 'bg-neutral-800 text-neutral-300' : getEngineColor(platformEngine)
                }`}
              >
                {platformEngine}
              </span>
              {latestVersion.date && (
                <span className={`inline-flex items-center px-3 py-1 rounded-pill text-xs font-medium ${
                  isRankOne ? 'bg-neutral-800 text-neutral-300' : 'bg-surface-subtle text-muted border border-border-subtle'
                }`}>
                  {new Date(latestVersion.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              )}
              {scoreDifference !== null && (
                <span
                  className="inline-flex items-center px-3 py-1 rounded-pill text-xs font-medium"
                  style={{
                    backgroundColor: `${getTrendColor(scoreDifference)}20`,
                    color: getTrendColor(scoreDifference),
                  }}
                >
                  {scoreDifference > 0 ? '+' : ''}
                  {scoreDifference.toFixed(1)} pts
                </span>
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

BrowserCard.displayName = 'BrowserCard';

export default BrowserCard;