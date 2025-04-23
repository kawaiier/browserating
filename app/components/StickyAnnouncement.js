"use client";

import React, { useState } from "react";

const StickyAnnouncement = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 flex items-center justify-between shadow-md z-50">
      <p className="text-sm md:text-base">
        Subscribe to my new subreddit{" "}
        <span className="font-bold">/r/aiBrowsing</span> — A place for
        discussing browsers and extensions that incorporate AI features
      </p>
      <div className="flex items-center space-x-4">
        <a
          href="https://www.reddit.com/r/aiBrowsing/" // Placeholder URL
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white text-blue-600 hover:bg-gray-100 font-semibold py-2 px-4 rounded text-sm md:text-base transition duration-150 ease-in-out"
        >
          Subscribe
        </a>
        <button
          onClick={() => setIsVisible(false)}
          className="text-white hover:text-gray-200 text-xl font-bold leading-none flex items-center justify-center h-6 w-6 rounded-full focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
          aria-label="Dismiss announcement"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default StickyAnnouncement;
