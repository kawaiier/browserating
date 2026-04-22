'use client';

import { useEffect, useState } from 'react';

import DarkModeToggle from './DarkModeToggle';
import Link from 'next/link';

export default function Header({ lastModified }) {
  const [scrolled, setScrolled] = useState(false);

  const platforms = [
    { name: 'macOS', icon: '🍎' },
    { name: 'Windows', icon: '🪟' },
    { name: 'Android', icon: '🤖' },
    { name: 'iPad', icon: '📱' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const lastModifiedFormatted = lastModified
    ? new Date(lastModified + 'T00:00:00').toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <>
      {/* Sticky Top Navigation */}
      <nav
        className={`sticky top-0 z-50 h-16 lg:h-[72px] border-b transition-all duration-200 ${
          scrolled ? 'bg-surface/95 backdrop-blur-sm shadow-sm' : 'bg-canvas border-transparent'
        } border-subtle`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="container mx-auto px-4 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full gap-4">
            {/* Logo - Left */}
            <Link
              href="/"
              className="flex items-center gap-2 text-primary hover:text-accent-primary transition-colors focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 rounded-radius-pill"
              aria-label="BrowseRating Home"
            >
              <div className="px-3 py-1.5 lg:px-4 border-2 border-neutral-800 rounded-radius-pill flex items-center gap-2">
                <div className="w-6 h-6 lg:w-7 lg:h-7 bg-neutral-900 rounded-radius-sm flex items-center justify-center">
                  <span className="text-white font-bold text-xs lg:text-sm">BR</span>
                </div>
                <span className="font-semibold text-sm lg:text-lg text-neutral-900 hidden sm:block">
                  BrowseRating
                </span>
              </div>
            </Link>

            {/* Primary Nav Links - Center/Left */}
            <div className="hidden md:flex items-center gap-1">
              <Link
                href="#rankings"
                className="px-4 py-2 text-secondary hover:text-primary hover:bg-surface-subtle rounded-radius-pill transition-all text-sm font-medium"
              >
                Rankings
              </Link>
              <Link
                href="#methodology"
                className="px-4 py-2 text-secondary hover:text-primary hover:bg-surface-subtle rounded-radius-pill transition-all text-sm font-medium"
              >
                Methodology
              </Link>
              <Link
                href="/quiz"
                className="px-4 py-2 text-secondary hover:text-primary hover:bg-surface-subtle rounded-radius-pill transition-all text-sm font-medium"
              >
                Find Your Browser
              </Link>
            </div>

            {/* Right: Utilities */}
            <div className="flex items-center gap-2">
              <DarkModeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Block */}
      <header className="bg-canvas px-4 lg:px-8 py-12 lg:py-16 bg-gradient-to-tr from-transparent via-transparent to-[#F5C400]/20" role="banner">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left: Content (7 columns) */}
            <div className="lg:col-span-7">
              {/* Eyebrow */}
              <div className="mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-muted bg-surface border border-subtle rounded-full">
                  <span className="w-1.5 h-1.5 bg-accent-primary rounded-full"></span>
                  Speedometer 3.1 Benchmark
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary mb-4 leading-tight">
                Browser Performance Rankings
              </h1>

              {/* Subtitle */}
              <p className="text-lg text-secondary mb-8 max-w-xl leading-relaxed">
                Independent browser performance benchmarks across all major platforms, updated
                monthly with real-world testing data.
              </p>

              {/* Metrics Row */}
              <div className="flex flex-wrap gap-6 mb-8">
                <div>
                  <div className="text-5xl lg:text-6xl font-extrabold text-neutral-900">64+</div>
                  <div className="text-sm text-muted">Browsers Tested</div>
                </div>
                <div className="w-px h-12 bg-border-subtle"></div>
                <div>
                  <div className="text-5xl lg:text-6xl font-extrabold text-neutral-900">5</div>
                  <div className="text-sm text-muted">Platforms</div>
                </div>
                <div className="w-px h-12 bg-border-subtle"></div>
                <div>
                  <div className="text-5xl lg:text-6xl font-extrabold text-neutral-900">Monthly</div>
                  <div className="text-sm text-muted">Update Cadence</div>
                </div>
              </div>

              {/* Platform Showcase */}
              <div className="mb-8">
                <div className="flex flex-wrap gap-2">
                  {platforms.map((platform) => (
                    <span
                      key={platform.name}
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-secondary bg-surface border border-subtle rounded-radius-md"
                    >
                      <span>{platform.icon}</span>
                      {platform.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Row */}
              <div className="flex flex-wrap gap-3 mb-8">
                <a
                  href="#rankings"
                  className="inline-flex items-center gap-2 bg-accent-primary hover:bg-accent-primary-hover text-surface font-medium px-6 py-3 rounded-radius-md shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-canvas"
                >
                  View Rankings
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </a>
                <Link
                  href="/quiz"
                  className="inline-flex items-center gap-2 bg-surface border border-subtle hover:border-accent-primary hover:text-accent-primary text-primary font-medium px-6 py-3 rounded-radius-md transition-all focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-canvas"
                >
                  Find Your Browser
                  <span className="text-xs font-semibold px-1.5 py-0.5 bg-accent-primary text-surface rounded">
                    Beta
                  </span>
                </Link>
                <a
                  href="#methodology"
                  className="inline-flex items-center gap-2 text-secondary hover:text-primary font-medium px-4 py-3 rounded-radius-md transition-all focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-canvas"
                >
                  Learn More
                </a>
              </div>

              {/* Meta Row */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                  <span className="text-secondary">Last updated:</span>
                  <time dateTime={lastModified} className="font-mono font-medium text-primary">
                    {lastModifiedFormatted}
                  </time>
                </div>
                <span className="text-muted">|</span>
                <div className="flex items-center gap-2">
                  <span className="text-secondary">Next update:</span>
                  <time dateTime="2026-03-22" className="font-mono font-medium text-primary">
                    ~ March 22, 2026
                  </time>
                </div>
              </div>
            </div>

            {/* Right: Summary Stat Card (5 columns) */}
            <div className="lg:col-span-5">
              <div className="bg-surface border border-subtle rounded-radius-lg p-6 shadow-sm">
                <h2 className="text-sm font-medium text-muted uppercase tracking-wide mb-4">
                  Top Benchmark Score
                </h2>
                
                {/* Circular Gauge */}
                <div className="flex items-center justify-center mb-4">
                  <div className="relative w-40 h-40">
                    {/* Background circle */}
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                      <circle
                        cx="60"
                        cy="60"
                        r="52"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        className="text-border-subtle"
                      />
                      {/* Progress circle - amber fill */}
                      <circle
                        cx="60"
                        cy="60"
                        r="52"
                        fill="none"
                        stroke="#D4A800"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray="326.73"
                        strokeDashoffset="45.74"
                        className="drop-shadow-sm"
                      />
                    </svg>
                    {/* Score in center */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-extrabold text-neutral-900">47.5</span>
                      <span className="text-xs text-muted">Speedometer 3.1</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-xs text-muted text-center">
                  Highest score among all tested browsers
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
