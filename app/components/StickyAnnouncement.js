'use client';

import React, { useEffect, useState } from 'react';

const announcements = [
  {
    id: 1,
    content: (
      <p className="body-small">
        Subscribe to <span className="font-semibold">/r/aiBrowsing</span> — A place for discussing
        browsers and extensions that incorporate AI features
      </p>
    ),
    buttonText: 'Subscribe',
    buttonUrl: 'https://www.reddit.com/r/aiBrowsing/',
  },
  {
    id: 2,
    content: (
      <p className="body-small">
        Follow me on <span className="font-semibold">X</span> for the latest updates and more
      </p>
    ),
    buttonText: 'Follow',
    buttonUrl: 'https://x.com/kawaiier101',
  },
  {
    id: 3,
    content: (
      <p className="body-small">
        Join our <span className="font-semibold">Telegram</span> community to discuss browsers and
        extensions
      </p>
    ),
    buttonText: 'Join',
    buttonUrl: 'https://t.me/thebrowsershq',
  },
];

const STORAGE_KEY = 'announcement_dismissed_at';
const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

const StickyAnnouncement = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentAnnouncement, setCurrentAnnouncement] = useState(null);

  useEffect(() => {
    try {
      const dismissedAt = localStorage.getItem(STORAGE_KEY);
      if (dismissedAt) {
        const elapsed = Date.now() - parseInt(dismissedAt, 10);
        if (elapsed < ONE_WEEK_MS) {
          return; // Still within the one-week cooldown
        }
      }
    } catch {
      // localStorage unavailable (SSR, private browsing, etc.) — show the banner
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect -- initializing from localStorage on mount
    setCurrentAnnouncement(announcements[Math.floor(Math.random() * announcements.length)]);
    setIsVisible(true);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    try {
      localStorage.setItem(STORAGE_KEY, Date.now().toString());
    } catch {
      // localStorage unavailable — dismiss for this session only
    }
  };

  if (!isVisible || !currentAnnouncement) {
    return null;
  }

  return (
    <div
      className="fixed bottom-0 left-0 right-0 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-0 sm:justify-between"
      style={{
        backgroundColor: 'var(--color-brand-subtle)',
        color: 'var(--text-default)',
        padding: 'var(--space-150) var(--space-200)',
        zIndex: 'var(--z-flag)',
        boxShadow: 'var(--shadow-overlay)',
      }}
    >
      {currentAnnouncement.content}
      <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
        <a
          href={currentAnnouncement.buttonUrl}
          target={currentAnnouncement.buttonUrl.startsWith('http') ? '_blank' : '_self'}
          rel={currentAnnouncement.buttonUrl.startsWith('http') ? 'noopener noreferrer' : ''}
          className="body-small font-semibold px-4 py-2 btn-atlantic transition-colors"
          style={{
            backgroundColor: 'var(--color-brand)',
            color: 'var(--text-inverse)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-brand-bold)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-brand)';
          }}
        >
          {currentAnnouncement.buttonText}
        </a>
        <button
          onClick={handleDismiss}
          className="flex items-center justify-center w-6 h-6 rounded-md transition-colors"
          style={{ color: 'var(--text-subtle)' }}
          aria-label="Dismiss announcement"
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--surface-hovered)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default StickyAnnouncement;
