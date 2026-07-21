'use client';

import Image from 'next/image';

export default function Footer() {
  return (
    <footer
      className="text-center"
      style={{
        backgroundColor: 'var(--surface-sunken)',
        borderTop: '1px solid var(--border-subtle)',
        padding: 'var(--space-400) var(--space-200)',
        marginTop: 'var(--space-600)',
      }}
      role="contentinfo"
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center" style={{ gap: 'var(--space-300)' }}>
          {/* Social Links */}
          <nav aria-label="Social media links">
            <ul className="flex flex-wrap justify-center" style={{ gap: 'var(--space-200)' }}>
              <li>
                <a
                  href="https://x.com/kawaiier101"
                  className="group flex items-center justify-center w-10 h-10 rounded-full transition-all cursor-pointer"
                  style={{
                    backgroundColor: 'var(--surface-raised)',
                    color: 'var(--text-subtle)',
                  }}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow us on X (formerly Twitter)"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--surface-hovered)';
                    e.currentTarget.style.color = 'var(--text-default)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--surface-raised)';
                    e.currentTarget.style.color = 'var(--text-subtle)';
                  }}
                >
                  <span className="relative block h-5 w-5">
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
                  className="group flex items-center justify-center w-10 h-10 rounded-full transition-all cursor-pointer"
                  style={{
                    backgroundColor: 'var(--surface-raised)',
                    color: 'var(--text-subtle)',
                  }}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Join our Telegram channel"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--surface-hovered)';
                    e.currentTarget.style.color = 'var(--text-brand)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--surface-raised)';
                    e.currentTarget.style.color = 'var(--text-subtle)';
                  }}
                >
                  <span className="relative block h-5 w-5">
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
                  className="group flex items-center justify-center w-10 h-10 rounded-full transition-all cursor-pointer"
                  style={{
                    backgroundColor: 'var(--surface-raised)',
                    color: 'var(--text-subtle)',
                  }}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Join our Reddit community"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--surface-hovered)';
                    e.currentTarget.style.color = 'var(--color-warning)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--surface-raised)';
                    e.currentTarget.style.color = 'var(--text-subtle)';
                  }}
                >
                  <span className="relative block h-5 w-5">
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
                  className="group flex items-center justify-center w-10 h-10 rounded-full transition-all cursor-pointer"
                  style={{
                    backgroundColor: 'var(--surface-raised)',
                    color: 'var(--text-subtle)',
                  }}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow us on Bluesky"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--surface-hovered)';
                    e.currentTarget.style.color = 'var(--text-brand)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--surface-raised)';
                    e.currentTarget.style.color = 'var(--text-subtle)';
                  }}
                >
                  <span className="relative block h-5 w-5">
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
            <p className="body-small" style={{ color: 'var(--text-subtle)' }}>
              developed by{' '}
              <a
                href="https://kawaiier.dev"
                className="font-medium cursor-pointer"
                style={{ color: 'var(--text-brand)' }}
                target="_blank"
                rel="noopener noreferrer"
              >
                kawaiier
              </a>
              {' · '}
              <a
                href="https://github.com/kawaiier/browserating"
                className="cursor-pointer"
                style={{ color: 'var(--text-subtle)' }}
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
              className="flex justify-center mt-3 cursor-pointer"
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

          {/* Privacy Policy Link */}
          <nav aria-label="Legal">
            <a
              href="/privacy"
              className="body-small cursor-pointer"
              style={{ color: 'var(--text-subtle)' }}
            >
              Privacy Policy
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
