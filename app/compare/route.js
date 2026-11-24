import { NextResponse } from 'next/server';
import catalog from '@/public/data/browsers.json';
import { getBrowserSlug } from '@/app/lib/getBrowserSlug';
import {
  buildCompareUrl,
  parsePairSlug,
  parseViewState,
  searchParamsToObject,
} from '@/app/lib/comparisonUrl';

export function GET(request) {
  const url = new URL(request.url);
  const query = searchParamsToObject(url.searchParams);
  const pair =
    typeof query.a === 'string' && typeof query.b === 'string'
      ? parsePairSlug(`${query.a}-vs-${query.b}`)
      : null;
  const known = new Set(catalog.map((browser) => getBrowserSlug(browser.name)));
  if (!pair || !pair.every((slug) => known.has(slug))) {
    return new Response(
      '<!doctype html><html lang="en"><title>Invalid comparison</title><h1>Choose two different browsers</h1><p>Both browsers must be in the catalog.</p><a href="/">Return to Browserating</a></html>',
      {
        status: 400,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      }
    );
  }
  const { engines, platform, sharedOnly } = parseViewState(query);
  return NextResponse.redirect(
    new URL(
      buildCompareUrl({ first: pair[0], second: pair[1], engines, platform, sharedOnly }),
      url
    ),
    307
  );
}
