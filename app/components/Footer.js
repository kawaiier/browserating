'use client';

import { useEffect, useState } from 'react';

const DONATION_ADDRESSES = {
  BTC: 'bc1qfyad27catyr8rtdhhydn8ummf996kxtesuw4hr',
  XMR: '41zM5Hk39icMLDnbAckLpJHMwMPQKAQEADYA1AvjoZw9Y9NC7atnubrWPZKXWRbpZeGg66DkstQmA1oPZurRBcvRFbQ3PLs',
  LTC: 'ltc1qnqldulnxsxpz4g89uklsepjeqx7cajynzyr7tc',
  MATIC: '0x6c056E9ccB183c08e9248eAF26160B5793221513',
};

export default function Footer() {
  const [isCopied, setIsCopied] = useState(false);
  const [copiedCurrency, setCopiedCurrency] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleCopy = (text, currency) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setCopiedCurrency(currency);
    setTimeout(() => {
      setIsCopied(false);
      setCopiedCurrency('');
    }, 2000);
  };

  const truncateAddress = (address, type) => {
    if (isMobile) {
      if (type === 'XMR') {
        return `${address.slice(0, 10)}...${address.slice(-10)}`;
      }
      return `${address.slice(0, 8)}...${address.slice(-8)}`;
    }

    if (type === 'XMR') {
      return `${address.slice(0, 20)}...${address.slice(-20)}`;
    }
    return address;
  };

  return (
    <footer
      className="border-t border-subtle bg-surface-subtle"
      role="contentinfo"
      aria-label="Site footer"
    >
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Primary tier */}
        <nav
          aria-label="Primary footer navigation"
          className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-6"
        >
          <a
            href="/credits"
            className="text-sm text-secondary hover:text-accent-primary transition-colors focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-surface-subtle rounded-sm"
          >
            Credits
          </a>
          <a
            href="/benchmarks"
            className="text-sm text-secondary hover:text-accent-primary transition-colors focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-surface-subtle rounded-sm"
          >
            Benchmark Sources
          </a>
          <a
            href="/methodology"
            className="text-sm text-secondary hover:text-accent-primary transition-colors focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-surface-subtle rounded-sm"
          >
            Methodology
          </a>
        </nav>

        {/* Secondary tier */}
        <nav
          aria-label="Secondary footer navigation"
          className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-8 pb-6 border-b border-subtle"
        >
          <a
            href="/privacy"
            className="text-sm text-muted hover:text-accent-primary transition-colors focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-surface-subtle rounded-sm"
          >
            Privacy
          </a>
          <a
            href="/support"
            className="text-sm text-muted hover:text-accent-primary transition-colors focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-surface-subtle rounded-sm"
          >
            Support
          </a>
          <a
            href="https://github.com/kawaiier/browserating"
            className="text-sm text-muted hover:text-accent-primary transition-colors focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-surface-subtle rounded-sm"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          <button
            onClick={() => {
              document.getElementById('donations')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="text-sm text-muted hover:text-accent-primary transition-colors focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-surface-subtle rounded-sm bg-transparent border-none cursor-pointer"
          >
            Donations
          </button>
        </nav>

        {/* Donations section */}
        <div id="donations" className="mb-8" aria-label="Cryptocurrency donation addresses">
          <div className="flex flex-col items-center">
            <p
              className={`text-xs mb-3 ${isCopied ? 'text-score-excellent' : 'text-muted'}`}
              aria-live="polite"
            >
              {isCopied ? `${copiedCurrency} address copied` : 'Click to copy address'}
            </p>
            <div className="flex flex-col gap-1 w-full max-w-sm">
              {Object.entries(DONATION_ADDRESSES).map(([currency, address]) => (
                <button
                  key={currency}
                  onClick={() => handleCopy(address, currency)}
                  className="font-mono text-xs text-secondary hover:text-accent-primary transition-colors py-1.5 px-3 rounded hover:bg-white focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-1 text-left w-full"
                  aria-label={`Copy ${currency} donation address`}
                >
                  <span className="font-semibold text-muted">{currency}:</span>{' '}
                  <span className="break-all">{truncateAddress(address, currency)}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tertiary tier */}
        <div className="text-center space-y-2">
          <p className="text-xs text-muted">Updated monthly based on official release notes</p>
          <p className="text-xs text-muted">
            Independent analysis — not affiliated with any browser vendor
          </p>
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} Browserater — All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
