# Browser Quiz Feature — Implementation Plan

## Overview

An interactive, visually polished multi-step quiz at `/quiz` that guides users through 7 questions about their browsing preferences and recommends the best browser from a curated set of ~18 browsers. Results feature a hero recommendation with runner-ups, shareable via URL and social buttons.

---

## 1. Curated Browser Set (~18 browsers)

Only stable, recommendable browsers — no betas, nightlies, or obscure/unmaintained ones:

| Browser | Engine | Profile Keywords |
|---------|--------|-----------------|
| **Google Chrome** | Blink | Mainstream, fast, Google ecosystem, extensions king |
| **Firefox** | Gecko | Privacy-respecting, open source, customizable, independent |
| **Safari** | WebKit | Apple ecosystem, battery efficient, minimal, native |
| **Microsoft Edge** | Blink | Productivity, Microsoft ecosystem, AI features, good defaults |
| **Brave** | Blink | Privacy-first, built-in ad blocker, crypto/web3, fast |
| **Vivaldi** | Blink | Power user, extreme customization, tab management, feature-rich |
| **Opera** | Blink | Built-in VPN, social sidebars, flow features, casual |
| **Opera GX** | Blink | Gaming, resource limiter, aesthetic, younger audience |
| **Arc Browser** | Blink | Innovative UI, workspace-based, minimal-maximal, design-forward |
| **Zen Browser** | Gecko | Minimal, beautiful, open source, Firefox-based, rising star |
| **Tor Browser** | Gecko | Maximum anonymity, anti-surveillance, journalist/activist |
| **Librewolf** | Gecko | Hardened Firefox, no telemetry, privacy purist, open source |
| **DuckDuckGo Browser** | Blink/WebKit | Simple privacy, fire button, non-technical users |
| **Orion** | WebKit | Kagi, zero telemetry, native macOS, Chrome extensions on WebKit |
| **Floorp** | Gecko | Customizable Firefox fork, sidebar, vertical tabs, open source |
| **Mullvad Browser** | Gecko | Anti-fingerprinting, Tor Project collab, no account needed |
| **Thorium** | Blink | Performance-optimized Chromium, speed enthusiast |
| **Samsung Internet** | Blink | Android default for Samsung, good ad blocking, mobile-focused |

---

## 2. Browser Characteristic Profiles

Each browser gets scored on trait dimensions (0–10 scale). This lives in a static data file `public/data/quiz/browser-profiles.json`.

### Trait Dimensions

| Trait | Description |
|-------|-------------|
| `privacy` | Tracking protection, data collection stance, telemetry |
| `speed` | Raw performance (informed by our Speedometer data) |
| `customization` | Settings depth, extensions, themes, UI configurability |
| `minimalism` | Clean UI, low clutter, distraction-free |
| `features` | Built-in tools (VPN, ad blocker, sync, sidebar, AI) |
| `openSource` | Source availability, community governance |
| `resourceEfficiency` | RAM usage, battery impact, lightweight |
| `ecosystem` | Integration with OS/services (Google, Apple, Microsoft) |
| `innovation` | Novel UI concepts, unique approach to browsing |
| `easeOfUse` | Beginner-friendliness, gentle learning curve |

### Example Profile Entry

```json
{
  "id": "brave",
  "name": "Brave",
  "tagline": "The privacy browser that doesn't compromise on speed",
  "traits": {
    "privacy": 9,
    "speed": 8,
    "customization": 6,
    "minimalism": 6,
    "features": 8,
    "openSource": 9,
    "resourceEfficiency": 7,
    "ecosystem": 4,
    "innovation": 7,
    "easeOfUse": 8
  },
  "highlights": [
    "Built-in ad & tracker blocking",
    "Chromium-based with full extension support",
    "Brave Search and privacy-focused ecosystem"
  ],
  "platforms": ["windows", "macos-arm", "macos-intel", "android", "ipad"],
  "bestFor": "Privacy-conscious users who want Chrome's compatibility without Google's tracking"
}
```

---

## 3. Quiz Questions (7 questions)

Each question has 3–4 options. Each option contributes weighted boosts to trait dimensions. This data lives in `public/data/quiz/questions.json`.

### Q1: "What matters most in a browser?"
*Core priority — the most important differentiator*

| Option | Label | Trait Boosts |
|--------|-------|-------------|
| A | **Speed & Performance** — I want everything to load instantly | `speed: +3, resourceEfficiency: +2` |
| B | **Privacy & Security** — My data is not for sale | `privacy: +3, openSource: +1` |
| C | **Features & Tools** — Give me everything built-in | `features: +3, customization: +1` |
| D | **Simplicity** — Just get out of my way | `minimalism: +3, easeOfUse: +2` |

