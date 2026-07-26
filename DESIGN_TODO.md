# BrowseRating — Design To-Do List
> Branch: `design-update-2`  
> Review method: 5-Dimension Expert Critique (Huashu-Design)  
> Overall score: **6.2 / 10** — Good, with clear upgrade path to 7.5+

This document lists every design and craft issue found during the expert review, ordered by severity. Each item explains **what** to change, **where** to find it, and **why** it matters.

---

## Severity Legend

| Symbol | Level | Meaning |
|--------|-------|---------|
| ⚠️ | **Critical** | Breaks brand coherence, trust, or system integrity. Fix before shipping. |
| ⚡ | **Important** | Degrades user experience or product credibility. Fix in next sprint. |
| 💡 | **Optimization** | Elevates polish and distinctiveness. Address when bandwidth allows. |

---

## ⚠️ Critical — Fix Before Shipping

### 1. Skip-link uses off-system purple color

**File:** `app/page.js` — line 24  
**Current code:**
```jsx
className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-purple-600 hover:bg-purple-700 focus:text-white focus:shadow-xl focus:rounded-lg focus:font-semibold focus:transition-all focus:duration-200 focus:outline-none focus:ring-4 focus:ring-purple-500/50"
```
**Fix:**
```jsx
className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-accent-primary hover:bg-accent-primary-hover focus:text-white focus:shadow-xl focus:rounded-radius-md focus:font-semibold focus:transition-all focus:duration-200 focus:outline-none focus:ring-4 focus:ring-accent-primary/40"
```

**Why this matters:**  
The entire design system is built around a warm amber accent (`#D4A800`). The skip-link was left with `purple-600` from a previous design iteration, creating a jarring brand rupture at a component that keyboard and assistive-technology users encounter on every single page load. For a tool that emphasizes independence and trustworthiness, inconsistent focus states erode the sense that the product is carefully maintained. It is also a direct violation of the established design token system whose whole purpose is preventing exactly this kind of color drift.

---

### 2. Root page wrapper bypasses the design token canvas color

**File:** `app/page.js` — line 21  
**Current code:**
```jsx
<div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
```
**Fix:**
```jsx
<div className="min-h-screen bg-canvas transition-colors duration-200">
```

**Why this matters:**  
The design token `--bg-canvas` maps to `#fafaf8` in light mode and `#1a1a18` in dark mode — a carefully chosen warm off-white and warm near-black. Using `bg-white` (`#ffffff`) in light mode makes every card and surface layered on top of it slightly more "cold" than intended, because the contrast between pure white and the `#fafaf8` card surfaces is lost. In dark mode, `bg-gray-900` (`#111827`) is a cold Tailwind blue-grey, completely mismatched against the token-based warm neutrals used throughout every other component. This creates a subtle but visible tonal conflict between the page background and every surface that sits on it — cards, modals, and the navigation bar all leak the wrong undertone. The token system was built precisely to keep this consistent; bypassing it at the root level undermines the entire token architecture.

---

### 3. Non-existent Tailwind class `ml-18` silently breaks card alignment

**File:** `app/components/BrowserCard.js` — line 257  
**Current code:**
```jsx
<div className="flex flex-wrap gap-2 mt-4 ml-18">
```
**Fix:**
```jsx
<div className="flex flex-wrap gap-2 mt-4 ml-[72px]">
```
Or, if the intent is to align with the 56px logo container plus its 16px gap:
```jsx
<div className="flex flex-wrap gap-2 mt-4 ml-[calc(56px+1rem)]">
```

**Why this matters:**  
Tailwind's default spacing scale goes up to `ml-16` (64px) and then jumps to `ml-20` (80px). The class `ml-18` does not exist and Tailwind will silently ignore it, generating no CSS. This means the version badge, engine tag, and date badge in the metadata row underneath each browser name will be left-flush with the card edge instead of indented to align with the browser name text. Every single browser card in the listing is affected. The misalignment breaks the visual column structure that the card design is built around — the logo on the left, the name directly to its right, and the metadata beneath the name — a layout relationship that exists throughout all 60+ browser cards.

---

## ⚡ Important — Fix in Next Sprint

### 4. Hero stat card shows hardcoded benchmark score

**File:** `app/components/Header.js` — lines 239–242  
**Current code:**
```jsx
<span className="text-4xl font-extrabold text-neutral-900">47.5</span>
<span className="text-xs text-muted">Speedometer 3.1</span>
```
And the SVG gauge progress arc:
```jsx
strokeDasharray="326.73"
strokeDashoffset="45.74"
```

