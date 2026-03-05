'use client';

import QuizOption from './QuizOption';
import { useEffect, useRef } from 'react';

export default function QuizQuestion({
  question,
  selectedAnswer,
  onAnswer,
  onBack,
  showBack,
  direction,
  stepKey,
}) {
  const containerRef = useRef(null);
  const hasMountedRef = useRef(false);

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }
    const el = containerRef.current;
    if (!el) return;
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

  return (
    <div
      ref={containerRef}
      className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-8 max-w-2xl mx-auto w-full"
      style={{ opacity: 1, transform: 'translateX(0)' }}
    >
      <div className="w-full">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2 text-center">
          {question.question}
        </h2>
        {question.subtitle && (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
            {question.subtitle}
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
          {question.options.map((option) => (
            <QuizOption
              key={option.id}
              option={option}
              isSelected={selectedAnswer === option.id}
              onClick={onAnswer}
            />
          ))}
        </div>

        {showBack && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={onBack}
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200 flex items-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded"
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
          </div>
        )}
      </div>
    </div>
  );
}
