'use client';

import { SHARE_COPY } from '../../lib/quiz-constants';
import { useEffect, useState } from 'react';
import { serializeQuizAnswers } from './quizState';

const BASE_URL = 'https://browserating.com';

export default function QuizShareButtons({ browserId, browserName, answers }) {
  const [copied, setCopied] = useState(false);
  const [hasNativeShare, setHasNativeShare] = useState(false);
  const shareParams = new URLSearchParams({ r: browserId });
  if (Array.isArray(answers)) shareParams.set('a', serializeQuizAnswers(answers));
  const shareUrl = `${BASE_URL}/quiz?${shareParams.toString()}`;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- detecting Web Share API support on mount
    setHasNativeShare(!!navigator.share);
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const el = document.createElement('textarea');
      el.value = shareUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleTwitter = () => {
    const text = encodeURIComponent(SHARE_COPY.twitter(browserName));
    const url = encodeURIComponent(shareUrl);
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  const handleNativeShare = async () => {
    if (!navigator.share) return;
    try {
      await navigator.share({
        title: SHARE_COPY.nativeShareTitle,
        text: SHARE_COPY.nativeShareText(browserName),
        url: shareUrl,
      });
    } catch {}
  };

  return (
    <div
      className="rounded-lg p-4 sm:p-5"
      style={{
        backgroundColor: 'var(--surface-sunken)',
        border: '1px solid var(--border-subtle)',
      }}
    >
      <p
        className="text-sm font-semibold text-center mb-4 uppercase tracking-wider"
        style={{ color: 'var(--text-subtle)' }}
      >
        Share your result
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-2 rounded-md border border-(--border-subtle) bg-(--surface-raised) px-4 py-2 text-sm font-medium text-(--text-default) transition-colors duration-200 hover:bg-(--surface-hovered) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--border-focused)"
        >
          {copied ? (
            <>
              <svg
                className="w-4 h-4"
                style={{ color: 'var(--color-success)' }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              {SHARE_COPY.copySuccess}
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              {SHARE_COPY.copyLabel}
            </>
          )}
        </button>

        <button
          onClick={handleTwitter}
          className="inline-flex items-center gap-2 rounded-md bg-(--color-neutral-900) px-4 py-2 text-sm font-medium text-(--color-neutral-0) transition-colors duration-200 hover:bg-(--color-neutral-800) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--border-focused)"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          Share on X
        </button>

        {hasNativeShare && (
          <button
            onClick={handleNativeShare}
            className="inline-flex items-center gap-2 rounded-md border border-(--border-subtle) bg-(--surface-raised) px-4 py-2 text-sm font-medium text-(--text-default) transition-colors duration-200 hover:bg-(--surface-hovered) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--border-focused)"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              />
            </svg>
            Share
          </button>
        )}
      </div>
    </div>
  );
}