**Fix:**  
Pass the actual top score from the server through the component tree:

In `app/page.js`:
```jsx
const [initialBrowsers, lastModified] = await Promise.all([
  getBrowsersServer(),
  getDataLastModified(),
]);

// Compute top score server-side
const topScore = initialBrowsers.reduce((max, b) => {
  const score = b['macos-arm']?.versions?.[0]?.scores?.speedometer3 ?? 0;
  return score > max ? score : max;
}, 0);

// Pass to Header
<Header lastModified={lastModified} topScore={topScore} />
```

In `Header.js`, use `topScore` to render the number and calculate:
```jsx
const MAX_SCORE = 60; // Speedometer 3.1 practical ceiling
const circumference = 2 * Math.PI * 52; // 326.73
const dashOffset = circumference * (1 - topScore / MAX_SCORE);
```

**Why this matters:**  
BrowseRating's core value proposition is "independent, up-to-date benchmark data." A hero section that always reads 47.5 — regardless of the actual current top performer — directly contradicts that promise. When a user who knows the current top browser sees a wrong number in the most prominent position on the page, trust in all other numbers is immediately called into question. The static gauge also means the visual arc never changes, making it indistinguishable from a decorative illustration rather than live data. Data tools live and die by perceived data integrity; a hardcoded figure in the hero is the worst place for that integrity to fail.

---

### 5. Decorative platform pills in Hero are out of sync with functional platform selector

**File:** `app/components/Header.js` — lines 12–16 and 138–148  
**Current state:**  
The Hero section renders 4 decorative platform pills (macOS, Windows, Android, iPad) that are purely visual — no `onClick`, no navigation. Meanwhile, `BrowserRankingList` has 5 distinct functional platform options (macos-arm, android, ipad, windows, macos-intel).

**Two options:**

**Option A — Remove the decorative pills entirely** (recommended):
```jsx
{/* Remove the Platform Showcase div from Header.js lines 136–148 */}
```
Replace with a single line of supporting text if needed:  
`"Data available for macOS ARM, macOS Intel, Windows, Android, and iPad."`

**Option B — Make them interactive shortcut links:**
```jsx
const platforms = [
  { name: 'macOS ARM', slug: 'macos-arm', icon: '🍎' },
  { name: 'Windows', slug: 'windows', icon: '🪟' },
  { name: 'Android', slug: 'android', icon: '🤖' },
  { name: 'iPad', slug: 'ipad', icon: '📱' },
  { name: 'macOS Intel', slug: 'macos-intel', icon: '🖥️' },
];
// Each pill: <a href={`#rankings?platform=${p.slug}`}> or trigger context-level platform selection
```

**Why this matters:**  
Having two different lists of platforms — one decorative in the hero, one functional in the rankings section — creates a taxonomy conflict. The hero says "macOS" (one option); the actual selector shows "macOS ARM" and "macOS Intel" as separate platforms. A user interested in Windows performance clicks nothing in the hero (there is nothing to click), scrolls down, and has to re-learn the platform naming. Decorative UI elements that carry information but offer no action are a form of broken affordance: they look like they should do something because they look like interactive chips, and they don't. This is particularly damaging on a tool where the platform selector is the single most important user action on the page.

---

### 6. `BrowserCard` uses `scrollIntoView` — known scroll-breaking pattern

**File:** `app/components/BrowserCard.js` — line 97  
**Current code:**
```jsx
const handleCardInteraction = (e) => {
  if (e.type === 'click' || (e.type === 'keydown' && (e.key === 'Enter' || e.key === ' '))) {
    if (e.type === 'keydown') e.preventDefault();
    cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    setShowModal(true);
  }
};
```
**Fix:**
```jsx
const handleCardInteraction = (e) => {
  if (e.type === 'click' || (e.type === 'keydown' && (e.key === 'Enter' || e.key === ' '))) {
    if (e.type === 'keydown') e.preventDefault();
    setShowModal(true);
  }
};
```

**Why this matters:**  
`scrollIntoView` on a card that is already inside a scroll container (the page) causes the browser to scroll the card into view just before opening the modal. This creates a jarring position jump — the page scrolls slightly, then the modal opens — which makes the interaction feel broken. In browsers with strict overflow handling, it can also cause the outer scroll container to misbehave and jump unexpectedly. The scroll call is also unnecessary because clicking a card that is already visible (the user just clicked it) should not move anything — the card is already "in view." Removing this call makes the modal open instantly and smoothly without any preceding position jump.

---

### 7. Duplicate heading tag in Rankings section

**File:** `app/components/BrowserRankingList.js` — lines 580–583  
**Current state:**  
The page has `<h1>` in the Hero ("Browser Performance Rankings") and then `<h2>` in the Rankings section ("Browser Performance Rankings") with identical text. This creates a redundant heading hierarchy where the same string appears as both the primary page heading and a section heading.

**Fix:**  
Change the `BrowserRankingList` section heading text to differentiate it:
```jsx
<h2 className="text-3xl font-bold text-primary mb-2">Rankings by Platform</h2>
```
or simply:
```jsx
<h2 className="text-3xl font-bold text-primary mb-2">All Browsers</h2>
```

**Why this matters:**  
Screen reader users navigate pages by jumping between headings. When the same text appears at both `h1` and `h2` level, it produces a confusing outline ("Browser Performance Rankings → Browser Performance Rankings") that provides no navigational value. It also weakens SEO, since search engines assign lower weight to repeated heading content. The section heading should describe what is in that section specifically, not repeat the page title.

---

## 💡 Optimization — Polish When Bandwidth Allows

### 8. No custom typeface — defaulting to system fonts

**Files:** `app/globals.css`, `app/layout.js`  
**Current state:** No `@font-face` or Google Fonts import anywhere. The entire site renders in the OS default (SF Pro on Mac, Segoe UI on Windows, Roboto on Android).

**Recommended fix:**  
Add to `app/layout.js`:
```jsx
import { DM_Serif_Display, DM_Sans } from 'next/font/google';

