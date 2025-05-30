import { Bar, Line } from "react-chartjs-2";
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
} from "chart.js";
import { useEffect, useRef, useState } from "react";

import Image from "next/image";

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
  const [activeTab, setActiveTab] = useState("overview");
  const [chartType, setChartType] = useState("bar");
  const [isAnimating, setIsAnimating] = useState(false);
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);
  const firstFocusableRef = useRef(null);

  const platformData = browser[selectedPlatform];

  // Focus management
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
      // Trap focus within modal
      if (e.key === "Tab") {
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

    document.addEventListener("keydown", handleKeyDown);

    // Focus the close button on mount
    setTimeout(() => closeButtonRef.current?.focus(), 100);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  // Animation on mount
  useEffect(() => {
    setIsAnimating(true);
  }, []);

  if (
    !platformData ||
    !platformData.versions ||
    platformData.versions.length === 0
  ) {
    return (
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="no-data-title"
      >
        <div
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full transform transition-all duration-300 scale-95 animate-[scale-in_0.3s_ease-out_forwards]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-400"
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
              className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4"
            >
              No Data Available
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              No performance data available for {browser.name} on this platform.
            </p>
            <button
              ref={closeButtonRef}
              onClick={onClose}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-colors focus:outline-none focus:ring-4 focus:ring-purple-500/50"
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

  const getEngineColor = (engine) => {
    switch (engine.toLowerCase()) {
      case "blink":
        return "bg-blue-100 dark:bg-sky-900/50 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-sky-700";
      case "gecko":
        return "bg-green-100 dark:bg-emerald-900/50 text-green-800 dark:text-green-200 border border-green-200 dark:border-emerald-700";
      case "webkit":
        return "bg-orange-100 dark:bg-amber-900/50 text-orange-800 dark:text-orange-200 border border-orange-200 dark:border-amber-700";
      default:
        return "bg-gray-100 dark:bg-gray-700/50 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600";
    }
  };

  const getPerformanceTrend = () => {
    if (sortedData.length < 2) return { trend: "stable", change: 0 };

    const recent = sortedData.slice(-3).map((d) => d.scores.speedometer3);
    const older = sortedData.slice(-6, -3).map((d) => d.scores.speedometer3);

    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const olderAvg =
      older.length > 0
        ? older.reduce((a, b) => a + b, 0) / older.length
        : recentAvg;

    const change = ((recentAvg - olderAvg) / olderAvg) * 100;

    if (Math.abs(change) < 2) return { trend: "stable", change: 0 };
    return { trend: change > 0 ? "improving" : "declining", change };
  };

  const trend = getPerformanceTrend();

  const chartData = {
    labels: sortedData.map((data) => `v${data.version}`),
    datasets: [
      {
        label: "Speedometer 3.1 Score",
        data: sortedData.map((data) => data.scores.speedometer3),
        backgroundColor:
          chartType === "bar" ? "rgba(120, 83, 224, 0.8)" : "transparent",
        borderColor: "#7853E0",
        borderWidth: chartType === "line" ? 3 : 1,
        fill: chartType === "line",
        tension: 0.4,
        pointBackgroundColor: "#7853E0",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: chartType === "line" ? 6 : 0,
        pointHoverRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: "index",
    },
    scales: {
      x: {
        grid: {
          color: "rgba(120, 83, 224, 0.1)",
          borderColor: "rgba(120, 83, 224, 0.2)",
        },
        ticks: {
          color: "#6B7280",
          font: { size: 12 },
          maxTicksLimit: 8,
        },
      },
      y: {
        beginAtZero: false,
        grid: {
          color: "rgba(120, 83, 224, 0.1)",
          borderColor: "rgba(120, 83, 224, 0.2)",
        },
        ticks: {
          color: "#6B7280",
          font: { size: 12 },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "#7853E0",
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          title: (context) =>
            `Version ${sortedData[context[0].dataIndex].version}`,
          label: (context) => `Score: ${context.parsed.y.toFixed(2)}`,
        },
      },
    },
  };

  const platformNames = {
    "macos-arm": "macOS ARM",
    "macos-intel": "macOS Intel",
    windows: "Windows",
    android: "Android",
    ipad: "iPad OS",
  };

  const platformName = platformNames[selectedPlatform] || selectedPlatform;

  const tabs = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "history", label: "Version History", icon: "📈" },
    { id: "metrics", label: "All Metrics", icon: "🎯" },
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
        className={`bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden transform transition-all duration-500 ${
          isAnimating ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <header className="sticky top-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 p-6 z-10">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Image
                  src={browser.logo}
                  alt=""
                  width={56}
                  height={56}
                  className="object-contain dark:brightness-90 rounded-xl bg-gray-50 dark:bg-gray-700 p-2"
                />
              </div>
              <div>
                <h1
                  id="modal-title"
                  className="text-3xl font-bold text-gray-900 dark:text-white"
                >
                  {browser.name}
                </h1>
                <p
                  id="modal-description"
                  className="text-gray-600 dark:text-gray-400 mt-1"
                >
                  Performance analysis on {platformName}
                </p>
                <div className="flex items-center gap-3 mt-3">
                  <span
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium ${getEngineColor(
                      platformEngine
                    )}`}
                  >
                    {platformEngine} Engine
                  </span>
                  <span className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium">
                    v{latestVersion.version}
                  </span>
                  {trend.trend !== "stable" && (
                    <span
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                        trend.trend === "improving"
                          ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                          : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
                      }`}
                    >
                      {trend.trend === "improving" ? "📈" : "📉"}{" "}
                      {Math.abs(trend.change).toFixed(1)}%
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button
              ref={closeButtonRef}
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-purple-500/50"
              aria-label="Close modal"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
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
          <nav className="flex space-x-1 mt-6" role="tablist">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-purple-500/50 ${
                  activeTab === tab.id
                    ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </header>

        {/* Content */}
        <main className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* Performance Chart */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Performance Trend
                  </h2>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setChartType(chartType === "bar" ? "line" : "bar")
                      }
                      className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    >
                      {chartType === "bar" ? "📈 Line" : "📊 Bar"}
                    </button>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-6">
                  <div className="h-80">
                    {chartType === "bar" ? (
                      <Bar data={chartData} options={chartOptions} />
                    ) : (
                      <Line data={chartData} options={chartOptions} />
                    )}
                  </div>
                </div>
              </section>

              {/* Current Performance Stats */}
              <section>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Current Performance
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-6 border border-purple-200 dark:border-purple-700">
                    <div className="text-purple-600 dark:text-purple-400 text-sm font-semibold uppercase tracking-wide mb-2">
                      Speedometer 3.1
                    </div>
                    <div className="text-3xl font-bold text-purple-900 dark:text-purple-100">
                      {latestVersion.scores.speedometer3.toFixed(2)}
                    </div>
                  </div>

                  {latestVersion.scores.ram && (
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-6 border border-blue-200 dark:border-blue-700">
                      <div className="text-blue-600 dark:text-blue-400 text-sm font-semibold uppercase tracking-wide mb-2">
                        Memory Usage
                      </div>
                      <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                        {latestVersion.scores.ram >= 1000
                          ? `${(latestVersion.scores.ram / 1000).toFixed(1)} GB`
                          : `${latestVersion.scores.ram.toFixed(0)} MB`}
                      </div>
                    </div>
                  )}

                  {latestVersion.scores.adblock && (
                    <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-6 border border-green-200 dark:border-green-700">
                      <div className="text-green-600 dark:text-green-400 text-sm font-semibold uppercase tracking-wide mb-2">
                        Ad Blocking
                      </div>
                      <div className="text-3xl font-bold text-green-900 dark:text-green-100">
                        {latestVersion.scores.adblock.toFixed(0)}%
                      </div>
                    </div>
                  )}
                </div>
              </section>
            </div>
          )}

          {activeTab === "history" && (
            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Version History
              </h2>
              <div className="space-y-4">
                {platformData.versions.map((version, index) => (
                  <div
                    key={version.version}
                    className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-6 border border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-600 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            Version {version.version}
                          </h3>
                          {index === 0 && (
                            <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs rounded-full font-medium">
                              Latest
                            </span>
                          )}
                        </div>
                        {version.releaseDate && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Released:{" "}
                            {new Date(version.releaseDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                          {version.scores.speedometer3.toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Speedometer 3.1
                        </div>
                      </div>
                    </div>

                    {(version.scores.ram || version.scores.adblock) && (
                      <div className="flex gap-6 text-sm">
                        {version.scores.ram && (
                          <div className="text-gray-600 dark:text-gray-400">
                            <span className="font-medium">Memory:</span>{" "}
                            {version.scores.ram.toFixed(0)} MB
                          </div>
                        )}
                        {version.scores.adblock && (
                          <div className="text-gray-600 dark:text-gray-400">
                            <span className="font-medium">Ad Blocking:</span>{" "}
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

          {activeTab === "metrics" && (
            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                All Performance Metrics
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                        Version
                      </th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">
                        Speedometer
                      </th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">
                        Memory
                      </th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">
                        Ad Block
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {platformData.versions.map((version, index) => (
                      <tr
                        key={version.version}
                        className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900 dark:text-white">
                              {version.version}
                            </span>
                            {index === 0 && (
                              <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs rounded font-medium">
                                Latest
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-gray-900 dark:text-white">
                          {version.scores.speedometer3.toFixed(2)}
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-gray-600 dark:text-gray-400">
                          {version.scores.ram
                            ? `${version.scores.ram.toFixed(0)} MB`
                            : "—"}
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-gray-600 dark:text-gray-400">
                          {version.scores.adblock
                            ? `${version.scores.adblock.toFixed(0)}%`
                            : "—"}
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

      <style jsx>{`
        @keyframes scale-in {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default BrowserDetailsModal;
