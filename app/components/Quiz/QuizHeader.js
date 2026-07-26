'use client';

import DarkModeToggle from '../DarkModeToggle';
import Image from 'next/image';
import Link from 'next/link';

export default function QuizHeader() {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center px-4 sm:px-6"
      style={{
        backgroundColor: 'var(--surface-overlay)',
        borderBottom: '1px solid var(--border-subtle)',
      }}
    >
      <div className="flex items-center justify-between w-full max-w-5xl mx-auto">
        <Link href="/" aria-label="BrowseRating Home" className="flex items-center">
          <Image
            src="/images/logo.png"
            alt="BrowseRating"
            width={120}
            height={60}
            className="w-auto h-7"
          />
        </Link>

        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/#rankings"
            className="text-sm font-medium transition-colors duration-200 flex items-center gap-1"
            style={{ color: 'var(--text-subtle)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--text-default)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--text-subtle)';
            }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="hidden sm:inline">Back to Rankings</span>
            <span className="sm:hidden">Rankings</span>
          </Link>
          <DarkModeToggle />
        </div>
      </div>
    </header>
  );
}
