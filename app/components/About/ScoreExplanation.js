export default function ScoreExplanation() {
  return (
    <div className="space-y-4">
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        <span className="font-bold text-[#7853E0] dark:text-[#9B7BE8]">
          The higher the score, the faster the browser.
        </span>{" "}
        Speedometer 3.1 measures browser performance by simulating user
        interactions on various web applications.
      </p>

      <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
        <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
          Score Interpretation:
        </h4>
        <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
          <li>
            <span className="font-medium">Speedometer 3.1:</span> Higher scores
            indicate faster JavaScript and DOM performance
          </li>
          <li>
            <span className="font-medium">RAM Usage:</span> Lower values
            indicate more efficient memory usage
          </li>
          <li>
            <span className="font-medium">Adblock:</span> Higher scores indicate
            better ad-blocking capabilities
          </li>
        </ul>
      </div>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm italic">
        Note: Performance may vary based on your specific hardware, operating
        system version, and browser configuration.
      </p>
    </div>
  );
}
