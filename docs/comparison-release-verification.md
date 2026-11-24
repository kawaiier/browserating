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
ordered by version text. Every record has a globally unique immutable `observationId`
used by historical comparison URLs. Preserve IDs when editing existing records and assign
a new unique ID to each new record; never derive identity from version labels, dates, or
array positions. Version strings are opaque labels and may contain channels or build dates.
Missing or `null` metrics are unknown (RAM is `scores.ram` in MB; ad-block percentages
include zero), not fabricated scores. At runtime, Speedometer uses the first-listed version
for each selected engine; optional metrics use the first newest-first version with a non-null
value for that metric. Version labels are opaque and are never parsed or sorted to choose a
record. The 180-day freshness label is informational only: it marks measurements older than
180 calendar days as older, and does not remove them from comparisons or indexability.

Comparison policy ownership:

- `comparisonUrl.js`: lexicographic canonical pair slug, `order=reverse` presentation, and validated query serialization. Engine and observation choices stay keyed by browser slug/platform so they survive pair ordering.
- `comparisonViewModel.js`: engine/record selection, score validity, outcomes, metric coverage, and exact-date rules for historical selections.
- `comparisonMetrics.js`: metric definitions and score formatting.
- `comparisonOptions.js`: chooser availability under selected engines.
- `platformDefinitions.js`: the only benchmark platform keys and labels — `platformNames` (short, used in comparisons, rankings, and validation) and `platformTitles` (platform ranking page titles).
- `comparisonIndex.js`: sitemap eligibility using default engines and latest primary-metric coverage, independent of query state.
- `getComparisonData.js`: server-side composition of the shared model and sitemap slug generation.

The schema supports optional `source: "curated" | "community"` and `cohortId` fields on
individual version observations. Unmarked historical records are treated and displayed as
curated; do not backfill inferred source or cohort values. Community observations require a
stable, non-personal 1–64 character cohort ID. The selected observation ID in a comparison URL resolves
to that exact source/cohort, and the comparison evidence and query-specific metadata display
it. Cohort IDs are labels, not proof of matched hardware, methodology, or compatibility.

Historical pair selection still uses exact recorded calendar-date equality and withholds a
head-to-head result when dates differ or are unknown. Equal dates do not establish matched
hardware or setup. Browser detail history is shown as independent bars; no line trend is
inferred without compatible provenance. No cross-device averaging or population distribution
is implemented: define a defensible cohort rule, minimum sample count, and distribution
method in the separate UGC scope before adding those views. Community observations continue
to ship through the same reviewed static-data deployment; source-specific caching and
publication policies belong to the UGC implementation, not this schema groundwork.

Curated data ships with a deployment. Deploy the successful build so rendered comparison
content and sitemap coverage refresh together; cache behavior and invalidation are defined
in [comparison performance](comparison-performance.md).

## Maintainer release checklist

- [ ] Validate dataset IDs, ordering, engine uniqueness, and schema with `npm run validate:data`; review coverage-count changes.
- [ ] Run `npm test`, `npm run lint`, `npm run format:check`, and `npm run build`.
- [ ] Inspect a measured and an empty comparison, canonical URLs/metadata, and the generated sitemap after build.
- [ ] For comparison UI or shared-header/theme changes, run the applicable Playwright checks; header/theme changes also cover home, browser, platform, and quiz pages.
- [ ] Deploy the same validated data/build and verify production comparison content and cache policy.

The browser suite runs in Chromium, Firefox and WebKit and covers: HTTP normalization and
404s; metadata, canonical, robots and the per-pair social card; engine and platform
changes, reload, Back/Forward and swap; keyboard form validation and submission; empty
and one-sided pairs; axe checks on measured, empty, invalid-input and loading states in
both themes; 320px reflow; the hub; use without JavaScript; an operational data
failure with retry; and a shared-page check (`e2e/shared-pages.pw.js`) that home,
browser detail, platform ranking, and quiz pages load with one H1, the site header, and a
working theme toggle.

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
