'use client';

import DarkModeToggle from './DarkModeToggle';
import Image from 'next/image';
import Link from 'next/link';
import { useDarkMode } from './DarkModeProvider';

export default function Header({ lastModified }) {
  const { darkMode, toggleDarkMode } = useDarkMode();

  const lastModifiedFormatted = lastModified
    ? new Date(lastModified + 'T00:00:00').toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <header
      className="surface-default border-b"
      style={{ borderColor: 'var(--border-subtle)' }}
      role="banner"
    >
      {/* Top Bar */}
      <div
        className="border-b"
        style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--surface-sunken)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full animate-pulse-subtle"
              style={{ backgroundColor: 'var(--color-success)' }}
            ></div>
            <span className="body-small" style={{ color: 'var(--text-subtle)' }}>
              Last updated:{' '}
              <time dateTime={lastModified} className="font-medium">
                {lastModifiedFormatted || 'Loading...'}
              </time>
            </span>
          </div>
          <DarkModeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        </div>
      </div>

      {/* Main Header Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          {/* Logo and Title */}
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <Link href="/" aria-label="BrowseRating Home" className="shrink-0">
                <Image
                  src="/images/logo.png"
                  alt="BrowseRating Logo"
                  width={180}
                  height={48}
                  className="h-12 w-auto"
                  priority
                />
              </Link>
            </div>

            <h1 className="heading-xlarge sm:heading-xxlarge" style={{ color: 'var(--text-default)' }}>
              Browser Performance Rankings
            </h1>
            <p className="body-large mt-3" style={{ color: 'var(--text-subtle)', maxWidth: '600px' }}>
              Compare browser performance across macOS, Windows, Android, and iPad using
              industry-standard Speedometer 3.1 benchmarks.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="flex gap-6 lg:gap-8">
            <div className="text-center">
              <div className="metric-medium" style={{ color: 'var(--text-brand)' }}>
                64+
              </div>
              <div className="body-small mt-1" style={{ color: 'var(--text-subtle)' }}>
                Browsers Tested
              </div>
            </div>
            <div
              className="w-px"
              style={{ backgroundColor: 'var(--border-subtle)' }}
            ></div>
            <div className="text-center">
              <div className="metric-medium" style={{ color: 'var(--text-brand)' }}>
                5
              </div>
              <div className="body-small mt-1" style={{ color: 'var(--text-subtle)' }}>
                Platforms
              </div>
            </div>
            <div
              className="w-px"
              style={{ backgroundColor: 'var(--border-subtle)' }}
            ></div>
            <div className="text-center">
              <div className="metric-medium" style={{ color: 'var(--text-brand)' }}>
                Monthly
              </div>
              <div className="body-small mt-1" style={{ color: 'var(--text-subtle)' }}>
                Updates
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="flex flex-wrap gap-3 mt-8 pt-8" style={{ borderTop: '1px solid var(--border-subtle)' }}>
          <a
            href="#rankings"
            className="inline-flex items-center gap-2 px-4 py-2 btn-atlantic font-medium transition-all"
            style={{
              backgroundColor: 'var(--color-brand)',
              color: 'var(--text-inverse)',
              fontSize: 'var(--font-body)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-brand-bold)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-brand)';
            }}
          >
            <span>View Rankings</span>
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
            className="inline-flex items-center gap-2 px-4 py-2 btn-atlantic-secondary font-medium transition-all"
            style={{
              backgroundColor: 'transparent',
              color: 'var(--text-brand)',
              border: '1.5px solid var(--border-brand)',
              fontSize: 'var(--font-body)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-brand-subtle)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <span>Find Your Browser</span>
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: 'var(--color-warning-subtle)',
                color: 'var(--color-warning)',
              }}
            >
              Beta
            </span>
          </Link>

          <a
            href="#methodology"
            className="inline-flex items-center gap-2 px-4 py-2 btn-atlantic font-medium transition-all"
            style={{
              backgroundColor: 'transparent',
              color: 'var(--text-subtle)',
              fontSize: 'var(--font-body)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--surface-hovered)';
              e.currentTarget.style.color = 'var(--text-default)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--text-subtle)';
            }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Learn More</span>
          </a>
        </div>
      </div>
    </header>
  );
}
