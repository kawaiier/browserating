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
import { BarChart3, LineChart, Target, TrendingDown, TrendingUp } from 'lucide-react';
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
        className="fixed inset-0 flex items-center justify-center p-4"
        style={{
          backgroundColor: 'rgba(9, 30, 66, 0.54)',
          zIndex: 'var(--z-modal)',
        }}
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="no-data-title"
      >
        <div
          className="p-8 max-w-md w-full fade-in"
          style={{
            backgroundColor: 'var(--surface-overlay)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-overlay-bold)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-center">
            <div
              className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'var(--surface-sunken)' }}
            >
              <svg
                className="w-8 h-8"
                style={{ color: 'var(--text-subtle)' }}
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
              className="text-xl font-bold mb-4"
              style={{ color: 'var(--text-default)' }}
            >
              No Data Available
            </h2>
            <p className="mb-6" style={{ color: 'var(--text-subtle)' }}>
              No performance data available for {browser.name} on this platform.
            </p>
            <button
              ref={closeButtonRef}
              onClick={onClose}
              className="px-6 py-3 rounded-md font-medium transition-colors"
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
        backgroundColor: chartType === 'bar' ? 'rgba(120, 83, 224, 0.8)' : 'transparent',
        borderColor: '#7853E0',
        borderWidth: chartType === 'line' ? 3 : 1,
        fill: chartType === 'line',
        tension: 0.4,
        pointBackgroundColor: '#7853E0',
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
          color: 'rgba(120, 83, 224, 0.1)',
          borderColor: 'rgba(120, 83, 224, 0.2)',
        },
        ticks: {
          color: '#6B7280',
          font: { size: 12 },
          maxTicksLimit: 8,
        },
      },
      y: {
        beginAtZero: false,
        grid: {
          color: 'rgba(120, 83, 224, 0.1)',
          borderColor: 'rgba(120, 83, 224, 0.2)',
        },
        ticks: {
          color: '#6B7280',
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
        borderColor: '#7853E0',
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
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'history', label: 'Version History', icon: LineChart },
    { id: 'metrics', label: 'All Metrics', icon: Target },
  ];

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{
        backgroundColor: 'rgba(9, 30, 66, 0.54)',
        zIndex: 'var(--z-modal)',
      }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <div
        ref={modalRef}
        className="w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col fade-in"
        style={{
          backgroundColor: 'var(--surface-overlay)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-overlay-bold)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <header
          className="sticky top-0 p-4 sm:p-6 z-10 shrink-0"
          style={{
            backgroundColor: 'var(--surface-overlay)',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Image
                  src={browser.logo}
                  alt=""
                  width={56}
                  height={56}
                  className="object-contain rounded-lg p-2"
                  style={{ backgroundColor: 'var(--surface-sunken)' }}
                />
              </div>
              <div>
                <h1
                  id="modal-title"
                  className="text-xl sm:text-3xl font-bold"
                  style={{ color: 'var(--text-default)' }}
                >
                  {browser.name}
                </h1>
                <p id="modal-description" className="mt-1" style={{ color: 'var(--text-subtle)' }}>
                  Performance analysis on {platformName}
                </p>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2 sm:mt-3">
                  <span
                    className={`px-3 py-1.5 rounded-md text-sm font-medium ${getEngineColor(
                      platformEngine
                    )}`}
                  >
                    {platformEngine} Engine
                  </span>
                  <span
                    className="px-3 py-1.5 rounded-md text-sm font-medium"
                    style={{
                      backgroundColor: 'var(--surface-sunken)',
                      color: 'var(--text-default)',
                    }}
                  >
                    v{latestVersion.version}
                  </span>
                  {trend.trend !== 'stable' && (
                    <span
                      className="px-3 py-1.5 rounded-md text-sm font-medium"
                      style={{
                        backgroundColor:
                          trend.trend === 'improving'
                            ? 'var(--color-success-subtle)'
                            : 'var(--color-danger-subtle)',
                        color:
                          trend.trend === 'improving'
                            ? 'var(--color-success)'
                            : 'var(--color-danger)',
                      }}
                    >
                      {trend.trend === 'improving' ? (
                        <TrendingUp className="inline w-4 h-4" aria-hidden="true" />
                      ) : (
                        <TrendingDown className="inline w-4 h-4" aria-hidden="true" />
                      )}{' '}
                      {Math.abs(trend.change).toFixed(1)}%
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button
              ref={closeButtonRef}
              onClick={onClose}
              className="p-2 rounded-md transition-all"
              style={{ color: 'var(--text-subtle)' }}
              aria-label="Close modal"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--surface-hovered)';
                e.currentTarget.style.color = 'var(--text-default)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--text-subtle)';
              }}
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
                className="px-3 py-2 sm:px-4 sm:py-2.5 rounded-md text-xs sm:text-sm font-medium transition-all"
                style={{
                  backgroundColor:
                    activeTab === tab.id ? 'var(--color-brand-subtle)' : 'transparent',
                  color:
                    activeTab === tab.id ? 'var(--text-brand)' : 'var(--text-subtle)',
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== tab.id) {
                    e.currentTarget.style.backgroundColor = 'var(--surface-hovered)';
                    e.currentTarget.style.color = 'var(--text-default)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== tab.id) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'var(--text-subtle)';
                  }
                }}
              >
                <span className="mr-2"><tab.icon className="inline w-4 h-4" aria-hidden="true" /></span>
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
                  <h2 className="text-xl font-semibold" style={{ color: 'var(--text-default)' }}>
                    Performance Trend
                  </h2>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setChartType(chartType === 'bar' ? 'line' : 'bar')}
                      className="px-3 py-1.5 text-sm rounded-md transition-colors"
                      style={{
                        backgroundColor: 'var(--surface-sunken)',
                        color: 'var(--text-default)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--surface-hovered)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--surface-sunken)';
                      }}
                    >
                      {chartType === 'bar' ? (
                        <>
                          <LineChart className="inline w-4 h-4 mr-1" aria-hidden="true" /> Line
                        </>
                      ) : (
                        <>
                          <BarChart3 className="inline w-4 h-4 mr-1" aria-hidden="true" /> Bar
                        </>
                      )}
                    </button>
                  </div>
                </div>
                <div
                  className="rounded-lg p-6"
                  style={{ backgroundColor: 'var(--surface-sunken)' }}
                >
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
                <h2 className="text-xl font-semibold mb-6" style={{ color: 'var(--text-default)' }}>
                  Current Performance
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div
                    className="rounded-lg p-6"
                    style={{
                      backgroundColor: 'var(--color-brand-subtle)',
                      border: '1px solid var(--color-brand-subtle)',
                    }}
                  >
                    <div
                      className="text-sm font-semibold uppercase tracking-wide mb-2"
                      style={{ color: 'var(--text-brand)' }}
                    >
                      Speedometer 3.1
                    </div>
                    <div
                      className="text-3xl font-bold"
                      style={{ color: 'var(--text-brand)' }}
                    >
                      {latestVersion.scores.speedometer3.toFixed(2)}
                    </div>
                  </div>

                  {latestVersion.scores.ram && (
                    <div
                      className="rounded-lg p-6"
                      style={{
                        backgroundColor: 'var(--color-information-subtle)',
                        border: '1px solid var(--color-information-subtle)',
                      }}
                    >
                      <div
                        className="text-sm font-semibold uppercase tracking-wide mb-2"
                        style={{ color: 'var(--text-brand)' }}
                      >
                        Memory Usage
                      </div>
                      <div
                        className="text-3xl font-bold"
                        style={{ color: 'var(--text-brand)' }}
                      >
                        {latestVersion.scores.ram >= 1000
                          ? `${(latestVersion.scores.ram / 1000).toFixed(1)} GB`
                          : `${latestVersion.scores.ram.toFixed(0)} MB`}
                      </div>
                    </div>
                  )}

                  {latestVersion.scores.adblock && (
                    <div
                      className="rounded-lg p-6"
                      style={{
                        backgroundColor: 'var(--color-success-subtle)',
                        border: '1px solid var(--color-success-subtle)',
                      }}
                    >
                      <div
                        className="text-sm font-semibold uppercase tracking-wide mb-2"
                        style={{ color: 'var(--color-success)' }}
                      >
                        Ad Blocking
                      </div>
                      <div
                        className="text-3xl font-bold"
                        style={{ color: 'var(--color-success)' }}
                      >
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
              <h2 className="text-xl font-semibold mb-6" style={{ color: 'var(--text-default)' }}>
                Version History
              </h2>
              <div className="space-y-4">
                {platformData.versions.map((version, index) => (
                  <div
                    key={version.version}
                    className="rounded-lg p-6 transition-colors"
                    style={{
                      backgroundColor: 'var(--surface-sunken)',
                      border: '1px solid var(--border-subtle)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border-default)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border-subtle)';
                    }}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold" style={{ color: 'var(--text-default)' }}>
                            Version {version.version}
                          </h3>
                          {index === 0 && (
                            <span
                              className="px-2 py-1 text-xs rounded-full font-medium"
                              style={{
                                backgroundColor: 'var(--color-success-subtle)',
                                color: 'var(--color-success)',
                              }}
                            >
                              Latest
                            </span>
                          )}
                        </div>
                        {version.date && (
                          <p className="text-sm mt-1" style={{ color: 'var(--text-subtle)' }}>
                            Tested: {new Date(version.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold" style={{ color: 'var(--text-default)' }}>
                          {version.scores.speedometer3.toFixed(2)}
                        </div>
                        <div className="text-sm" style={{ color: 'var(--text-subtle)' }}>
                          Speedometer 3.1
                        </div>
                      </div>
                    </div>

                    {(version.scores.ram || version.scores.adblock) && (
                      <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
                        {version.scores.ram && (
                          <div style={{ color: 'var(--text-subtle)' }}>
                            <span className="font-medium">Memory:</span>{' '}
                            {version.scores.ram.toFixed(0)} MB
                          </div>
                        )}
                        {version.scores.adblock && (
                          <div style={{ color: 'var(--text-subtle)' }}>
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
              <h2 className="text-xl font-semibold mb-6" style={{ color: 'var(--text-default)' }}>
                All Performance Metrics
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-default)' }}>
                      <th className="text-left py-3 px-3 sm:px-4 font-semibold" style={{ color: 'var(--text-default)' }}>
                        Version
                      </th>
                      <th className="text-right py-3 px-3 sm:px-4 font-semibold" style={{ color: 'var(--text-default)' }}>
                        Speedometer
                      </th>
                      <th className="text-right py-3 px-3 sm:px-4 font-semibold" style={{ color: 'var(--text-default)' }}>
                        Memory
                      </th>
                      <th className="text-right py-3 px-3 sm:px-4 font-semibold" style={{ color: 'var(--text-default)' }}>
                        Ad Block
                      </th>
                      <th className="text-right py-3 px-3 sm:px-4 font-semibold" style={{ color: 'var(--text-default)' }}>
                        Tested
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {platformData.versions.map((version, index) => (
                      <tr
                        key={version.version}
                        style={{ borderBottom: '1px solid var(--border-subtle)' }}
                        className="transition-colors"
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--surface-hovered)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        <td className="py-3 px-3 sm:px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-medium" style={{ color: 'var(--text-default)' }}>
                              {version.version}
                            </span>
                            {index === 0 && (
                              <span
                                className="px-2 py-0.5 text-xs rounded font-medium"
                                style={{
                                  backgroundColor: 'var(--color-success-subtle)',
                                  color: 'var(--color-success)',
                                }}
                              >
                                Latest
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-3 sm:px-4 text-right font-mono" style={{ color: 'var(--text-default)' }}>
                          {version.scores.speedometer3.toFixed(2)}
                        </td>
                        <td className="py-3 px-3 sm:px-4 text-right font-mono" style={{ color: 'var(--text-subtle)' }}>
                          {version.scores.ram ? `${version.scores.ram.toFixed(0)} MB` : '—'}
                        </td>
                        <td className="py-3 px-3 sm:px-4 text-right font-mono" style={{ color: 'var(--text-subtle)' }}>
                          {version.scores.adblock ? `${version.scores.adblock.toFixed(0)}%` : '—'}
                        </td>
                        <td className="py-3 px-3 sm:px-4 text-right font-mono" style={{ color: 'var(--text-subtle)' }}>
                          {version.date ? new Date(version.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
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
