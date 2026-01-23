'use client';

import React, { useState } from 'react';

const StatCard = ({ icon, number, label, description }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 group">
    <div className="flex items-center gap-4 mb-3">
      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center text-white text-xl">
        {icon}
      </div>
      <div>
        <div className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
          {number}
        </div>
        <div className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</div>
      </div>
    </div>
    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{description}</p>
  </div>
);

const FeatureCard = ({ icon, title, description, highlights }) => (
  <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-300">
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center text-white text-lg flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 leading-relaxed">
          {description}
        </p>
        {highlights && (
          <div className="space-y-2">
            {highlights.map((highlight, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                <span className="text-gray-600 dark:text-gray-400">{highlight}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
);

const TimelineItem = ({ phase, title, description, status, date }) => (
  <div className="flex gap-4">
    <div className="flex flex-col items-center">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
          status === 'completed'
            ? 'bg-green-500 text-white'
            : status === 'current'
              ? 'bg-purple-500 text-white'
              : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
        }`}
      >
        {phase}
      </div>
      <div className="w-0.5 h-16 bg-gray-200 dark:bg-gray-600 mt-2"></div>
    </div>
    <div className="pb-16">
      <div className="flex items-center gap-3 mb-2">
        <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            status === 'completed'
              ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
              : status === 'current'
                ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
          }`}
        >
          {status === 'completed' ? 'Completed' : status === 'current' ? 'In Progress' : 'Planned'}
        </span>
      </div>
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{description}</p>
      <span className="text-xs text-gray-500 dark:text-gray-500">{date}</span>
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

  const roadmapItems = [
    {
      phase: 1,
      title: 'Foundation & Core Testing',
      description:
        'Established testing methodology and infrastructure for consistent browser performance evaluation.',
      status: 'completed',
      date: 'Q1 2024',
    },
    {
      phase: 2,
      title: 'Multi-Platform Expansion',
      description:
        'Extended testing to cover macOS (Intel & Apple Silicon), Windows, Android, and iPad platforms.',
      status: 'completed',
      date: 'Q2 2024',
    },
    {
      phase: 3,
      title: 'Enhanced Metrics & Analysis',
      description:
        'Adding memory usage tracking, ad-blocking evaluation, and trend analysis across browser versions.',
      status: 'current',
      date: 'Q3 2024',
    },
    {
      phase: 4,
      title: 'Real-World Performance Tests',
      description:
        'Implementing website-specific performance tests and user experience metrics beyond synthetic benchmarks.',
      status: 'planned',
      date: 'Q4 2024',
    },
    {
      phase: 5,
      title: 'Community & API Access',
      description:
        'Public API for performance data and community-contributed testing scenarios and configurations.',
      status: 'planned',
      date: 'Q1 2025',
    },
  ];

  return (
    <section className="max-w-6xl mx-auto px-4 py-12 mt-16" aria-labelledby="explanation-heading">
      {/* Header */}
      <div className="text-center mb-12">
        <h2
          id="explanation-heading"
          className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent"
        >
          Why BrowseRating Exists
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          The definitive source for unbiased browser performance data, helping millions make
          informed choices about their browsing experience.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <StatCard
          icon="🌐"
          number="100+"
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
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg scale-105'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <span className="text-lg">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Sections */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Our Story */}
        {activeTab === 'story' && (
          <div className="p-8">
            <div className="max-w-4xl mx-auto">
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-6 mb-8 border border-purple-200 dark:border-purple-700">
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
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
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
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      Unlike browser vendors&apos; cherry-picked benchmarks or tech media&apos;s
                      sponsored content, our testing is completely independent. We purchase our own
                      hardware, run standardized tests, and publish complete methodologies alongside
                      every result.
                    </p>
                  </div>
                </div>

                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-6">
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
          <div className="p-8">
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

            <div className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
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
                    <div className="text-gray-600 dark:text-gray-400">
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
                    <div className="text-gray-600 dark:text-gray-400">
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
                    <div className="text-gray-600 dark:text-gray-400">
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
          <div className="p-8">
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  What Each Metric Tells You
                </h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
                  Our testing goes beyond simple speed tests to give you a complete picture of
                  browser performance and capabilities.
                </p>
              </div>

              <div className="grid gap-6">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white text-xl font-bold">
                      ⚡
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        Speedometer 3.1 Performance
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        The gold standard for browser performance testing. Measures JavaScript
                        execution, DOM manipulation, and CSS styling through realistic web
                        application simulations.
                      </p>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="text-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                          <div className="font-bold text-green-600 dark:text-green-400">40+</div>
                          <div className="text-gray-600 dark:text-gray-400">Excellent</div>
                        </div>
                        <div className="text-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                          <div className="font-bold text-yellow-600 dark:text-yellow-400">
                            25-40
                          </div>
                          <div className="text-gray-600 dark:text-gray-400">Good</div>
                        </div>
                        <div className="text-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                          <div className="font-bold text-red-600 dark:text-red-400">&lt;25</div>
                          <div className="text-gray-600 dark:text-gray-400">Needs Work</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-white text-xl font-bold">
                      🧠
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        Memory Efficiency
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
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

                <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white text-xl font-bold">
                      🛡️
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        Ad-blocking effectiveness
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        Built-in ad-blocking and tracker protection capabilities. Higher scores mean
                        better protection against ads and trackers.
                      </p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="font-medium text-purple-800 dark:text-purple-200 mb-2">
                            Benefits of Native Blocking:
                          </div>
                          <div className="space-y-1 text-purple-700 dark:text-purple-300">
                            <div>• Faster page loading</div>
                            <div>• Reduced bandwidth usage</div>
                            <div>• Better battery life</div>
                          </div>
                        </div>
                        <div>
                          <div className="font-medium text-purple-800 dark:text-purple-200 mb-2">
                            Security Advantages:
                          </div>
                          <div className="space-y-1 text-purple-700 dark:text-purple-300">
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

        {/* Roadmap */}
        {activeTab === 'roadmap' && (
          <div className="p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                The Future of Browser Testing
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
                We`&apos;`re constantly evolving our testing methodology and expanding our coverage
                to provide even more valuable insights for the browsing community.
              </p>
            </div>

            <div className="max-w-3xl mx-auto">
              {roadmapItems.map((item, index) => (
                <TimelineItem
                  key={index}
                  phase={item.phase}
                  title={item.title}
                  description={item.description}
                  status={item.status}
                  date={item.date}
                />
              ))}
            </div>

            <div className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-indigo-200 dark:border-indigo-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <span className="text-2xl">🤝</span>
                Join Our Mission
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                Help us build the most comprehensive browser performance database. Whether through
                feedback, suggestions, or supporting our testing infrastructure, every contribution
                makes our data more valuable for the entire community.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="#newsletter"
                  className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  📧 Get Updates
                </a>
                <a
                  href="#support"
                  className="inline-flex items-center gap-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  💝 Support Project
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
