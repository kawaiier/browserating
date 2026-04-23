'use client';

import { Bar, Line } from 'react-chartjs-2';
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import { useEffect, useRef, useState } from 'react';

import Image from 'next/image';
import { getEngineColor, platformNames } from '../lib/constants';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement
);

const BrowserDetailsModal = ({ browser, selectedPlatform, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [chartType, setChartType] = useState('bar');
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);
  const firstFocusableRef = useRef(null);

  const platformData = browser[selectedPlatform];

  // Focus management
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
      // Trap focus within modal
      if (e.key === 'Tab') {
        const focusableElements = modalRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements?.[0];
        const lastElement = focusableElements?.[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // Focus the close button on mount
    setTimeout(() => closeButtonRef.current?.focus(), 100);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  if (!platformData || !platformData.versions || platformData.versions.length === 0) {
    return (
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="no-data-title"
      >
        <div
          className="bg-bg-surface dark:bg-neutral-800 rounded-radius-xl shadow-lg p-8 max-w-md w-full transform transition-all duration-300 scale-95 animate-[scale-in_0.3s_ease-out_forwards]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-bg-surface-subtle dark:bg-neutral-700 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-text-muted"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h2
              id="no-data-title"
              className="text-xl font-bold text-text-primary dark:text-gray-100 mb-4"
            >
              No Data Available
            </h2>
            <p className="text-text-secondary dark:text-gray-400 mb-6">
              No performance data available for {browser.name} on this platform.
            </p>
            <button
              ref={closeButtonRef}
              onClick={onClose}
              className="px-6 py-3 bg-accent-primary hover:bg-accent-primary-hover text-white rounded-xl font-medium transition-colors focus:outline-none focus:ring-4 focus:ring-focus-ring/50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  const latestVersion = platformData.versions[0];
  const sortedData = [...platformData.versions].reverse();
  const platformEngine = platformData.engine;

  const getPerformanceTrend = () => {
    if (sortedData.length < 2) return { trend: 'stable', change: 0 };

    const recent = sortedData.slice(-3).map((d) => d.scores.speedometer3);
    const older = sortedData.slice(-6, -3).map((d) => d.scores.speedometer3);

    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const olderAvg = older.length > 0 ? older.reduce((a, b) => a + b, 0) / older.length : recentAvg;

    const change = ((recentAvg - olderAvg) / olderAvg) * 100;

    if (Math.abs(change) < 2) return { trend: 'stable', change: 0 };
    return { trend: change > 0 ? 'improving' : 'declining', change };
  };

  const trend = getPerformanceTrend();

  const chartData = {
    labels: sortedData.map((data) => `v${data.version}`),
    datasets: [
      {
        label: 'Speedometer 3.1 Score',
        data: sortedData.map((data) => data.scores.speedometer3),
        backgroundColor: chartType === 'bar' ? 'rgba(212, 168, 0, 0.8)' : 'transparent',
        borderColor: '#D4A800',
        borderWidth: chartType === 'line' ? 3 : 1,
        fill: chartType === 'line',
        tension: 0.4,
        pointBackgroundColor: '#D4A800',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: chartType === 'line' ? 6 : 0,
        pointHoverRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index',
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(212, 168, 0, 0.1)',
          borderColor: 'rgba(36, 88, 201, 0.2)',
        },
        ticks: {
          color: '#647181',
          font: { size: 12 },
          maxTicksLimit: 8,
        },
      },
      y: {
        beginAtZero: false,
        grid: {
          color: 'rgba(212, 168, 0, 0.1)',
          borderColor: 'rgba(36, 88, 201, 0.2)',
        },
        ticks: {
          color: '#647181',
          font: { size: 12 },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#D4A800',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          title: (context) => `Version ${sortedData[context[0].dataIndex].version}`,
          label: (context) => `Score: ${context.parsed.y.toFixed(2)}`,
        },
      },
    },
  };

  const platformName = platformNames[selectedPlatform] || selectedPlatform;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'history', label: 'Version History', icon: '📈' },
    { id: 'metrics', label: 'All Metrics', icon: '🎯' },
  ];

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <div
        ref={modalRef}
        className="bg-bg-surface dark:bg-neutral-800 rounded-radius-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-hidden animate-[scale-in_0.3s_ease-out_forwards] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <header className="sticky top-0 bg-bg-surface/95 dark:bg-neutral-800/95 backdrop-blur-sm border-b border-border-subtle dark:border-neutral-700 p-4 sm:p-6 z-10 shrink-0">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Image
                  src={browser.logo}
                  alt=""
                  width={56}
                  height={56}
                  className="object-contain dark:brightness-90 rounded-xl bg-bg-surface-subtle dark:bg-neutral-700 p-2"
                />
              </div>
              <div>
                <h1
                  id="modal-title"
                  className="text-xl sm:text-3xl font-bold text-gray-900 dark:text-white"
                >
                  {browser.name}
                </h1>
                <p id="modal-description" className="text-gray-600 dark:text-gray-400 mt-1">
                  Performance analysis on {platformName}
                </p>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2 sm:mt-3">
                  <span
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium ${getEngineColor(
                      platformEngine
                    )}`}
                  >
                    {platformEngine} Engine
                  </span>
                  <span className="px-3 py-1.5 bg-bg-surface-subtle dark:bg-neutral-700 text-text-secondary dark:text-neutral-300 rounded-radius-md text-sm font-medium">
                    v{latestVersion.version}
                  </span>
                  {trend.trend !== 'stable' && (
                    <span
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                        trend.trend === 'improving'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                      }`}
                    >
                      {trend.trend === 'improving' ? '📈' : '📉'}{' '}
                      {Math.abs(trend.change).toFixed(1)}%
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button
              ref={closeButtonRef}
              onClick={onClose}
              className="p-2 text-text-muted hover:text-text-primary dark:text-gray-500 dark:hover:text-gray-300 hover:bg-bg-surface-subtle dark:hover:bg-neutral-700 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-focus-ring/50"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Tabs */}
          <nav className="flex flex-wrap gap-1 mt-4 sm:mt-6" role="tablist">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-focus-ring/50 ${
                  activeTab === tab.id
                    ? 'bg-accent-primary/10 text-accent-primary'
                    : 'text-text-secondary dark:text-gray-400 hover:text-text-primary dark:hover:text-white hover:bg-bg-surface-subtle dark:hover:bg-neutral-700'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </header>

        {/* Content */}
        <main className="p-4 sm:p-6 overflow-y-auto flex-1 min-h-0">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Performance Chart */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-text-primary dark:text-white">
                    Performance Trend
                  </h2>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setChartType(chartType === 'bar' ? 'line' : 'bar')}
                      className="px-3 py-1.5 text-sm bg-bg-surface-subtle dark:bg-neutral-700 text-text-secondary dark:text-gray-300 rounded-lg hover:bg-border-subtle dark:hover:bg-neutral-600 transition-colors focus:outline-none focus:ring-2 focus:ring-focus-ring/50"
                    >
                      {chartType === 'bar' ? '📈 Line' : '📊 Bar'}
                    </button>
                  </div>
                </div>
                <div className="bg-bg-surface-subtle dark:bg-neutral-700/30 rounded-xl p-6">
                  <div className="h-48 sm:h-64 md:h-80">
                    {chartType === 'bar' ? (
                      <Bar data={chartData} options={chartOptions} />
                    ) : (
                      <Line data={chartData} options={chartOptions} />
                    )}
                  </div>
                </div>
              </section>

              {/* Current Performance Stats */}
              <section>
                <h2 className="text-xl font-semibold text-text-primary dark:text-white mb-6">
                  Current Performance
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-bg-surface-subtle dark:bg-neutral-700/30 rounded-xl p-6 border border-border-subtle dark:border-neutral-600">
                    <div className="text-accent-primary text-sm font-semibold uppercase tracking-wide mb-2">
                      Speedometer 3.1
                    </div>
                    <div className="text-3xl font-bold text-text-primary dark:text-white">
                      {latestVersion.scores.speedometer3.toFixed(2)}
                    </div>
                  </div>

                  {latestVersion.scores.ram && (
                    <div className="bg-blue-500/10 dark:bg-blue-500/20 rounded-xl p-6 border border-blue-500/30 dark:border-blue-500/40">
                      <div className="text-blue-600 dark:text-blue-400 text-sm font-semibold uppercase tracking-wide mb-2">
                        Memory Usage
                      </div>
                      <div className="text-3xl font-bold text-text-primary dark:text-white">
                        {latestVersion.scores.ram >= 1000
                          ? `${(latestVersion.scores.ram / 1000).toFixed(1)} GB`
                          : `${latestVersion.scores.ram.toFixed(0)} MB`}
                      </div>
                    </div>
                  )}

                  {latestVersion.scores.adblock && (
                    <div className="bg-green-500/10 dark:bg-green-500/20 rounded-xl p-6 border border-green-500/30 dark:border-green-500/40">
                      <div className="text-green-600 dark:text-green-400 text-sm font-semibold uppercase tracking-wide mb-2">
                        Ad Blocking
                      </div>
                      <div className="text-3xl font-bold text-text-primary dark:text-white">
                        {latestVersion.scores.adblock.toFixed(0)}%
                      </div>
                    </div>
                  )}
                </div>
              </section>
            </div>
          )}

          {activeTab === 'history' && (
            <section>
              <h2 className="text-xl font-semibold text-text-primary dark:text-white mb-6">
                Version History
              </h2>
              <div className="space-y-4">
                {platformData.versions.map((version, index) => (
                  <div
                    key={version.version}
                    className="bg-bg-surface-subtle dark:bg-neutral-700/30 rounded-xl p-6 border border-border-subtle dark:border-neutral-600 hover:border-accent-primary/30 dark:hover:border-accent-primary/50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-text-primary dark:text-white">
                            Version {version.version}
                          </h3>
                          {index === 0 && (
                            <span className="px-2 py-1 bg-green-500/10 text-green-600 dark:text-green-400 text-xs rounded-full font-medium">
                              Latest
                            </span>
                          )}
                        </div>
                        {version.date && (
                          <p className="text-sm text-text-muted dark:text-gray-400 mt-1">
                            Tested:{' '}
                            {new Date(version.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-text-primary dark:text-white">
                          {version.scores.speedometer3.toFixed(2)}
                        </div>
                        <div className="text-sm text-text-muted dark:text-gray-400">
                          Speedometer 3.1
                        </div>
                      </div>
                    </div>

                    {(version.scores.ram || version.scores.adblock) && (
                      <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
                        {version.scores.ram && (
                          <div className="text-text-secondary dark:text-gray-400">
                            <span className="font-medium">Memory:</span>{' '}
                            {version.scores.ram.toFixed(0)} MB
                          </div>
                        )}
                        {version.scores.adblock && (
                          <div className="text-text-secondary dark:text-gray-400">
                            <span className="font-medium">Ad Blocking:</span>{' '}
                            {version.scores.adblock.toFixed(0)}%
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeTab === 'metrics' && (
            <section>
              <h2 className="text-xl font-semibold text-text-primary dark:text-white mb-6">
                All Performance Metrics
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-border-subtle dark:border-neutral-600">
                      <th className="text-left py-3 px-3 sm:px-4 font-semibold text-text-primary dark:text-white">
                        Version
                      </th>
                      <th className="text-right py-3 px-3 sm:px-4 font-semibold text-text-primary dark:text-white">
                        Speedometer
                      </th>
                      <th className="text-right py-3 px-3 sm:px-4 font-semibold text-text-primary dark:text-white">
                        Memory
                      </th>
                      <th className="text-right py-3 px-3 sm:px-4 font-semibold text-text-primary dark:text-white">
                        Ad Block
                      </th>
                      <th className="text-right py-3 px-3 sm:px-4 font-semibold text-text-primary dark:text-white">
                        Tested
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {platformData.versions.map((version, index) => (
                      <tr
                        key={version.version}
                        className="border-b border-border-subtle/50 dark:border-neutral-600/50 hover:bg-bg-surface-subtle dark:hover:bg-neutral-700/30"
                      >
                        <td className="py-3 px-3 sm:px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-text-primary dark:text-white">
                              {version.version}
                            </span>
                            {index === 0 && (
                              <span className="px-2 py-0.5 bg-green-500/10 text-green-600 dark:text-green-400 text-xs rounded font-medium">
                                Latest
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-3 sm:px-4 text-right font-mono text-text-primary dark:text-white">
                          {version.scores.speedometer3.toFixed(2)}
                        </td>
                        <td className="py-3 px-3 sm:px-4 text-right font-mono text-text-secondary dark:text-gray-400">
                          {version.scores.ram ? `${version.scores.ram.toFixed(0)} MB` : '—'}
                        </td>
                        <td className="py-3 px-3 sm:px-4 text-right font-mono text-text-secondary dark:text-gray-400">
                          {version.scores.adblock ? `${version.scores.adblock.toFixed(0)}%` : '—'}
                        </td>
                        <td className="py-3 px-3 sm:px-4 text-right font-mono text-text-secondary dark:text-gray-400">
                          {version.date
                            ? new Date(version.date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })
                            : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default BrowserDetailsModal;
