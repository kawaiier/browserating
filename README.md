# Browserating

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.18-38B2AC)](https://tailwindcss.com/)
[![SEO Optimized](https://img.shields.io/badge/SEO-Optimized-green)](https://browserating.com)

**Browserating** is a comprehensive, SEO-optimized Next.js web application that provides unbiased browser performance rankings and comparisons across multiple platforms. Using data from Speedometer 3.1 benchmarks, it delivers detailed insights into browser efficiency, ad-blocking capabilities, and RAM usage to help users make informed decisions about their browsing experience.

🌐 **[Live Demo](https://browserating.com)** | 📊 **[Performance Benchmarks](https://browserating.com)**

## ✨ Features

- **🔍 Comprehensive Browser Rankings**: Performance comparisons across macOS (ARM & Intel), Windows, Android, and iPad platforms
- **📱 Responsive Design**: Optimized for all devices with mobile-first approach
- **🎯 Advanced Filtering**: Filter browsers by engine (Blink, Gecko, WebKit) and platform
- **📊 Detailed Metrics**: Speedometer 3.1 scores, with RAM usage and ad-blocking data where recorded
- **🎨 Interactive Charts**: Visual representations of performance data using Chart.js
- **🌙 Dark Mode Support**: Full dark/light theme toggle with system preference detection
- **🔒 Privacy-Focused**: Transparent data practices with dedicated privacy policy
- **⚡ Server-Side Rendering**: Fast loading with Next.js SSR and static generation
- **🔍 SEO Optimized**: Structured data (JSON-LD), dynamic sitemaps, and meta tags for search engines
- **♿ Accessibility**: WCAG compliant with keyboard navigation and screen reader support
- **🔗 Individual Browser Pages**: Dedicated pages for each browser with cross-platform benchmarks (`/browsers/[slug]`)
- **⚖️ Head-to-Head Comparisons**: Side-by-side browser comparison pages (`/compare/[browser-a]-vs-[browser-b]`)
- **📋 Platform Pages**: Dedicated ranking pages per platform (`/platforms/[platform]`)

## 🚀 Tech Stack

- **Framework**: Next.js 16.1.6 (App Router)
- **Frontend**: React 19, Tailwind CSS 4.1.18
- **Language**: TypeScript (dev), JavaScript
- **Charts**: Chart.js 4.5.1 with react-chartjs-2 5.3.0
- **Icons**: Lucide React 0.576.0
- **Analytics**: Vercel Analytics 1.6.1, counter.dev
- **Data Storage**: JSON files
- **Deployment**: Vercel
- **Development Tools**: Bun, ESLint 10, Prettier 3.8.1, Husky 9, lint-staged, commitlint

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js**: Version 24.x (see `package.json`)
- **Bun**: Package manager ([bun.sh](https://bun.sh))
- **Git**: For cloning the repository

## 🛠️ Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/kawaiier/browserating.git
   cd browserating
   ```

2. **Install dependencies**:

   ```bash
   bun install
   ```

3. **Run the development server**:

   ```bash
   bun run dev
   ```

4. **Open your browser** and visit [http://localhost:3000](http://localhost:3000) to see the application.

## 📊 Usage

The application provides several key functionalities:

### Browser Rankings

- View comprehensive performance rankings across all supported platforms
- Sort and filter browsers by engine (Blink, Gecko, WebKit) and platform
- Access detailed metrics for each browser version

### Individual Browser Pages (`/browsers/[slug]`)

- Dedicated page per browser with cross-platform benchmark data
- Links to the browser's official website
- Quick jump to head-to-head comparison

### Head-to-Head Comparisons (`/compare/[browser-a]-vs-[browser-b]`)

- Side-by-side Speedometer 3.1 score comparison across all platforms
- Recorded scores, versions, engines, test dates, and differences where both browsers have measurements
- Platform and engine controls, explicit browser selection, and shareable URLs
- Pairs without shared measurements remain available but are omitted from the sitemap and marked `noindex, follow`

The sitemap includes every canonical pair with a valid Speedometer 3.1 score for both browsers on at least one shared platform using their first-listed engines. This coverage-based list is not a popularity ranking; comparison pages are rendered dynamically.

### Platform-Specific Views (`/platforms/[platform]`)

- **macOS ARM**: Apple Silicon browser rankings
- **macOS Intel**: Intel processor browser rankings
- **Windows**: Windows browser performance
- **Android**: Mobile browser performance analysis
- **iPad**: iPadOS-specific browser testing

### Performance Insights

- Speedometer 3.1 benchmark scores
- RAM usage analysis across multiple websites
- Ad-blocking effectiveness testing
- Version-by-version performance tracking

## 🗂️ Data Management

Browser performance data is stored in JSON files located in `public/data/`. The application supports multiple platforms with separate data files:

- `browsers.json` - Base browser information and metadata
- `android.json` - Android platform performance data
- `macos-arm.json` - macOS ARM (Apple Silicon) data
- `macos-intel.json` - macOS Intel data
- `windows.json` - Windows platform data
- `ipad.json` - iPadOS data

### Updating Browser Data

1. Locate the appropriate JSON file in `public/data/`
2. Modify the data following the existing structure:
   ```json
   {
     "name": "Google Chrome",
     "engineVariants": [
       {
         "engine": "Blink",
         "versions": [
           {
             "version": "stable label (opaque)",
             "date": "2026-11-15",
             "observationId": "obs-<new-unique-uuid>",
             "scores": { "speedometer3": 145.2, "adblock": 85.3 }
           }
         ]
       },
       {
         "engine": "WebKit",
         "versions": [
           {
             "version": "nightly build label",
             "date": "2026-11-15",
             "observationId": "obs-<another-new-unique-uuid>",
             "scores": { "speedometer3": 139.4 }
           }
         ]
       }
     ]
   }
   ```
   `name` must exactly match an entry in `browsers.json`. Use either the legacy top-level `engine`/`versions` shape or `engineVariants`; variant order matters because the first engine is the default. Version labels are opaque. Every new record needs a globally unique, immutable `observationId`; preserve existing IDs. Metrics may be omitted or `null` when unmeasured; RAM is stored as `scores.ram` in MB.
3. Run `bun run validate:data` and review errors, warnings, and primary-engine/pair coverage counts. Never infer missing provenance.
4. Commit and deploy the data update. `bun run build` validates before rendering; each deployment refreshes comparison pages and the sitemap together. Follow the [dataset publication and release checklist](docs/comparison-release-verification.md).

### Extending comparison data and behavior

- **Add a browser:** add its stable display name and metadata to `browsers.json`, then add platform records using that exact name. Slugs are derived from names, so renaming a browser changes its pair URLs; retain existing names/slugs or plan redirects before a rename.
- **Add an engine variant:** add a unique engine entry with its own newest-first `versions` history. Keep the intended default engine first; comparison URLs store engine choices against the browser slug and platform.
- **Add a metric:** define its ID, validity, direction, unit, precision, and interpretation in `app/lib/comparisonMetrics.js`; update data validation, comparison rendering, and helper tests to cover it. Only enable it for pair comparisons once its method and comparability limits are documented.

Comparison responsibilities are split by policy: `comparisonUrl.js` owns canonical pairs and query serialization; `comparisonMetrics.js` owns metric definitions and formatting; `comparisonViewModel.js` selects records and derives coverage/outcomes; `comparisonOptions.js` builds chooser coverage; `comparisonIndex.js` defines sitemap eligibility. See the [release verification checklist](docs/comparison-release-verification.md) and [cache policy](docs/comparison-performance.md).

## 🤝 Contributing

We welcome contributions from the community! Please see our [Contributing Guidelines](CONTRIBUTING.md) for detailed information on:

- Development setup
- Code standards and style guides
- Testing requirements
- Pull request process
- Issue reporting

### Quick Start for Contributors

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes following our coding standards
4. Run tests: `bun run test`
5. Submit a pull request

## 📈 Performance & SEO

This application is optimized for both user experience and search engines:

- **Core Web Vitals**: Optimized for fast loading and interaction
- **Server-Side Rendering**: Improved SEO and initial page load
- **Structured Data**: JSON-LD schema markup for rich snippets
- **Sitemap**: Dynamic XML sitemap for search engine crawling
- **Meta Tags**: Comprehensive SEO meta tags and Open Graph
- **Accessibility**: WCAG 2.1 AA compliance

## 🙏 Acknowledgments

- **Speedometer 3.1** - Industry-standard browser benchmarking tool ([browserbench.org](https://browserbench.org/Speedometer3.1/))
- **AdBlock Tester** - Comprehensive ad-blocking effectiveness testing ([adblock-tester.com](https://adblock-tester.com/))
- **Browser Vendors** - All browser developers for their continuous innovation
- **Open Source Community** - React, Next.js, Tailwind CSS, and Chart.js contributors

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact & Support

- **Author**: Sergei Manvelov ([@kawaiier101](https://x.com/kawaiier101))
- **Website**: [https://kawaiier.dev](https://kawaiier.dev)
- **Email**: kawaiier@tutanota.com
- **Telegram Community**: [@thebrowsershq](https://t.me/thebrowsershq)
- **Reddit**: [r/aiBrowsing](https://www.reddit.com/r/aiBrowsing/)

## 💝 Support the Project

If you find Browserating useful, please consider supporting its development:

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/J3J8TMWMG)

### Cryptocurrency Donations

- **BTC**: `bc1qfyad27catyr8rtdhhydn8ummf996kxtesuw4hr`
- **XMR**: `41zM5Hk39icMLDnbAckLpJHMwMPQKAQEADYA1AvjoZw9Y9NC7atnubrWPZKXWRbpZeGg66DkstQmA1oPZurRBcvRFbQ3PLs`
- **LTC**: `ltc1qnqldulnxsxpz4g89uklsepjeqx7cajynzyr7tc`
- **MATIC**: `0x6c056E9ccB183c08e9248eAF26160B5793221513`

## 📊 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=kawaiier/browserating&type=Date)](https://star-history.com/#kawaiier/browserating&Date)

---

_Built with ❤️ using Next.js and React. Helping users choose the best browser for their needs since 2024. Updated for 2026._
