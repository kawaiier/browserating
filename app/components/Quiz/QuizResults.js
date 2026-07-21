'use client';

import QuizResultCard from './QuizResultCard';
import QuizShareButtons from './QuizShareButtons';
import QuizTraitChart from './QuizTraitChart';
import Link from 'next/link';

const fadeInUpKeyframes = `
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0);    }
}
@media (prefers-reduced-motion: reduce) {
  .quiz-fade-in-up { animation: none !important; opacity: 1 !important; transform: none !important; }
}
`;

export default function QuizResults({ results, userTraits, onRetake, isShared }) {
  const { topResults } = results;
  const hero = topResults[0];
  const runnerUps = topResults.slice(1, 3);

  if (!hero) return null;

  return (
    <div className="px-4 sm:px-6 py-10 max-w-2xl mx-auto w-full">
      <style>{fadeInUpKeyframes}</style>
      {isShared && (
        <div className="mb-8 text-center">
          <p className="mb-4" style={{ color: 'var(--text-subtle)' }}>
            This is the quiz result for{' '}
            <strong style={{ color: 'var(--text-default)' }}>{hero.name}</strong>. Want to find
            your own match?
          </p>
          <button
            onClick={onRetake}
            className="inline-flex items-center gap-2 font-semibold px-8 py-3 rounded-md transition-all duration-300"
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
        <p
          className="text-center text-sm font-medium mb-3 uppercase tracking-wider"
          style={{ color: 'var(--text-brand)' }}
        >
          Your best match
        </p>
      )}

      <div
        className="quiz-fade-in-up"
        style={{ animation: 'fadeInUp 500ms ease-out both' }}
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
          <h3 className="text-base font-semibold mb-3" style={{ color: 'var(--text-default)' }}>
            Also worth considering
          </h3>
          <div className="flex flex-col gap-4">
            {runnerUps.map((browser, i) => (
              <div
                key={browser.id}
                className="quiz-fade-in-up"
                style={{ animation: 'fadeInUp 500ms ease-out both', animationDelay: `${(i + 1) * 150 + 200}ms` }}
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
            View All Rankings
          </Link>
        </div>
      )}
    </div>
  );
}
