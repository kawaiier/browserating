export default function TestProcedure() {
  return (
    <div className="space-y-4">
      <div className="flex items-start">
        <div className="flex-shrink-0 mt-1">
          <svg
            className="h-5 w-5 text-purple-600 dark:text-purple-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <p className="ml-3 text-gray-700 dark:text-gray-300 leading-relaxed">
          For Speedometer benchmark, for each browser{" "}
          <span className="font-medium text-[#7853E0] dark:text-[#9B7BE8]">
            five tests were conducted
          </span>
          . The{" "}
          <span className="font-medium text-[#7853E0] dark:text-[#9B7BE8]">
            best and worst results were eliminated
          </span>
          , and the{" "}
          <span className="font-medium text-[#7853E0] dark:text-[#9B7BE8]">
            average of the remaining three tests was calculated
          </span>{" "}
          to determine the final result.
        </p>
      </div>

      <div className="flex items-start">
        <div className="flex-shrink-0 mt-1">
          <svg
            className="h-5 w-5 text-purple-600 dark:text-purple-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <p className="ml-3 text-gray-700 dark:text-gray-300 leading-relaxed">
          For RAM usage test,{" "}
          <span className="font-medium text-[#7853E0] dark:text-[#9B7BE8]">
            the cumulative memory consumption was measured
          </span>{" "}
          after sequentially loading seven diverse websites: IGN, ESPN, Figma,
          Britannica, Wired, Bloomberg, and Reddit's popular page. Measurements
          were taken using Activity Monitor, filtered by each browser's name.
        </p>
      </div>

      <div className="flex items-start">
        <div className="flex-shrink-0 mt-1">
          <svg
            className="h-5 w-5 text-purple-600 dark:text-purple-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <p className="ml-3 text-gray-700 dark:text-gray-300 leading-relaxed">
          For adblock test,{" "}
          <a
            href="https://adblock-tester.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-[#7853E0] dark:text-[#9B7BE8] hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 rounded"
            aria-label="Visit AdBlock Tester website (opens in a new tab)"
          >
            AdBlock Tester
          </a>{" "}
          website was used.
        </p>
      </div>
    </div>
  );
}
