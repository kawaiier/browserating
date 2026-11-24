'use client';

import { useEffect, useRef, useState } from 'react';
import { track } from '@vercel/analytics/react';

export default function ComparisonShare({ first, second, path, title, printDate }) {
  const [browserA, browserB] = [first, second].sort();
  const [message, setMessage] = useState('');
  const [fallbackUrl, setFallbackUrl] = useState('');
  const dateRef = useRef(null);
  const sourceRef = useRef(null);

  useEffect(() => {
    const updatePrintDetails = () => {
      if (dateRef.current) dateRef.current.textContent = new Date().toLocaleDateString();
      if (sourceRef.current)
        sourceRef.current.textContent = new URL(path, window.location.origin).href;
    };
    window.addEventListener('beforeprint', updatePrintDetails);
    return () => window.removeEventListener('beforeprint', updatePrintDetails);
  }, [path]);

  const url = () => new URL(path, window.location.origin).href;
  const copy = async () => {
    const value = url();
    try {
      await navigator.clipboard.writeText(value);
      track('comparison_share_succeeded', {
        browser_a: browserA,
        browser_b: browserB,
        channel: 'copy',
      });
      setFallbackUrl('');
      setMessage('Comparison link copied.');
    } catch {
      setFallbackUrl(value);
      setMessage('Could not copy the link. Select and copy it below.');
    }
  };
  const share = async () => {
    if (!navigator.share) return copy();
    try {
      await navigator.share({ title, url: url() });
      track('comparison_share_succeeded', {
        browser_a: browserA,
        browser_b: browserB,
        channel: 'native',
      });
      setMessage('');
    } catch (error) {
      if (error?.name !== 'AbortError') {
        setFallbackUrl(url());
        setMessage('Could not share the link. Select and copy it below.');
      }
    }
  };

  return (
    <>
      <div className="comparison-share mb-6">
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={copy}
            className="min-h-[44px] rounded px-3 py-2"
            style={{ border: '1px solid currentColor' }}
          >
            Copy link
          </button>
          <button
            type="button"
            onClick={share}
            className="min-h-[44px] rounded px-3 py-2"
            style={{ border: '1px solid currentColor' }}
          >
            Share
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="min-h-[44px] rounded px-3 py-2"
            style={{ border: '1px solid currentColor' }}
          >
            Print
          </button>
        </div>
        <p role="status" aria-live="polite">
          {message}
        </p>
        {fallbackUrl && (
          <label className="block mt-2">
            Comparison URL{' '}
            <input
              className="block w-full p-2"
              style={{
                border: '1px solid currentColor',
                background: 'var(--surface-raised)',
                color: 'var(--text-default)',
              }}
              readOnly
              value={fallbackUrl}
              onFocus={(event) => event.target.select()}
            />
          </label>
        )}
      </div>
      <div className="comparison-print-meta">
        <p>
          Source URL: <span ref={sourceRef}>{`https://browserating.com${path}`}</span>
        </p>
        <p>
          Print date: <span ref={dateRef}>{printDate}</span>
        </p>
      </div>
    </>
  );
}
