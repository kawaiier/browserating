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

import { Bar } from "react-chartjs-2";
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
  const platformData = browser[selectedPlatform];

  // Check if platform data exists and has the correct structure
  if (
    !platformData ||
    !platformData.versions ||
    platformData.versions.length === 0
  ) {
    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
        onClick={onClose}
      >
        <div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-md w-full"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
        >
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              No Data Available
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              No performance data available for {browser.name} on this platform.
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
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
        return "bg-blue-100 dark:bg-sky-900 text-blue-800 dark:text-blue-100";
      case "gecko":
        return "bg-green-100 dark:bg-emerald-900 text-green-800 dark:text-green-100";
      case "webkit":
        return "bg-orange-100 dark:bg-amber-900 text-orange-800 dark:text-orange-100";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100";
    }
  };

  const chartData = {
    labels: sortedData.map((data) => data.version),
    datasets: [
      {
        label: "Speedometer 3 Score",
        data: sortedData.map((data) => data.scores.speedometer3),
        backgroundColor: "#7853E0",
        borderColor: "#7853E0",
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          color: "rgba(120, 83, 224, 0.1)",
        },
        ticks: {
          color: "#9CA3AF", // gray-400
        },
      },
      y: {
        grid: {
          color: "rgba(120, 83, 224, 0.1)",
        },
        ticks: {
          color: "#9CA3AF", // gray-400
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: "#9CA3AF", // gray-400
        },
      },
    },
  };

  // Get platform display name
  const platformNames = {
    "macos-arm": "macOS ARM",
    "macos-intel": "macOS Intel",
    windows: "Windows",
    android: "Android",
    ipad: "iPad OS",
  };

  const platformName = platformNames[selectedPlatform] || selectedPlatform;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto fade-in"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <div className="flex items-center space-x-4 mb-2">
              <Image
                src={browser.logo}
                alt={`${browser.name} logo`}
                width={48}
                height={48}
                className="object-contain dark:brightness-90"
              />
              <div>
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                  {browser.name}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Performance on {platformName}
                </p>
              </div>
            </div>
            <div className="flex items-center ml-1">
              <span
                className={`px-2 py-1 rounded-full text-sm ${getEngineColor(
                  platformEngine
                )}`}
              >
                {platformEngine}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
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

        <div className="mb-8">
          <h3 className="font-semibold text-lg mb-4 text-gray-700 dark:text-gray-200">
            Performance History on {platformName}
          </h3>
          <div className="h-72">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-4 text-gray-700 dark:text-gray-200">
              Version History
            </h3>
            <div className="space-y-4">
              {platformData.versions.map((data, index) => (
                <div
                  key={data.version}
                  className="border-b pb-4 border-gray-200 dark:border-gray-700"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-medium text-gray-800 dark:text-gray-200">
                        Version {data.version}
                      </span>
                      {index === 0 && (
                        <span className="ml-2 px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 text-xs rounded-full">
                          Latest
                        </span>
                      )}
                    </div>
                    <span className="text-gray-600 dark:text-gray-400 font-mono">
                      {data.scores.speedometer3.toFixed(2)}
                    </span>
                  </div>

                  {/* Additional scores if available */}
                  {(data.scores.ram || data.scores.adblock) && (
                    <div className="mt-2 flex gap-4 text-sm text-gray-500 dark:text-gray-400">
                      {data.scores.ram && (
                        <span>RAM: {data.scores.ram.toFixed(0)} MB</span>
                      )}
                      {data.scores.adblock && (
                        <span>
                          Adblock: {data.scores.adblock.toFixed(0)}/100
                        </span>
                      )}
                    </div>
                  )}

                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {data.releaseDate &&
                      `Released: ${new Date(
                        data.releaseDate
                      ).toLocaleDateString()}`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrowserDetailsModal;
