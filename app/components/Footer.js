import { useEffect, useState } from "react";

import Image from "next/image";

const DONATION_ADDRESSES = {
  BTC: "bc1qfyad27catyr8rtdhhydn8ummf996kxtesuw4hr",
  XMR: "41zM5Hk39icMLDnbAckLpJHMwMPQKAQEADYA1AvjoZw9Y9NC7atnubrWPZKXWRbpZeGg66DkstQmA1oPZurRBcvRFbQ3PLs",
  LTC: "ltc1qnqldulnxsxpz4g89uklsepjeqx7cajynzyr7tc",
  MATIC: "0x6c056E9ccB183c08e9248eAF26160B5793221513",
};

export default function Footer() {
  const [isCopied, setIsCopied] = useState(false);
  const [copiedCurrency, setCopiedCurrency] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleCopy = (text, currency) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setCopiedCurrency(currency);
    setTimeout(() => {
      setIsCopied(false);
      setCopiedCurrency("");
    }, 2000);
  };

  const truncateAddress = (address, type) => {
    if (isMobile) {
      if (type === "XMR") {
        return `${address.slice(0, 10)}...${address.slice(-10)}`;
      }
      return `${address.slice(0, 8)}...${address.slice(-8)}`;
    }

    if (type === "XMR") {
      return `${address.slice(0, 20)}...${address.slice(-20)}`;
    }
    return address;
  };

  return (
    <footer
      className="text-center text-sm p-4 sm:p-8 flex flex-col items-center gap-2 mt-8"
      role="contentinfo"
    >
      <div className="container mx-auto px-4 max-w-full md:max-w-4xl">
        <div className="flex flex-col items-center space-y-6">
          {/* Social Links */}

          <nav aria-label="Social media links">
            <ul className="flex flex-wrap justify-center gap-6">
              <li>
                <a
                  href="https://x.com/kawaiier101"
                  className="group flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow us on X (formerly Twitter)"
                >
                  <span className="relative block h-5 w-5 group-hover:scale-110 transition-transform duration-300">
                    <Image
                      src="/images/TwitterLogo.svg"
                      alt=""
                      fill
                      sizes="20px"
                      className="object-contain"
                      priority={false}
                    />
                  </span>
                </a>
              </li>

              <li>
                <a
                  href="https://t.me/thebrowsershq"
                  className="group flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Join our Telegram channel"
                >
                  <span className="relative block h-5 w-5 group-hover:scale-110 transition-transform duration-300">
                    <Image
                      src="/images/TelegramLogo.svg"
                      alt=""
                      fill
                      sizes="20px"
                      className="object-contain"
                      priority={false}
                    />
                  </span>
                </a>
              </li>

              <li>
                <a
                  href="https://www.reddit.com/r/aiBrowsing/"
                  className="group flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:text-orange-600 dark:hover:text-orange-400 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Join our Reddit community"
                >
                  <span className="relative block h-5 w-5 group-hover:scale-110 transition-transform duration-300">
                    <Image
                      src="/images/RedditLogo.svg"
                      alt=""
                      fill
                      sizes="20px"
                      className="object-contain"
                      priority={false}
                    />
                  </span>
                </a>
              </li>

              <li>
                <a
                  href="https://bsky.app/profile/kawaiier.bsky.social"
                  className="group flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-sky-50 dark:hover:bg-sky-900/20 hover:text-sky-600 dark:hover:text-sky-400 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow us on Bluesky"
                >
                  <span className="relative block h-5 w-5 group-hover:scale-110 transition-transform duration-300">
                    <Image
                      src="/images/BlueskyLogo.png"
                      alt=""
                      fill
                      sizes="20px"
                      className="object-contain"
                      priority={false}
                    />
                  </span>
                </a>
              </li>
            </ul>
          </nav>

          {/* Developer Info */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              developed by{" "}
              <a
                href="https://kawaiier.dev"
                className="font-medium bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent leading-normal hover:text-purple-700 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                kawaiier
              </a>
              {" · "}
              <a
                href="https://github.com/kawaiier/browserating"
                className="text-gray-500 hover:text-purple-700 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View source code on GitHub"
              >
                source code
              </a>
            </p>
            {/* Ko-fi Link */}
            <a
              href="https://ko-fi.com/J3J8TMWMG"
              target="_blank"
              rel="noopener noreferrer"
              className="flex justify-center mt-2"
              aria-label="Support me on Ko-fi"
            >
              <Image
                height={36}
                width={109}
                src="https://storage.ko-fi.com/cdn/kofi4.png?v=6"
                alt="Buy Me a Coffee at ko-fi.com"
              />
            </a>
          </div>

          {/* Minimal Donations Section */}
          <div
            className="flex flex-col items-center text-xs text-gray-500 w-full px-4 sm:px-0"
            id="support"
          >
            <h3 className="text-sm font-bold mb-2">Donations</h3>
            <p className={isCopied ? "text-green-500" : ""} aria-live="polite">
              {isCopied
                ? `${copiedCurrency} address copied! ✓`
                : "Click to copy"}
            </p>
            <div className="w-full max-w-sm">
              {Object.entries(DONATION_ADDRESSES).map(([currency, address]) => (
                <div
                  key={currency}
                  onClick={() => handleCopy(address, currency)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleCopy(address, currency);
                    }
                  }}
                  className="font-mono cursor-pointer text-[10px] sm:text-xs hover:text-gray-700 transition-colors p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                  tabIndex="0"
                  role="button"
                  aria-label={`Copy ${currency} address: ${address}`}
                >
                  <span className="font-semibold">{currency}:</span>{" "}
                  <span className="break-all">
                    {truncateAddress(address, currency)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Privacy Policy Link */}
          <nav aria-label="Legal">
            <a
              href="/privacy"
              className="text-sm text-gray-600 hover:text-purple-700 transition-colors"
            >
              Privacy Policy
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
