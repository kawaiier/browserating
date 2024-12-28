export default function Explanation() {
  return (
    <section className="max-w-4xl mx-auto p-10 mt-12 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/50">
      <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        Understanding Browser Performance Rankings
      </h2>

      <p className="mb-4 text-gray-700 dark:text-gray-300">
        BrowseRater began as a curiosity-driven project to quantify the
        perceived speed differences between browsers. What started as a personal
        investigation has evolved into a{" "}
        <strong className="text-gray-900 dark:text-gray-100">
          comprehensive benchmarking platform comparing browser performance
          across operating systems
        </strong>{" "}
        through synthetic testing methodologies.
      </p>

      <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
        Our Testing Methodology
      </h3>
      <p className="mb-4 text-gray-700 dark:text-gray-300">
        BrowseRater conducts controlled performance tests on identical hardware
        configurations, ensuring fair comparisons between browsers. Each browser
        undergoes the same synthetic tests, with detailed system specifications
        displayed alongside the results for complete transparency. While these
        benchmarks focus on DOM element creation speed, they provide valuable
        insights into browser capabilities across different platforms.
      </p>

      <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
        Real-World Context
      </h3>
      <p className="mb-4 text-gray-700 dark:text-gray-300">
        It's important to note that while these benchmarks provide valuable
        comparative data, the performance differences may not be immediately
        noticeable in everyday browsing. Most modern browsers deliver excellent
        performance for typical usage, with factors like internet connectivity
        often having a more significant impact on user experience than rendering
        differences.
      </p>

      <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
        Why These Tests Matter
      </h3>
      <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
        <li>Provides objective performance comparisons across browsers</li>
        <li>Helps track browser optimization progress over time</li>
        <li>Offers insights into platform-specific performance variations</li>
        <li>Supports informed decision-making for power users</li>
      </ul>

      <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
        Memory Usage Comparison
      </h3>
      <p className="mb-4 text-gray-700 dark:text-gray-300">
        To provide a more comprehensive comparison, we've included average RAM
        usage measurements for browsers with a single active YouTube tab. Keep
        in mind that actual memory consumption can vary significantly based on
        several factors, including:
      </p>
      <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
        <li>Number and types of installed extensions/add-ons</li>
        <li>Other open tabs and their content</li>
        <li>Background applications and system load</li>
        <li>Operating system memory management</li>
      </ul>

      <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
        Looking Ahead
      </h3>
      <p className="mb-4 text-gray-700 dark:text-gray-300">
        We're committed to expanding our benchmark suite and maintaining
        up-to-date comparisons. While our current scores are pending updates due
        to technical considerations, we're preparing to conduct a comprehensive
        round of testing across all major browsers in the coming weeks. Stay
        tuned for fresh performance insights across{" "}
        <strong className="text-gray-900 dark:text-gray-100">
          multiple operating systems and browser versions
        </strong>
        .
      </p>

      <p className="text-sm text-gray-600 dark:text-gray-400 mt-8">
        Last updated: <time dateTime="2024-12-28">December 28, 2024</time>
      </p>
    </section>
  );
}
