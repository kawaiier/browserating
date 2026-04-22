'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import BrowserBarChart from './BrowserBarChart';
import BrowserCard from './BrowserCard';
import { getBrowsers } from '../lib/getBrowsers';
import { engineColors, getEngineColor, platformNames, platformIcons } from '../lib/constants';
import { useLocalStorage } from '../hooks/useLocalStorage';

const NEW_PLATFORMS = ['macos-arm', 'ipad', 'windows'];
const OUTDATED_PLATFORMS = ['android', 'macos-intel'];

const SkeletonLoader = ({ index }) => (
  <div
    className="animate-pulse bg-surface rounded-radius-md shadow-sm border border-border-subtle overflow-hidden"
    style={{ animationDelay: `${index * 100}ms` }}
  >
    <div className="p-6">
      <div className="flex items-center mb-6">
        <div className="w-14 h-14 bg-surface-subtle rounded-radius-md mr-4"></div>
        <div className="flex-1">
          <div className="h-6 bg-surface-subtle rounded-radius-sm mb-2 w-3/4"></div>
          <div className="h-4 bg-surface-subtle rounded-radius-sm w-1/2"></div>
        </div>
      </div>
      <div className="flex gap-2 mb-6">
        <div className="h-8 bg-surface-subtle rounded-pill w-20"></div>
        <div className="h-8 bg-surface-subtle rounded-pill w-16"></div>
      </div>
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-surface-subtle rounded-radius-sm p-2 sm:p-4">
            <div className="h-4 bg-surface-subtle rounded-radius-sm mb-2"></div>
            <div className="h-8 bg-surface-subtle rounded-radius-sm"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const SearchBar = ({ searchTerm, onSearchChange, totalBrowsers, filteredCount }) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <svg
        className="h-5 w-5 text-muted"
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
    <input
      type="text"
      placeholder="Search browsers..."
      value={searchTerm}
      onChange={(e) => onSearchChange(e.target.value)}
      className="block w-full pl-10 pr-3 py-3 border border-border-subtle rounded-radius-md text-sm text-primary placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent transition-all duration-200"
      aria-label="Search browsers"
    />
    {searchTerm && (
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
        <span className="text-sm text-muted">
          {filteredCount} of {totalBrowsers}
        </span>
      </div>
    )}
  </div>
);

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
    <div className="mb-6 p-4 bg-surface-subtle rounded-radius-md border border-border-subtle">
      <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
        <div className="flex items-center gap-6">
          <div className="text-secondary">
            <span className="font-semibold text-primary">{stats.total}</span> browsers tested
          </div>
          <div className="text-secondary">
            <span className="font-semibold text-primary">{stats.engines}</span> engines
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-secondary">
            Avg: <span className="font-semibold">{stats.avgScore}</span>
          </div>
          <div className="text-secondary">
            Range: <span className="font-semibold">{stats.minScore}</span> -{' '}
            <span className="font-semibold text-accent-primary">{stats.maxScore}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const SortDropdown = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const sortOptions = [
    { value: 'score', label: 'Score (High to Low)' },
    { value: 'name-asc', label: 'Name (A-Z)' },
    { value: 'name-desc', label: 'Name (Z-A)' },
    { value: 'engine', label: 'Engine' },
  ];

  const selectedLabel = sortOptions.find((o) => o.value === value)?.label || sortOptions[0].label;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-surface border border-border-subtle rounded-radius-md text-sm text-secondary hover:bg-surface-subtle transition-colors focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-1"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
          />
        </svg>
        {selectedLabel}
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-1 w-48 bg-surface border border-border-subtle rounded-radius-md shadow-md z-10">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-surface-subtle transition-colors first:rounded-t-radius-md last:rounded-b-radius-md ${
                value === option.value
                  ? 'bg-selected text-accent-primary font-medium'
                  : 'text-secondary'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const ActiveFilters = ({ filters, onRemove, onClearAll }) => {
  if (filters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <span className="text-sm text-muted">Active filters:</span>
      {filters.map((filter) => (
        <button
          key={filter.key}
          onClick={() => onRemove(filter.key)}
          className="inline-flex items-center gap-1 px-2 py-1 bg-selected text-accent-primary text-sm rounded-pill hover:bg-surface-subtle transition-colors"
        >
          {filter.label}
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      ))}
      <button
        onClick={onClearAll}
        className="text-sm text-muted hover:text-primary transition-colors"
      >
        Clear all
      </button>
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
  const [sortBy, setSortBy] = useLocalStorage('sortBy', 'score');

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

  const sortBrowsersByPlatform = useCallback((browsers, platform, sortType) => {
    return [...browsers].sort((a, b) => {
      if (sortType === 'score') {
        const aScore = a[platform]?.versions?.[0]?.scores?.speedometer3 || 0;
        const bScore = b[platform]?.versions?.[0]?.scores?.speedometer3 || 0;
        return bScore - aScore;
      }
      if (sortType === 'name-asc') {
        return a.name.localeCompare(b.name);
      }
      if (sortType === 'name-desc') {
        return b.name.localeCompare(a.name);
      }
      if (sortType === 'engine') {
        const aEngine = a[platform]?.engine || '';
        const bEngine = b[platform]?.engine || '';
        return aEngine.localeCompare(bEngine);
      }
      return 0;
    });
  }, []);

  const sortedBrowsers = useMemo(
    () => sortBrowsersByPlatform(browsers, selectedPlatform, sortBy),
    [browsers, selectedPlatform, sortBy, sortBrowsersByPlatform]
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

  const activeFilters = useMemo(() => {
    const filters = [];
    if (selectedEngine !== 'All') {
      filters.push({ key: 'engine', label: selectedEngine });
    }
    if (searchTerm) {
      filters.push({ key: 'search', label: `"${searchTerm}"` });
    }
    return filters;
  }, [selectedEngine, searchTerm]);

  const handleRemoveFilter = useCallback(
    (key) => {
      if (key === 'engine') setSelectedEngine('All');
      if (key === 'search') setSearchTerm('');
    },
    [setSelectedEngine]
  );

  const handleClearAllFilters = useCallback(() => {
    setSelectedEngine('All');
    setSearchTerm('');
  }, [setSelectedEngine]);

  const renderPlatformSelector = () => (
    <div className="w-full">
      <h3 className="text-sm font-semibold text-secondary mb-3 uppercase tracking-wide hidden md:block">
        Platform
      </h3>
      <div
        className="flex md:grid md:grid-cols-5 gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0 -mx-2 px-2 md:mx-0 md:px-0 scrollbar-hide bg-surface-subtle rounded-radius-pill p-1.5"
        role="radiogroup"
        aria-label="Select platform"
      >
        {platforms.map((platform) => (
          <button
            key={platform}
            onClick={() => handlePlatformChange(platform)}
            className={`group relative flex-shrink-0 h-9 px-4 rounded-pill text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-1
            ${
              selectedPlatform === platform
                ? 'bg-neutral-900 text-white shadow-sm'
                : 'bg-transparent border border-transparent text-secondary hover:bg-surface'
            }`}
            role="radio"
            aria-checked={selectedPlatform === platform}
          >
            <span className="flex items-center justify-center gap-2 whitespace-nowrap">
              <span className="text-base">{platformIcons[platform]}</span>
              <span className="hidden sm:inline">{platformNames[platform]}</span>
            </span>

            {NEW_PLATFORMS.includes(platform) && (
              <span
                className="absolute -top-1.5 -right-1.5 bg-accent-primary text-white text-[10px] px-1.5 py-0.5 rounded-pill font-semibold shadow-sm"
                aria-label="Recently updated"
              >
                NEW
              </span>
            )}

            {OUTDATED_PLATFORMS.includes(platform) && (
              <span
                className="absolute -top-1.5 -right-1.5 bg-surface border border-border-subtle text-muted text-[10px] px-1.5 py-0.5 rounded-pill font-semibold shadow-sm"
                aria-label="Potentially outdated data"
              >
                OLD
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );

  const renderEngineFilter = () => {
    const isSingleSelect = true;

    if (isSingleSelect && engines.length <= 3) {
      return (
        <div className="flex gap-2 bg-surface-subtle rounded-radius-pill p-1">
          {engines.map((engine) => (
            <button
              key={engine}
              onClick={() => handleEngineFilter(engine)}
              className={`h-8 px-4 rounded-pill text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-1 ${
                selectedEngine === engine
                  ? 'bg-neutral-900 text-white shadow-sm'
                  : 'bg-transparent text-secondary hover:bg-surface'
              }`}
              role="radio"
              aria-checked={selectedEngine === engine}
            >
              {engine === 'All' ? 'All' : engine}
            </button>
          ))}
        </div>
      );
    }

    return (
      <div className="relative">
        <button
          onClick={() => document.getElementById('engine-dropdown')?.classList.toggle('hidden')}
          className="flex items-center gap-2 h-9 px-4 bg-surface border border-border-subtle rounded-radius-md text-sm text-secondary hover:bg-surface-subtle transition-colors focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-1"
        >
          Engine: {selectedEngine === 'All' ? 'All' : selectedEngine}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <div
          id="engine-dropdown"
          className="hidden absolute left-0 mt-1 w-48 bg-surface border border-border-subtle rounded-radius-md shadow-md z-10"
        >
          {engines.map((engine) => (
            <button
              key={engine}
              onClick={() => {
                handleEngineFilter(engine);
                document.getElementById('engine-dropdown')?.classList.add('hidden');
              }}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-surface-subtle transition-colors first:rounded-t-radius-md last:rounded-b-radius-md ${
                selectedEngine === engine
                  ? 'bg-selected text-accent-primary font-medium'
                  : 'text-secondary'
              }`}
            >
              {engine === 'All' ? 'All Engines' : `${engine} Engine`}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderViewModeToggle = () => (
    <div className="flex items-center gap-1 bg-surface-subtle p-1 rounded-radius-pill">
      <button
        onClick={() => setViewMode('grid')}
        className={`px-3 py-1.5 rounded-pill text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-1 ${
          viewMode === 'grid'
            ? 'bg-neutral-900 text-white shadow-sm'
            : 'text-muted hover:text-secondary'
        }`}
        aria-label="Grid view"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      </button>
      <button
        onClick={() => setViewMode('list')}
        className={`px-3 py-1.5 rounded-pill text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-1 ${
          viewMode === 'list'
            ? 'bg-neutral-900 text-white shadow-sm'
            : 'text-muted hover:text-secondary'
        }`}
        aria-label="List view"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );

  if (isLoading) {
    return (
      <section className="p-6 lg:px-10 max-w-7xl mx-auto" aria-label="Browser Rankings">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-primary mb-2">Browser Rankings</h2>
          <p className="text-muted">Loading performance data...</p>
        </div>

        {renderPlatformSelector()}
        {renderEngineFilter()}

        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
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
      <section className="p-6 lg:px-10 max-w-7xl mx-auto" aria-label="Error Loading Data">
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-surface-subtle rounded-full flex items-center justify-center border border-border-subtle">
            <svg
              className="w-8 h-8 text-score-poor"
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
          <h2 className="text-xl font-semibold text-primary mb-2">Unable to Load Data</h2>
          <p className="text-score-poor mb-6" role="alert">
            {error}
          </p>
          <button
            onClick={handleRetry}
            disabled={isLoading}
            className="px-6 py-3 bg-accent-primary hover:bg-accent-primary-hover disabled:opacity-50 text-white rounded-radius-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2"
          >
            {isLoading ? 'Retrying...' : `Retry ${retryCount > 0 ? `(${retryCount})` : ''}`}
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="p-6 lg:px-10 max-w-7xl mx-auto" aria-label="Browser Rankings" id="rankings">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-primary mb-2">Browser Performance Rankings</h2>
        <p className="text-muted">
          Compare browser performance across different platforms using Speedometer 3.1 benchmark
        </p>
      </div>

      <div className="mb-6 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="flex-1">{renderPlatformSelector()}</div>
          <div className="flex items-center gap-3">
            {renderEngineFilter()}
            <SortDropdown value={sortBy} onChange={setSortBy} />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
              totalBrowsers={sortedBrowsers.length}
              filteredCount={filteredAndSearchedBrowsers.length}
            />
          </div>
          <div className="flex items-center gap-3 sm:self-end">{renderViewModeToggle()}</div>
        </div>
      </div>

      <ActiveFilters
        filters={activeFilters}
        onRemove={handleRemoveFilter}
        onClearAll={handleClearAllFilters}
      />

      <StatsBar browsers={sortedBrowsers} selectedPlatform={selectedPlatform} />

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-6">
        <h3 className="text-lg font-semibold text-primary">
          {filteredAndSearchedBrowsers.length === 0
            ? 'No browsers found'
            : `${filteredAndSearchedBrowsers.length} ${
                filteredAndSearchedBrowsers.length === 1 ? 'browser' : 'browsers'
              } on ${platformNames[selectedPlatform]}`}
        </h3>
      </div>

      <div
        className={`${
          viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'
        } mb-12`}
        aria-live="polite"
      >
        {filteredAndSearchedBrowsers.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-surface-subtle rounded-full flex items-center justify-center border border-border-subtle">
              <svg
                className="w-8 h-8 text-muted"
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
            <h3 className="text-lg font-semibold text-primary mb-2">No browsers found</h3>
            <p className="text-muted mb-4">
              {searchTerm
                ? `No browsers match "${searchTerm}" with the selected filters.`
                : 'No browsers match the selected filters.'}
            </p>
            {(searchTerm || selectedEngine !== 'All') && (
              <button
                onClick={handleClearAllFilters}
                className="px-4 py-2 text-accent-primary hover:text-accent-primary-hover font-medium transition-colors"
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

      {filteredAndSearchedBrowsers.length > 0 && (
        <div className="mt-12">
          <BrowserBarChart
            browsers={filteredAndSearchedBrowsers}
            platform={selectedPlatform}
            getEngineColor={getEngineColor}
          />
        </div>
      )}
    </section>
  );
}
