# Comparison measurement plan

## Events

Comparison custom events use the existing `track()` API from `@vercel/analytics/react`; no additional analytics SDK is required. Events describe page views and committed actions, not chooser edits. Browser values are canonical catalog slugs, and no user or session identifier is added.

| Event                         | When                                                                                                                           | Properties                                                |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------- |
| `comparison_started`          | Once when a distinct pair is first shown in the mounted comparison view; query-only platform/engine changes do not restart it. | `browser_a`, `browser_b` (canonical slugs), `source`      |
| `comparison_applied`          | After a valid chooser submission or swap.                                                                                      | `browser_a`, `browser_b`, `source`                        |
| `comparison_platform_changed` | A platform form is submitted with a different platform than the currently committed selection.                                 | `browser_a`, `browser_b`, `platform`                      |
| `comparison_engine_changed`   | An engine form is submitted with a different engine than the committed selection.                                              | `browser_a`, `browser_b`, `browser`, `platform`, `engine` |
| `comparison_no_shared_data`   | The pair has measurements, but no shared measured platform. Pairs where neither browser has data are excluded.                 | `browser_a`, `browser_b`                                  |
| `comparison_share_succeeded`  | Clipboard copy or native share resolves successfully. Canceled/failed shares are not counted.                                  | `browser_a`, `browser_b`, `channel` (`copy` or `native`)  |
| `comparison_load_failed`      | A route/data error boundary or comparison client-render error appears.                                                         | `failure_category` (`route-load` or `client-render`)      |

`source` is limited to `detail`, `quiz`, `rankings`, `hub`, and `direct/unknown`. Known comparison links pass this short-lived attribution through session storage; otherwise a same-origin referrer path is reduced locally to an allowlisted category. The referrer, URL, query, free-text search, browser name, and error contents are never sent as event properties. Attribution is not added to canonical URLs. If storage is unavailable, referral attribution falls back to `direct/unknown` without affecting navigation.

Expected empty states are product outcomes, not failures: no-shared pairs produce `comparison_no_shared_data`; pairs with no measurements produce neither that event nor `comparison_load_failed`. Client rendering exceptions and server route/data errors remain distinct categories. Invalid pair URLs are handled as 404s by the route proxy and are not counted as data-load failures.

## Baseline and review

There is no pre-change custom-event baseline, so do not set conversion targets from the first release. Collect at least 28 days of events before setting targets; report event counts, denominators, date range, and sample size, and call out small samples rather than implying statistical confidence. Compare chooser submissions with starts and successful shares with starts, but treat those as descriptive rates until volume supports decisions.

The lab baseline is recorded in [comparison-performance.md](comparison-performance.md): current mobile-profile median LCP is 800 ms (range 800–812), CLS is 0, and the longest measured interaction is 56 ms (range 56–64). These are lab measurements, not field vitals. The project currently has no field LCP/INP/CLS integration; the page-view/custom-event integration alone is not evidence of field vitals. Do not claim field performance or add a second SDK for CMP-020. Revisit field vitals when an existing provider or enough CrUX coverage is available.

After release, review monthly (and after a data publication):

1. Event volume and source distribution; compare with the pre-release traffic baseline and flag small samples.
2. `comparison_no_shared_data` frequency against total starts, separating pairs with zero data from one-sided coverage in the application/data review.
3. `comparison_load_failed` by category, and investigate server/data failures without exporting error text or stacks.
4. Broken comparison links with a link crawl and HTTP status checks; 404s are not represented by the custom failure event.
5. Field LCP/INP/CLS only if a trustworthy source becomes available; keep lab and field results separate.
