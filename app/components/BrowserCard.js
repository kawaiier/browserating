import React, { useEffect, useRef, useState } from 'react';

import BrowserDetailsModal from './BrowserDetailsModal';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, TrendingDown, TrendingUp } from 'lucide-react';

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
          return `${base}`;
        case 2:
          return `${base}`;
        case 3:
          return `${base}`;
        default:
          return base;
      }
    };

    const getRankBadge = (rank) => {
      if (rank > 3) return null;

      const badges = {
        1: { text: '#1', color: 'var(--color-warning)', textColor: '#000' },
        2: { text: '#2', color: 'var(--color-neutral-400)', textColor: '#000' },
        3: { text: '#3', color: 'var(--color-neutral-500)', textColor: '#fff' },
      };

      const badge = badges[rank];
      return (
        <div
          className="absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-bold"
          style={{
            backgroundColor: badge.color,
            color: badge.textColor,
          }}
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
        setShowModal(true);
      }
    };

    const getPerformanceLevel = (score) => {
      if (score >= 40)
        return { level: 'Excellent', color: 'var(--color-score-excellent)' };
      if (score >= 30) return { level: 'Good', color: 'var(--color-score-good)' };
      if (score >= 20) return { level: 'Fair', color: 'var(--color-score-fair)' };
      return { level: 'Poor', color: 'var(--color-score-poor)' };
    };

    const performance = getPerformanceLevel(latestVersion.scores.speedometer3);

    if (isLoading) {
      return (
        <div
          className="rounded-lg overflow-hidden animate-pulse browser-card-accent"
          style={{
            backgroundColor: 'var(--surface-raised)',
            boxShadow: 'var(--shadow-raised)',
          }}
        >
          <div style={{ padding: 'var(--space-200)' }}>
            <div className="flex items-center mb-4 gap-3">
              <div
                className="w-10 h-10 rounded-md shrink-0"
                style={{ backgroundColor: 'var(--surface-sunken)' }}
              ></div>
              <div className="flex-1">
                <div
                  className="h-4 rounded w-2/3 mb-2"
                  style={{ backgroundColor: 'var(--surface-sunken)' }}
                ></div>
                <div
                  className="h-3 rounded w-1/3"
                  style={{ backgroundColor: 'var(--surface-sunken)' }}
                ></div>
              </div>
            </div>
            <div className="flex gap-2 mb-4">
              <div
                className="h-5 rounded-full w-14"
                style={{ backgroundColor: 'var(--surface-sunken)' }}
              ></div>
              <div
                className="h-5 rounded-full w-20"
                style={{ backgroundColor: 'var(--surface-sunken)' }}
              ></div>
            </div>
            <div
              className="h-24 rounded-lg"
              style={{ backgroundColor: 'var(--surface-sunken)' }}
            ></div>
          </div>
        </div>
      );
    }

    return (
      <>
        <div
          ref={cardRef}
          className={`
            rounded-lg
            transition-all
            cursor-pointer
            browser-card-accent
            ${getRankStyle(rank)}
          `}
          style={{
            backgroundColor: 'var(--surface-raised)',
            boxShadow: 'var(--shadow-raised)',
            border: '1px solid var(--border-subtle)',
          }}
          role="button"
          aria-labelledby={`browser-${browser.name}-title`}
          aria-describedby={`browser-${browser.name}-desc`}
          onClick={handleCardInteraction}
          onKeyDown={handleCardInteraction}
          tabIndex="0"
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = 'var(--shadow-overlay)';
            e.currentTarget.style.borderColor = 'var(--border-default)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = 'var(--shadow-raised)';
            e.currentTarget.style.borderColor = 'var(--border-subtle)';
          }}
        >
          {getRankBadge(rank)}

          <div style={{ padding: 'var(--space-200)' }}>
            {/* Header */}
            <header className="flex items-center gap-3 mb-4">
              <div className="group shrink-0">
                <div
                  className="w-10 h-10 rounded-md flex items-center justify-center"
                  style={{ backgroundColor: 'var(--surface-sunken)' }}
                >
                  <Image
                    src={browser.logo}
                    alt={`${browser.name} logo`}
                    width={40}
                    height={40}
                    className="object-contain w-8 h-8"
                    onLoad={() => setImageLoaded(true)}
                    priority={rank <= 3}
                  />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h3
                  id={`browser-${browser.name}-title`}
                  className="heading-small truncate"
                  style={{ color: 'var(--text-default)' }}
                >
                  {browser.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="body-small font-medium" style={{ color: performance.color }}>
                    {performance.level}
                  </span>
                  <span style={{ color: 'var(--text-subtlest)' }}>·</span>
                  <span className="body-small" style={{ color: 'var(--text-subtle)' }}>
                    #{rank}
                  </span>
                </div>
              </div>

              {browser.website && (
                <a
                  href={browser.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 flex items-center justify-center w-8 h-8 rounded-md transition-colors"
                  style={{ color: 'var(--text-subtlest)' }}
                  onClick={(e) => e.stopPropagation()}
                  aria-label={`Visit ${browser.name} website`}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--surface-hovered)';
                    e.currentTarget.style.color = 'var(--text-subtle)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'var(--text-subtlest)';
                  }}
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
            <div className="flex flex-wrap gap-2 mb-4">
              <span
                className="inline-flex items-center px-2 py-0.5 rounded-full body-small font-medium"
                style={{
                  backgroundColor: 'var(--surface-sunken)',
                  color: 'var(--text-subtle)',
                }}
              >
                v{latestVersion.version}
              </span>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full body-small font-medium ${getEngineColor(platformEngine)}`}
              >
                {platformEngine}
              </span>
              {latestVersion.date && (
                <span
                  className="inline-flex items-center px-2 py-0.5 rounded-full body-small font-medium"
                  style={{
                    backgroundColor: 'var(--surface-sunken)',
                    color: 'var(--text-subtle)',
                  }}
                >
                  {new Date(latestVersion.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              )}
            </div>

            {/* Score Block */}
            <div
              id={`browser-${browser.name}-desc`}
              className="rounded-lg flex flex-col items-center gap-2"
              style={{
                backgroundColor: 'var(--surface-sunken)',
                padding: 'var(--space-200)',
              }}
            >
              <span
                className="body-small font-semibold uppercase tracking-wide"
                style={{ color: 'var(--text-subtlest)', fontSize: '10px' }}
              >
                Speedometer 3.1
              </span>
              <span
                className="metric-large leading-none score-glow"
                style={{ color: performance.color }}
              >
                {latestVersion.scores.speedometer3.toFixed(1)}
              </span>
              {scoreDifference !== null && (
                <span
                  aria-label={scoreChangeText}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-full body-small font-semibold"
                  style={{
                    backgroundColor:
                      scoreDifference > 0
                        ? 'var(--color-success-subtle)'
                        : scoreDifference < 0
                          ? 'var(--color-danger-subtle)'
                          : 'var(--surface-sunken)',
                    color:
                      scoreDifference > 0
                        ? 'var(--color-success)'
                        : scoreDifference < 0
                          ? 'var(--color-danger)'
                          : 'var(--text-subtle)',
                  }}
                >
                  {scoreDifference > 0 ? (
                    <TrendingUp className="inline w-3.5 h-3.5" aria-hidden="true" />
                  ) : scoreDifference < 0 ? (
                    <TrendingDown className="inline w-3.5 h-3.5" aria-hidden="true" />
                  ) : (
                    <ArrowRight className="inline w-3.5 h-3.5" aria-hidden="true" />
                  )}{' '}
                  {Math.abs(scoreDifference).toFixed(1)} pts
                </span>
              )}
            </div>

            {/* Footer actions */}
            <div className="mt-3 flex items-center justify-between">
              <span className="body-small" style={{ color: 'var(--text-subtlest)', fontSize: '10px' }}>
                Tap for history
              </span>
              <Link
                href={`/browsers/${browser.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`}
                className="body-small font-medium hover:underline"
                style={{ color: 'var(--text-brand)' }}
                onClick={(e) => e.stopPropagation()}
              >
                Full details <ArrowRight className="inline w-3.5 h-3.5" aria-hidden="true" />
              </Link>
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
