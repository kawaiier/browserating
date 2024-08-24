import Image from "next/image";

export default function BrowserCard({ browser, getEngineColor }) {
  const latestVersion = browser.versions[0]; // Assuming versions are sorted newest first

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-sm">
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
            {latestVersion.scores.overallScore.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}
