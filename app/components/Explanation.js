import React from "react";

// Collapsible section component similar to SystemInfo
const ExplanationSection = ({ title, children }) => {
  return (
    <details className="group border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <summary
        className="dark:text-gray-300 text-gray-700 p-4 cursor-pointer flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        aria-expanded="false"
      >
        <span className="font-medium">{title}</span>
        <svg
          className="w-5 h-5 transform group-open:rotate-180 transition-transform duration-200"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </summary>
      <div className="p-4 pt-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        {children}
      </div>
    </details>
  );
};

export default function Explanation() {
  return (
    <section
      className="dark:text-gray-300 text-gray-700 max-w-4xl mx-auto px-4 py-8 mt-12 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/50"
      aria-labelledby="explanation-heading"
    >
      <h2
        id="explanation-heading"
        className="text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"
      >
        Understanding Browser Performance Rankings
      </h2>

      <div className="space-y-6">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          BrowseRating began as a curiosity-driven project to quantify the
          perceived speed differences between browsers. What started as a
          personal investigation has evolved into a{" "}
          <span className="font-medium text-[#7853E0] dark:text-[#9B7BE8]">
            comprehensive benchmarking platform comparing browser performance
          </span>{" "}
          through synthetic testing methodologies.
        </p>

        <ExplanationSection title="Our Testing Methodology">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            BrowseRating conducts controlled performance tests on identical
            hardware configurations, ensuring fair comparisons between browsers.
            Each browser undergoes the same synthetic tests, with detailed
            system specifications displayed alongside the results for complete
            transparency. While these benchmarks focus on DOM element creation
            speed, they provide valuable insights into browser capabilities
            across different platforms.
          </p>
        </ExplanationSection>

        <ExplanationSection title="Real-World Context">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            It&apos;s important to note that while these benchmarks provide
            valuable comparative data, the performance differences may not be
            immediately noticeable in everyday browsing. Most modern browsers
            deliver excellent performance for typical usage, with factors like
            internet connectivity often having a more significant impact on user
            experience than rendering differences.
          </p>
        </ExplanationSection>

        <ExplanationSection title="Why These Tests Matter">
          <div className="flex flex-col space-y-4">
            {[
              "Provides objective performance comparisons across browsers",
              "Helps track browser optimization progress over time",
              "Offers insights into platform-specific performance variations",
              "Supports informed decision-making for power users",
            ].map((item, index) => (
              <div key={index} className="flex items-start">
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
                  {item}
                </p>
              </div>
            ))}
          </div>
        </ExplanationSection>

        <ExplanationSection title="Memory Usage Comparison">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            To provide a more comprehensive comparison, we&apos;ve included
            average RAM usage measurements for browsers with a single active
            YouTube tab. Keep in mind that actual memory consumption can vary
            significantly based on several factors, including:
          </p>
          <div className="flex flex-col space-y-4">
            {[
              "Number and types of installed extensions/add-ons",
              "Other open tabs and their content",
              "Background applications and system load",
              "Operating system memory management",
            ].map((item, index) => (
              <div key={index} className="flex items-start">
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
                  {item}
                </p>
              </div>
            ))}
          </div>
        </ExplanationSection>

        <ExplanationSection title="Ad Blocking Ability">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            Built-in ad blocking capabilities have become increasingly important
            for modern browsers as they directly impact both performance and
            user privacy. By blocking intrusive advertisements and tracking
            scripts at the browser level, users can experience{" "}
            <span className="font-medium text-[#7853E0] dark:text-[#9B7BE8]">
              faster page load times, reduced bandwidth usage, and better
              overall browsing security
            </span>{" "}
            without relying on third-party extensions. Native ad blocking also
            tends to be more efficient than extension-based solutions, consuming
            fewer system resources while providing comprehensive protection
            against unwanted content and potential security threats that could
            be delivered through ad networks.
          </p>
        </ExplanationSection>

        <ExplanationSection title="Looking Ahead">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            We&apos;re committed to expanding our benchmark suite and
            maintaining up-to-date comparisons. While our current scores are
            pending updates due to technical considerations, we&apos;re
            preparing to conduct a comprehensive round of testing across all
            major browsers in the coming weeks. Stay tuned for fresh performance
            insights across{" "}
            <span className="font-medium text-[#7853E0] dark:text-[#9B7BE8]">
              multiple browser versions
            </span>
            .
          </p>
        </ExplanationSection>
      </div>
    </section>
  );
}
