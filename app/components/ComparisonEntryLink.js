'use client';

import Link from 'next/link';
import { rememberComparisonSource } from '@/app/lib/comparisonAnalytics';

export default function ComparisonEntryLink({ href, source, children, ...props }) {
  return (
    <Link href={href} {...props} onClick={() => rememberComparisonSource(source, href)}>
      {children}
    </Link>
  );
}
