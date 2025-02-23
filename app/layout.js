import "./globals.css";

import { Inter } from "next/font/google";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "BrowseRating - Browser Performance for macOS, Windows and Android",
  description:
    "Compare performance of macOS, Windows and Android browsers based on Speedometer 3 benchmark results",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
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
