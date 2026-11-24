# Comparison rendering and performance

Comparison pages render on demand using server search parameters. The server reads and
merges the curated JSON files; React `cache()` shares the resulting catalog within a
request. There is no cross-request application cache or visitor-specific global state.
The chooser receives names, slugs and platform coverage, not version histories.
Alternative comparison and filter links do not automatically prefetch; ordinary site
navigation remains eligible for Next.js prefetching. Logos have fixed dimensions.

Publish data changes with a new build and deployment. The proxy's catalog, dynamic
comparison pages, metadata and statically generated sitemap must all come from that
same deployment. Do not edit deployed JSON in place: the sitemap and bundled catalog
would not necessarily update with it. A mutable data source would need an explicit,
coordinated invalidation policy. Next.js 16.2.12 sends dynamic comparison responses
with `Cache-Control: private, no-cache, no-store, max-age=0, must-revalidate` on a
local production server. No shared CDN cache lifetime is assumed. Reconsider caching
only with hosting measurements and verification of query and RSC cache isolation.

## Local measurement, November 24, 2026

On this Mac, Node 24.22.3 and Next.js 16.2.12, a production build reported the
comparison route as dynamic. The build reported 1.4 seconds compilation and 0.5
seconds static generation; these are framework phases, not total build time. There
are no prebuilt comparison pairs: valid pairs, including pairs outside the sitemap,
use the same on-demand route.

For `/compare/crest-vs-firefox?platform=macos-arm&engine.crest.macos-arm=WebKit`,
the first local request took 91 ms and two warm requests took 21 and 13 ms. The HTML
was 77,087 bytes uncompressed (13,680 gzip); an RSC response was 31,988 bytes
uncompressed (6,282 gzip). The HTML contained the selected 36.77 score. Twelve
JavaScript chunks referenced by that HTML totaled 206,798 gzip bytes, including
shared framework and site code. The charting chunk found in the build was not among
those referenced chunks. These sizes are local gzip estimates, not transfer sizes or
a route-specific delta. Empty and measured pairs both returned 200 in warm checks.

This is a current-state measurement, not the requested pre-PR-4 baseline: the earlier
baseline was not captured. It cannot establish compliance with the provisional 30 KiB
additional route-specific JavaScript ceiling. Repeat measurements with a browser
network trace and a comparable baseline before treating that ceiling as verified.
Client interaction latency, a controlled mobile lab profile and field LCP, INP and
CLS remain unmeasured. The respective 75th-percentile targets are 2.5 seconds,
200 ms and 0.1, reported separately for mobile and desktop. Do not infer field
performance from local server timings.

Before release, verify a fixture publication across body, metadata, coverage and
sitemap in a fresh build; check direct query-state reloads and an eligible pair and
an unsitemapped valid pair against that build. Record the device, throttle, repeated
lab results and variation alongside a browser network trace.
