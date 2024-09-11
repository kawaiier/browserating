import Image from "next/image";

export default function BrowserCard({ browser, getEngineColor, rank }) {
  const latestVersion = browser.versions[0];

  // Get previous version's speedometer3 score
  const prevSpeedometer3Score =
    browser.versions.length > 1
      ? browser.versions[1].scores.speedometer3
      : null;

  const getRankStyle = (rank) => {
    switch (rank) {
      case 1:
        return "ring-4 ring-yellow-400"; // Gold
      case 2:
        return "ring-4 ring-gray-300"; // Silver
      case 3:
        return "ring-4 ring-amber-600"; // Bronze
      default:
        return "";
    }
  };

  return (
    <div
      className={`bg-white shadow-lg rounded-lg overflow-hidden max-w-sm ${getRankStyle(rank)}`}
    >
      <div className="p-4">
        <div className="flex items-center mb-4">
          <Image
            src={browser.logo}
            alt={`${browser.name} logo`}
            width={50}
            height={50}
            className="mr-4"
          />
          <h3 className="text-xl font-semibold">
            <a
              href={browser.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800"
            >
              {browser.name}
            </a>
          </h3>
        </div>
        <div className="mb-4">
          <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm mr-2">
            {latestVersion.version}
          </span>
          <span
            className={`px-2 py-1 rounded-full text-sm ${getEngineColor(browser.engine)}`}
          >
            {browser.engine}
          </span>
        </div>
        <div className="space-y-2">
          <p className="text-2xl font-bold text-center mt-4">
            {latestVersion.scores.speedometer3.toFixed(2)}
          </p>
          <p
            title={browser.versions[1]?.version}
            className={`text-xs text-gray-600 text-center ${prevSpeedometer3Score ? "" : "opacity-50"}`}
          >
            Previous Version:{" "}
            {(prevSpeedometer3Score && prevSpeedometer3Score.toFixed(2)) ||
              "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
}
