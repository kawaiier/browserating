'use client';

import { useEffect } from 'react';

// Native GET forms work without JavaScript; restore focus after an enhanced submission.
export default function ComparisonFocus() {
  useEffect(() => {
    try {
      if (sessionStorage.getItem('comparison-selection')) {
        sessionStorage.removeItem('comparison-selection');
        document.getElementById('comparison-result')?.focus();
      }
    } catch {
      // Storage may be unavailable; the native form still works.
    }
    const submitted = (event) => {
      if (!event.target.matches('form[data-comparison-control]')) return;
      try {
        sessionStorage.setItem('comparison-selection', '1');
      } catch {
        // Navigation still works without storage.
      }
    };
    document.addEventListener('submit', submitted);
    return () => document.removeEventListener('submit', submitted);
  }, []);
  return null;
}
