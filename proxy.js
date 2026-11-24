import { NextResponse } from 'next/server';
import catalog from './public/data/browsers.json';
import { getBrowserSlug } from './app/lib/getBrowserSlug.js';
import { resolveCompareRequest } from './app/lib/comparisonUrl.js';

const knownSlugs = new Set(catalog.map((browser) => getBrowserSlug(browser.name)));

// Path that matches no route, so the rewrite renders the app's not-found page with a 404.
const NOT_FOUND_PATH = '/__not-found';

// Answers comparison URL errors and canonical redirects before rendering. The page streams
// behind the root loading boundary, so notFound()/permanentRedirect() there cannot set the
// HTTP status. The page keeps the same checks as a fallback.
export function proxy(request) {
  let slug;
  try {
    slug = decodeURIComponent(request.nextUrl.pathname.slice('/compare/'.length));
  } catch {
    slug = null; // malformed percent-encoding
  }
  const result = resolveCompareRequest(slug, request.nextUrl.searchParams, knownSlugs);
  if (result.type === 'not-found') {
    return NextResponse.rewrite(new URL(NOT_FOUND_PATH, request.url));
  }
  if (result.type === 'redirect') {
    return NextResponse.redirect(new URL(result.url, request.url), 308);
  }
  return NextResponse.next();
}

export const config = {
  matcher: '/compare/:slug',
};
