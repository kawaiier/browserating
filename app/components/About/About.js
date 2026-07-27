'use client';

import { useState } from 'react';
import { Apple, AppWindow, ArrowRight, BarChart3, Bot, Brain, Check, FlaskConical, Laptop, Lightbulb, Shield, Sparkles, Tablet, Target, TriangleAlert, Zap } from 'lucide-react';

export default function About() {
  const [activeSection, setActiveSection] = useState('methodology');
  const [expandedSystem, setExpandedSystem] = useState(null);

  const systemConfigs = [
    {
      id: 'macos-silicon',
      title: 'macOS (Apple Silicon)',
      icon: Apple,
      gradient: 'from-blue-500 to-purple-500',
      specs: {
        os: 'macOS Tahoe 26.5.2',
        device: '14-inch MacBook Pro (2023)',
        processor: 'M3 Pro',
        memory: '36 GB RAM',
        highlights: ['Apple Silicon', 'Latest macOS', 'High Performance'],
      },
    },
    {
      id: 'macos-intel',
      title: 'macOS (Intel)',
      icon: Laptop,
      gradient: 'from-gray-500 to-blue-500',
      specs: {
        os: 'macOS Ventura 13.6.9',
        device: '15-inch MacBook Pro (2019)',
        processor: '2.3 GHz 8-core Intel Core i9',
        memory: '16 GB RAM',
        highlights: ['Intel Architecture', 'Stable Release', 'Professional Grade'],
      },
    },
    {
      id: 'windows',
      title: 'Windows',
      icon: AppWindow,
      gradient: 'from-blue-600 to-cyan-500',
      specs: {
        os: 'Windows 10 Pro',
        device: 'Lenovo Ideapad Gaming 3',
        processor: 'AMD Ryzen 5 5600H with Radeon Graphics 3.3 GHz',
        memory: '16 GB RAM',
        highlights: ['Gaming Laptop', 'AMD Architecture', 'Real-world Setup'],
      },
    },
    {
      id: 'android',
      title: 'Android',
      icon: Bot,
      gradient: 'from-green-500 to-emerald-500',
      specs: {
        os: 'Nothing OS 2.6 (Android 14)',
        device: 'Nothing Phone (2a)',
        processor: 'Dimensity 7200 Pro CPU with Mali-G610 MC4 GPU',
        memory: '8 GB RAM',
        highlights: ['Modern Android', 'Mid-range Performance', 'Custom OS'],
      },
    },
    {
      id: 'ipad',
      title: 'iPad',
      icon: Tablet,
      gradient: 'from-purple-500 to-pink-500',
      specs: {
        os: 'iPadOS 18.5',
        device: 'iPad Mini 7th Generation',
        processor: 'A17 Pro CPU',
        memory: '8 GB RAM',
        highlights: ['Latest iPadOS', 'Pro Chip', 'Compact Form Factor'],
      },
    },
  ];

  const testingSteps = [
    {
      icon: Zap,
      title: 'Speedometer 3.1 Benchmark',
      description:
        'Five tests conducted per browser, eliminating best and worst results, averaging the middle three for accuracy.',
      details:
        'The benchmark tests a wide range of JavaScript frameworks and technologies, including TodoMVC implementations (using vanilla JavaScript, Web Components, React, Angular, Vue, jQuery, Preact, Svelte, and Lit), code and rich text editors (CodeMirror, TipTap), and charting libraries (observable-plot, chartjs, React-Stockcharts-SVG, Perf-Dashboard). It also includes workloads that mimic browsing a typical news site, testing how well a browser handles large DOM and CSSOM changes during navigation.',
    },
    {
      icon: Brain,
      title: 'Memory Usage Analysis',
      description:
        'Cumulative RAM consumption measured across seven diverse websites including IGN, ESPN, Figma, and Reddit.',
      details:
        'Memory tracking via Activity Monitor provides real-world usage patterns rather than theoretical limits. All processes RAM usage is summed up to get the total RAM usage.',
    },
    {
      icon: Shield,
      title: 'Ad-Blocking Effectiveness',
      description:
        'Comprehensive testing using AdBlock Tester to evaluate built-in and extension-based blocking capabilities.',
      details:
        'Tests various ad types including display ads, video ads, trackers, and social media widgets.',
    },
  ];

  const scoreGuide = [
    {
      metric: 'Speedometer 3.1',
      description: 'Higher scores indicate faster JavaScript and DOM performance',
      scale: '0-100+',
      good: '40+',
      average: '25-40',
      poor: '<25',
      color: 'var(--color-information)',
    },
    {
      metric: 'RAM Usage',
      description: 'Lower values indicate more efficient memory management',
      scale: 'MB',
      good: '<500MB',
      average: '500-1000MB',
      poor: '>1000MB',
      color: 'var(--color-success)',
    },
    {
      metric: 'Ad Blocking',
      description: 'Higher scores indicate better ad-blocking capabilities',
      scale: '0-100%',
      good: '80-100%',
      average: '50-80%',
      poor: '<50%',
      color: 'var(--color-brand)',
    },
  ];

  const sections = [
    { id: 'methodology', label: 'Testing Methodology', icon: FlaskConical },
    { id: 'systems', label: 'Test Systems', icon: Laptop },
    { id: 'scores', label: 'Score Guide', icon: BarChart3 },
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
          className="text-3xl md:text-4xl font-bold mb-4"
          style={{ color: 'var(--text-brand)' }}
        >
          Testing Methodology & Systems
        </h2>
        <p className="text-lg max-w-3xl mx-auto" style={{ color: 'var(--text-subtle)' }}>
          Transparent, consistent, and thorough testing across multiple platforms to give you
          reliable browser performance insights you can trust.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className="flex items-center gap-2 px-6 py-3 rounded-md font-medium transition-all duration-300"
            style={{
              backgroundColor:
                activeSection === section.id ? 'var(--color-brand)' : 'var(--surface-sunken)',
              color:
                activeSection === section.id ? 'var(--text-inverse)' : 'var(--text-default)',
            }}
            onMouseEnter={(e) => {
              if (activeSection !== section.id) {
                e.currentTarget.style.backgroundColor = 'var(--surface-hovered)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeSection !== section.id) {
                e.currentTarget.style.backgroundColor = 'var(--surface-sunken)';
              }
            }}
          >
            <span className="text-lg"><section.icon className="w-5 h-5" aria-hidden="true" /></span>
            {section.label}
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
        {/* Testing Methodology */}
        {activeSection === 'methodology' && (
          <div className="p-4 sm:p-8">
            <div className="grid gap-8">
              {testingSteps.map((step, index) => (
                <div key={index} className="group">
                  <div
                    className="flex flex-col items-center sm:flex-row sm:items-start gap-4 p-6 rounded-lg transition-all duration-300"
                    style={{
                      backgroundColor: 'var(--surface-sunken)',
                      border: '1px solid var(--border-subtle)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = 'var(--shadow-overlay)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div className="flex-shrink-0">
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl font-bold"
                        style={{ backgroundColor: 'var(--color-brand)' }}
                      >
                        <step.icon className="w-5 h-5" aria-hidden="true" />
                      </div>
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                      <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-default)' }}>
                        {step.title}
                      </h3>
                      <p className="mb-3 leading-relaxed" style={{ color: 'var(--text-subtle)' }}>
                        {step.description}
                      </p>
                      <details className="group-details">
                        <summary
                          className="cursor-pointer font-medium"
                          style={{ color: 'var(--text-brand)' }}
                        >
                          Technical Details <ArrowRight className="inline w-3.5 h-3.5" aria-hidden="true" />
                        </summary>
                        <p
                          className="mt-3 text-sm rounded-lg p-4"
                          style={{
                            backgroundColor: 'var(--surface-sunken)',
                            color: 'var(--text-subtle)',
                          }}
                        >
                          {step.details}
                        </p>
                      </details>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Key Points */}
            <div
              className="mt-8 rounded-lg p-6"
              style={{
                backgroundColor: 'var(--color-information-subtle)',
                border: '1px solid var(--color-information-subtle)',
              }}
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-default)' }}>
                <Sparkles className="w-6 h-6" aria-hidden="true" />
                Why Our Testing Matters
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-start gap-2">
                  <Check className="mt-1 w-4 h-4" style={{ color: 'var(--color-success)' }} aria-hidden="true" />
                  <span style={{ color: 'var(--text-subtle)' }}>
                    Consistent testing environment across all browsers
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="mt-1 w-4 h-4" style={{ color: 'var(--color-success)' }} aria-hidden="true" />
                  <span style={{ color: 'var(--text-subtle)' }}>
                    Statistical accuracy through multiple test runs
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="mt-1 w-4 h-4" style={{ color: 'var(--color-success)' }} aria-hidden="true" />
                  <span style={{ color: 'var(--text-subtle)' }}>
                    Real-world scenarios and websites
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Test Systems */}
        {activeSection === 'systems' && (
          <div className="p-4 sm:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {systemConfigs.map((system) => (
                <div
                  key={system.id}
                  className={`group cursor-pointer transition-all duration-300 ${
                    expandedSystem === system.id ? 'lg:col-span-2' : ''
                  }`}
                  onClick={() => setExpandedSystem(expandedSystem === system.id ? null : system.id)}
                >
                  <div
                    className="rounded-lg p-6 h-full"
                    style={{
                      backgroundColor: 'var(--surface-raised)',
                      border: '1px solid var(--border-subtle)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border-default)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border-subtle)';
                    }}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <system.icon className="w-8 h-8" aria-hidden="true" />
                      <div>
                        <h3 className="text-xl font-bold" style={{ color: 'var(--text-default)' }}>
                          {system.title}
                        </h3>
                        <p className="text-sm" style={{ color: 'var(--text-subtle)' }}>
                          Click to {expandedSystem === system.id ? 'collapse' : 'expand'} details
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-0.5 sm:gap-4">
                        <span className="shrink-0" style={{ color: 'var(--text-subtle)' }}>
                          Operating System:
                        </span>
                        <span className="font-medium sm:text-right" style={{ color: 'var(--text-default)' }}>
                          {system.specs.os}
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-0.5 sm:gap-4">
                        <span style={{ color: 'var(--text-subtle)' }}>Device:</span>
                        <span className="font-medium sm:text-right" style={{ color: 'var(--text-default)' }}>
                          {system.specs.device}
                        </span>
                      </div>

                      {expandedSystem === system.id && (
                        <div
                          className="mt-4 pt-4 space-y-3"
                          style={{ borderTop: '1px solid var(--border-subtle)' }}
                        >
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-0.5 sm:gap-4">
                            <span style={{ color: 'var(--text-subtle)' }}>Processor:</span>
                            <span className="font-medium sm:text-right" style={{ color: 'var(--text-default)' }}>
                              {system.specs.processor}
                            </span>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-0.5 sm:gap-4">
                            <span style={{ color: 'var(--text-subtle)' }}>Memory:</span>
                            <span className="font-medium sm:text-right" style={{ color: 'var(--text-default)' }}>
                              {system.specs.memory}
                            </span>
                          </div>

                          <div className="mt-4">
                            <h4 className="text-sm font-semibold mb-2" style={{ color: 'var(--text-default)' }}>
                              Key Features:
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {system.specs.highlights.map((highlight, index) => (
                                <span
                                  key={index}
                                  className="px-3 py-1 text-xs font-medium rounded-full text-white"
                                  style={{ backgroundColor: 'var(--color-brand)' }}
                                >
                                  {highlight}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div
              className="mt-8 rounded-lg p-6"
              style={{
                backgroundColor: 'var(--color-warning-subtle)',
                border: '1px solid var(--color-warning)',
              }}
            >
              <div className="flex items-start gap-3">
                <TriangleAlert className="w-6 h-6" aria-hidden="true" />
                <div>
                  <h3 className="font-semibold mb-2" style={{ color: 'var(--color-warning)' }}>
                    Important Testing Notes
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--color-warning)' }}>
                    Performance results may vary based on your specific hardware configuration,
                    operating system version, installed extensions, and system load. These tests
                    represent controlled conditions and should be used as relative comparisons
                    rather than absolute benchmarks.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Score Guide */}
        {activeSection === 'scores' && (
          <div className="p-4 sm:p-8">
            <div className="mb-6">
              <div
                className="rounded-lg p-6"
                style={{
                  backgroundColor: 'var(--color-brand-subtle)',
                  border: '1px solid var(--color-brand-subtle)',
                }}
              >
                <h3 className="text-xl font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--text-default)' }}>
                  <Target className="w-6 h-6" aria-hidden="true" />
                  Understanding Performance Metrics
                </h3>
                <p className="leading-relaxed" style={{ color: 'var(--text-subtle)' }}>
                  <strong style={{ color: 'var(--text-brand)' }}>
                    Higher Speedometer scores = Faster browser performance.
                  </strong>{' '}
                  Our comprehensive testing evaluates multiple aspects of browser performance to
                  give you a complete picture.
                </p>
              </div>
            </div>

            <div className="grid gap-6">
              {scoreGuide.map((metric, index) => (
                <div
                  key={index}
                  className="rounded-lg p-6"
                  style={{
                    backgroundColor: 'var(--surface-sunken)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div className="flex flex-col items-center sm:flex-row sm:items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${metric.color}20`, color: metric.color }}
                    >
                      <span className="text-xl font-bold">
                        {index === 0 ? (
                          <Zap className="w-5 h-5" aria-hidden="true" />
                        ) : index === 1 ? (
                          <Brain className="w-5 h-5" aria-hidden="true" />
                        ) : (
                          <Shield className="w-5 h-5" aria-hidden="true" />
                        )}
                      </span>
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                      <h4 className="text-lg font-semibold mb-2" style={{ color: metric.color }}>
                        {metric.metric}
                      </h4>
                      <p className="mb-4" style={{ color: 'var(--text-subtle)' }}>{metric.description}</p>

                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="font-medium" style={{ color: 'var(--text-default)' }}>
                            Scale:
                          </span>
                          <div style={{ color: 'var(--text-subtle)' }}>{metric.scale}</div>
                        </div>
                        <div>
                          <span className="font-medium" style={{ color: 'var(--color-success)' }}>
                            Excellent:
                          </span>
                          <div style={{ color: 'var(--text-subtle)' }}>{metric.good}</div>
                        </div>
                        <div>
                          <span className="font-medium" style={{ color: 'var(--color-score-fair)' }}>
                            Average:
                          </span>
                          <div style={{ color: 'var(--text-subtle)' }}>{metric.average}</div>
                        </div>
                        <div>
                          <span className="font-medium" style={{ color: 'var(--color-danger)' }}>
                            Needs Improvement:
                          </span>
                          <div style={{ color: 'var(--text-subtle)' }}>{metric.poor}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div
              className="mt-8 rounded-lg p-6"
              style={{
                backgroundColor: 'var(--color-success-subtle)',
                border: '1px solid var(--color-success-subtle)',
              }}
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-default)' }}>
                <Lightbulb className="w-6 h-6" aria-hidden="true" />
                Pro Tips for Interpreting Results
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-start gap-2">
                  <ArrowRight className="mt-1 w-4 h-4" style={{ color: 'var(--color-information)' }} aria-hidden="true" />
                  <span style={{ color: 'var(--text-subtle)' }}>
                    Focus on consistent performance across metrics rather than just peak scores
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <ArrowRight className="mt-1 w-4 h-4" style={{ color: 'var(--color-information)' }} aria-hidden="true" />
                  <span style={{ color: 'var(--text-subtle)' }}>
                    Consider your specific use case: gaming, productivity, or general browsing
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <ArrowRight className="mt-1 w-4 h-4" style={{ color: 'var(--color-information)' }} aria-hidden="true" />
                  <span style={{ color: 'var(--text-subtle)' }}>Balance performance with features that matter to you</span>
                </div>
                <div className="flex items-start gap-2">
                  <ArrowRight className="mt-1 w-4 h-4" style={{ color: 'var(--color-information)' }} aria-hidden="true" />
                  <span style={{ color: 'var(--text-subtle)' }}>Remember that browser updates can significantly impact performance</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