const dmSerifDisplay = DM_Serif_Display({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});
```
Apply to the root `<html>` element and reference in Tailwind config.

Alternative pairing if a more editorial/journalistic tone is preferred: **Playfair Display** (display) + **Source Sans 3** (body).

**Why this matters:**  
The warm amber-neutral color system signals "editorial, measured, trustworthy." System fonts — especially `-apple-system` / Segoe UI — signal "default, uncustomized, template." Typography is the single highest-leverage design decision on a text-and-number-heavy page like this one. The 64pt score numbers in the hero and the browser names in the card list are the visual centerpieces of the product; rendering them in an undesigned system font is the equivalent of printing a carefully typeset magazine layout in Times New Roman. A matching typeface does not need to be elaborate — even a single display font applied only to headings and large numerals would lift the overall impression substantially.

---

### 9. Hero hero-right stat card has no connection to actual platform data

**File:** `app/components/Header.js` — lines 203–248  
**Current state:** The stat card shows "Top Benchmark Score" with a hardcoded value (covered in issue #4), but it also has no indication of *which platform* the score is from. Users land on the page, the hero shows 47.5 — but is that macOS ARM? Windows? The fastest platform? The slowest?

**Fix:**  
Add a platform label below the gauge label:
```jsx
<span className="text-xs text-muted">Speedometer 3.1 · macOS ARM</span>
```
Or, if `topScore` is now dynamic (issue #4), also pass `topPlatform` and render it:
```jsx
<span className="text-xs text-muted">
  Speedometer 3.1 · {platformNames[topPlatform]}
</span>
```

**Why this matters:**  
Benchmark scores without context are meaningless and misleading. A score of 47.5 on macOS ARM is a very different claim than 47.5 on Android. The absence of a platform label means a technically sophisticated user will immediately distrust the number, and a less technical user will form an incorrect mental model. Data integrity on a benchmarking tool requires that every number is accompanied by its measurement context.

---

### 10. Engine filter dropdown uses raw DOM manipulation instead of React state

**File:** `app/components/BrowserRankingList.js` — lines 447–477  
**Current code:**
```jsx
onClick={() => document.getElementById('engine-dropdown')?.classList.toggle('hidden')}
```
And:
```jsx
document.getElementById('engine-dropdown')?.classList.add('hidden');
```

**Fix:**  
Promote to controlled React state (consistent with the `SortDropdown` component already in the same file):
```jsx
const [engineDropdownOpen, setEngineDropdownOpen] = useState(false);

