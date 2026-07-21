'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function QuizResultCard({ browser, size = 'runner-up' }) {
  const [expandedHighlights, setExpandedHighlights] = useState(false);
  const isHero = size === 'hero';
  const hasMatchPercentage = Number.isFinite(browser.matchPercentage);

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
              className="w-full h-full rounded-lg"
              style={{ backgroundColor: 'var(--surface-sunken)' }}
            />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2
              className="font-bold"
              style={{
                color: 'var(--text-default)',
                fontSize: isHero ? '1.5rem' : '1.125rem',
              }}
            >
              {browser.name}
            </h2>
            {hasMatchPercentage && (
              <span
                className="inline-flex items-center font-bold rounded-full px-2 py-0.5"
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
            <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-subtle)' }}>
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
            className="text-xs hover:underline rounded"
            style={{ color: 'var(--text-brand)' }}
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
          {browser.website && (
            <a
              href={browser.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-semibold px-5 py-2.5 rounded-md transition-all duration-200 text-sm"
              style={{
                backgroundColor: 'var(--color-brand)',
                color: 'var(--text-inverse)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-brand-bold)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-brand)';
              }}
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
            className="inline-flex items-center gap-2 font-medium px-5 py-2.5 rounded-md transition-all duration-200 text-sm"
            style={{
              backgroundColor: 'var(--surface-sunken)',
              color: 'var(--text-default)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--surface-hovered)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--surface-sunken)';
            }}
          >
            View Rankings
          </Link>
        </div>
      )}
    </div>
  );
}
