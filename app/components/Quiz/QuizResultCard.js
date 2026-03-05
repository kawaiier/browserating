'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function QuizResultCard({ browser, size = 'runner-up' }) {
  const [expandedHighlights, setExpandedHighlights] = useState(false);
  const isHero = size === 'hero';

  return (
    <div
      className={`rounded-2xl border bg-white dark:bg-gray-800 transition-all duration-200 ${
        isHero
          ? 'border-purple-200 dark:border-purple-700 shadow-xl shadow-purple-100/50 dark:shadow-purple-900/20 p-6 sm:p-8'
          : 'border-gray-200 dark:border-gray-700 shadow-md p-4 sm:p-6'
      }`}
    >
      {browser.discontinued && (
        <div className="mb-4 flex items-start gap-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 text-amber-800 dark:text-amber-300 text-xs sm:text-sm rounded-lg px-3 py-2">
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
              className="w-full h-full rounded-xl shadow-sm"
            />
          ) : (
            <div className="w-full h-full rounded-xl bg-gray-200 dark:bg-gray-700" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2
              className={`font-bold text-gray-900 dark:text-white ${
                isHero ? 'text-2xl sm:text-3xl' : 'text-lg'
              }`}
            >
              {browser.name}
            </h2>
            <span
              className={`inline-flex items-center font-bold rounded-full px-2 py-0.5 ${
                isHero
                  ? 'text-sm bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300'
                  : 'text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              {browser.matchPercentage}% match
            </span>
          </div>

          {browser.tagline && (
            <p
              className={`mt-1 text-gray-600 dark:text-gray-400 ${
                isHero ? 'text-base' : 'text-sm'
              }`}
            >
              {browser.tagline}
            </p>
          )}
          {isHero && browser.bestFor && (
            <p className="mt-2 text-sm text-purple-700 dark:text-purple-300 font-medium">
              Best for: {browser.bestFor}
            </p>
          )}
        </div>
      </div>

      {isHero && browser.highlights && browser.highlights.length > 0 && (
        <ul className="mt-5 space-y-2" role="list">
          {browser.highlights.map((h, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
              <svg
                className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5"
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
            className="text-xs text-purple-600 dark:text-purple-400 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded"
          >
            {expandedHighlights ? 'Hide details' : 'Why this one?'}
          </button>
          {expandedHighlights && (
            <ul className="mt-2 space-y-1.5" role="list">
              {browser.highlights.map((h, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400"
                >
                  <svg
                    className="w-3.5 h-3.5 text-purple-500 flex-shrink-0 mt-0.5"
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
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl shadow hover:shadow-md transition-all duration-200 text-sm"
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
            className="inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium px-5 py-2.5 rounded-xl transition-all duration-200 text-sm"
          >
            View Rankings
          </Link>
        </div>
      )}
    </div>
  );
}
