import React, { useEffect, useRef, useState } from 'react';

import BrowserDetailsModal from './BrowserDetailsModal';
import Image from 'next/image';
import Link from 'next/link';

const COLORS = {
  scoreExcellent: '#138A5B',
  scoreGood: '#3F7AE0',
  scoreFair: '#A76A00',
  scorePoor: '#C0392B',
  trendUp: '#138A5B',
  trendFlat: '#647181',
  trendDown: '#C0392B',
  bgSurface: '#FFFFFF',
  bgSurfaceSubtle: '#F7F9FB',
  textPrimary: '#121A23',
  textSecondary: '#33404D',
  textMuted: '#647181',
  borderSubtle: '#DCE3EA',
  borderStrong: '#C5CFD9',
};

const getScoreColor = (score) => {
  if (score >= 40) return COLORS.scoreExcellent;
  if (score >= 30) return COLORS.scoreGood;
  if (score >= 20) return COLORS.scoreFair;
  return COLORS.scorePoor;
};

const getTrendColor = (diff) => {
  if (diff > 0) return COLORS.trendUp;
  if (diff < 0) return COLORS.trendDown;
  return COLORS.trendFlat;
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

    const getRankStyle = (rank) => {
      const base = 'relative overflow-hidden';
      switch (rank) {
        case 1:
          return `${base} ring-2 ring-[#D4AF37]/50 shadow-lg shadow-[#D4AF37]/10`;
        case 2:
          return `${base} ring-2 ring-[#C0C0C0]/50 shadow-lg shadow-[#C0C0C0]/10`;
        case 3:
          return `${base} ring-2 ring-[#CD7F32]/50 shadow-lg shadow-[#CD7F32]/10`;
        default:
          return base;
      }
    };

    const getRankBadge = (rank) => {
      if (rank > 3) return null;

      const badges = {
        1: { text: '🥇 #1', color: 'bg-[#FFF9E6] text-[#8B6914]' },
        2: { text: '🥈 #2', color: 'bg-[#F5F5F5] text-[#5C5C5C]' },
        3: { text: '🥉 #3', color: 'bg-[#FFF4E6] text-[#8B5A00]' },
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

    const score = latestVersion.scores.speedometer3;
    const scoreColor = getScoreColor(score);

    if (isLoading) {
      return (
        <div className="bg-[#FFFFFF] rounded-2xl shadow-sm overflow-hidden animate-pulse">
          <div className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-[#F7F9FB] rounded-xl shrink-0"></div>
              <div className="flex-1">
                <div className="h-5 bg-[#F7F9FB] rounded w-2/3 mb-2"></div>
                <div className="h-4 bg-[#F7F9FB] rounded w-1/3"></div>
              </div>
              <div className="w-16 h-16 bg-[#F7F9FB] rounded-xl"></div>
            </div>
            <div className="flex gap-2 mt-4">
              <div className="h-6 bg-[#F7F9FB] rounded-full w-14"></div>
              <div className="h-6 bg-[#F7F9FB] rounded-full w-20"></div>
              <div className="h-6 bg-[#F7F9FB] rounded-full w-24"></div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <>
        <div
          ref={cardRef}
          className={`
            bg-[#FFFFFF]
            hover:shadow-md
            rounded-2xl
            transition-all duration-200 ease-out
            cursor-pointer
            border border-[#DCE3EA]
            hover:border-[#C5CFD9]
            ${getRankStyle(rank)}
            ${focusVisible ? 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F7AE0] focus-visible:ring-offset-2' : ''}
          `}
          role="button"
          aria-labelledby={`browser-${browser.name}-title`}
          aria-describedby={`browser-${browser.name}-desc`}
          onClick={handleCardInteraction}
          onKeyDown={handleCardInteraction}
          tabIndex="0"
        >
          {getRankBadge(rank)}

          <div className="p-5">
            <div className="flex items-center gap-4">
              {/* Rank cluster - 64px width */}
              <div className="w-16 shrink-0 flex items-center justify-center">
                <span className="text-3xl font-bold text-[#33404D]">#{rank}</span>
              </div>

              {/* Browser identity cluster */}
              <div className="group shrink-0">
                <div
                  className={`w-14 h-14 rounded-xl bg-[#F7F9FB] flex items-center justify-center transition-all duration-300 ${
                    imageLoaded ? 'bg-transparent' : ''
                  }`}
                >
                  <Image
                    src={browser.logo}
                    alt={`${browser.name} logo`}
                    width={40}
                    height={40}
                    className="object-contain w-10 h-10 group-hover:scale-110 transition-transform duration-300"
                    onLoad={() => setImageLoaded(true)}
                    priority={rank <= 3}
                  />
                </div>
              </div>

              {/* Browser info */}
              <div className="flex-1 min-w-0">
                <h3
                  id={`browser-${browser.name}-title`}
                  className="text-lg font-bold text-[#121A23] leading-tight truncate"
                >
                  {browser.name}
                </h3>
                <p className="text-sm text-[#33404D] mt-0.5">{platformEngine}</p>
              </div>

              {/* Score cluster - aligned right, mono-enabled */}
              <div className="text-right shrink-0">
                <span
                  className="text-3xl font-bold tabular-nums leading-none"
                  style={{ color: scoreColor }}
                >
                  {score.toFixed(1)}
                </span>
                <p className="text-xs text-[#647181] mt-1">Speedometer 3.1</p>
              </div>

              {/* Trend cluster */}
              {scoreDifference !== null && (
                <div className="w-16 shrink-0 text-center">
                  <span
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold"
                    style={{
                      backgroundColor: `${getTrendColor(scoreDifference)}15`,
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
                  className="flex items-center justify-center w-10 h-10 rounded-lg border border-[#DCE3EA] text-[#33404D] hover:bg-[#F7F9FB] hover:border-[#C5CFD9] transition-colors"
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
            <div className="flex flex-wrap gap-2 mt-4 ml-20">
              <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-[#F7F9FB] text-[#33404D] border border-[#DCE3EA]">
                v{latestVersion.version}
              </span>
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${getEngineColor(platformEngine)}`}
              >
                {platformEngine}
              </span>
              {latestVersion.date && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-[#F7F9FB] text-[#647181] border border-[#DCE3EA]">
                  {new Date(latestVersion.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              )}
              {scoreDifference !== null && (
                <span
                  className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium"
                  style={{
                    backgroundColor: `${getTrendColor(scoreDifference)}15`,
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
