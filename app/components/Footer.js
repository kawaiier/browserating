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
            <ul className="flex flex-wrap justify-center space-x-6">
              <li>
                <a
                  href="https://x.com/kawaiier101"
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow on X (Twitter)"
                >
                  <span className="block h-6 w-6">
                    <svg
                      viewBox="0 0 512 512"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" />
                    </svg>
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="https://bsky.app/profile/kawaiier.bsky.social"
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow on Bluesky"
                >
                  <span className="relative block h-6 w-6">
                    <Image
                      src="/images/BlueskyLogo.png"
                      alt=""
                      fill
                      sizes="24px"
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
          <div className="flex flex-col items-center text-xs text-gray-500 w-full px-4 sm:px-0">
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
