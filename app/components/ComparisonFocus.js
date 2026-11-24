'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { track } from '@vercel/analytics/react';
import { canonicalPair } from '@/app/lib/comparisonUrl';

// Native GET forms work without JavaScript; restore focus after an enhanced submission.
export default function ComparisonFocus({ first, second }) {
  const pathname = usePathname();
  const announcement = useRef(null);
  useEffect(() => {
    try {
      const target = sessionStorage.getItem('comparison-focus');
      if (target) {
        sessionStorage.removeItem('comparison-focus');
        document.getElementById(target)?.focus();
        if (target !== 'comparison-heading') {
          const message =
            document.getElementById('comparison-result')?.textContent || 'Result updated.';
          // Populate an already-mounted live region after navigation.
          setTimeout(() => {
            if (announcement.current) announcement.current.textContent = message;
          }, 100);
        }
      }
    } catch {
      // Storage may be unavailable; the native form still works.
    }
    const submitted = (event) => {
      if (!event.target.matches('form[data-comparison-control]')) return;
      const control = event.target.querySelector('select');
      const value = control?.value;
      const { first: browserA, second: browserB } = canonicalPair(first, second);
      if (control?.name === 'platform' && value && value !== control.dataset.current) {
        track('comparison_platform_changed', {
          browser_a: browserA,
          browser_b: browserB,
          platform: value,
        });
      } else {
        const match = control?.name.match(/^engine\.([a-z0-9-]+)\.([a-z0-9-]+)$/);
        if (match && value && control.dataset.current !== value) {
          track('comparison_engine_changed', {
            browser_a: browserA,
            browser_b: browserB,
            browser: match[1],
            platform: match[2],
            engine: value,
          });
        }
      }
      try {
        if (control?.id) sessionStorage.setItem('comparison-focus', control.id);
      } catch {
        // Navigation still works without storage.
      }
    };
    document.addEventListener('submit', submitted);
    return () => document.removeEventListener('submit', submitted);
  }, [pathname, first, second]);
  return <div ref={announcement} className="sr-only" role="status" aria-atomic="true" />;
}
