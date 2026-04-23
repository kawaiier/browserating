import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import BrowserDetailsModal from './BrowserDetailsModal';

// --- Utilities & Constants ---
const getScoreColor = (score) => {
  if (score >= 40) return 'var(--color-score-excellent)';
  if (score >= 30) return 'var(--color-score-good)';
  if (score >= 20) return 'var(--color-score-fair)';
  return 'var(--color-score-poor)';
};

const getTrendColor = (diff) => {
  if (diff > 0) return '#D4A800'; // Design token: --color-trend-up
  if (diff < 0) return '#C83A2E'; // Design token: --color-trend-down
  return '#9A9080';
};

const formatDate = (dateString) => 
  new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(dateString));

// --- Sub-components ---
const BrowserCardSkeleton = () => (
  <div className="bg-surface rounded-radius-xl shadow-sm overflow-hidden animate-pulse p-7">
    <div className="flex items-center gap-4 mb-6">
      <div className="w-16 h-16 bg-surface-subtle rounded-xl mr-4" />
      <div className="flex-1">
        <div className="h-6 bg-surface-subtle rounded w-2/3 mb-2" />
        <div className="h-4 bg-surface-subtle rounded w-1/3" />
      </div>
    </div>
    <div className="grid grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => <div key={i} className="h-10 bg-surface-subtle rounded" />)}
    </div>
  </div>
);

const BrowserCard = React.memo(({ browser, getEngineColor, rank, selectedPlatform, isLoading = false }) => {
  const [showModal, setShowModal] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Data Derivation
  const platformData = browser?.[selectedPlatform];
  const versions = platformData?.versions || [];
  const latestVersion = versions[0];
  const score = latestVersion?.scores?.speedometer3 ?? 0;
  
  // Memoized Values
  const scoreColor = useMemo(() => getScoreColor(score), [score]);
  const progressWidth = useMemo(() => Math.min((score / 60) * 100, 100), [score]);
  const scoreDifference = useMemo(() => {
    const prevScore = versions[1]?.scores?.speedometer3;
    return prevScore ? score - prevScore : null;
  }, [score, versions]);

  const slug = useMemo(() => 
    browser.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''), 
  [browser.name]);

  if (isLoading) return <BrowserCardSkeleton />;
  if (!platformData || versions.length === 0) return null;

  const isRankOne = rank === 1;

  // Configuration for specialized rank styles
  const theme = {
    container: isRankOne ? 'bg-[#1A1A18] text-white shadow-md' : 'bg-surface shadow-sm border-border-subtle',
    textSecondary: isRankOne ? 'text-neutral-300' : 'text-secondary',
    badge: isRankOne ? 'bg-neutral-800 text-neutral-300' : 'bg-surface-subtle text-secondary border-border-subtle',
    cta: isRankOne ? 'border-neutral-700 text-neutral-300 hover:bg-neutral-800' : 'border-border-subtle text-secondary hover:bg-surface-subtle'
  };

  const handleInteraction = (e) => {
    // If user clicks the Link or a child of the Link, do not open the modal
    if (e.target.closest('a')) return;
    
    if (e.type === 'click' || (e.key === 'Enter' || e.key === ' ')) {
      if (e.type === 'keydown') e.preventDefault();
      setShowModal(true);
    }
  };

  return (
    <>
      <div
        role="button"
        tabIndex="0"
        onClick={handleInteraction}
        onKeyDown={handleInteraction}
        className={`
          relative p-6 rounded-radius-xl transition-all duration-200 cursor-pointer overflow-hidden
          focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2
          ${theme.container} ${rank > 1 && rank <= 3 ? 'ring-2 ring-[#F5C400]/60' : ''}
        `}
        aria-label={`View ${browser.name} details. Rank #${rank}, Score ${score.toFixed(1)}`}
      >
        {rank <= 3 && (
          <div className="absolute top-3 right-3 bg-[#1A1A18] text-white rounded-full px-3 py-1 text-xs font-semibold z-10">
            #{rank}
          </div>
        )}

        <div className="flex items-center gap-4">
          {/* Browser Logo */}
          <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${isRankOne ? 'bg-neutral-800' : 'bg-surface-subtle'}`}>
            <Image
              src={imageError ? '/fallback-browser-icon.svg' : browser.logo}
              alt=""
              width={40}
              height={40}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              priority={rank <= 3}
              className={`object-contain transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              style={isRankOne ? { filter: 'brightness(0) invert(1)' } : {}}
            />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold truncate">{browser.name}</h3>
            <p className={`text-sm ${theme.textSecondary}`}>{platformData.engine}</p>
          </div>

          {/* Score Cluster */}
          <div className="text-right shrink-0">
            <span className="text-5xl font-bold tabular-nums" style={{ color: scoreColor }}>
              {score.toFixed(1)}
            </span>
            <div className="mt-2 w-24 h-1 bg-black/10 rounded-full overflow-hidden">
              <div 
                className="h-full transition-all duration-500" 
                style={{ width: `${progressWidth}%`, backgroundColor: scoreColor }} 
              />
            </div>
          </div>

          {/* Trend Tag */}
          {scoreDifference !== null && (
            <div 
              className="px-2.5 py-1 rounded-full text-xs font-bold"
              style={{ backgroundColor: `${getTrendColor(scoreDifference)}20`, color: getTrendColor(scoreDifference) }}
            >
              {scoreDifference > 0 ? '↑' : scoreDifference < 0 ? '↓' : '→'} {Math.abs(scoreDifference).toFixed(1)}
            </div>
          )}

          {/* Chevron Link */}
          <Link
            href={`/browsers/${slug}`}
            className={`w-10 h-10 rounded-lg border flex items-center justify-center transition-colors ${theme.cta}`}
            aria-label={`View historical data for ${browser.name}`}
            onClick={(e) => e.stopPropagation()}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Metadata Badges */}
        <div className="flex flex-wrap gap-2 mt-4 ml-[72px]">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${theme.badge}`}>
            v{latestVersion.version}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${isRankOne ? theme.badge : getEngineColor(platformData.engine)}`}>
            {platformData.engine}
          </span>
          {latestVersion.date && (
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${theme.badge}`}>
              {formatDate(latestVersion.date)}
            </span>
          )}
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
});

BrowserCard.displayName = 'BrowserCard';
export default BrowserCard;