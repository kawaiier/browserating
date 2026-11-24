import { NextResponse } from 'next/server';
import catalog from './public/data/browsers.json';
import { getBrowserSlug } from './app/lib/getBrowserSlug.js';
import {
  buildCompareUrl,
  parsePairSlug,
  parseViewState,
  resolveCompareRequest,
  searchParamsToObject,
} from './app/lib/comparisonUrl.js';

const knownSlugs = new Set(catalog.map((browser) => getBrowserSlug(browser.name)));

// Path that matches no route, so the rewrite renders the app's not-found page with a 404.
const NOT_FOUND_PATH = '/__not-found';

// Answers comparison URL errors and canonical redirects before rendering. The page streams
// behind the root loading boundary, so notFound()/permanentRedirect() there cannot set the
// HTTP status. The page keeps the same checks as a fallback.
export function proxy(request) {
  if (request.nextUrl.pathname === '/compare') {
    const query = searchParamsToObject(request.nextUrl.searchParams);
    if (query.a === undefined && query.b === undefined) return NextResponse.next();
    const pair =
      typeof query.a === 'string' && typeof query.b === 'string'
        ? parsePairSlug(`${query.a}-vs-${query.b}`)
        : null;
    if (!pair || !pair.every((slug) => knownSlugs.has(slug))) {
      return new Response(
        '<!doctype html><html lang="en"><title>Invalid comparison</title><h1>Choose two different browsers</h1><p>Both browsers must be in the catalog.</p><a href="/compare">Return to comparisons</a></html>',
        {
          status: 400,
          headers: { 'Content-Type': 'text/html; charset=utf-8' },
        }
      );
    }
    const { engines, platform, sharedOnly, metric } = parseViewState(query);
    return NextResponse.redirect(
      new URL(
        buildCompareUrl({ first: pair[0], second: pair[1], engines, platform, sharedOnly, metric }),
        request.url
      ),
      307
    );
  }
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
  matcher: ['/compare', '/compare/:slug'],
};
