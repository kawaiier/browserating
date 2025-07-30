"use client";

import React, { useEffect, useState } from "react";

const StickyAnnouncement = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [currentAnnouncement, setCurrentAnnouncement] = useState(null);

  // Define three different announcements
  const announcements = [
    {
      id: 1,
      content: (
        <p className="text-sm md:text-base">
          Subscribe to <span className="font-bold">/r/aiBrowsing</span> — A
          place for discussing browsers and extensions that incorporate AI
          features
        </p>
      ),
      buttonText: "Subscribe",
      buttonUrl: "https://www.reddit.com/r/aiBrowsing/",
      gradient: "from-orange-500 to-red-500",
      buttonClass: "bg-orange-600 hover:bg-orange-700 text-white",
    },
    {
      id: 2,
      content: (
        <p className="text-sm md:text-base">
          Follow me on <span className="font-bold">X</span> for the latest
          updates and more
        </p>
      ),
      buttonText: "Follow",
      buttonUrl: "https://x.com/kawaiier101",
      gradient: "from-black to-blue-500",
      buttonClass: "bg-black hover:bg-blue-700 text-white",
    },
    {
      id: 3,
      content: (
        <p className="text-sm md:text-base">
          Join our <span className="font-bold">Telegram</span> community to
          discuss browsers and extensions
        </p>
      ),
      buttonText: "Join",
      buttonUrl: "https://t.me/thebrowsershq",
      gradient: "from-blue-400 to-cyan-400",
      buttonClass: "bg-blue-500 hover:bg-cyan-500 text-white",
    },
  ];

  // Select a random announcement on component mount
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * announcements.length);
    setCurrentAnnouncement(announcements[randomIndex]);
  }, []);

  if (!isVisible || !currentAnnouncement) {
    return null;
  }

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 bg-gradient-to-r ${currentAnnouncement.gradient} text-white p-4 flex items-center justify-between shadow-md z-50`}
    >
      {currentAnnouncement.content}
      <div className="flex items-center space-x-4">
        <a
          href={currentAnnouncement.buttonUrl}
          target={
            currentAnnouncement.buttonUrl.startsWith("http")
              ? "_blank"
              : "_self"
          }
          rel={
            currentAnnouncement.buttonUrl.startsWith("http")
              ? "noopener noreferrer"
              : ""
          }
          className={`${currentAnnouncement.buttonClass} font-semibold py-2 px-4 rounded text-sm md:text-base transition duration-150 ease-in-out`}
        >
          {currentAnnouncement.buttonText}
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
