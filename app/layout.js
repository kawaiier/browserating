import "./globals.css";

import { Inter } from "next/font/google";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "BrowseRating - Browser Performance for macOS, Windows and Android",
  description:
    "Compare performance of macOS, Windows and Android browsers based on Speedometer 3 benchmark results. Find the fastest and most efficient browsers for your device.",
  keywords:
    "browser performance, browser benchmark, Speedometer 3, browser comparison, fastest browser, macOS browser, Windows browser, Android browser",
  authors: [{ name: "kawaiier" }],
  openGraph: {
    title: "BrowseRating - Browser Performance Comparison",
    description:
      "Compare browser performance across macOS, Windows and Android based on Speedometer 3 benchmark results.",
    url: "https://browserating.kawaiier.dev",
    siteName: "BrowseRating",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BrowseRating - Browser Performance Comparison",
    description:
      "Compare browser performance across macOS, Windows and Android based on Speedometer 3 benchmark results.",
    creator: "@kawaiier101",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#7853E0" />
        <link rel="canonical" href="https://browserating.kawaiier.dev" />
        <Script id="schema-org" type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "BrowseRating",
              "url": "https://browserating.kawaiier.dev",
              "description": "Compare performance of macOS, Windows and Android browsers based on Speedometer 3 benchmark results.",
            }
          `}
        </Script>
        <Script id="browser-comparison-schema" type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "Dataset",
              "name": "Browser Performance Comparison",
              "description": "Performance comparison of web browsers across different platforms based on Speedometer 3 benchmark",
              "keywords": ["browser performance", "browser benchmark", "Speedometer 3", "browser comparison"],
              "creator": {
                "@type": "Person",
                "name": "kawaiier"
              },
              "license": "https://browserating.kawaiier.dev/privacy",
              "dateModified": "2025-02-23"
            }
          `}
        </Script>
      </head>
      <body className={inter.className}>
        {children}

        <Script
          src="https://cdn.counter.dev/script.js"
          data-id="543bdca5-3749-4923-8c4c-1593e1a96e57"
          data-utcoffset="4"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
