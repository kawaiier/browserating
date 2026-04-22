'use client';

import React, { useState } from 'react';

const StatCard = ({ icon, number, label, description }) => (
  <div className="bg-white dark:bg-neutral-800 rounded-radius-md p-6 border border-border-subtle dark:border-neutral-700 hover:shadow-lg transition-all duration-300 group">
    <div className="flex flex-col items-center sm:flex-row sm:items-start gap-4 mb-3">
      <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-radius-md flex items-center justify-center text-white text-xl">
        {icon}
      </div>
      <div className="text-center sm:text-left">
        <div className="text-2xl font-bold text-text-primary dark:text-white group-hover:text-accent-primary dark:group-hover:text-accent-primary transition-colors">
          {number}
        </div>
        <div className="text-sm font-medium text-text-text-secondary dark:text-neutral-400">{label}</div>
      </div>
    </div>
    <p className="text-text-text-secondary dark:text-neutral-400 text-sm leading-relaxed">{description}</p>
  </div>
);

const FeatureCard = ({ icon, title, description, highlights }) => (
  <div className="bg-gradient-to-br from-neutral-50 to-white dark:from-neutral-800 dark:to-neutral-700 rounded-radius-md p-6 border border-border-subtle dark:border-neutral-600 hover:border-accent-primary/30 dark:hover:border-accent-primary/50 transition-all duration-300">
    <div className="flex flex-col items-center sm:flex-row sm:items-start gap-4">
      <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-radius-md flex items-center justify-center text-white text-lg flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1 text-center sm:text-left">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
        <p className="text-text-text-secondary dark:text-neutral-400 text-sm mb-3 leading-relaxed">
          {description}
        </p>
        {highlights && (
          <div className="space-y-2 inline-flex flex-col items-start">
            {highlights.map((highlight, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                <span className="text-text-text-secondary dark:text-neutral-400">{highlight}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
);

export default function Explanation() {
  const [activeTab, setActiveTab] = useState('story');

  const tabs = [
    { id: 'story', label: 'Our Story', icon: '📖' },
    { id: 'methodology', label: 'How We Test', icon: '🔬' },
    { id: 'metrics', label: 'What We Measure', icon: '📊' },
  ];

  const testingFeatures = [
    {
      icon: '⚡',
      title: 'Performance Benchmarking',
      description:
        'Industry-standard Speedometer 3.1 tests measuring real-world JavaScript and DOM performance across all major browsers.',
      highlights: [
        'Controlled testing environment',
        'Multiple test runs for accuracy',
        'Statistical significance validation',
      ],
    },
    {
      icon: '🧠',
      title: 'Memory Analysis',
      description:
        'Comprehensive RAM usage monitoring across diverse website loads to understand real-world memory consumption patterns.',
      highlights: ['Multi-site testing scenario', 'System-level memory tracking'],
    },
    {
      icon: '🛡️',
      title: 'Ad-blocking',
      description:
        'Built-in ad-blocking effectiveness testing to evaluate protection against trackers and ads.',
      highlights: ['First-party blocker evaluation'],
    },
  ];

  return (
    <section className="max-w-6xl mx-auto px-4 py-12 mt-16" aria-labelledby="explanation-heading">
      {/* Header */}
      <div className="text-center mb-12">
        <h2
          id="explanation-heading"
          className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-amber-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent"
        >
          Why BrowseRating Exists
        </h2>
        <p className="text-lg text-text-text-secondary dark:text-neutral-400 max-w-3xl mx-auto">
          The definitive source for unbiased browser performance data, helping millions make
          informed choices about their browsing experience.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <StatCard
          icon="🌐"
          number="64+"
          label="Browsers Tested"
          description="Comprehensive coverage of major browsers across all platforms"
        />
        <StatCard
          icon="💻"
          number="5"
          label="Platforms"
          description="macOS, Windows, Android, iPad testing environments"
        />
        <StatCard
          icon="📊"
          number="2K+"
          label="Test Runs"
          description="Statistical accuracy through extensive testing cycles"
        />
        <StatCard
          icon="⏱️"
          number="Monthly"
          label="Updates"
          description="Fresh performance data with every browser release"
        />
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-radius-md font-medium transition-all duration-300 ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-amber-600 to-orange-500 text-white shadow-lg scale-105'
                : 'bg-bg-surface-subtle dark:bg-neutral-800 text-text-secondary dark:text-neutral-300 hover:bg-border-subtle dark:hover:bg-neutral-700'
            }`}
          >
            <span className="text-lg">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Sections */}
      <div className="bg-white dark:bg-neutral-800 rounded-radius-lg shadow-md border border-border-subtle dark:border-neutral-700 overflow-hidden">
        {/* Our Story */}
        {activeTab === 'story' && (
          <div className="p-4 sm:p-8">
            <div className="max-w-4xl mx-auto">
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <div className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-radius-md p-6 mb-8 border border-amber-200 dark:border-amber-700">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <span className="text-2xl">💡</span>
                    From Curiosity to Community Resource
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-0">
                    BrowseRating started as a simple question:{' '}
                    <em>&quot;Which browser is actually fastest?&quot;</em> What began as a weekend
                    curiosity project has quietly grown into a trusted resource for browser
                    performance comparison. Referenced in developer forums and Reddit threads, our
                    tools help IT professionals, developers, and performance enthusiasts make
                    informed browser choices based on real data. With steady growth averaging 300+
                    monthly visits, we&apos;ve become a go-to reference for those who need reliable,
                    independent browser performance metrics without the marketing noise.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <span className="text-2xl">🎯</span>
                      Our Mission
                    </h3>
                    <p className="text-text-text-secondary dark:text-neutral-400 leading-relaxed">
                      To provide transparent, unbiased browser performance data that empowers users
                      to make informed decisions. No marketing spin, no vendor bias—just pure
                      performance metrics tested under identical conditions across all major
                      platforms.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <span className="text-2xl">⚖️</span>
                      Why Independence Matters
                    </h3>
                    <p className="text-text-text-secondary dark:text-neutral-400 leading-relaxed">
                      Unlike browser vendors&apos; cherry-picked benchmarks or tech media&apos;s
                      sponsored content, our testing is completely independent. We purchase our own
                      hardware, run standardized tests, and publish complete methodologies alongside
                      every result.
                    </p>
                  </div>
                </div>

                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-radius-md p-6">
                  <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-200 mb-3 flex items-center gap-2">
                    <span className="text-xl">⚠️</span>
                    Real-World Context
                  </h3>
                  <p className="text-amber-700 dark:text-amber-300 text-sm leading-relaxed mb-3">
                    While our benchmarks provide valuable comparative data, most modern browsers
                    deliver excellent performance for everyday use. The &quot;best&quot; browser
                    depends on your specific needs: privacy features, extension ecosystem, platform
                    integration, or development tools.
                  </p>
                  <p className="text-amber-700 dark:text-amber-300 text-sm leading-relaxed mb-0">
                    <strong>Our role:</strong> Provide the performance piece of your decision-making
                    puzzle, not the entire solution.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Methodology */}
        {activeTab === 'methodology' && (
          <div className="p-4 sm:p-8">
            <div className="grid gap-6 mb-8">
              {testingFeatures.map((feature, index) => (
                <FeatureCard
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  highlights={feature.highlights}
                />
              ))}
            </div>

            <div className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-radius-md p-6 border border-green-200 dark:border-green-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">🔬</span>
                Scientific Approach to Browser Testing
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-green-500 mt-1 text-lg">✓</span>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      Controlled Environment
                    </div>
                    <div className="text-text-text-secondary dark:text-neutral-400">
                      Same OS installs, identical hardware
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-500 mt-1 text-lg">✓</span>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      Statistical Rigor
                    </div>
                    <div className="text-text-text-secondary dark:text-neutral-400">
                      Multiple runs, outlier elimination
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-500 mt-1 text-lg">✓</span>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      Full Transparency
                    </div>
                    <div className="text-text-text-secondary dark:text-neutral-400">
                      Open methodology, complete specs
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Metrics */}
        {activeTab === 'metrics' && (
          <div className="p-4 sm:p-8">
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  What Each Metric Tells You
                </h3>
                <p className="text-text-text-secondary dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed">
                  Our testing goes beyond simple speed tests to give you a complete picture of
                  browser performance and capabilities.
                </p>
              </div>

              <div className="grid gap-6">
                <div className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-radius-md p-6 border border-blue-200 dark:border-blue-800">
                  <div className="flex flex-col items-center sm:flex-row sm:items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-amber-500 rounded-radius-md flex items-center justify-center text-white text-xl font-bold">
                      ⚡
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                      <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        Speedometer 3.1 Performance
                      </h4>
                      <p className="text-text-text-secondary dark:text-neutral-400 mb-4 leading-relaxed">
                        The gold standard for browser performance testing. Measures JavaScript
                        execution, DOM manipulation, and CSS styling through realistic web
                        application simulations.
                      </p>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="text-center p-3 bg-white/50 dark:bg-neutral-800/50 rounded-radius-md">
                          <div className="font-bold text-green-600 dark:text-green-400">40+</div>
                          <div className="text-text-text-secondary dark:text-neutral-400">Excellent</div>
                        </div>
                        <div className="text-center p-3 bg-white/50 dark:bg-neutral-800/50 rounded-radius-md">
                          <div className="font-bold text-yellow-600 dark:text-yellow-400">
                            25-40
                          </div>
                          <div className="text-text-text-secondary dark:text-neutral-400">Good</div>
                        </div>
                        <div className="text-center p-3 bg-white/50 dark:bg-neutral-800/50 rounded-radius-md">
                          <div className="font-bold text-red-600 dark:text-red-400">&lt;25</div>
                          <div className="text-text-text-secondary dark:text-neutral-400">Needs Work</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-radius-md p-6 border border-green-200 dark:border-green-800">
                  <div className="flex flex-col items-center sm:flex-row sm:items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-radius-md flex items-center justify-center text-white text-xl font-bold">
                      🧠
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                      <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        Memory Efficiency
                      </h4>
                      <p className="text-text-text-secondary dark:text-neutral-400 mb-4 leading-relaxed">
                        Real-world RAM usage across diverse websites. Lower numbers mean better
                        efficiency and more room for other applications on your system.
                      </p>
                      <div className="bg-green-100 dark:bg-green-900/30 rounded-lg p-4">
                        <h5 className="font-medium text-green-800 dark:text-green-200 mb-2">
                          Factors That Affect Memory Usage:
                        </h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-green-700 dark:text-green-300">
                          <div>• Number of installed extensions</div>
                          <div>• Background tabs and processes</div>
                          <div>• Website complexity and media</div>
                          <div>• Operating system differences</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-radius-md p-6 border border-amber-200 dark:border-amber-800">
                  <div className="flex flex-col items-center sm:flex-row sm:items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-pink-500 rounded-radius-md flex items-center justify-center text-white text-xl font-bold">
                      🛡️
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                      <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        Ad-blocking effectiveness
                      </h4>
                      <p className="text-text-text-secondary dark:text-neutral-400 mb-4 leading-relaxed">
                        Built-in ad-blocking and tracker protection capabilities. Higher scores mean
                        better protection against ads and trackers.
                      </p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="font-medium text-amber-800 dark:text-amber-200 mb-2">
                            Benefits of Native Blocking:
                          </div>
                          <div className="space-y-1 text-amber-700 dark:text-amber-300">
                            <div>• Faster page loading</div>
                            <div>• Reduced bandwidth usage</div>
                            <div>• Better battery life</div>
                          </div>
                        </div>
                        <div>
                          <div className="font-medium text-amber-800 dark:text-amber-200 mb-2">
                            Security Advantages:
                          </div>
                          <div className="space-y-1 text-amber-700 dark:text-amber-300">
                            <div>• Tracking prevention</div>
                            <div>• Ad-blocking</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
