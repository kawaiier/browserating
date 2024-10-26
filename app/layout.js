import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "BrowseRating - Browser Performance for macOS, Windows and Android",
  description:
    "Compare performance of macOS, Windows and Android browsers based on Speedometer 3 benchmark results",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head></head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
