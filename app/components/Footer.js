import Image from "next/image";
import { useState, useEffect } from "react";

const DONATION_ADDRESSES = {
  BTC: "bc1qfyad27catyr8rtdhhydn8ummf996kxtesuw4hr",
  XMR: "41zM5Hk39icMLDnbAckLpJHMwMPQKAQEADYA1AvjoZw9Y9NC7atnubrWPZKXWRbpZeGg66DkstQmA1oPZurRBcvRFbQ3PLs",
  LTC: "ltc1qnqldulnxsxpz4g89uklsepjeqx7cajynzyr7tc",
  MATIC: "0x6c056E9ccB183c08e9248eAF26160B5793221513",
};

export default function Footer() {
  const [isCopied, setIsCopied] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const truncateAddress = (address, type) => {
    if (type === "XMR") {
      return `${address.slice(0, 20)}...${address.slice(-20)}`;
    }
    return address;
  };

  return (
    <footer className="text-center text-sm p-4 sm:p-8 flex flex-col items-center gap-2 mt-8">
      <div className="container mx-auto px-4 max-w-full md:max-w-4xl">
        <div className="flex flex-col items-center space-y-6">
          {/* Social Links */}
          <div className="flex flex-wrap justify-center space-x-6">
            <a
              href="https://x.com/kawaiier101"
              className="text-gray-400 hover:text-gray-600 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="block h-6 w-6">
                <svg viewBox="0 0 512 512" fill="currentColor">
                  <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" />
                </svg>
              </span>
            </a>
            <a
              href="https://bsky.app/profile/kawaiier.bsky.social"
              className="text-gray-400 hover:text-gray-600 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="relative block h-6 w-6">
                <Image
                  src="/images/BlueskyLogo.png"
                  alt="Bluesky Logo"
                  fill
                  sizes="24px"
                />
              </span>
            </a>
          </div>

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
              >
                source code
              </a>
            </p>
          </div>

          {/* Minimal Donations Section */}
          <div className="flex flex-col items-center text-xs text-gray-500 w-full px-4 sm:px-0">
            <h3 className="text-sm font-bold mb-2">Donations</h3>
            <em className={isCopied ? "text-green-500" : ""}>
              {isCopied ? "Copied! ✓" : "Click to copy"}
            </em>
            <div className="w-full max-w-sm">
              {Object.entries(DONATION_ADDRESSES).map(([currency, address]) => (
                <div
                  key={currency}
                  onClick={() => handleCopy(address)}
                  className="font-mono cursor-pointer text-[10px] sm:text-xs hover:text-gray-700 transition-colors"
                >
                  <span className="font-semibold">{currency}:</span>{" "}
                  <span className="break-all">
                    {truncateAddress(address, currency)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