// Toggle: onClick={() => setEngineDropdownOpen(prev => !prev)}
// Close on selection: onClick={() => { handleEngineFilter(engine); setEngineDropdownOpen(false); }}
// Render: {engineDropdownOpen && <div className="absolute ...">}
```

**Why this matters:**  
Direct DOM manipulation inside a React component bypasses React's rendering cycle. This means React cannot track the dropdown's open/closed state, making it impossible to add keyboard navigation, close-on-outside-click behavior, or animate the open/close transition without additional complexity. It also creates a code inconsistency: `SortDropdown` directly below in the same file correctly uses `useState` for its open/close state. Two functionally identical dropdowns using different paradigms is a maintenance trap — a future developer will assume they work the same way and discover only at runtime that one does not respond to React-managed state changes.

---

### 11. `getScoreColor` thresholds are misaligned with the score system semantics

**File:** `app/components/BrowserCard.js` — lines 7–12  
**Current code:**
```js
const getScoreColor = (score) => {
  if (score >= 40) return '#D4A800'; // amber for high scores
  if (score >= 30) return '#B89200'; // warm good
  if (score >= 20) return '#A76A00'; // warm fair
  return '#C83A2E'; // warm red for poor
};
```

**Current semantic color tokens from `globals.css`:**
```css
--color-score-excellent: #1a8f5d;  /* green */
--color-score-good: #b89200;
--color-score-fair: #a76a00;
--color-score-poor: #c83a2e;
```

**Problem:** Scores ≥ 40 return `#D4A800` (amber, the primary brand accent) — but `#D4A800` is not the "excellent" semantic color; `#1a8f5d` (green) is. The amber accent is meant to be a brand highlight, not a data-encoding color. When the score badge and the brand accent use the same color, they blur into each other and lose their distinct communicative roles.

**Fix:**
```js
const getScoreColor = (score) => {
  if (score >= 40) return 'var(--color-score-excellent)'; // #1a8f5d green
  if (score >= 30) return 'var(--color-score-good)';
  if (score >= 20) return 'var(--color-score-fair)';
  return 'var(--color-score-poor)';
};
```
Use CSS variable references so dark mode overrides propagate automatically.

**Why this matters:**  
Color in a data tool carries semantic weight. Green means "this is good performance"; amber/yellow means "this is the brand." When the same amber hue encodes both "top score" (data meaning) and "brand accent" (identity meaning), neither meaning is clear. Users who understand color encoding will perceive high-scoring browsers as "branded" or "highlighted" rather than "excellent." This is a subtle but real confusion in information design.

---

### 12. Trend indicator duplicated in the card: shown twice per row

**File:** `app/components/BrowserCard.js` — lines 214–226 and 281–292  
**Current state:** The score change (e.g., `↑ 1.2`) appears once in the score cluster (as a colored pill next to the score) and again in the metadata row below (as `+1.2 pts`). Both are conditionally rendered on `scoreDifference !== null`.

**Fix:** Choose one location. The score cluster pill (top-right, near the score number) is higher impact. Remove the metadata row duplicate:
```jsx
{/* Remove lines 281–292 in the metadata cluster */}
```

**Why this matters:**  
Information repeated twice in a single card without additional context is visual noise. It makes the card feel busier than it needs to be, and a user reading it twice will momentarily wonder if the two values are the same, different, or measure different things. In information design, repetition without purpose is clutter — it dilutes attention from the primary data (the score number itself) and makes the card harder to scan at speed.

---

### 13. Missing `loading` state for the stat card gauge in the Hero