### Q2: "How many tabs do you usually have open?"
*Reveals workflow complexity and resource needs*

| Option | Label | Trait Boosts |
|--------|-------|-------------|
| A | **1–5 tabs** — I keep things tidy | `minimalism: +2, resourceEfficiency: +2, easeOfUse: +1` |
| B | **5–20 tabs** — A healthy mix | `features: +1, speed: +1` |
| C | **20–50 tabs** — I'm a multitasker | `customization: +2, features: +2, resourceEfficiency: +1` |
| D | **50+** — I live in my browser | `customization: +3, features: +2, innovation: +2` |

### Q3: "How do you feel about customization?"
*Power user vs simplicity seeker*

| Option | Label | Trait Boosts |
|--------|-------|-------------|
| A | **Don't touch my settings** — Defaults are fine | `easeOfUse: +3, minimalism: +2` |
| B | **Some tweaks** — A few extensions and a nice theme | `customization: +1, features: +1` |
| C | **I want control over everything** — Custom CSS, flags, the works | `customization: +3, openSource: +2, innovation: +1` |

### Q4: "Which ecosystem are you in?"
*Platform loyalty and integration needs*

| Option | Label | Trait Boosts |
|--------|-------|-------------|
| A | **Google** — Gmail, Drive, YouTube, Android | `ecosystem: +3, speed: +1` |
| B | **Apple** — iCloud, macOS, iPhone | `ecosystem: +3, resourceEfficiency: +2, minimalism: +1` |
| C | **Microsoft** — Outlook, OneDrive, Windows | `ecosystem: +3, features: +1` |
| D | **None / Independent** — I avoid big tech when I can | `privacy: +2, openSource: +3, innovation: +1` |

### Q5: "What's your stance on ads and trackers?"
*Privacy spectrum*

| Option | Label | Trait Boosts |
|--------|-------|-------------|
| A | **I don't mind them** — Ads keep the internet free | `easeOfUse: +2, ecosystem: +1` |
| B | **Block ads, but I'm flexible** — An ad blocker extension is enough | `privacy: +1, features: +1` |
| C | **Block everything by default** — Built-in protection is a must | `privacy: +3, features: +2` |
| D | **Maximum anonymity** — I want anti-fingerprinting and Tor-level protection | `privacy: +4, openSource: +2` |

### Q6: "Do you care if your browser is open source?"
*Values alignment*

| Option | Label | Trait Boosts |
|--------|-------|-------------|
| A | **Not really** — I just want it to work | `easeOfUse: +2, features: +1` |
| B | **Nice to have** — I appreciate transparency | `openSource: +1, privacy: +1` |
| C | **It's a must** — I only trust what I can verify | `openSource: +3, privacy: +2` |

### Q7: "What describes your ideal browser's look and feel?"
*UI philosophy — the subjective taste question*

| Option | Label | Trait Boosts |
|--------|-------|-------------|
| A | **Clean and familiar** — Like Chrome, but better | `easeOfUse: +2, minimalism: +1, ecosystem: +1` |
| B | **Minimal and zen** — Beautiful, quiet, no clutter | `minimalism: +3, innovation: +2` |
| C | **Feature-packed dashboard** — Sidebar, workspaces, panels, tools everywhere | `features: +3, customization: +2, innovation: +1` |
| D | **Unique and experimental** — I want something no other browser does | `innovation: +3, customization: +2` |

---

## 4. Scoring Algorithm

### Step 1: Accumulate Trait Scores
As the user answers questions, accumulate their trait preference vector:

```
userTraits = { privacy: 0, speed: 0, customization: 0, ... }

For each answer:
  For each trait boost in the answer:
    userTraits[trait] += boostValue
```

### Step 2: Normalize User Traits
Convert to percentages so the magnitude doesn't skew results:

```
total = sum(all userTraits values)
normalizedUserTraits[trait] = userTraits[trait] / total
```

### Step 3: Compute Match Score Per Browser
For each browser, compute cosine similarity between the normalized user trait vector and the browser's normalized trait vector:

```
For each browser:
  browserNorm = normalize(browser.traits)  // same normalization

  dotProduct = sum(normalizedUserTraits[t] * browserNorm[t] for each trait t)
  magnitudeA = sqrt(sum(normalizedUserTraits[t]^2))
  magnitudeB = sqrt(sum(browserNorm[t]^2))

  matchScore = dotProduct / (magnitudeA * magnitudeB)
  matchPercentage = round(matchScore * 100)
```

