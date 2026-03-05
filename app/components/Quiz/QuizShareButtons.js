'use client';

import { SHARE_COPY } from '../../lib/quiz-constants';
import { useEffect, useState } from 'react';

const BASE_URL = 'https://browserating.com';

export default function QuizShareButtons({ browserId, browserName }) {
  const [copied, setCopied] = useState(false);
  const [hasNativeShare, setHasNativeShare] = useState(false);
  const shareUrl = `${BASE_URL}/quiz?r=${browserId}`;

  useEffect(() => {
    setHasNativeShare(!!navigator.share); // eslint-disable-line react-hooks/set-state-in-effect
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
    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 sm:p-5 border border-gray-200 dark:border-gray-700">
      <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 text-center mb-4 uppercase tracking-wider">
        Share your result
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium px-4 py-2 rounded-xl transition-all duration-200 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
        >
          {copied ? (
            <>
              <svg
                className="w-4 h-4 text-green-500"
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
          className="inline-flex items-center gap-2 bg-black hover:bg-gray-800 text-white font-medium px-4 py-2 rounded-xl transition-all duration-200 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          Share on X
        </button>

        {hasNativeShare && (
          <button
            onClick={handleNativeShare}
            className="inline-flex items-center gap-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium px-4 py-2 rounded-xl transition-all duration-200 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
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
