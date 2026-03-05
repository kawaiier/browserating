'use client';

import QuizResultCard from './QuizResultCard';
import QuizShareButtons from './QuizShareButtons';
import QuizTraitChart from './QuizTraitChart';
import Link from 'next/link';

export default function QuizResults({ results, userTraits, onRetake, isShared }) {
  const { topResults } = results;
  const hero = topResults[0];
  const runnerUps = topResults.slice(1, 3);

  if (!hero) return null;

  return (
    <div className="px-4 sm:px-6 py-10 max-w-2xl mx-auto w-full">
      {isShared && (
        <div className="mb-8 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            This is the quiz result for{' '}
            <strong className="text-gray-900 dark:text-white">{hero.name}</strong>. Want to find
            your own match?
          </p>
          <button
            onClick={onRetake}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold px-8 py-3 rounded-xl shadow hover:shadow-md transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-amber-400/50"
          >
            Take the Quiz
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </button>
        </div>
      )}

      {!isShared && (
        <p className="text-center text-sm font-medium text-purple-600 dark:text-purple-400 mb-3 uppercase tracking-wider">
          Your best match
        </p>
      )}

      <div
        className="animate-in fade-in slide-in-from-bottom-4 duration-500"
        style={{ animationFillMode: 'both' }}
      >
        <QuizResultCard browser={hero} size="hero" />
      </div>

      {!isShared && userTraits && (
        <div className="mt-8" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
          <QuizTraitChart userTraits={userTraits} browserProfile={hero} />
        </div>
      )}

      {!isShared && runnerUps.length > 0 && (
        <div className="mt-8">
          <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Also worth considering
          </h3>
          <div className="flex flex-col gap-4">
            {runnerUps.map((browser, i) => (
              <div
                key={browser.id}
                className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                style={{ animationDelay: `${(i + 1) * 150 + 200}ms`, animationFillMode: 'both' }}
              >
                <QuizResultCard browser={browser} size="runner-up" />
              </div>
            ))}
          </div>
        </div>
      )}

      {!isShared && (
        <div className="mt-8">
          <QuizShareButtons browserId={hero.id} browserName={hero.name} />
        </div>
      )}

      {!isShared && (
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={onRetake}
            className="inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium px-5 py-2.5 rounded-xl transition-all duration-200 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Retake Quiz
          </button>
          <Link
            href="/#rankings"
            className="inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium px-5 py-2.5 rounded-xl transition-all duration-200 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
          >
            View All Rankings
          </Link>
        </div>
      )}
    </div>
  );
}
