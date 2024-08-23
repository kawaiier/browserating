export default function Explanation() {
  return (
    <section class="max-w-4xl mx-auto px-4 py-8 mt-12 bg-gray-50 rounded-lg shadow-md">
      <h2 class="text-3xl font-bold mb-6">
        Understanding macOS Browser Performance Rankings
      </h2>

      <p class="mb-4">
        At BrowseRater, we provide comprehensive{" "}
        <strong>macOS browser performance rankings</strong> to help you make
        informed decisions about your web browsing experience. Our rankings are
        currently based on <em>Speedometer 3 benchmark results</em>, a key
        indicator of browser speed and responsiveness.
      </p>

      <h3 class="text-2xl font-semibold mb-4">
        Speedometer 3: Measuring Browser Speed
      </h3>
      <p class="mb-4">
        <a
          href="https://browserbench.org/Speedometer3.0/"
          target="_blank"
          rel="noopener noreferrer"
          class="text-blue-600 hover:underline"
        >
          Speedometer 3
        </a>{" "}
        is an industry-standard benchmark that measures the responsiveness of
        web applications. It simulates user actions for the TodoMVC app,
        providing a realistic measure of browser performance. Higher scores
        indicate faster performance.
      </p>

      {/* Privacy Scores section removed
        <h3 class="text-2xl font-semibold mb-4">
          Privacy Scores: Protecting Your Data
        </h3>
        <p class="mb-4">
          Our privacy scores are derived from comprehensive tests that evaluate
          how well each browser protects your personal data. Factors considered
          include tracking prevention, fingerprinting resistance, and default
          privacy settings. Higher scores indicate better privacy protection.
        </p>
        */}

      <h3 class="text-2xl font-semibold mb-4">
        Why Browser Performance Matters
      </h3>
      <p class="mb-4">
        Choosing a high-performing browser can significantly impact your daily
        internet usage. Fast browsers lead to:
      </p>
      <ul class="list-disc pl-6 mb-4">
        <li>Quicker page load times</li>
        <li>Smoother web application performance</li>
        <li>Better overall user experience</li>
        <li>Increased productivity</li>
      </ul>

      <h3 class="text-2xl font-semibold mb-4">
        Stay Informed with BrowseRater
      </h3>
      <p class="mb-4">
        Browser technology is constantly evolving. Our rankings are regularly
        updated to reflect the latest versions and performance improvements.
        Bookmark this page to stay informed about the best-performing{" "}
        <strong>macOS browsers</strong>.
      </p>

      <p class="text-sm text-gray-600 mt-8">
        Last updated: <time datetime="2023-08-23">August 23, 2023</time> | Next
        update scheduled: September 23, 2023
      </p>
    </section>
  );
}