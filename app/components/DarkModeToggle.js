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
    <button
      onClick={toggleDarkMode}
      className="relative p-2 w-12 h-12 rounded-full bg-gradient-to-b from-blue-50 to-blue-100 
            dark:from-gray-700 dark:to-gray-800 hover:from-blue-100 hover:to-blue-200 
            dark:hover:from-gray-600 dark:hover:to-gray-700
            shadow-md transition-all duration-300 ease-in-out transform hover:scale-110
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-purple-400"
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={darkMode}
      title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <div className="relative w-full h-full">
        {/* Sun */}
        <div
          className={`absolute inset-0 transform transition-transform duration-500 
                ${darkMode ? 'scale-0 rotate-90' : 'scale-100 rotate-0'}`}
          aria-hidden="true"
        >
          {/* Main sun circle */}
          <div className="absolute inset-[3px] bg-yellow-400 rounded-full" />

          {/* Sun rays */}
          {[...Array(12)].map((_, i) => (
            <div
              key={`ray-${i}`}
              className="absolute w-[2px] h-[7px] bg-yellow-400 rounded"
              style={{
                top: 'calc(50% - 3px)', // Adjust based on ray size
                left: 'calc(50% - 1px)', // Adjust based on ray size
                transform: `rotate(${i * 30}deg) translate(8px, 8px)`, // Adjust translate values
              }}
            />
          ))}
        </div>

        {/* Moon */}
        <div
          className={`absolute inset-0 transform transition-transform duration-500
                ${darkMode ? 'scale-100 rotate-0' : 'scale-0 -rotate-90'}`}
          aria-hidden="true"
        >
          {/* Main moon circle */}
          <div className="absolute inset-0 bg-slate-200 rounded-full" />

          {/* Moon craters */}
          <div className="absolute top-2 left-2 w-2 h-2 bg-slate-400 rounded-full opacity-75" />
          <div className="absolute top-4 right-3 w-1.5 h-1.5 bg-slate-400 rounded-full opacity-75" />
          <div className="absolute bottom-2 right-2 w-2.5 h-2.5 bg-slate-400 rounded-full opacity-75" />
        </div>

        {/* Stars (visible in dark mode) */}
        <div
          className={`absolute inset-0 transition-opacity duration-500 ${
            darkMode ? 'opacity-100' : 'opacity-0'
          }`}
          aria-hidden="true"
        >
          {STARS.map((star) => (
            <div
              key={star.key}
              className="absolute w-0.5 h-0.5 bg-white rounded-full animate-twinkle"
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
  );
}
