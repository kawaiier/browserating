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
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl shadow-md"
                />
              ) : (
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gray-200 dark:bg-gray-700 shadow-md" />
              )}
            </div>
          ))}
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
          {QUIZ_INTRO_COPY.headline}
        </h1>

        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-xl mx-auto leading-relaxed">
          {QUIZ_INTRO_COPY.subheadline}
        </p>

        <ul
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 mb-10"
          role="list"
        >
          {QUIZ_INTRO_COPY.bullets.map((bullet, i) => (
            <li
              key={i}
              className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 font-medium"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 flex-shrink-0" />
              {bullet.text}
            </li>
          ))}
        </ul>

        <button
          onClick={onStart}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold px-10 py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-lg focus:outline-none focus:ring-4 focus:ring-amber-400/50"
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
