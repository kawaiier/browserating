'use client';

import Link from 'next/link';
import QuizResultCard from './QuizResultCard';
import QuizShareButtons from './QuizShareButtons';
import QuizPriorityBars from './QuizPriorityBars';
import { TRAIT_META } from '../../lib/quiz-constants';
import { getPriorityTraits } from './quizEngine';
import { SKIP_ANSWER } from './quizState';
import { buildCompareUrl } from '../../lib/comparisonUrl';

const PLATFORM_LABELS = {
  windows: 'Windows',
  'macos-arm': 'Apple silicon Mac',
  'macos-intel': 'Intel Mac',
  linux: 'Linux',
  android: 'Android',
  ios: 'iPhone',
  ipad: 'iPad',
};

function formatList(items) {
  if (items.length < 2) return items[0] ?? '';
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(', ')}, and ${items.at(-1)}`;
}

function formatBrowserNames(browsers) {
  return formatList(browsers.map((browser) => browser.name));
}

function getTraitAnswerLabels(trait, answers, questions) {
  const labels = [];

  questions.forEach((question, index) => {
    const answer = answers?.[index];
    const answerIds = Array.isArray(answer) ? answer : [answer];
    for (const answerId of answerIds) {
      const option = question.options.find((candidate) => candidate.id === answerId);
      if (option && Number.isFinite(option.traits?.[trait]) && option.traits[trait] !== 0) {
        labels.push(option.label);
      }
    }
  });

  return [...new Set(labels)];
}

function formatQuotedChoices(labels) {
  const choices = labels.slice(0, 2).map((label) => `“${label}”`);
  if (labels.length > 2)
    choices.push(`${labels.length - 2} other choice${labels.length > 3 ? 's' : ''}`);
  return formatList(choices);
}

function getMatchRationales(userTraits, hero, answers, questions, showDetails) {
  if (!showDetails || !userTraits || !hero) return [];

  return getPriorityTraits(userTraits)
    .map(([trait, weight]) => ({
      trait,
      label: TRAIT_META[trait]?.label ?? trait,
      weight,
      score: hero.traits?.[trait],
      rationale: hero.traitRationales?.[trait],
      answerLabels: getTraitAnswerLabels(trait, answers, questions),
    }))
    .filter((item) => Number.isFinite(item.score) && item.rationale && item.answerLabels.length > 0)
    .slice(0, 3);
}

function getTradeoffs(hero, userTraits, selectedPlatforms, isShared) {
  if (!hero) return [];

  const tradeoffs = [];
  const missingPlatforms = [...new Set(selectedPlatforms)].filter(
    (platform) => Array.isArray(hero.platforms) && !hero.platforms.includes(platform)
  );
  if (missingPlatforms.length > 0) {
    const labels = missingPlatforms.map((platform) => PLATFORM_LABELS[platform] ?? platform);
    tradeoffs.push({
      id: 'platforms',
      message: isShared
        ? `This browser is not listed for ${formatList(labels)}, among the devices selected in the shared answers.`
        : `This browser is not listed for ${formatList(labels)}, among the devices you selected.`,
    });
  }

  const mismatchedTraits = getPriorityTraits(userTraits ?? {})
    .map(([trait, weight]) => ({
      trait,
      label: TRAIT_META[trait]?.label ?? trait,
      weight,
      score: hero.traits?.[trait],
      rationale: hero.traitRationales?.[trait],
    }))
    .filter(
      ({ weight, score }) =>
        Number.isFinite(score) && ((weight > 0 && score <= 4) || (weight < 0 && score >= 6))
    )
    .slice(0, 2);

  for (const item of mismatchedTraits) {
    tradeoffs.push({
      id: item.trait,
      message:
        item.weight > 0
          ? `${hero.name} is rated ${item.score}/10 for ${item.label}, ${isShared ? "one of the quiz taker's" : 'one of your'} stronger priorities.`
          : `${isShared ? 'The quiz taker preferred' : 'You preferred'} less ${item.label.toLowerCase()}, but ${hero.name} is rated ${item.score}/10 for it.`,
      rationale: item.rationale,
    });
  }

  return tradeoffs;
}

function getAnswerText(question, answer) {
  if (answer === SKIP_ANSWER || answer === null || answer === undefined) return 'No preference';

  const answerIds = Array.isArray(answer) ? answer : [answer];
  const labels = answerIds
    .map((answerId) => question.options.find((option) => option.id === answerId)?.label)
    .filter(Boolean);
  return labels.length > 0 ? formatList(labels) : 'No preference';
}

export default function QuizResults({
  results,
  userTraits,
  answers,
  questions,
  onChangeAnswers,
  onRetake,
  isShared,
  resultHeadingRef,
}) {
  const { topResults, discontinuedResults = [] } = results;
  const hero = topResults[0];
  const runnerUps = topResults.slice(1, 3);
  const showDetailedResults = !isShared || results.hasSharedAnswers;
  const matchRationales = getMatchRationales(
    userTraits,
    hero,
    answers,
    questions,
    showDetailedResults
  );
  const tradeoffs = showDetailedResults
    ? getTradeoffs(hero, userTraits, results.selectedPlatforms ?? [], isShared)
    : [];
  const sharedMatch = hero ?? discontinuedResults[0];
  const compareHref =
    showDetailedResults && hero?.slug && runnerUps[0]?.slug && hero.slug !== runnerUps[0].slug
      ? buildCompareUrl({ first: hero.slug, second: runnerUps[0].slug })
      : null;

  if (!hero && (!isShared || results.hasSharedAnswers)) {
    return (
      <div className="px-4 sm:px-6 py-10 max-w-2xl mx-auto w-full text-center">
        <h1
          ref={resultHeadingRef}
          tabIndex={-1}
          className="text-xl font-semibold mb-3"
          style={{ color: 'var(--text-default)' }}
        >
          No browser fits every requirement
        </h1>
        <p className="mb-8" style={{ color: 'var(--text-subtle)' }}>
          {isShared
            ? 'The shared answers do not match any browser that meets the selected device and feature requirements.'
            : 'Your answers rule out every browser we cover for that device. Try changing an answer or skipping a preference.'}
        </p>
        {!isShared && (
          <button
            onClick={onChangeAnswers}
            className="mr-3 inline-flex items-center gap-2 rounded-md bg-(--surface-sunken) px-6 py-3 font-semibold text-(--text-default) transition-colors hover:bg-(--surface-hovered) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--border-focused)"
          >
            Change answers
          </button>
        )}
        {isShared ? (
          <Link
            href="/quiz"
            onClick={onRetake}
            className="inline-flex items-center gap-2 rounded-md bg-(--color-brand) px-8 py-3 font-semibold text-(--text-inverse) transition-colors duration-300 hover:bg-(--color-brand-bold) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--border-focused)"
          >
            Take the Quiz
          </Link>
        ) : (
          <button
            onClick={onRetake}
            className="inline-flex items-center gap-2 rounded-md bg-(--color-brand) px-8 py-3 font-semibold text-(--text-inverse) transition-colors duration-300 hover:bg-(--color-brand-bold) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--border-focused)"
          >
            Retake Quiz
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 py-10 max-w-2xl mx-auto w-full">
      <h1
        ref={resultHeadingRef}
        tabIndex={-1}
        className="mb-2 text-center text-2xl font-bold sm:text-3xl"
        style={{ color: 'var(--text-default)' }}
      >
        {isShared ? 'A shared browser match' : 'Your browser matches'}
      </h1>
      <p className="mb-6 text-center text-sm" style={{ color: 'var(--text-subtle)' }}>
        Recommendations are not sponsored.
      </p>
      {isShared && (
        <div className="mb-8 text-center">
          <p className="mb-4" style={{ color: 'var(--text-subtle)' }}>
            {sharedMatch ? (
              <>
                Someone matched with{' '}
                <strong style={{ color: 'var(--text-default)' }}>{sharedMatch.name}</strong> —
                what’s yours?
              </>
            ) : (
              'Someone tried the browser quiz. What would your match be?'
            )}
          </p>
          <Link
            href="/quiz"
            onClick={onRetake}
            className="inline-flex items-center gap-2 rounded-md bg-(--color-brand) px-8 py-3 font-semibold text-(--text-inverse) transition-colors duration-300 hover:bg-(--color-brand-bold) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--border-focused)"
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
          </Link>
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

      {hero && (
        <div className="quiz-fade-in-up">
          <QuizResultCard browser={hero} size="hero" />
        </div>
      )}

      {discontinuedResults.length > 0 && (
        <p
          role="note"
          className="mt-4 text-center text-xs sm:text-sm"
          style={{ color: 'var(--text-subtle)' }}
        >
          {isShared ? (
            <>
              The shared result refers to {formatBrowserNames(discontinuedResults)};{' '}
              {discontinuedResults.length === 1 ? 'it is' : 'they are'} discontinued.
            </>
          ) : (
            <>
              You might have liked {formatBrowserNames(discontinuedResults)}, but{' '}
              {discontinuedResults.length === 1 ? 'it’s' : 'they’re'} discontinued.
            </>
          )}
        </p>
      )}

      {showDetailedResults && userTraits && hero && (
        <div className="mt-8" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
          <QuizPriorityBars
            userTraits={userTraits}
            browserProfile={hero}
            userLabel={isShared ? 'Shared Answers' : 'Your Priorities'}
          />
        </div>
      )}

      {matchRationales.length > 0 && (
        <section
          className="mt-6 rounded-lg p-4 sm:p-6"
          style={{
            backgroundColor: 'var(--surface-sunken)',
            border: '1px solid var(--border-subtle)',
          }}
          aria-labelledby="quiz-match-reasons-heading"
        >
          <h2
            id="quiz-match-reasons-heading"
            className="text-sm font-semibold mb-4 uppercase tracking-wider"
            style={{ color: 'var(--text-subtle)' }}
          >
            Why it matches
          </h2>
          <ul className="space-y-4">
            {matchRationales.map(({ trait, label, weight, score, rationale, answerLabels }) => (
              <li key={trait}>
                <p className="text-sm font-semibold" style={{ color: 'var(--text-default)' }}>
                  Because {isShared ? 'the shared answers include' : 'you chose'}{' '}
                  {formatQuotedChoices(answerLabels)},{' '}
                  {isShared ? 'the quiz taker signaled' : 'you signaled'}{' '}
                  {weight < 0 ? `less emphasis on ${label}` : `that ${label} matters`}. {hero.name}{' '}
                  is rated {score}/10 for {label}.
                </p>
                <p className="mt-1 text-sm" style={{ color: 'var(--text-subtle)' }}>
                  {rationale}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {tradeoffs.length > 0 && (
        <section
          className="mt-6 rounded-lg p-4 sm:p-6"
          style={{
            backgroundColor: 'var(--surface-sunken)',
            border: '1px solid var(--border-subtle)',
          }}
          aria-labelledby="quiz-tradeoffs-heading"
        >
          <h2
            id="quiz-tradeoffs-heading"
            className="text-sm font-semibold mb-4 uppercase tracking-wider"
            style={{ color: 'var(--text-subtle)' }}
          >
            Trade-offs to consider
          </h2>
          <ul className="space-y-3">
            {tradeoffs.map(({ id, message, rationale }) => (
              <li key={id}>
                <p className="text-sm font-semibold" style={{ color: 'var(--text-default)' }}>
                  Heads-up: {message}
                </p>
                {rationale && (
                  <p className="mt-1 text-sm" style={{ color: 'var(--text-subtle)' }}>
                    {rationale}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {isShared && results.hasSharedAnswers && (
        <section
          className="mt-6 rounded-lg p-4 sm:p-6"
          style={{
            backgroundColor: 'var(--surface-sunken)',
            border: '1px solid var(--border-subtle)',
          }}
          aria-labelledby="quiz-shared-answers-heading"
        >
          <h2
            id="quiz-shared-answers-heading"
            className="text-sm font-semibold mb-4 uppercase tracking-wider"
            style={{ color: 'var(--text-subtle)' }}
          >
            Answers included in this result
          </h2>
          <dl className="space-y-3">
            {questions.map((question, index) => (
              <div key={question.id}>
                <dt className="text-sm font-semibold" style={{ color: 'var(--text-default)' }}>
                  {question.question}
                </dt>
                <dd className="mt-0.5 text-sm" style={{ color: 'var(--text-subtle)' }}>
                  {getAnswerText(question, answers[index])}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {showDetailedResults && runnerUps.length > 0 && (
        <div className="mt-8">
          <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--text-default)' }}>
            Also worth considering
          </h2>
          <div className="flex flex-col gap-4">
            {runnerUps.map((browser, i) => (
              <div
                key={browser.id}
                className="quiz-fade-in-up"
                style={{ animationDelay: `${(i + 1) * 150 + 200}ms` }}
              >
                <QuizResultCard browser={browser} size="runner-up" headingLevel={3} />
              </div>
            ))}
          </div>
        </div>
      )}

      {compareHref && (
        <div className="mt-6 text-center">
          <Link
            href={compareHref}
            className="inline-flex items-center gap-2 rounded-md bg-(--surface-sunken) px-5 py-2.5 text-sm font-medium text-(--text-default) transition-colors duration-200 hover:bg-(--surface-hovered) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--border-focused)"
          >
            Compare {hero.name} vs {runnerUps[0].name}
          </Link>
        </div>
      )}

      {!isShared && hero && (
        <div className="mt-8">
          <QuizShareButtons browserId={hero.id} browserName={hero.name} answers={answers} />
        </div>
      )}

      {!isShared && (
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={onChangeAnswers}
            className="inline-flex items-center gap-2 rounded-md bg-(--surface-sunken) px-5 py-2.5 text-sm font-medium text-(--text-default) transition-colors duration-200 hover:bg-(--surface-hovered) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--border-focused)"
          >
            Change answers
          </button>
          <button
            onClick={onRetake}
            className="inline-flex items-center gap-2 rounded-md bg-(--surface-sunken) px-5 py-2.5 text-sm font-medium text-(--text-default) transition-colors duration-200 hover:bg-(--surface-hovered) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--border-focused)"
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
            className="inline-flex items-center gap-2 rounded-md bg-(--surface-sunken) px-5 py-2.5 text-sm font-medium text-(--text-default) transition-colors duration-200 hover:bg-(--surface-hovered) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--border-focused)"
          >
            View All Rankings
          </Link>
        </div>
      )}
    </div>
  );
}
