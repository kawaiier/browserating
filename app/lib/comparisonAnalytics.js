const SOURCES = new Set(['detail', 'quiz', 'rankings', 'hub', 'direct/unknown']);
const SOURCE_KEY = 'comparison-source:';

export function comparisonSourceFromReferrer(referrer, origin) {
  try {
    const url = new URL(referrer);
    if (url.origin !== origin) return 'direct/unknown';
    if (url.pathname === '/quiz') return 'quiz';
    if (url.pathname === '/compare') return 'hub';
    if (url.pathname === '/') return 'rankings';
    if (/^\/browsers\/[^/]+\/?$/.test(url.pathname)) return 'detail';
  } catch {}
  return 'direct/unknown';
}

export function rememberComparisonSource(source, destination) {
  if (!SOURCES.has(source)) return;
  try {
    const url = new URL(destination, window.location.origin);
    if (url.origin === window.location.origin)
      sessionStorage.setItem(`${SOURCE_KEY}${url.pathname}`, source);
  } catch {
    // Analytics attribution is optional; navigation must still work.
  }
}

export function takeComparisonSource(pathname) {
  try {
    const key = `${SOURCE_KEY}${pathname}`;
    const source = sessionStorage.getItem(key);
    sessionStorage.removeItem(key);
    return SOURCES.has(source) ? source : null;
  } catch {
    return null;
  }
}
