'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

// Native GET forms work without JavaScript; restore focus after an enhanced submission.
export default function ComparisonFocus() {
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
      try {
        const control = event.target.querySelector('select');
        if (control?.id) sessionStorage.setItem('comparison-focus', control.id);
      } catch {
        // Navigation still works without storage.
      }
    };
    document.addEventListener('submit', submitted);
    return () => document.removeEventListener('submit', submitted);
  }, [pathname]);
  return <div ref={announcement} className="sr-only" role="status" aria-atomic="true" />;
}
