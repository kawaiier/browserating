'use client';

import { TRAIT_META } from '../../lib/quiz-constants';
import { getPriorityTraits } from './quizEngine';

export default function QuizPriorityBars({
  userTraits,
  browserProfile,
  userLabel = 'Your Priorities',
}) {
  const priorities = getPriorityTraits(userTraits ?? {})
    .map(([trait, weight]) => ({
      trait,
      label: TRAIT_META[trait]?.label ?? trait,
      weight,
      rating: browserProfile.traits?.[trait],
    }))
    .filter(({ rating }) => Number.isFinite(rating));

  return (
    <section
      className="rounded-lg border border-(--border-subtle) bg-(--surface-sunken) p-4 sm:p-6"
      aria-labelledby="quiz-priority-bars-heading"
    >
      <h3
        id="quiz-priority-bars-heading"
        className="mb-2 text-center text-sm font-semibold uppercase tracking-wider text-(--text-subtle)"
      >
        {browserProfile.name}: ratings for {userLabel.toLowerCase()}
      </h3>
      <p className="mb-5 text-center text-sm text-(--text-subtle)">
        Preferences are ordered strongest first. Bars show the browser’s rating for each trait on a
        0–10 scale.
      </p>

      {priorities.length > 0 ? (
        <ol className="space-y-5">
          {priorities.map(({ trait, label, weight, rating }, index) => (
            <li key={trait}>
              <div className="mb-2 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-semibold text-(--text-default)">
                    {index + 1}. {label}
                  </p>
                  <p className="text-xs text-(--text-subtle)">
                    Preference favors a {weight > 0 ? 'higher' : 'lower'} score
                  </p>
                </div>
                <p className="shrink-0 text-sm font-semibold tabular-nums text-(--text-default)">
                  Browser rating: {rating}/10
                </p>
              </div>
              <div
                className="h-2 overflow-hidden rounded-full bg-(--surface-hovered)"
                aria-hidden="true"
              >
                <div
                  className="h-full rounded-full bg-(--color-brand)"
                  style={{ width: `${Math.max(0, Math.min(10, rating)) * 10}%` }}
                />
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <p className="text-center text-sm text-(--text-subtle)">
          No specific priorities were selected, so there are no trait ratings to compare.
        </p>
      )}
    </section>
  );
}
