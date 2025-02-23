import { useEffect, useState } from "react";

import DarkModeToggle from "./DarkModeToggle";
import Image from "next/image";

export default function Header({ darkMode, toggleDarkMode }) {
  return (
    <header className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-12">
      {/* Background Pattern */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400">
        <defs>
          <pattern
            id="bg_pattern"
            x="0"
            y="0"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M0 20h40M20 0v40"
              stroke="#7853E0"
              strokeOpacity={darkMode ? "0.2" : "0.1"}
              strokeWidth="1"
            />
            <circle
              cx="20"
              cy="20"
              r="2"
              fill="#7853E0"
              fillOpacity={darkMode ? "0.25" : "0.15"}
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#bg_pattern)" />
      </svg>

      {/* Content Container */}
      <div className="container mx-auto px-4">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto">
          {/* Logo Section */}
          <div className="w-full md:w-1/3 mb-8 md:mb-0 flex justify-center md:justify-start">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg blur opacity-25"></div>
              <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl p-2">
                <Image
                  src="/images/logo.png"
                  alt="Browserating Logo"
                  width={180}
                  height={90}
                  className="w-auto h-auto"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Text Section */}
          <div className="w-full md:w-2/3 text-center md:text-left md:pl-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent leading-normal pb-2">
              BrowseRating
            </h1>
            <h2 className="text-xl md:text-2xl font-medium text-gray-600 dark:text-gray-300 leading-relaxed">
              Browser Performance Ranking for
              <span className="inline-flex gap-1.5 ml-2">
                <span className="text-purple-600 dark:text-purple-400 font-semibold">
                  macOS
                </span>
                <span className="text-gray-400 dark:text-gray-500">/</span>
                <span className="text-blue-600 dark:text-blue-400 font-semibold">
                  Windows
                </span>
                <span className="text-gray-400 dark:text-gray-500">/</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
                  Android
                </span>
              </span>
            </h2>
            <p className="text-xsm mt-4 text-gray-600 dark:text-gray-400">
              The score displayed below reflects the browser&apos;s performance
              in the Speedometer 3 benchmark. The higher the score, the better.
            </p>
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-md mt-8 inline-block">
              <p className="text-sm font-mono">
                Last updated:{" "}
                <time dateTime="2025-02-23">February 23, 2025</time>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute top-4 right-4">
        <DarkModeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      </div>
    </header>
  );
}