### Step 4: Platform Filtering (Optional Boost)
If Q4 reveals a platform (Google → Android/Windows, Apple → macOS/iPad, Microsoft → Windows), give a small bonus (+5%) to browsers available on those platforms. But don't exclude browsers — just boost relevance.

### Step 5: Rank and Return Top 3
Sort browsers by matchPercentage descending. Return top 1 as hero, next 2 as runners-up.

### Why Cosine Similarity?
- Direction-based, not magnitude-based — it rewards browsers whose trait *shape* matches the user's preference *shape*
- A user who cares about privacy+speed will match a fast privacy browser, even if absolute trait values differ
- It's deterministic, explainable, and lightweight to compute client-side

---

## 5. Results Page Design

### Hero Recommendation (Top Pick)
- Large card with browser logo (from existing `browsers.json`), name, match percentage
- Tagline from the profile (e.g., "The privacy browser that doesn't compromise on speed")
- 3 highlight bullets explaining *why* this browser matched
- "Visit Website" button linking to browser's website (from `browsers.json`)
- "View Rankings" link back to home page to see its benchmark scores
- Trait radar/bar chart showing the overlap between user preferences and browser profile

### Runner-ups (2nd & 3rd)
- Smaller cards below the hero
- Logo, name, match percentage, tagline
- "Why this one?" expandable that shows the highlights

### Share Section
- Shareable URL: `/quiz?r=brave` — encodes the result browser ID as a query param
- When visiting a shared link, show the result directly with a "Take the quiz yourself" CTA
- Share buttons: Copy link, X/Twitter ("My browser match is Brave! Find yours at browserating.com/quiz"), generic share (Web Share API where supported)

### Retake
- "Retake Quiz" button that clears state and starts over

---

## 6. Component Architecture

```
app/
├── quiz/
│   └── page.js                          # Server component — quiz page entry
├── components/
│   └── Quiz/
│       ├── QuizContainer.js             # Client component — orchestrates the entire quiz flow
│       ├── QuizIntro.js                 # Welcome screen with CTA to start
│       ├── QuizProgress.js              # Step indicator bar (segmented progress)
│       ├── QuizQuestion.js              # Single question with animated option cards
│       ├── QuizOption.js                # Individual clickable option card
│       ├── QuizResults.js               # Results page (hero + runners-up + share)
│       ├── QuizResultCard.js            # Single browser result card (hero or runner-up)
│       ├── QuizTraitChart.js            # Radar or bar chart comparing user vs browser traits
│       ├── QuizShareButtons.js          # Copy link, Twitter, Web Share API
│       └── quizEngine.js               # Pure functions: scoring, normalization, matching
├── lib/
│   └── quiz-constants.js               # Trait dimension labels, colors for chart
└── public/
    └── data/
        └── quiz/
            ├── browser-profiles.json    # 18 browser trait profiles
            └── questions.json           # 7 questions with options and trait boosts
```

### Component Responsibilities

**`quiz/page.js`** (Server Component)
- Reads `browser-profiles.json` and `questions.json` at build time
- Reads `browsers.json` for logos/websites
- Passes data as props to `QuizContainer`
- Handles metadata (title, description, OG tags for SEO)
- Reads `?r=` query param for shared results

