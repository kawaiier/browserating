# Comparison release verification

Run on Node 24: `npm ci`, `npm test`, `npm run lint`, `npm run format:check`,
`npm run build`, `npx playwright install chromium`, then `npm run test:e2e`.
Playwright starts the production server on port 3100. CI runs the browser job
separately and retains traces on failure.

For each release, review measured and empty pairs at 320px and desktop widths in
light and dark themes, including long names, 200% zoom, forced colors and reduced
motion. Check keyboard focus and perform VoiceOver/Safari and NVDA/Windows checks;
record versions, findings, owners and priorities. Automated axe checks do not
replace these reviews.

Open P1 follow-ups (owner: FE / QA):

- CMP-010: complete the VoiceOver and NVDA checks.
- CMP-011 and CMP-014: exercise an operational data-loading failure and retry,
  and audit the actual loading state in both themes. The smoke suite does not
  inject server data failures or guarantee interception of a streamed skeleton.
- CMP-012, CMP-013, CMP-019 and CMP-023: finish their release criteria, including
  data validation, publication and performance checks. Do not treat the browser
  suite as proof of those criteria.
- CMP-014: review the viewport/theme/state matrix manually and verify keyboard-only
  selection and focus in supported browsers. Chromium automation is not a
  substitute for cross-browser or assistive-technology testing.

Local verification on November 24, 2026: Node 24.22.3 unit tests and lint passed;
production webpack build and 11 Chromium smoke tests passed. The default
Turbopack build could not bind its internal port in the local sandbox, including
a retry with escalation. The default build and CI job still need verification in
an environment that permits that port. The comparison route was dynamic in the
production build; HTTP checks observed 308 normalization and 404 invalid routes.