**File:** `app/components/Header.js` — lines 203–248  
**Current state:** The stat card renders unconditionally with the hardcoded score. Once the score is made dynamic (issue #4), it will need a loading state if the data fetch is asynchronous.

**Fix:** Since `getBrowsersServer()` is already called in `page.js` at the server level, this should be a server component prop — no loading state needed if passed correctly. However, ensure the `Header` component accepts and validates the `topScore` prop with a sensible fallback:
```jsx
export default function Header({ lastModified, topScore = 0 }) {
  // topScore of 0 renders the gauge arc at 0% — visually honest, never shows wrong data
}
```

**Why this matters:**  
A gauge that shows 0% is more honest than a gauge that always shows 47.5%. Fallback values should represent "no data" truthfully, not a plausible-looking invented value.

---

### 14. `BrowserCompareDropdown` import not used on the main page

**File:** `app/page.js` — line 1–9 (check imports)  
**Action:** Audit current imports in `page.js` and verify no unused component imports remain after the recent refactor. Unused imports add bundle weight and create confusion about which components are actually rendered.

```bash
# Quick check
grep -n "import" app/page.js
```

---

### 15. Dark mode canvas color is not the warmest possible expression

**File:** `app/globals.css` — line 117  
**Current:**
```css
.dark {
  --bg-canvas: var(--color-neutral-950);  /* resolves to #0f0e0c */
}
```
Wait — in the dark block, `neutral-950` is overridden to `#ffffff`. Let me re-examine: in the `.dark` block, `neutral-25` becomes `#1a1a18` and `neutral-950` becomes `#ffffff`. The canvas resolves via `var(--color-neutral-950)` which in dark mode = `#ffffff` — that cannot be right for a dark canvas.

**Actual issue:** The `.dark` block remaps `--bg-canvas` to `var(--color-neutral-950)` but `--color-neutral-950` in dark mode is overridden to `#ffffff` (white), which would make the dark canvas white. Re-examine the token chain:

```css
/* Dark mode overrides */
--color-neutral-950: #ffffff;   /* ← becomes white in dark mode */
--bg-canvas: var(--color-neutral-950);  /* ← would be white! */
```

But the dark canvas is actually defined directly:
```css
--bg-canvas: var(--color-neutral-950);
```
...which maps to `#ffffff` in `.dark`. This appears to be a token mapping error. The dark mode canvas should use `var(--color-neutral-25)` which in dark mode resolves to `#1a1a18`.

**Fix:**
```css
.dark {
  --bg-canvas: var(--color-neutral-25); /* #1a1a18 — correct warm dark */
}
```

**Why this matters:**  
If the dark canvas token is broken, the dark mode experience could be showing incorrect background colors throughout — which would explain why `bg-white dark:bg-gray-900` was hardcoded in `page.js` as a workaround in the first place. Fixing the token is the root fix; fixing the hardcode (issue #2) is the symptom fix. Both should be done together.

---

## Summary Table

| # | File | Line(s) | Severity | Category |
|---|------|---------|----------|----------|
| 1 | `app/page.js` | 24 | ⚠️ Critical | Brand consistency |
| 2 | `app/page.js` | 21 | ⚠️ Critical | Token system integrity |
| 3 | `app/components/BrowserCard.js` | 257 | ⚠️ Critical | Layout / Tailwind class |
| 4 | `app/components/Header.js` | 239–242 | ⚡ Important | Data integrity |
| 5 | `app/components/Header.js` | 136–148 | ⚡ Important | Information architecture |
| 6 | `app/components/BrowserCard.js` | 97 | ⚡ Important | Interaction behavior |
| 7 | `app/components/BrowserRankingList.js` | 580–583 | ⚡ Important | Heading hierarchy / SEO |
| 8 | `app/layout.js` | — | 💡 Optimization | Typography |
| 9 | `app/components/Header.js` | 244 | 💡 Optimization | Data context |
| 10 | `app/components/BrowserRankingList.js` | 447–477 | 💡 Optimization | React patterns |
| 11 | `app/components/BrowserCard.js` | 7–12 | 💡 Optimization | Color semantics |
| 12 | `app/components/BrowserCard.js` | 281–292 | 💡 Optimization | Information density |
| 13 | `app/components/Header.js` | 203–248 | 💡 Optimization | Data fallbacks |
| 14 | `app/page.js` | imports | 💡 Optimization | Bundle hygiene |
| 15 | `app/globals.css` | 117–133 | ⚡ Important | Token system integrity |

---

## Recommended Fix Order

**Batch 1 — 30 minutes, zero visual risk, highest ROI:**
1. Fix skip-link purple → amber (`page.js:24`)
2. Fix root wrapper `bg-white` → `bg-canvas` (`page.js:21`)
3. Fix `ml-18` → `ml-[72px]` (`BrowserCard.js:257`)
4. Audit and fix dark mode canvas token (`globals.css`)

**Batch 2 — 2–3 hours, requires data plumbing:**
5. Make Hero gauge score dynamic (pass `topScore` from server)
6. Add platform label to Hero stat card
7. Remove or make interactive the decorative platform pills in Hero
8. Fix duplicate heading text in Rankings section

**Batch 3 — 1 sprint, architectural improvements:**
9. Remove `scrollIntoView` from card interaction handler
10. Refactor engine filter dropdown to React state
11. Fix `getScoreColor` to use semantic token colors
12. Remove duplicate trend indicator from metadata row

**Batch 4 — When bandwidth allows:**
13. Introduce a custom typeface (DM Serif Display + DM Sans recommended)
14. Audit all unused imports

---

*Generated from: 5-Dimension Expert Critique using Huashu-Design skill*  
*Dimensions reviewed: Philosophy Alignment · Visual Hierarchy · Craft Quality · Functionality · Originality*
