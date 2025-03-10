import Image from "next/image";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from "chart.js";

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
  const latestVersion = platformData[0];
  const sortedData = [...platformData].reverse();

  const getEngineColor = (engine) => {
    switch (engine.toLowerCase()) {
      case "blink":
        return "bg-blue-100 text-blue-800";
      case "gecko":
        return "bg-orange-100 text-orange-800";
      case "webkit":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
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
              <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                {browser.name}
              </h2>
            </div>
            <div className="flex items-center ml-1">
              <span
                className={`px-2 py-1 rounded-full text-sm ${getEngineColor(
                  browser.engine
                )}`}
              >
                {browser.engine}
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
            Performance History
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
              {platformData.map((data, index) => (
                <div
                  key={data.version}
                  className="border-b pb-4 border-gray-200 dark:border-gray-700"
                >
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      Version {data.version}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      {data.scores.speedometer3.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
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
