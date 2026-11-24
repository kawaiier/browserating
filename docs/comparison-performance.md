# Comparison rendering and performance

Comparison pages render on demand using server search parameters. The server reads and
merges the curated JSON files; React `cache()` shares the resulting catalog within a
request. There is no cross-request application cache or visitor-specific global state.
The chooser receives names, slugs and platform coverage, not version histories.
Alternative comparison and filter links do not automatically prefetch; ordinary site
navigation remains eligible for Next.js prefetching. Logos have fixed dimensions.

Publish data changes with a new build and deployment. The proxy's catalog, dynamic
comparison pages, metadata, social cards and statically generated sitemap must all come
from that same deployment. Do not edit deployed JSON in place: the sitemap and bundled
catalog would not necessarily update with it. A mutable data source would need an
explicit, coordinated invalidation policy. Next.js sends dynamic comparison responses
with `Cache-Control: private, no-cache, no-store, max-age=0, must-revalidate` on a
local production server. No shared CDN cache lifetime is assumed. Reconsider caching
only with hosting measurements and verification of query and RSC cache isolation.

`BENCHMARK_DATA_DIR` overrides the data directory for the server-side loader only. It
exists for the data-failure smoke test; production leaves it unset.

## Measurements, November 24, 2026

Environment: MacBook (Apple Silicon), macOS 27.2.1, Node 24.22.3, Next.js 16.4.6,
default Turbopack production builds served with `next start`. Baseline is commit
`6bc1f42` (before the PR 4 client components), built the same way in a separate
worktree. Both builds report `/compare/[slug]` as dynamic, with no prebuilt pairs.

### Payload and server timing (`/compare/crest-vs-firefox`)

| Measure                           | Baseline `6bc1f42` | Current            |
| --------------------------------- | ------------------ | ------------------ |
| Referenced JS chunks              | 9                  | 10                 |
| Referenced JS, gzip               | 191,926 B          | 197,144 B          |
| HTML, raw / gzip                  | 42,313 / 8,672 B   | 74,580 / 13,544 B  |
| Client-navigation RSC, raw / gzip | 10,831 / 2,583 B   | 26,485 / 5,204 B   |
| First request after start         | 112 ms             | 120 ms             |
| Warm median of 10 (min–max)       | 9.7 ms (7–15)      | 13.1 ms (9.3–22.5) |
| Build wall time                   | 6.8 s              | 4.5 s              |

Route JavaScript grew by 5,218 gzip bytes (5.1 KiB), within the provisional 30 KiB
ceiling. No charting chunk is referenced by either build. The empty pair
(`deta-surf-vs-web`) has the same chunk set.

### Lab run (repeatable mobile profile)

Playwright Chromium, 412×823 viewport at 1.75 DPR with a mobile user agent, CDP network
emulation of 150 ms RTT, 1.6 Mbps down and 750 Kbps up, and 4× CPU throttling. Five
cold runs per build. LCP and CLS come from `PerformanceObserver`; interaction latency is
the longest Event Timing entry while choosing two browsers, swapping, and opening the
engine select.

| Metric (median, range) | Baseline         | Current          | Target (p75) |
| ---------------------- | ---------------- | ---------------- | ------------ |
| LCP                    | 508 ms (488–512) | 800 ms (800–812) | ≤ 2.5 s      |
| CLS                    | 0 (0–0)          | 0 (0–0)          | ≤ 0.1        |
| Load event             | 1,608 ms         | 1,457 ms         | —            |
| Longest interaction    | —                | 56 ms (56–64)    | INP ≤ 200 ms |

These are lab results, not field data. Once Vercel Analytics or CrUX has enough
comparison-page traffic, report p75 LCP, INP and CLS separately for mobile and desktop
and treat those as the release signal.

### Publication check

With one added Firefox Beta Windows record, a fresh build turned
`firefox-beta-vs-floorp` from `noindex, follow` to `index, follow`, showed the score in
the body, added the pair to the sitemap, and served a score card from
`/api/og/compare`. Restoring the data and rebuilding reverted all four. A direct load
with query state (`?platform=macos-arm&engine.crest.macos-arm=WebKit`) renders the
selected 36.77 score in the HTML.
