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
- **📊 Detailed Metrics**: Speedometer 3.1 scores, RAM usage, ad-blocking effectiveness, and more
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
- **Development Tools**: ESLint 10, Prettier 3.8.1, Husky 9, lint-staged, commitlint

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js**: Version 18.17 or higher
- **npm**: Version 9.0.0 or higher (comes with Node.js)
- **Git**: For cloning the repository

## 🛠️ Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/kawaiier/browserating.git
   cd browserating
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Run the development server**:

   ```bash
   npm run dev
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
- Winner highlighted per platform

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
     "name": "Chrome",
     "engine": "Blink",
     "versions": [
       {
         "version": "120.0.6099.109",
         "scores": {
           "speedometer3": 145.2,
           "ramUsage": 245.8,
           "adblock": 85.3
         }
       }
     ]
   }
   ```
3. Save the file - changes will be reflected on the next page load

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
4. Run tests: `npm test`
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
