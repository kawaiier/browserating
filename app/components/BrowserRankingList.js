'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import BrowserCard from './BrowserCard';
import { getBrowsers } from '../lib/getBrowsers';
import { engineColors, getEngineColor, platformNames, platformIcons } from '../lib/constants';
import { useLocalStorage } from '../hooks/useLocalStorage';

const NEW_PLATFORMS = ['macos-arm'];
const OUTDATED_PLATFORMS = ['android', 'macos-intel'];

// Skeleton Loader
const SkeletonLoader = ({ index }) => (
  <div
    className="animate-pulse rounded-lg overflow-hidden"
    style={{
      backgroundColor: 'var(--surface-raised)',
      boxShadow: 'var(--shadow-raised)',
      animationDelay: `${index * 100}ms`,
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
            className="h-4 rounded mb-2 w-3/4"
            style={{ backgroundColor: 'var(--surface-sunken)' }}
          ></div>
          <div
            className="h-3 rounded w-1/2"
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

// Search Component
const SearchBar = ({ searchTerm, onSearchChange, totalBrowsers, filteredCount }) => (
  <div className="relative mb-6">
    <div
      className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
      style={{ color: 'var(--text-subtlest)' }}
    >
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </div>
    <input
      type="text"
      placeholder="Search browsers..."
      value={searchTerm}
      onChange={(e) => onSearchChange(e.target.value)}
      className="block w-full pl-10 pr-3 py-2 rounded-md body-default transition-all"
      style={{
        backgroundColor: 'var(--surface-sunken)',
        border: '1px solid var(--border-default)',
        color: 'var(--text-default)',
      }}
      aria-label="Search browsers"
      onFocus={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-focused)';
        e.currentTarget.style.boxShadow = '0 0 0 1px var(--border-focused)';
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-default)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    />
    {searchTerm && (
      <div
        className="absolute inset-y-0 right-0 pr-3 flex items-center body-small"
        style={{ color: 'var(--text-subtle)' }}
      >
        {filteredCount} of {totalBrowsers}
      </div>
    )}
  </div>
);

// Statistics Component
const StatsBar = ({ browsers, selectedPlatform }) => {
  const stats = useMemo(() => {
    const validBrowsers = browsers.filter((b) => b[selectedPlatform]?.versions?.length > 0);
    if (validBrowsers.length === 0) return null;

    const scores = validBrowsers.map((b) => b[selectedPlatform].versions[0].scores.speedometer3);
    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    const maxScore = Math.max(...scores);
    const minScore = Math.min(...scores);

    const engines = [...new Set(validBrowsers.map((b) => b[selectedPlatform].engine))];

    return {
      total: validBrowsers.length,
      avgScore: avgScore.toFixed(1),
      maxScore: maxScore.toFixed(1),
      minScore: minScore.toFixed(1),
      engines: engines.length,
    };
  }, [browsers, selectedPlatform]);

  if (!stats) return null;

  return (
    <div
      className="mb-6 rounded-lg flex flex-wrap items-center justify-between gap-4"
      style={{
        backgroundColor: 'var(--color-brand-subtle)',
        border: '1px solid var(--color-brand-subtle)',
        padding: 'var(--space-150) var(--space-200)',
      }}
    >
      <div className="flex items-center gap-6">
        <div className="body-default" style={{ color: 'var(--text-default)' }}>
          <span className="font-semibold" style={{ color: 'var(--text-brand)' }}>
            {stats.total}
          </span>{' '}
          browsers tested
        </div>
        <div className="body-default" style={{ color: 'var(--text-default)' }}>
          <span className="font-semibold" style={{ color: 'var(--text-brand)' }}>
            {stats.engines}
          </span>{' '}
          engines
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="body-default" style={{ color: 'var(--text-default)' }}>
          Avg: <span className="font-semibold">{stats.avgScore}</span>
        </div>
        <div className="body-default" style={{ color: 'var(--text-default)' }}>
          Range: <span className="font-semibold">{stats.minScore}</span> -{' '}
          <span className="font-semibold" style={{ color: 'var(--color-success)' }}>
            {stats.maxScore}
          </span>
        </div>
      </div>
    </div>
  );
};

export default function BrowserRankingList({ initialBrowsers = [] }) {
  const [browsers, setBrowsers] = useState(initialBrowsers);
  const [selectedEngine, setSelectedEngine] = useLocalStorage('selectedEngine', 'All');
  const [selectedPlatform, setSelectedPlatform] = useLocalStorage('selectedPlatform', 'macos-arm');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(initialBrowsers.length === 0);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [viewMode, setViewMode] = useLocalStorage('viewMode', 'grid');

  const fetchBrowsers = useCallback(async () => {
    if (initialBrowsers.length > 0 && retryCount === 0) {
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      setError(null);

      const data = await getBrowsers();
      setBrowsers(data);
      setIsLoading(false);
    } catch (err) {
      setError('Failed to load browser data. Please check your connection and try again.');
      setIsLoading(false);
    }
  }, [initialBrowsers.length, retryCount]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetch on mount is an intentional side effect
    fetchBrowsers();
  }, [fetchBrowsers]);

  const sortBrowsersByPlatform = useCallback((browsers, platform) => {
    return [...browsers].sort((a, b) => {
      const aScore = a[platform]?.versions?.[0]?.scores?.speedometer3 || 0;
      const bScore = b[platform]?.versions?.[0]?.scores?.speedometer3 || 0;
      return bScore - aScore;
    });
  }, []);

  const sortedBrowsers = useMemo(
    () => sortBrowsersByPlatform(browsers, selectedPlatform),
    [browsers, selectedPlatform, sortBrowsersByPlatform]
  );

  const filteredAndSearchedBrowsers = useMemo(() => {
    let filtered = sortedBrowsers.filter((browser) => {
      const platformData = browser[selectedPlatform];
      if (!platformData || !platformData.versions || platformData.versions.length === 0) {
        return false;
      }
      return true;
    });

    if (selectedEngine !== 'All') {
      filtered = filtered.filter((browser) => {
        const platformData = browser[selectedPlatform];
        return platformData?.engine === selectedEngine;
      });
    }

    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(
        (browser) =>
          browser.name.toLowerCase().includes(searchLower) ||
          browser[selectedPlatform]?.engine?.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [selectedEngine, sortedBrowsers, selectedPlatform, searchTerm]);

  const engines = useMemo(() => {
    const platformEngines = browsers
      .filter((browser) => browser[selectedPlatform]?.versions?.length > 0)
      .map((browser) => browser[selectedPlatform].engine)
      .filter(Boolean);

    return ['All', ...new Set(platformEngines)];
  }, [browsers, selectedPlatform]);

  const platforms = ['macos-arm', 'android', 'ipad', 'windows', 'macos-intel'];

  const handleEngineFilter = useCallback(
    (engine) => {
      setSelectedEngine(engine);
    },
    [setSelectedEngine]
  );

  const handlePlatformChange = useCallback(
    (platform) => {
      setSelectedPlatform(platform);
      setSelectedEngine('All');
      setSearchTerm('');
    },
    [setSelectedPlatform, setSelectedEngine]
  );

  const handleRetry = useCallback(() => {
    setRetryCount((prev) => prev + 1);
    fetchBrowsers();
  }, [fetchBrowsers]);

  const handleSearchChange = useCallback((value) => {
    setSearchTerm(value);
  }, []);

  const renderPlatformButtons = () => (
    <div className="mb-6">
      <h3
        className="heading-xsmall mb-3 uppercase tracking-wide"
        style={{ color: 'var(--text-subtle)' }}
      >
        Select Platform
      </h3>
      <div
        className="flex flex-wrap gap-2"
        role="radiogroup"
        aria-label="Select platform"
      >
        {platforms.map((platform) => (
          <button
            key={platform}
            onClick={() => handlePlatformChange(platform)}
            className="group relative px-4 py-2 rounded-md body-default font-medium transition-all"
            style={{
              backgroundColor:
                selectedPlatform === platform ? 'var(--color-brand)' : 'var(--surface-sunken)',
              color:
                selectedPlatform === platform ? 'var(--text-inverse)' : 'var(--text-default)',
              border: `1px solid ${selectedPlatform === platform ? 'var(--color-brand)' : 'var(--border-subtle)'}`,
            }}
            role="radio"
            aria-checked={selectedPlatform === platform}
            onMouseEnter={(e) => {
              if (selectedPlatform !== platform) {
                e.currentTarget.style.backgroundColor = 'var(--surface-hovered)';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedPlatform !== platform) {
                e.currentTarget.style.backgroundColor = 'var(--surface-sunken)';
              }
            }}
          >
            <span className="flex items-center gap-2">
              {(() => {
                const PlatformIcon = platformIcons[platform];
                return PlatformIcon ? <PlatformIcon className="w-4 h-4" aria-hidden="true" /> : null;
              })()}
              {platformNames[platform]}
            </span>

            {NEW_PLATFORMS.includes(platform) && (
              <span
                className="absolute -top-2 -right-2 text-xs px-1.5 py-0.5 rounded-full font-bold"
                style={{
                  backgroundColor: 'var(--color-success)',
                  color: 'var(--text-inverse)',
                }}
                aria-label="Recently updated"
              >
                NEW
              </span>
            )}

            {OUTDATED_PLATFORMS.includes(platform) && (
              <span
                className="absolute -top-2 -right-2 text-xs px-1.5 py-0.5 rounded-full font-bold"
                style={{
                  backgroundColor: 'var(--color-warning)',
                  color: '#000',
                }}
                aria-label="Potentially outdated data"
              >
                OUTDATED
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );

  const renderEngineButtons = () => (
    <div className="mb-6">
      <h3
        className="heading-xsmall mb-3 uppercase tracking-wide"
        style={{ color: 'var(--text-subtle)' }}
      >
        Filter by Engine
      </h3>
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Filter by engine">
        {engines.map((engine) => (
          <button
            key={engine}
            onClick={() => handleEngineFilter(engine)}
            className="px-3 py-1.5 rounded-md body-small font-medium transition-all"
            style={{
              backgroundColor:
                selectedEngine === engine ? 'var(--color-brand)' : 'var(--surface-sunken)',
              color:
                selectedEngine === engine ? 'var(--text-inverse)' : 'var(--text-default)',
              border: `1px solid ${selectedEngine === engine ? 'var(--color-brand)' : 'var(--border-subtle)'}`,
            }}
            role="radio"
            aria-checked={selectedEngine === engine}
            onMouseEnter={(e) => {
              if (selectedEngine !== engine) {
                e.currentTarget.style.backgroundColor = 'var(--surface-hovered)';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedEngine !== engine) {
                e.currentTarget.style.backgroundColor = 'var(--surface-sunken)';
              }
            }}
          >
            {engine === 'All' ? 'All Engines' : `${engine} Engine`}
          </button>
        ))}
      </div>
    </div>
  );

  const renderViewModeToggle = () => (
    <div className="flex items-center gap-2">
      <span className="body-small font-medium" style={{ color: 'var(--text-subtle)' }}>
        View:
      </span>
      <div
        className="flex rounded-md p-0.5"
        style={{ backgroundColor: 'var(--surface-sunken)' }}
      >
        <button
          onClick={() => setViewMode('grid')}
          className="px-3 py-1 rounded-sm body-small font-medium transition-all flex items-center gap-1.5"
          style={{
            backgroundColor: viewMode === 'grid' ? 'var(--surface-raised)' : 'transparent',
            color: viewMode === 'grid' ? 'var(--text-default)' : 'var(--text-subtle)',
            boxShadow: viewMode === 'grid' ? 'var(--shadow-raised)' : 'none',
          }}
        >
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          Grid
        </button>
        <button
          onClick={() => setViewMode('list')}
          className="px-3 py-1 rounded-sm body-small font-medium transition-all flex items-center gap-1.5"
          style={{
            backgroundColor: viewMode === 'list' ? 'var(--surface-raised)' : 'transparent',
            color: viewMode === 'list' ? 'var(--text-default)' : 'var(--text-subtle)',
            boxShadow: viewMode === 'list' ? 'var(--shadow-raised)' : 'none',
          }}
        >
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clipRule="evenodd"
            />
          </svg>
          List
        </button>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <section
        className="max-w-7xl mx-auto"
        style={{ padding: 'var(--space-300)' }}
        aria-label="Browser Rankings"
      >
        <div className="mb-8">
          <h2 className="heading-large mb-2" style={{ color: 'var(--text-default)' }}>
            Rankings by Platform
          </h2>
          <p className="body-default" style={{ color: 'var(--text-subtle)' }}>
            Loading performance data...
          </p>
        </div>

        {renderPlatformButtons()}
        {renderEngineButtons()}

        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          aria-live="polite"
          aria-busy="true"
        >
          <div className="sr-only">Loading browser data...</div>
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <SkeletonLoader key={i} index={i} />
            ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section
        className="max-w-7xl mx-auto"
        style={{ padding: 'var(--space-300)' }}
        aria-label="Error Loading Data"
      >
        <div className="text-center" style={{ padding: 'var(--space-600) 0' }}>
          <div
            className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'var(--color-danger-subtle)' }}
          >
            <svg
              className="w-6 h-6"
              style={{ color: 'var(--color-danger)' }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="heading-medium mb-2" style={{ color: 'var(--text-default)' }}>
            Unable to Load Data
          </h2>
          <p className="body-default mb-6" style={{ color: 'var(--color-danger)' }} role="alert">
            {error}
          </p>
          <button
            onClick={handleRetry}
            disabled={isLoading}
            className="px-4 py-2 rounded-md body-default font-medium transition-colors"
            style={{
              backgroundColor: 'var(--color-brand)',
              color: 'var(--text-inverse)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-brand-bold)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-brand)';
            }}
          >
            {isLoading ? 'Retrying...' : `Retry ${retryCount > 0 ? `(${retryCount})` : ''}`}
          </button>
        </div>
      </section>
    );
  }

  return (
    <section
      className="max-w-7xl mx-auto"
      style={{ padding: 'var(--space-300)' }}
      aria-label="Browser Rankings"
      id="rankings"
    >
      <div className="mb-8">
        <h2 className="heading-large mb-2" style={{ color: 'var(--text-default)' }}>
          Rankings by Platform
        </h2>
        <p className="body-default" style={{ color: 'var(--text-subtle)' }}>
          Compare browser performance across different platforms using Speedometer 3.1 benchmark
        </p>
      </div>

      {renderPlatformButtons()}
      {renderEngineButtons()}

      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        totalBrowsers={sortedBrowsers.length}
        filteredCount={filteredAndSearchedBrowsers.length}
      />

      <StatsBar browsers={sortedBrowsers} selectedPlatform={selectedPlatform} />

      <div
        className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-6"
        style={{ paddingBottom: 'var(--space-150)', borderBottom: '1px solid var(--border-subtle)' }}
      >
        <h3 className="heading-small" style={{ color: 'var(--text-default)' }}>
          {filteredAndSearchedBrowsers.length === 0
            ? 'No browsers found'
            : `${filteredAndSearchedBrowsers.length} ${
                filteredAndSearchedBrowsers.length === 1 ? 'browser' : 'browsers'
              } on ${platformNames[selectedPlatform]}`}
        </h3>
        {filteredAndSearchedBrowsers.length > 0 && renderViewModeToggle()}
      </div>

      {/* Browser Cards */}
      <div
        className={`${
          viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-3'
        } mb-12`}
        aria-live="polite"
      >
        {filteredAndSearchedBrowsers.length === 0 ? (
          <div className="col-span-full text-center" style={{ padding: 'var(--space-600) 0' }}>
            <div
              className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'var(--surface-sunken)' }}
            >
              <svg
                className="w-6 h-6"
                style={{ color: 'var(--text-subtlest)' }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 className="heading-small mb-2" style={{ color: 'var(--text-default)' }}>
              No browsers found
            </h3>
            <p className="body-default mb-4" style={{ color: 'var(--text-subtle)' }}>
              {searchTerm
                ? `No browsers match "${searchTerm}" with the selected filters.`
                : 'No browsers match the selected filters.'}
            </p>
            {(searchTerm || selectedEngine !== 'All') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedEngine('All');
                }}
                className="body-default font-medium"
                style={{ color: 'var(--text-brand)' }}
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          filteredAndSearchedBrowsers.map((browser, index) => (
            <BrowserCard
              key={`${browser.name}-${selectedPlatform}`}
              browser={browser}
              getEngineColor={getEngineColor}
              rank={index + 1}
              selectedPlatform={selectedPlatform}
              isLoading={false}
            />
          ))
        )}
      </div>
    </section>
  );
}
