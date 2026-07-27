'use client';

import React, { useState } from 'react';
import { BarChart3, BookOpen, Brain, Check, Clock, FlaskConical, Globe, Laptop, Lightbulb, Scale, Shield, Target, TriangleAlert, Zap } from 'lucide-react';

const StatCard = ({ icon: Icon, number, label, description }) => (
  <div
    className="rounded-lg p-6 transition-all duration-300 group"
    style={{
      backgroundColor: 'var(--surface-raised)',
      border: '1px solid var(--border-subtle)',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.boxShadow = 'var(--shadow-overlay)';
      e.currentTarget.style.borderColor = 'var(--border-default)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.boxShadow = 'none';
      e.currentTarget.style.borderColor = 'var(--border-subtle)';
    }}
  >
    <div className="flex flex-col items-center sm:flex-row sm:items-start gap-4 mb-3">
      <div
        className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl"
        style={{ backgroundColor: 'var(--color-brand)' }}
      >
        <Icon className="w-6 h-6" aria-hidden="true" />
      </div>
      <div className="text-center sm:text-left">
        <div
          className="text-2xl font-bold transition-colors"
          style={{ color: 'var(--text-default)' }}
        >
          {number}
        </div>
        <div className="text-sm font-medium" style={{ color: 'var(--text-subtle)' }}>
          {label}
        </div>
      </div>
    </div>
    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-subtle)' }}>
      {description}
    </p>
  </div>
);

