'use client';

import { track } from '@vercel/analytics/react';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

function getBrowserInitials(name) {
  const words = String(name ?? '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (words.length > 1) return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
  return words[0]?.slice(0, 2).toUpperCase() ?? '?';
}

export default function QuizResultCard({ browser, size = 'runner-up', headingLevel = 2 }) {
  const [expandedHighlights, setExpandedHighlights] = useState(false);
  const isHero = size === 'hero';
  const hasMatchPercentage = Number.isFinite(browser.matchPercentage);
  const BrowserHeading = headingLevel === 3 ? 'h3' : 'h2';

  return (
    <div
      className="rounded-lg transition-all duration-200"
      style={{
        backgroundColor: 'var(--surface-raised)',
        border: isHero ? '1px solid var(--color-brand)' : '1px solid var(--border-subtle)',
        padding: isHero ? '2rem' : '1.5rem',
        boxShadow: isHero ? 'var(--shadow-overlay)' : 'var(--shadow-raised)',
      }}
    >
      {browser.discontinued && (
        <div
          className="mb-4 flex items-start gap-2 text-xs sm:text-sm rounded-lg px-3 py-2"
          style={{
            backgroundColor: 'var(--color-warning-subtle)',
            border: '1px solid var(--color-warning)',
            color: 'var(--color-warning)',
          }}
        >
          <svg
            className="w-4 h-4 flex-shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <span>{browser.discontinuedNote}</span>
        </div>
      )}

      <div className="flex items-start gap-4">
        <div className={`flex-shrink-0 ${isHero ? 'w-16 h-16 sm:w-20 sm:h-20' : 'w-12 h-12'}`}>
          {browser.logo ? (
            <Image
              src={browser.logo}
              alt={browser.name}
              width={isHero ? 80 : 48}
              height={isHero ? 80 : 48}
              className="w-full h-full rounded-lg"
            />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center rounded-lg border border-(--border-subtle) bg-(--color-brand-subtle) text-lg font-bold text-(--text-brand) sm:text-xl"
              aria-hidden="true"
            >
              {getBrowserInitials(browser.name)}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <BrowserHeading
              className="font-bold"
              style={{
                color: 'var(--text-default)',
                fontSize: isHero ? '1.5rem' : '1.125rem',
              }}
            >
              {browser.slug ? (
                <Link
                  href={`/browsers/${browser.slug}`}
                  className="rounded hover:underline focus-visible:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--border-focused)"
                >
                  {browser.name}
                </Link>
              ) : (
                browser.name
              )}
            </BrowserHeading>
            {hasMatchPercentage && (
              <span
                className="inline-flex items-center font-bold rounded-full px-2 py-0.5"
                aria-describedby="quiz-match-score-explanation"
                style={{
                  fontSize: isHero ? '0.875rem' : '0.75rem',
                  backgroundColor: isHero ? 'var(--color-brand-subtle)' : 'var(--surface-sunken)',
                  color: isHero ? 'var(--text-brand)' : 'var(--text-default)',
                }}
              >
                {browser.matchPercentage}% match
              </span>
            )}
          </div>

          {isHero && hasMatchPercentage && (
            <p
              id="quiz-match-score-explanation"
              className="mt-3 text-xs leading-relaxed"
              style={{ color: 'var(--text-subtle)' }}
            >
              This fit score is based on the quiz’s strongest priorities and eligible browsers; it
              is not a probability or guarantee.
            </p>
          )}

          {browser.tagline && (
            <p
              className="mt-1"
              style={{
                color: 'var(--text-subtle)',
                fontSize: isHero ? '1rem' : '0.875rem',
              }}
            >
              {browser.tagline}
            </p>
          )}
          {isHero && browser.bestFor && (
            <p className="mt-2 text-sm font-medium" style={{ color: 'var(--text-brand)' }}>
              Best for: {browser.bestFor}
            </p>
          )}
        </div>
      </div>

      {isHero && browser.highlights && browser.highlights.length > 0 && (
        <ul className="mt-5 space-y-2" role="list">
          {browser.highlights.map((h, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-sm"
              style={{ color: 'var(--text-subtle)' }}
            >
              <svg
                className="w-4 h-4 flex-shrink-0 mt-0.5"
                style={{ color: 'var(--color-brand)' }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              {h}
            </li>
          ))}
        </ul>
      )}

      {!isHero && browser.highlights && browser.highlights.length > 0 && (
        <div className="mt-3">
          <button
            onClick={() => setExpandedHighlights((v) => !v)}
            aria-expanded={expandedHighlights}
            className="rounded text-xs text-(--text-brand) hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--border-focused)"
          >
            {expandedHighlights ? 'Hide details' : 'Why this one?'}
          </button>
          {expandedHighlights && (
            <ul className="mt-2 space-y-1.5" role="list">
              {browser.highlights.map((h, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-xs"
                  style={{ color: 'var(--text-subtle)' }}
                >
                  <svg
                    className="w-3.5 h-3.5 flex-shrink-0 mt-0.5"
                    style={{ color: 'var(--color-brand)' }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {h}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {isHero && (
        <div className="mt-6 flex flex-wrap gap-3">
          {browser.website && !browser.discontinued && (
            <a
              href={browser.website}
              onClick={() => track('quiz_outbound_click', { browser_id: browser.id })}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md bg-(--color-brand) px-5 py-2.5 text-sm font-semibold text-(--text-inverse) transition-colors duration-200 hover:bg-(--color-brand-bold) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--border-focused)"
            >
              Visit Website
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          )}
          <Link
            href="/#rankings"
            className="inline-flex items-center gap-2 rounded-md bg-(--surface-sunken) px-5 py-2.5 text-sm font-medium text-(--text-default) transition-colors duration-200 hover:bg-(--surface-hovered) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--border-focused)"
          >
            View Rankings
          </Link>
        </div>
      )}
    </div>
  );
}