**`QuizContainer.js`** (Client Component — the brain)
- Manages state: `currentStep` (0=intro, 1-7=questions, 8=results), `answers[]`, `results`
- Handles forward/back navigation with animated transitions
- On completing Q7, runs `quizEngine.computeResults(answers, browserProfiles)`
- Persists last result to localStorage (so refreshing doesn't lose it)
- If `?r=` param present, renders results directly with "Take quiz" CTA

**`QuizIntro.js`**
- Hero-style welcome: "Find Your Perfect Browser"
- Brief explanation (3 bullet points: 7 questions, ~2 minutes, personalized result)
- Animated browser logos floating/orbiting
- "Start Quiz" gradient CTA button

**`QuizProgress.js`**
- 7 segmented bars, filled with gradient as user progresses
- Current question number: "Question 3 of 7"
- Subtle animation when advancing

**`QuizQuestion.js`**
- Animated question heading (slide in from right, or fade)
- Renders 3-4 `QuizOption` cards in a responsive grid
- "Back" button (except on Q1)
- Auto-advances 500ms after selection (with visual confirmation)

**`QuizOption.js`**
- Card with icon/emoji, label, and description
- Click/keyboard to select
- Selected state: purple gradient border + check mark + scale bump
- Hover: subtle lift + shadow
- Focus-visible: purple ring (matching existing pattern)

**`QuizResults.js`**
- Animated entrance (staggered fade-in for hero, then runners-up)
- Renders `QuizResultCard` for hero (large) and runners-up (smaller)
- Renders `QuizTraitChart` showing user profile vs top match
- Renders `QuizShareButtons`
- "Retake Quiz" and "View All Rankings" buttons

**`quizEngine.js`** (Pure logic, no React)
- `computeUserTraits(answers, questions)` → trait vector
- `normalizeTraits(traits)` → normalized vector
- `computeMatchScore(userTraits, browserTraits)` → percentage
- `rankBrowsers(userTraits, browserProfiles)` → sorted array with scores
- `getTopResults(rankedBrowsers, count)` → top N results
- Fully testable, no side effects

---

## 7. Integration with Existing Site

### Header CTA
Add a "Find Your Browser" button in the Header's CTA section (alongside "View Rankings" and "Learn More"):

```jsx
<Link
  href="/quiz"
  className="group inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
>
  <span>Find Your Browser</span>
  <svg ...sparkle/compass icon... />
</Link>
```

Uses a warm amber-to-orange gradient to distinguish it from the purple "View Rankings" button. This makes the quiz CTA pop as something different and exciting.

### Layout
The quiz page inherits the root `layout.js` automatically (Inter font, dark mode script, analytics). The `QuizContainer` wraps itself in `DarkModeProvider` for toggle support.

### Navigation
- Quiz results link back to homepage with `?highlight=brave` (optional: scroll to that browser card)
- Browser websites link out from result cards
- "View Rankings" in results links to `/#rankings`

### SEO / Metadata
```js
// app/quiz/page.js
export const metadata = {
  title: 'Browser Quiz — Find Your Perfect Browser | BrowseRating',
  description: 'Answer 7 quick questions and discover which browser is the best match for your needs. Personalized recommendations based on privacy, speed, features, and more.',
  openGraph: {
    title: 'Find Your Perfect Browser — BrowseRating Quiz',
    description: 'Take our 2-minute quiz to find the browser that fits you best.',
    url: 'https://browserating.com/quiz',
  },
};
```

---

## 8. UX Flow Diagram

```
[Homepage Header CTA: "Find Your Browser"]
              │
              ▼
┌──────────────────────────────┐
│        QUIZ INTRO            │
│  "Find Your Perfect Browser" │
│  [Start Quiz]                │
└──────────────┬───────────────┘
               │
     ┌─────────▼──────────┐
     │  QUESTION 1 of 7   │◄──────┐
     │  [Option A/B/C/D]  │       │
     └─────────┬──────────┘       │ Back
               │ Select           │
     ┌─────────▼──────────┐       │
     │  QUESTION 2 of 7   │───────┘
     │  [Option A/B/C]    │
     └─────────┬──────────┘
               │
              ...  (Q3–Q6)
               │
     ┌─────────▼──────────┐
     │  QUESTION 7 of 7   │
     │  [Option A/B/C/D]  │
     └─────────┬──────────┘
               │ Computing...
     ┌─────────▼──────────────────┐
     │        RESULTS             │
     │  ┌──────────────────────┐  │
     │  │  HERO: 94% Match     │  │
     │  │  🦁 Brave            │  │
     │  │  "Privacy browser..." │  │
     │  │  [Visit] [Rankings]  │  │
     │  └──────────────────────┘  │
     │                            │
     │  Runner-ups:               │
     │  ┌──────────┬───────────┐  │
     │  │ Firefox  │ Zen       │  │
     │  │ 87%      │ 82%       │  │
     │  └──────────┴───────────┘  │
     │                            │
     │  [Share] [Retake] [Home]   │
     └────────────────────────────┘
               │
               ▼ Share URL
     browserating.com/quiz?r=brave
     → Shows result + "Take quiz yourself" CTA
```

---

## 9. Animations & Transitions

| Transition | Animation | Duration |
|-----------|-----------|----------|
| Question enter | Slide in from right + fade in | 300ms ease-out |
| Question exit | Slide out to left + fade out | 200ms ease-in |
| Going back | Reverse direction (slide from left) | 300ms ease-out |
| Option select | Scale to 1.02 + purple border glow | 200ms |
| Auto-advance after select | 500ms delay then question transition | — |
| Progress bar fill | Width transition with gradient | 300ms ease-out |
| Results hero entrance | Scale from 0.95 + fade in | 400ms ease-out |
| Results runners-up | Staggered fade in, 200ms delay between each | 300ms each |
| Computing step | Brief "analyzing" animation with spinning dots (1–1.5s fake delay for dramatic effect) | — |

All animations use CSS transitions (no extra library). Implemented via Tailwind classes + conditional class toggling + `setTimeout` for sequencing.

---

## 10. Accessibility

- All option cards are `<button>` elements with descriptive `aria-label`
- Arrow keys navigate between options within a question
- Enter/Space selects an option
- Tab moves between interactive elements (options, back button, progress)
- Focus-visible rings match existing purple pattern
- Progress communicated via `aria-live="polite"` region: "Question 3 of 7"
- Results screen uses heading hierarchy (h1 for hero, h2 for runners-up)
- Reduced motion: `@media (prefers-reduced-motion)` disables slide animations, keeps fade

---

## 11. Mobile Considerations

- Option cards stack vertically on mobile (1 column), 2 columns on tablet, 2 columns on desktop
- Touch targets minimum 48px
- Progress bar simplified to dots on very small screens
- Share uses Web Share API on mobile (native share sheet) with fallback to copy link
- Full-screen feel: hide distractions, center content vertically
- Swipe gestures (optional v2): swipe left/right to navigate questions

---

## 12. Data Files to Create

### `public/data/quiz/browser-profiles.json`
Full trait profiles for all 18 curated browsers. Each entry:
```json
{
  "id": "string (kebab-case, matches URL param)",
  "name": "string (display name, must match browsers.json)",
  "tagline": "string (one-liner why this browser)",
  "traits": { "privacy": 0-10, "speed": 0-10, ... },
  "highlights": ["string", "string", "string"],
  "platforms": ["windows", "macos-arm", ...],
  "bestFor": "string (one-sentence ideal user description)"
}
```

### `public/data/quiz/questions.json`
```json
[
  {
    "id": "q1",
    "question": "What matters most in a browser?",
    "subtitle": "Pick the one thing you can't compromise on",
    "options": [
      {
        "id": "q1a",
        "label": "Speed & Performance",
        "description": "I want everything to load instantly",
        "icon": "zap",
        "traits": { "speed": 3, "resourceEfficiency": 2 }
      },
      ...
    ]
  },
  ...
]
```

---

## 13. Shareable Results

### URL Scheme
- `/quiz?r=brave` — shows Brave result with "Take quiz yourself" CTA
- The `r` param is just the browser ID, not the full answer state

### Social Share Text
- Twitter/X: `My browser match is {Browser}! 🎯 Find your perfect browser at browserating.com/quiz`
- Copy link: `https://browserating.com/quiz?r={id}`
- Web Share API (mobile): title + text + url

### Shared Result View
When visiting with `?r=` param:
- Show the result browser as hero card (same styling as quiz result)
- Below: "This is {Name}'s browser match. Want to find yours?"
- Large "Take the Quiz" CTA

---

## 14. Future Enhancements (Not in v1)

- **Result image generation**: OG image with the browser logo + match % for social previews (would need an API route with `@vercel/og`)
- **Platform-specific recommendations**: Additional question "What device are you on?" to filter to platform-available browsers
- **Quiz analytics**: Track most common results, drop-off rates (would need a simple API endpoint)
- **"Compare" mode**: Pick two quiz results and see them side-by-side
- **Weighted questions**: Let users mark which questions matter most to them
- **Community votes**: "Did this recommendation work for you?" thumbs up/down

---

## 15. Implementation Order

1. **Data files first**: Create `browser-profiles.json` and `questions.json` — these are the foundation and can be reviewed/tuned independently
2. **Quiz engine**: Build `quizEngine.js` with pure functions and verify scoring with manual test cases
3. **Quiz page shell**: `app/quiz/page.js` + `QuizContainer.js` with basic step navigation
4. **Intro screen**: `QuizIntro.js` with styling
5. **Question flow**: `QuizQuestion.js` + `QuizOption.js` + `QuizProgress.js` with animations
6. **Results**: `QuizResults.js` + `QuizResultCard.js` + trait chart
7. **Share functionality**: `QuizShareButtons.js` + shared result view via `?r=` param
8. **Header CTA**: Add "Find Your Browser" button to Header
9. **Polish**: Animations, transitions, reduced motion, edge cases
10. **Testing**: Manual testing across browsers/devices, dark mode, keyboard nav
