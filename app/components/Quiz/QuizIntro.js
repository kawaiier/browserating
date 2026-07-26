'use client';

import { QUIZ_INTRO_COPY } from '../../lib/quiz-constants';
import Image from 'next/image';
import { useMemo } from 'react';

const FLOAT_BROWSERS = ['brave', 'firefox', 'chrome', 'zen-browser', 'arc'];

const floatKeyframes = `
@keyframes floatY {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-12px); }
}
@media (prefers-reduced-motion: reduce) {
  .quiz-float { animation: none !important; }
}
`;

export default function QuizIntro({ browserProfiles, onStart }) {
  const floatBrowsers = useMemo(
    () => FLOAT_BROWSERS.map((id) => browserProfiles.find((b) => b.id === id)).filter(Boolean),
    [browserProfiles]
  );

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center px-4 py-12">
      <style>{floatKeyframes}</style>

      <div className="w-full max-w-2xl mx-auto text-center">
        <div className="flex justify-center items-end gap-4 sm:gap-6 mb-10 h-20" aria-hidden="true">
          {floatBrowsers.map((browser, i) => (
            <div
              key={browser.id}
              className={`quiz-float${i >= 3 ? ' hidden sm:block' : ''}`}
              style={{
                animation: `floatY 3s ease-in-out infinite`,
                animationDelay: `${i * 0.3}s`,
              }}
            >
              {browser.logo ? (
                <Image
                  src={browser.logo}
                  alt={browser.name}
                  width={40}
                  height={40}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg"
                  style={{ boxShadow: 'var(--shadow-raised)' }}
                />
              ) : (
                <div
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg"
                  style={{ backgroundColor: 'var(--surface-sunken)' }}
                />
              )}
            </div>
          ))}
        </div>

        <h1
          className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight"
          style={{ color: 'var(--text-default)' }}
        >
          {QUIZ_INTRO_COPY.headline}
          <span
            className="ml-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold"
            style={{
              backgroundColor: 'var(--color-warning-subtle)',
              color: 'var(--color-warning)',
              border: '1px solid var(--color-warning)',
            }}
          >
            Beta
          </span>
        </h1>

        <p
          className="text-lg mb-8 max-w-xl mx-auto leading-relaxed"
          style={{ color: 'var(--text-subtle)' }}
        >
          {QUIZ_INTRO_COPY.subheadline}
        </p>

        <ul
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 mb-10"
          role="list"
        >
          {QUIZ_INTRO_COPY.bullets.map((bullet, i) => (
            <li
              key={i}
              className="flex items-center gap-2 text-sm font-medium"
              style={{ color: 'var(--text-subtle)' }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: 'var(--color-brand)' }}
              />
              {bullet.text}
            </li>
          ))}
        </ul>

        <button
          onClick={onStart}
          className="inline-flex items-center gap-2 font-semibold px-10 py-4 rounded-md transition-all duration-300 text-lg"
          style={{
            backgroundColor: 'var(--color-brand)',
            color: 'var(--text-inverse)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-brand-bold)';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-brand)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          {QUIZ_INTRO_COPY.cta}
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
