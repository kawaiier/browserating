import { useEffect, useState } from "react";

import DarkModeToggle from "./DarkModeToggle";
import Image from "next/image";
import Link from "next/link";

export default function Header({ darkMode, toggleDarkMode }) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentPlatform, setCurrentPlatform] = useState(0);

  const platforms = [
    { name: "macOS", icon: "🍎", color: "from-blue-500 to-purple-500" },
    { name: "Windows", icon: "🪟", color: "from-blue-600 to-cyan-500" },
    { name: "Android", icon: "🤖", color: "from-green-500 to-emerald-500" },
    { name: "iPad", icon: "📱", color: "from-purple-500 to-pink-500" },
  ];

  // Animation on mount
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Rotating platform showcase
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPlatform((prev) => (prev + 1) % platforms.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [platforms.length]);

  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header
      className="relative p-8 overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950 min-h-[600px] flex items-center"
      role="banner"
    >
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 800 600"
          aria-hidden="true"
        >
          <defs>
            <linearGradient
              id="grid-gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.05" />
            </linearGradient>
            <pattern
              id="enhanced-pattern"
              x="0"
              y="0"
              width="80"
              height="80"
              patternUnits="userSpaceOnUse"
            >
              <rect width="80" height="80" fill="url(#grid-gradient)" />
              <path
                d="M0 40h80M40 0v80"
                stroke="url(#grid-gradient)"
                strokeWidth="1"
                opacity="0.3"
              />
              <circle
                cx="40"
                cy="40"
                r="3"
                fill="#8B5CF6"
                opacity="0.2"
                className="sm:animate-pulse"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#enhanced-pattern)" />
        </svg>
      </div>

      {/* Floating geometric shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full opacity-10 sm:animate-bounce"
          style={{ animationDelay: "0s", animationDuration: "6s" }}
        ></div>
        <div
          className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-lg rotate-45 opacity-10 sm:animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-32 left-20 w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full opacity-10 sm:animate-bounce"
          style={{ animationDelay: "2s", animationDuration: "4s" }}
        ></div>
        <div
          className="absolute bottom-20 right-32 w-24 h-6 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full opacity-10 sm:animate-pulse"
          style={{ animationDelay: "3s" }}
        ></div>
      </div>

      {/* Dark Mode Toggle */}
      <div className="absolute top-6 right-6 z-20">
        <DarkModeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div
          className={`max-w-7xl mx-auto transition-all duration-1000 transform ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          {/* Top Section - Logo and Navigation */}
          <div className="flex flex-col lg:flex-row items-center justify-between mb-12">
            {/* Logo */}
            <div className="mb-8 lg:mb-0">
              <div className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 rounded-2xl blur-lg opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
                <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-2xl p-4 border border-white/20 dark:border-gray-700/50">
                  <a
                    href="/"
                    aria-label="BrowseRating Home"
                    className="block transform hover:scale-105 transition-transform duration-300"
                  >
                    <Image
                      src="/images/logo.png"
                      alt="BrowseRating Logo"
                      width={200}
                      height={100}
                      className="w-auto h-auto max-h-16"
                      priority
                    />
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap gap-4 lg:gap-6 text-center lg:text-left">
              <div className="bg-white/10 dark:bg-gray-800/20 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20 dark:border-gray-700/30">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  100+
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Browsers Tested
                </div>
              </div>
              <div className="bg-white/10 dark:bg-gray-800/20 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20 dark:border-gray-700/30">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  5
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Platforms
                </div>
              </div>
              <div className="bg-white/10 dark:bg-gray-800/20 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20 dark:border-gray-700/30">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  Monthly
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Updates
                </div>
              </div>
            </div>
          </div>

          {/* Hero Section */}
          <div className="text-center max-w-5xl mx-auto">
            {/* Main Title */}
            <h1
              className={`text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 transition-all duration-1000 delay-300 ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
            >
              <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent leading-tight block pb-2">
                Browserating
              </span>
            </h1>

            {/* Subtitle with animated platform showcase */}
            <div
              className={`mb-8 transition-all duration-1000 delay-500 ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
            >
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-medium text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Browser Performance Ranking for
              </h2>

              {/* Animated Platform Showcase */}
              <div className="flex flex-wrap justify-center gap-4 mb-6">
                {platforms.map((platform) => (
                  <div
                    key={platform.name}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300"
                  >
                    <span className="text-lg">{platform.icon}</span>
                    <span className="font-semibold">{platform.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div
              className={`max-w-3xl mx-auto mb-10 transition-all duration-1000 delay-700 ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
            >
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                Discover the fastest browsers across different platforms using
                the industry-standard
                <strong className="text-purple-600 dark:text-purple-400">
                  {" "}
                  Speedometer 3.1 benchmark
                </strong>
                . Our comprehensive testing reveals real-world performance
                differences to help you choose the best browser for your needs.
              </p>

              {/* Key Features */}
              {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400">
                  <svg
                    className="w-5 h-5 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Real-world Testing</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400">
                  <svg
                    className="w-5 h-5 text-blue-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Cross-Platform</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400">
                  <svg
                    className="w-5 h-5 text-purple-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Monthly Updates</span>
                </div>
              </div> */}
            </div>

            {/* Call to Action */}
            <div
              className={`flex flex-col sm:flex-row items-center justify-center gap-4 mb-10 transition-all duration-1000 delay-900 ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
            >
              <a
                href="#rankings"
                className="group inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <span>View Rankings</span>
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </a>

              <a
                href="#methodology"
                className="inline-flex items-center gap-2 bg-white/20 dark:bg-gray-800/30 backdrop-blur-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium px-6 py-3 rounded-xl border border-white/30 dark:border-gray-700/50 hover:bg-white/30 dark:hover:bg-gray-800/50 transition-all duration-300"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Learn More</span>
              </a>
            </div>

            {/* Last Updated Info */}
            <div
              className={`transition-all duration-1000 delay-1000 ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 bg-gradient-to-r from-purple-600/10 to-blue-600/10 backdrop-blur-sm border border-purple-200/30 dark:border-purple-700/30 rounded-xl px-3 sm:px-6 py-3 sm:py-4 w-full">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-0 sm:gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Last updated:
                    </span>
                  </div>
                  <time
                    dateTime="2025-11-08"
                    className="text-sm font-mono font-semibold text-purple-700 dark:text-purple-300 ml-6 sm:ml-2 sm:mt-0 mt-1"
                  >
                    November 8, 2025
                  </time>
                </div>
                <div className="hidden sm:block w-px h-6 bg-gray-300 dark:bg-gray-600"></div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-0 sm:gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Next update:</span>
                  <span className="text-blue-600 dark:text-blue-400 sm:ml-1 ml-6 sm:mt-0 mt-1">
                    ~ December 6, 2025
                  </span>
                </div>
              </div>

              <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 max-w-2xl mx-auto italic">
                💡 Want weekly updates?
                <Link
                  href="#support"
                  className="text-purple-600 dark:text-purple-400 hover:underline ml-1"
                >
                  Support the project
                </Link>{" "}
                to get more frequent performance insights and help us test more
                browsers!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          className="w-full h-20 text-white dark:text-gray-900"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            fill="currentColor"
            opacity="0.1"
          />
          <path
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
            fill="currentColor"
            opacity="0.05"
          />
        </svg>
      </div>
    </header>
  );
}
