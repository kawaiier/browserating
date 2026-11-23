'use client';

import QuizOption from './QuizOption';
import { useEffect, useRef } from 'react';

export default function QuizQuestion({
  question,
  selectedAnswer,
  onAnswer,
  onContinue,
  onSkip,
  canContinue,
  isReviewing,
  onBack,
  showBack,
  direction,
  stepKey,
}) {
  const containerRef = useRef(null);
  const headingRef = useRef(null);
  const hasMountedRef = useRef(false);

  useEffect(() => {
    headingRef.current?.focus();
  }, [stepKey]);

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }
    const el = containerRef.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    el.style.transition = 'none';
    el.style.opacity = '0';
    el.style.transform = direction === 'back' ? 'translateX(-30px)' : 'translateX(30px)';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.transition = 'opacity 300ms ease-out, transform 300ms ease-out';
        el.style.opacity = '1';
        el.style.transform = 'translateX(0)';
      });
    });
  }, [stepKey, direction]);

  if (!question) return null;

  const isMultiSelect = question.selectionMode === 'multiple';

  return (
    <div
      ref={containerRef}
      className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-8 max-w-2xl mx-auto w-full"
      style={{ opacity: 1, transform: 'translateX(0)' }}
    >
      <div className="w-full">
        <h2
          ref={headingRef}
          id={`quiz-question-${question.id}`}
          tabIndex={-1}
          className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 text-center"
          style={{ color: 'var(--text-default)' }}
        >
          {question.question}
        </h2>
        {question.subtitle && (
          <p className="text-sm text-center mb-6" style={{ color: 'var(--text-subtle)' }}>
            {question.subtitle}
          </p>
        )}

        <div
          className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6"
          role={isMultiSelect ? 'group' : 'radiogroup'}
          aria-labelledby={`quiz-question-${question.id}`}
          onKeyDown={(e) => {
            const buttons = e.currentTarget.querySelectorAll('button');
            const idx = Array.from(buttons).indexOf(document.activeElement);
            if (idx === -1) return;
            if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
              e.preventDefault();
              const nextOption = buttons[(idx + 1) % buttons.length];
              nextOption.focus();
              if (!isMultiSelect) nextOption.click();
            } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
              e.preventDefault();
              const previousOption = buttons[(idx - 1 + buttons.length) % buttons.length];
              previousOption.focus();
              if (!isMultiSelect) previousOption.click();
            }
          }}
        >
          {question.options.map((option, index) => {
            const isSelected = isMultiSelect
              ? selectedAnswer.includes(option.id)
              : selectedAnswer === option.id;
            return (
              <QuizOption
                key={option.id}
                option={option}
                isSelected={isSelected}
                selectionMode={isMultiSelect ? 'multiple' : 'single'}
                tabIndex={isMultiSelect || isSelected || (!selectedAnswer && index === 0) ? 0 : -1}
                onClick={onAnswer}
              />
            );
          })}
        </div>

        <div className="mt-6 flex flex-wrap justify-center items-center gap-3">
          {showBack && (
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-1 rounded text-sm text-(--text-subtle) transition-colors duration-200 hover:text-(--text-default) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--border-focused)"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back
            </button>
          )}
          {(isMultiSelect || isReviewing) && (
            <button
              type="button"
              onClick={onContinue}
              disabled={!canContinue}
              className="rounded-md bg-(--color-brand) px-6 py-2.5 text-sm font-semibold text-(--text-inverse) transition-colors hover:bg-(--color-brand-bold) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--border-focused) disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isMultiSelect ? 'Continue' : 'Next'}
            </button>
          )}
          <button
            type="button"
            onClick={onSkip}
            className="rounded-md border border-(--border-subtle) bg-(--surface-raised) px-4 py-2.5 text-sm font-medium text-(--text-subtle) transition-colors hover:bg-(--surface-hovered) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--border-focused)"
          >
            Skip / no preference
          </button>
        </div>
        {isMultiSelect && !canContinue && (
          <p className="mt-2 text-center text-sm" style={{ color: 'var(--text-subtle)' }}>
            Select at least one device or choose no preference to continue.
          </p>
        )}
      </div>
    </div>
  );
}
