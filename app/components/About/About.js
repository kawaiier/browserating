import { useState } from "react";

export default function About() {
  const [activeSection, setActiveSection] = useState("methodology");
  const [expandedSystem, setExpandedSystem] = useState(null);

  const systemConfigs = [
    {
      id: "macos-silicon",
      title: "macOS (Apple Silicon)",
      icon: "🍎",
      gradient: "from-blue-500 to-purple-500",
      specs: {
        os: "macOS Tahoe 26.1",
        device: "14-inch MacBook Pro (2023)",
        processor: "M3 Pro",
        memory: "36 GB RAM",
        highlights: ["Apple Silicon", "Latest macOS", "High Performance"],
      },
    },
    {
      id: "macos-intel",
      title: "macOS (Intel)",
      icon: "💻",
      gradient: "from-gray-500 to-blue-500",
      specs: {
        os: "macOS Ventura 13.6.9",
        device: "15-inch MacBook Pro (2019)",
        processor: "2.3 GHz 8-core Intel Core i9",
        memory: "16 GB RAM",
        highlights: [
          "Intel Architecture",
          "Stable Release",
          "Professional Grade",
        ],
      },
    },
    {
      id: "windows",
      title: "Windows",
      icon: "🪟",
      gradient: "from-blue-600 to-cyan-500",
      specs: {
        os: "Windows 10 Pro",
        device: "Lenovo Ideapad Gaming 3",
        processor: "AMD Ryzen 5 5600H with Radeon Graphics 3.3 GHz",
        memory: "16 GB RAM",
        highlights: ["Gaming Laptop", "AMD Architecture", "Real-world Setup"],
      },
    },
    {
      id: "android",
      title: "Android",
      icon: "🤖",
      gradient: "from-green-500 to-emerald-500",
      specs: {
        os: "Nothing OS 2.6 (Android 14)",
        device: "Nothing Phone (2a)",
        processor: "Dimensity 7200 Pro CPU with Mali-G610 MC4 GPU",
        memory: "8 GB RAM",
        highlights: ["Modern Android", "Mid-range Performance", "Custom OS"],
      },
    },
    {
      id: "ipad",
      title: "iPad",
      icon: "📱",
      gradient: "from-purple-500 to-pink-500",
      specs: {
        os: "iPadOS 18.5",
        device: "iPad Mini 7th Generation",
        processor: "A17 Pro CPU",
        memory: "8 GB RAM",
        highlights: ["Latest iPadOS", "Pro Chip", "Compact Form Factor"],
      },
    },
  ];

  const testingSteps = [
    {
      icon: "⚡",
      title: "Speedometer 3.1 Benchmark",
      description:
        "Five tests conducted per browser, eliminating best and worst results, averaging the middle three for accuracy.",
      details:
        "The benchmark tests a wide range of JavaScript frameworks and technologies, including TodoMVC implementations (using vanilla JavaScript, Web Components, React, Angular, Vue, jQuery, Preact, Svelte, and Lit), code and rich text editors (CodeMirror, TipTap), and charting libraries (observable-plot, chartjs, React-Stockcharts-SVG, Perf-Dashboard). It also includes workloads that mimic browsing a typical news site, testing how well a browser handles large DOM and CSSOM changes during navigation.",
    },
    {
      icon: "🧠",
      title: "Memory Usage Analysis",
      description:
        "Cumulative RAM consumption measured across seven diverse websites including IGN, ESPN, Figma, and Reddit.",
      details:
        "Memory tracking via Activity Monitor provides real-world usage patterns rather than theoretical limits. All processes RAM usage is summed up to get the total RAM usage.",
    },
    {
      icon: "🛡️",
      title: "Ad-Blocking Effectiveness",
      description:
        "Comprehensive testing using AdBlock Tester to evaluate built-in and extension-based blocking capabilities.",
      details:
        "Tests various ad types including display ads, video ads, trackers, and social media widgets.",
    },
  ];

  const scoreGuide = [
    {
      metric: "Speedometer 3.1",
      description:
        "Higher scores indicate faster JavaScript and DOM performance",
      scale: "0-100+",
      good: "40+",
      average: "25-40",
      poor: "<25",
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      metric: "RAM Usage",
      description: "Lower values indicate more efficient memory management",
      scale: "MB",
      good: "<500MB",
      average: "500-1000MB",
      poor: ">1000MB",
      color: "text-green-600 dark:text-green-400",
    },
    {
      metric: "Ad Blocking",
      description: "Higher scores indicate better ad-blocking capabilities",
      scale: "0-100%",
      good: "80-100%",
      average: "50-80%",
      poor: "<50%",
      color: "text-purple-600 dark:text-purple-400",
    },
  ];

  const sections = [
    { id: "methodology", label: "Testing Methodology", icon: "🔬" },
    { id: "systems", label: "Test Systems", icon: "💻" },
    { id: "scores", label: "Score Guide", icon: "📊" },
  ];

  return (
    <section
      className="max-w-6xl mx-auto px-4 py-12 mt-16"
      aria-labelledby="about-heading"
      id="methodology"
    >
      {/* Header */}
      <div className="text-center mb-12">
        <h2
          id="about-heading"
          className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent"
        >
          Testing Methodology & Systems
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Transparent, consistent, and thorough testing across multiple
          platforms to give you reliable browser performance insights you can
          trust.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
              activeSection === section.id
                ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg scale-105"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            <span className="text-lg">{section.icon}</span>
            {section.label}
          </button>
        ))}
      </div>

      {/* Content Sections */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Testing Methodology */}
        {activeSection === "methodology" && (
          <div className="p-8">
            <div className="grid gap-8">
              {testingSteps.map((step, index) => (
                <div key={index} className="group">
                  <div className="flex items-start gap-4 p-6 bg-gradient-to-r from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-all duration-300">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg">
                        {step.icon}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        {step.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">
                        {step.description}
                      </p>
                      <details className="group-details">
                        <summary className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 cursor-pointer font-medium">
                          Technical Details →
                        </summary>
                        <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                          {step.details}
                        </p>
                      </details>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Key Points */}
            <div className="mt-8 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">✨</span>
                Why Our Testing Matters
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span className="text-gray-700 dark:text-gray-300">
                    Consistent testing environment across all browsers
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span className="text-gray-700 dark:text-gray-300">
                    Statistical accuracy through multiple test runs
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span className="text-gray-700 dark:text-gray-300">
                    Real-world scenarios and websites
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Test Systems */}
        {activeSection === "systems" && (
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {systemConfigs.map((system) => (
                <div
                  key={system.id}
                  className={`group cursor-pointer transition-all duration-300 ${
                    expandedSystem === system.id ? "lg:col-span-2" : ""
                  }`}
                  onClick={() =>
                    setExpandedSystem(
                      expandedSystem === system.id ? null : system.id,
                    )
                  }
                >
                  <div
                    className={`bg-gradient-to-br ${system.gradient} p-[1px] rounded-xl`}
                  >
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 h-full">
                      <div className="flex items-center gap-4 mb-4">
                        <span className="text-3xl">{system.icon}</span>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            {system.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">
                            Click to{" "}
                            {expandedSystem === system.id
                              ? "collapse"
                              : "expand"}{" "}
                            details
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 dark:text-gray-400">
                            Operating System:
                          </span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {system.specs.os}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 dark:text-gray-400">
                            Device:
                          </span>
                          <span className="font-medium text-gray-900 dark:text-white text-right">
                            {system.specs.device}
                          </span>
                        </div>

                        {expandedSystem === system.id && (
                          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600 dark:text-gray-400">
                                Processor:
                              </span>
                              <span className="font-medium text-gray-900 dark:text-white text-right">
                                {system.specs.processor}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600 dark:text-gray-400">
                                Memory:
                              </span>
                              <span className="font-medium text-gray-900 dark:text-white">
                                {system.specs.memory}
                              </span>
                            </div>

                            <div className="mt-4">
                              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Key Features:
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {system.specs.highlights.map(
                                  (highlight, index) => (
                                    <span
                                      key={index}
                                      className={`px-3 py-1 text-xs font-medium rounded-full bg-gradient-to-r ${system.gradient} text-white`}
                                    >
                                      {highlight}
                                    </span>
                                  ),
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <span className="text-2xl">⚠️</span>
                <div>
                  <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">
                    Important Testing Notes
                  </h3>
                  <p className="text-amber-700 dark:text-amber-300 text-sm leading-relaxed">
                    Performance results may vary based on your specific hardware
                    configuration, operating system version, installed
                    extensions, and system load. These tests represent
                    controlled conditions and should be used as relative
                    comparisons rather than absolute benchmarks.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Score Guide */}
        {activeSection === "scores" && (
          <div className="p-8">
            <div className="mb-6">
              <div className="bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-xl p-6 border border-purple-200 dark:border-purple-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <span className="text-2xl">🎯</span>
                  Understanding Performance Metrics
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  <strong className="text-purple-600 dark:text-purple-400">
                    Higher Speedometer scores = Faster browser performance.
                  </strong>
                  Our comprehensive testing evaluates multiple aspects of
                  browser performance to give you a complete picture.
                </p>
              </div>
            </div>

            <div className="grid gap-6">
              {scoreGuide.map((metric, index) => (
                <div
                  key={index}
                  className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${metric.color} bg-current/10 flex-shrink-0`}
                    >
                      <span className="text-xl font-bold">
                        {index === 0 ? "⚡" : index === 1 ? "🧠" : "🛡️"}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4
                        className={`text-lg font-semibold mb-2 ${metric.color}`}
                      >
                        {metric.metric}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {metric.description}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700 dark:text-gray-300">
                            Scale:
                          </span>
                          <div className="text-gray-600 dark:text-gray-400">
                            {metric.scale}
                          </div>
                        </div>
                        <div>
                          <span className="font-medium text-green-600 dark:text-green-400">
                            Excellent:
                          </span>
                          <div className="text-gray-600 dark:text-gray-400">
                            {metric.good}
                          </div>
                        </div>
                        <div>
                          <span className="font-medium text-yellow-600 dark:text-yellow-400">
                            Average:
                          </span>
                          <div className="text-gray-600 dark:text-gray-400">
                            {metric.average}
                          </div>
                        </div>
                        <div>
                          <span className="font-medium text-red-600 dark:text-red-400">
                            Needs Improvement:
                          </span>
                          <div className="text-gray-600 dark:text-gray-400">
                            {metric.poor}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">💡</span>
                Pro Tips for Interpreting Results
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
                <div className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">→</span>
                  <span>
                    Focus on consistent performance across metrics rather than
                    just peak scores
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">→</span>
                  <span>
                    Consider your specific use case: gaming, productivity, or
                    general browsing
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">→</span>
                  <span>
                    Balance performance with features that matter to you
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">→</span>
                  <span>
                    Remember that browser updates can significantly impact
                    performance
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
