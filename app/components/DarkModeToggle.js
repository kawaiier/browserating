'use client';

import React from 'react';
import { useDarkMode } from './DarkModeProvider';

const STARS = [
  { top: 10, left: 20, delay: 0, key: 'star-0' },
  { top: 25, left: 70, delay: 300, key: 'star-1' },
  { top: 60, left: 15, delay: 700, key: 'star-2' },
  { top: 75, left: 80, delay: 1100, key: 'star-3' },
  { top: 40, left: 45, delay: 500, key: 'star-4' },
  { top: 85, left: 55, delay: 900, key: 'star-5' },
];

export default function DarkModeToggle() {
  const { darkMode, toggleDarkMode } = useDarkMode();

  return (
    <div className="flex items-center gap-2 px-2 py-1.5 bg-surface-subtle rounded-radius-pill border border-border-subtle">
      <button
        onClick={toggleDarkMode}
        className="relative p-2 w-8 h-8 rounded-full bg-surface border border-border-subtle 
              hover:bg-neutral-100 dark:hover:bg-neutral-700
              shadow-sm
              transition-all duration-200 ease-in-out
              focus:outline-none focus:ring-2 focus:ring-focus-ring focus:ring-offset-1"
        aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        aria-pressed={darkMode}
        title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        <div className="relative w-full h-full">
          {/* Sun */}
          <div
            className={`absolute inset-0 transform transition-transform duration-300 
                  ${darkMode ? 'scale-0 rotate-90' : 'scale-100 rotate-0'}`}
            aria-hidden="true"
          >
            {/* Main sun circle */}
            <div className="absolute inset-1 bg-amber-500 rounded-full" />

            {/* Sun rays */}
            {[...Array(8)].map((_, i) => (
              <div
                key={`ray-${i}`}
                className="absolute w-1 h-2 bg-amber-500 rounded-full"
                style={{
                  top: '2px',
                  left: 'calc(50% - 0.5px)',
                  transform: `rotate(${i * 45}deg) translateY(-6px)`,
                }}
              />
            ))}
          </div>

          {/* Moon */}
          <div
            className={`absolute inset-0 transform transition-transform duration-300
                  ${darkMode ? 'scale-100 rotate-0' : 'scale-0 -rotate-90'}`}
            aria-hidden="true"
          >
            {/* Main moon circle */}
            <div className="absolute inset-0.5 bg-neutral-300 dark:bg-neutral-600 rounded-full" />

            {/* Moon craters */}
            <div className="absolute top-1.5 left-1.5 w-1.5 h-1.5 bg-neutral-400 dark:bg-neutral-500 rounded-full opacity-60" />
            <div className="absolute top-3 right-2 w-1 h-1 bg-neutral-400 dark:bg-neutral-500 rounded-full opacity-60" />
            <div className="absolute bottom-1.5 right-1.5 w-2 h-2 bg-neutral-400 dark:bg-neutral-500 rounded-full opacity-60" />
          </div>

          {/* Stars (visible in dark mode) */}
          <div
            className={`absolute inset-0 transition-opacity duration-300 ${
              darkMode ? 'opacity-100' : 'opacity-0'
            }`}
            aria-hidden="true"
          >
            {STARS.map((star) => (
              <div
                key={star.key}
                className="absolute w-0.5 h-0.5 bg-white rounded-full"
                style={{
                  top: `${star.top}%`,
                  left: `${star.left}%`,
                  animationDelay: `${star.delay}ms`,
                }}
              />
            ))}
          </div>
        </div>
      </button>
    </div>
  );
}