const FeatureCard = ({ icon: Icon, title, description, highlights }) => (
  <div
    className="rounded-lg p-6 transition-all duration-300"
    style={{
      backgroundColor: 'var(--surface-sunken)',
      border: '1px solid var(--border-subtle)',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.borderColor = 'var(--border-default)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.borderColor = 'var(--border-subtle)';
    }}
  >
    <div className="flex flex-col items-center sm:flex-row sm:items-start gap-4">
      <div
        className="w-10 h-10 rounded-md flex items-center justify-center text-white text-lg flex-shrink-0"
        style={{ backgroundColor: 'var(--color-brand)' }}
      >
        <Icon className="w-5 h-5" aria-hidden="true" />
      </div>
      <div className="flex-1 text-center sm:text-left">
        <h3 className="font-semibold mb-2" style={{ color: 'var(--text-default)' }}>
          {title}
        </h3>
        <p className="text-sm mb-3 leading-relaxed" style={{ color: 'var(--text-subtle)' }}>
          {description}
        </p>
        {highlights && (
          <div className="space-y-2 inline-flex flex-col items-start">
            {highlights.map((highlight, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: 'var(--color-brand)' }}
                ></div>
                <span style={{ color: 'var(--text-subtle)' }}>{highlight}</span>
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
    { id: 'story', label: 'Our Story', icon: BookOpen },
    { id: 'methodology', label: 'How We Test', icon: FlaskConical },
    { id: 'metrics', label: 'What We Measure', icon: BarChart3 },
  ];

  const testingFeatures = [
    {
      icon: Zap,
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
      icon: Brain,
      title: 'Memory Analysis',
      description:
        'Comprehensive RAM usage monitoring across diverse website loads to understand real-world memory consumption patterns.',
      highlights: ['Multi-site testing scenario', 'System-level memory tracking'],
    },
    {
      icon: Shield,
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
          className="text-3xl md:text-4xl font-bold mb-4"
          style={{ color: 'var(--text-brand)' }}
        >
          Why BrowseRating Exists
        </h2>
        <p className="text-lg max-w-3xl mx-auto" style={{ color: 'var(--text-subtle)' }}>
          The definitive source for unbiased browser performance data, helping millions make
          informed choices about their browsing experience.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <StatCard
          icon={Globe}
          number="64+"
          label="Browsers Tested"
          description="Comprehensive coverage of major browsers across all platforms"
        />
        <StatCard
          icon={Laptop}
          number="5"
          label="Platforms"
          description="macOS, Windows, Android, iPad testing environments"
        />
        <StatCard
          icon={BarChart3}
          number="2K+"
          label="Test Runs"
          description="Statistical accuracy through extensive testing cycles"
        />
        <StatCard
          icon={Clock}
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
            className="flex items-center gap-2 px-6 py-3 rounded-md font-medium transition-all duration-300"
            style={{
              backgroundColor: activeTab === tab.id ? 'var(--color-brand)' : 'var(--surface-sunken)',
              color: activeTab === tab.id ? 'var(--text-inverse)' : 'var(--text-default)',
            }}
            onMouseEnter={(e) => {
              if (activeTab !== tab.id) {
                e.currentTarget.style.backgroundColor = 'var(--surface-hovered)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== tab.id) {
                e.currentTarget.style.backgroundColor = 'var(--surface-sunken)';
              }
            }}
          >
            <span className="text-lg"><tab.icon className="w-5 h-5" aria-hidden="true" /></span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Sections */}
      <div
        className="rounded-lg overflow-hidden"
        style={{
          backgroundColor: 'var(--surface-raised)',
          border: '1px solid var(--border-subtle)',
        }}
      >
        {/* Our Story */}
        {activeTab === 'story' && (
          <div className="p-4 sm:p-8">
            <div className="max-w-4xl mx-auto">
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <div
                  className="rounded-lg p-6 mb-8"
                  style={{
                    backgroundColor: 'var(--color-brand-subtle)',
                    border: '1px solid var(--color-brand-subtle)',
                  }}
                >
                  <h3
                    className="text-xl font-bold mb-3 flex items-center gap-2"
                    style={{ color: 'var(--text-default)' }}
                  >
                    <Lightbulb className="w-6 h-6" aria-hidden="true" />
                    From Curiosity to Community Resource
                  </h3>
                  <p className="leading-relaxed mb-0" style={{ color: 'var(--text-subtle)' }}>
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
                    <h3
                      className="text-xl font-semibold mb-4 flex items-center gap-2"
                      style={{ color: 'var(--text-default)' }}
                    >
                      <Target className="w-6 h-6" aria-hidden="true" />
                      Our Mission
                    </h3>
                    <p className="leading-relaxed" style={{ color: 'var(--text-subtle)' }}>
                      To provide transparent, unbiased browser performance data that empowers users
                      to make informed decisions. No marketing spin, no vendor bias—just pure
                      performance metrics tested under identical conditions across all major
                      platforms.
                    </p>
                  </div>
                  <div>
                    <h3
                      className="text-xl font-semibold mb-4 flex items-center gap-2"
                      style={{ color: 'var(--text-default)' }}
                    >
                      <Scale className="w-6 h-6" aria-hidden="true" />
                      Why Independence Matters
                    </h3>
                    <p className="leading-relaxed" style={{ color: 'var(--text-subtle)' }}>
                      Unlike browser vendors&apos; cherry-picked benchmarks or tech media&apos;s
                      sponsored content, our testing is completely independent. We purchase our own
                      hardware, run standardized tests, and publish complete methodologies alongside
                      every result.
                    </p>
                  </div>
                </div>

                <div
                  className="rounded-lg p-6"
                  style={{
                    backgroundColor: 'var(--color-warning-subtle)',
                    border: '1px solid var(--color-warning)',
                  }}
                >
                  <h3
                    className="text-lg font-semibold mb-3 flex items-center gap-2"
                    style={{ color: 'var(--color-warning)' }}
                  >
                    <TriangleAlert className="w-5 h-5" aria-hidden="true" />
                    Real-World Context
                  </h3>
                  <p
                    className="text-sm leading-relaxed mb-3"
                    style={{ color: 'var(--color-warning)' }}
                  >
                    While our benchmarks provide valuable comparative data, most modern browsers
                    deliver excellent performance for everyday use. The &quot;best&quot; browser
                    depends on your specific needs: privacy features, extension ecosystem, platform
                    integration, or development tools.
                  </p>
                  <p className="text-sm leading-relaxed mb-0" style={{ color: 'var(--color-warning)' }}>
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

            <div
              className="rounded-lg p-6"
              style={{
                backgroundColor: 'var(--color-success-subtle)',
                border: '1px solid var(--color-success-subtle)',
              }}
            >
              <h3
                className="text-lg font-semibold mb-4 flex items-center gap-2"
                style={{ color: 'var(--text-default)' }}
              >
                <FlaskConical className="w-6 h-6" aria-hidden="true" />
                Scientific Approach to Browser Testing
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-start gap-2">
                  <Check className="mt-1 w-4 h-4" style={{ color: 'var(--color-success)' }} aria-hidden="true" />
                  <div>
                    <div className="font-medium" style={{ color: 'var(--text-default)' }}>
                      Controlled Environment
                    </div>
                    <div style={{ color: 'var(--text-subtle)' }}>
                      Same OS installs, identical hardware
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="mt-1 w-4 h-4" style={{ color: 'var(--color-success)' }} aria-hidden="true" />
                  <div>
                    <div className="font-medium" style={{ color: 'var(--text-default)' }}>
                      Statistical Rigor
                    </div>
                    <div style={{ color: 'var(--text-subtle)' }}>
                      Multiple runs, outlier elimination
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="mt-1 w-4 h-4" style={{ color: 'var(--color-success)' }} aria-hidden="true" />
                  <div>
                    <div className="font-medium" style={{ color: 'var(--text-default)' }}>
                      Full Transparency
                    </div>
                    <div style={{ color: 'var(--text-subtle)' }}>
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
                <h3 className="text-2xl font-bold mb-3" style={{ color: 'var(--text-default)' }}>
                  What Each Metric Tells You
                </h3>
                <p className="max-w-2xl mx-auto leading-relaxed" style={{ color: 'var(--text-subtle)' }}>
                  Our testing goes beyond simple speed tests to give you a complete picture of
                  browser performance and capabilities.
                </p>
              </div>

              <div className="grid gap-6">
                <div
                  className="rounded-lg p-6"
                  style={{
                    backgroundColor: 'var(--color-information-subtle)',
                    border: '1px solid var(--color-information-subtle)',
                  }}
                >
                  <div className="flex flex-col items-center sm:flex-row sm:items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl font-bold"
                      style={{ backgroundColor: 'var(--color-information)' }}
                    >
                      <Zap className="w-6 h-6" aria-hidden="true" />
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                      <h4 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-default)' }}>
                        Speedometer 3.1 Performance
                      </h4>
                      <p className="mb-4 leading-relaxed" style={{ color: 'var(--text-subtle)' }}>
                        The gold standard for browser performance testing. Measures JavaScript
                        execution, DOM manipulation, and CSS styling through realistic web
                        application simulations.
                      </p>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div
                          className="text-center p-3 rounded-lg"
                          style={{ backgroundColor: 'var(--surface-raised)' }}
                        >
                          <div className="font-bold" style={{ color: 'var(--color-score-excellent)' }}>
                            40+
                          </div>
                          <div style={{ color: 'var(--text-subtle)' }}>Excellent</div>
                        </div>
                        <div
                          className="text-center p-3 rounded-lg"
                          style={{ backgroundColor: 'var(--surface-raised)' }}
                        >
                          <div className="font-bold" style={{ color: 'var(--color-score-fair)' }}>
                            25-40
                          </div>
                          <div style={{ color: 'var(--text-subtle)' }}>Good</div>
                        </div>
                        <div
                          className="text-center p-3 rounded-lg"
                          style={{ backgroundColor: 'var(--surface-raised)' }}
                        >
                          <div className="font-bold" style={{ color: 'var(--color-score-poor)' }}>
                            &lt;25
                          </div>
                          <div style={{ color: 'var(--text-subtle)' }}>Needs Work</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className="rounded-lg p-6"
                  style={{
                    backgroundColor: 'var(--color-success-subtle)',
                    border: '1px solid var(--color-success-subtle)',
                  }}
                >
                  <div className="flex flex-col items-center sm:flex-row sm:items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl font-bold"
                      style={{ backgroundColor: 'var(--color-success)' }}
                    >
                      <Brain className="w-6 h-6" aria-hidden="true" />
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                      <h4 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-default)' }}>
                        Memory Efficiency
                      </h4>
                      <p className="mb-4 leading-relaxed" style={{ color: 'var(--text-subtle)' }}>
                        Real-world RAM usage across diverse websites. Lower numbers mean better
                        efficiency and more room for other applications on your system.
                      </p>
                      <div
                        className="rounded-lg p-4"
                        style={{ backgroundColor: 'var(--surface-raised)' }}
                      >
                        <h5 className="font-medium mb-2" style={{ color: 'var(--color-success)' }}>
                          Factors That Affect Memory Usage:
                        </h5>
                        <div
                          className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm"
                          style={{ color: 'var(--text-subtle)' }}
                        >
                          <div>• Number of installed extensions</div>
                          <div>• Background tabs and processes</div>
                          <div>• Website complexity and media</div>
                          <div>• Operating system differences</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className="rounded-lg p-6"
                  style={{
                    backgroundColor: 'var(--color-brand-subtle)',
                    border: '1px solid var(--color-brand-subtle)',
                  }}
                >
                  <div className="flex flex-col items-center sm:flex-row sm:items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl font-bold"
                      style={{ backgroundColor: 'var(--color-brand)' }}
                    >
                      <Shield className="w-6 h-6" aria-hidden="true" />
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                      <h4 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-default)' }}>
                        Ad-blocking effectiveness
                      </h4>
                      <p className="mb-4 leading-relaxed" style={{ color: 'var(--text-subtle)' }}>
                        Built-in ad-blocking and tracker protection capabilities. Higher scores mean
                        better protection against ads and trackers.
                      </p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="font-medium mb-2" style={{ color: 'var(--text-brand)' }}>
                            Benefits of Native Blocking:
                          </div>
                          <div className="space-y-1" style={{ color: 'var(--text-subtle)' }}>
                            <div>• Faster page loading</div>
                            <div>• Reduced bandwidth usage</div>
                            <div>• Better battery life</div>
                          </div>
                        </div>
                        <div>
                          <div className="font-medium mb-2" style={{ color: 'var(--text-brand)' }}>
                            Security Advantages:
                          </div>
                          <div className="space-y-1" style={{ color: 'var(--text-subtle)' }}>
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
