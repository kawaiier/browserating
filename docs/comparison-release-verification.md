# Comparison release verification

Run on Node 24: `npm ci`, `npm test`, `npm run lint`, `npm run format:check`,
`npm run build`, `npx playwright install chromium firefox webkit`, then
`npm run test:e2e`. Playwright starts two production servers: port 3100 for the smoke
suite, and port 3101 with `BENCHMARK_DATA_DIR` pointing at a disposable copy of the data
for the data-failure spec. CI runs the browser job separately and keeps traces on
failure.

## Benchmark data publication

Before publishing edits to `public/data/`, run `npm run validate:data` (also run by
`npm run build` through `prebuild`). `npm test` validates the live files in CI. The check
blocks malformed data and reports ambiguous dates or missing dates separately. It also
prints the current count of browsers with a valid primary-engine measurement and the
canonical indexable-pair count; review changes to these coverage figures and verify the
sitemap after the build rather than maintaining a separate candidate list.

Platform records join to `browsers.json` by exact `name`. Keep each browser/platform's
engine records unique, and review their order deliberately: the first listed engine is
primary and controls default comparisons and indexable coverage. Keep version records
newest-first by recorded date; equal or absent dates are reported as ambiguous, never
ordered by version text. Missing or `null` metrics are unknown (RAM is `scores.ram` in
MB; ad-block percentages include zero), not fabricated scores.

The current schema has no approved benchmark revision, source, hardware/setup, or method
reference fields. The validation report keeps this historical provenance gap separate
from hard errors; do not backfill legacy records with inferred values. Add those fields
only through a documented migration once their meaning and collection process are agreed.

Curated data ships with a deployment. Deploy the successful build so rendered comparison
content and sitemap coverage refresh together, following the publication policy in
[comparison performance](comparison-performance.md).

The browser suite runs in Chromium, Firefox and WebKit and covers: HTTP normalization and
404s; metadata, canonical, robots and the per-pair social card; engine and platform
changes, reload, Back/Forward and swap; keyboard form validation and submission; empty
and one-sided pairs; axe checks on measured, empty, invalid-input and loading states in
both themes; 320px reflow; the hub; use without JavaScript; and an operational data
failure with retry.

For each release, also review measured and empty pairs at 320px and desktop widths in
light and dark themes, including long names, 200% zoom, forced colors and reduced
motion, and run VoiceOver/Safari and NVDA/Windows. Automated axe checks do not replace
those reviews.

## November 24, 2026

Node 24.22.3 on macOS 27.2.1: 72 unit tests, lint, format check and the default
Turbopack build passed. Chromium and WebKit smoke suites and the data-failure spec passed
(35 tests). The failure spec passed 12 consecutive runs, including 4 cold server starts.
Playwright's Firefox build does not launch on macOS 27 ("Could not find profile
folder", also outside Playwright). Firefox runs in the Ubuntu CI job; that job has not run on this branch yet.

State matrix: measured, long names, one-sided, empty, invalid input, loading and hub, at
320×900 and 1440×900, in light and dark (28 screenshots). No page-level horizontal
overflow. Finding fixed: the loading skeleton was nearly invisible in dark mode (#121212
on #1a1a1a) and now uses `--border-subtle`.

Fixed during verification: comparison content streamed behind `loading.js` stayed hidden
without JavaScript (a `<noscript>` style now reveals it), and the error page's
"Try again" used `reset`, which doesn't refetch server data (now `retry`).

Open, needs a person (owner: FE / QA, P1): VoiceOver/Safari and NVDA/Windows passes
(CMP-010).
