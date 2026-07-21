import Footer from '../components/Footer';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export const metadata = {
  title: 'Privacy Policy - BrowseRating',
  description: 'Learn about how BrowseRating collects, uses, and protects your information.',
  alternates: {
    canonical: 'https://browserating.com/privacy',
  },
};

export default function PrivacyPage() {
  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 w-full z-50"
        style={{
          backgroundColor: 'var(--surface-raised)',
          boxShadow: 'var(--shadow-raised)',
        }}
      >
        <div className="max-w-4xl mx-auto py-4 px-6">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/logo.png"
              alt="Browserating Logo"
              width={180}
              height={40}
              className="h-8 w-auto"
              priority
            />
            <h1
              className="text-2xl font-bold leading-normal"
              style={{ color: 'var(--text-brand)' }}
            >
              Browserating
            </h1>
          </Link>
        </div>
      </header>

      <div className="pt-16">
        <section
          className="max-w-4xl mx-auto p-10 my-12 rounded-lg"
          style={{
            backgroundColor: 'var(--surface-raised)',
            boxShadow: 'var(--shadow-raised)',
          }}
        >
          <h2 className="text-3xl font-bold mb-6" style={{ color: 'var(--text-default)' }}>
            Privacy Policy
          </h2>
          <p className="text-sm mb-4" style={{ color: 'var(--text-subtle)' }}>
            Last updated: March 3, 2026
          </p>

          <h3 className="text-2xl font-semibold mb-4" style={{ color: 'var(--text-default)' }}>
            Introduction
          </h3>
          <p className="mb-4" style={{ color: 'var(--text-subtle)' }}>
            This Privacy Policy explains how we collect, use, and protect your information when you
            use our website. We are committed to ensuring the privacy and security of your data
            while providing you with a transparent understanding of our practices.
          </p>

          <h3 className="text-2xl font-semibold mb-4" style={{ color: 'var(--text-default)' }}>
            Information We Collect
          </h3>

          <h4 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-default)' }}>
            Newsletter Subscription
          </h4>
          <ul className="list-disc pl-6 mb-4" style={{ color: 'var(--text-subtle)' }}>
            <li>
              We collect email addresses when you voluntarily subscribe to our newsletter through
              Beehive.
            </li>
            <li>
              Your email address is used solely for sending you our newsletter and related
              communications.
            </li>
            <li>
              You can unsubscribe from our newsletter at any time by using the unsubscribe link
              provided in each email.
            </li>
          </ul>

          <h4 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-default)' }}>
            Anonymous Usage Statistics
          </h4>
          <p className="mb-4" style={{ color: 'var(--text-subtle)' }}>
            We use Counter.dev and Vercel Analytics to collect anonymous statistical information
            about website visits, including:
          </p>
          <ul className="list-disc pl-6 mb-4" style={{ color: 'var(--text-subtle)' }}>
            <li>Day and time of visits</li>
            <li>Device type (Phone, Tablet, or Computer)</li>
            <li>Referral source (which website the visit came from)</li>
            <li>Browser type</li>
            <li>Country (based on IP address)</li>
            <li>Operating system</li>
            <li>Screen size</li>
            <li>Preferred language</li>
            <li>Pages visited</li>
            <li>Web vitals metrics (page load time, interaction times)</li>
            <li>Route changes</li>
          </ul>
          <p className="mb-4" style={{ color: 'var(--text-subtle)' }}>
            We also use{' '}
            <a
              href="https://search.google.com/search-console"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--text-brand)' }}
              className="hover:underline"
            >
              Google Search Console
            </a>{' '}
            to understand how our site appears in Google Search and to collect aggregated search
            performance data (queries, impressions, clicks, click‑through rate, and average
            position). This data is processed by Google — see{' '}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--text-brand)' }}
              className="hover:underline"
            >
              Google&apos;s privacy documentation
            </a>{' '}
            for details.
          </p>
          <p className="mb-4" style={{ color: 'var(--text-subtle)' }}>
            This data is:
          </p>
          <ul className="list-disc pl-6 mb-4" style={{ color: 'var(--text-subtle)' }}>
            <li>Collected anonymously</li>
            <li>Aggregated on hourly, daily, weekly, monthly, and yearly basis</li>
            <li>Partially deleted after certain time periods to enhance privacy</li>
            <li>Never used to personally identify individual users</li>
          </ul>

          <h4 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-default)' }}>
            Technical Services
          </h4>
          <p className="mb-4" style={{ color: 'var(--text-subtle)' }}>
            We use Bunny.net as our CDN provider, which may process technical information necessary
            for delivering our website content efficiently and securely.
          </p>

          <h3 className="text-2xl font-semibold mb-4" style={{ color: 'var(--text-default)' }}>
            How We Use Your Information
          </h3>
          <ol className="list-decimal pl-6 mb-4" style={{ color: 'var(--text-subtle)' }}>
            <li>
              Email addresses are used exclusively for:
              <ul className="list-disc pl-6">
                <li>Sending newsletters you&apos;ve subscribed to</li>
                <li>Communicating important website updates when necessary</li>
              </ul>
            </li>
            <li>
              Anonymous usage statistics are used for:
              <ul className="list-disc pl-6">
                <li>Understanding how our website is used</li>
                <li>Improving user experience</li>
                <li>Analyzing website performance</li>
              </ul>
            </li>
          </ol>

          <h3 className="text-2xl font-semibold mb-4" style={{ color: 'var(--text-default)' }}>
            Data Sharing and Third Parties
          </h3>
          <p className="mb-4" style={{ color: 'var(--text-subtle)' }}>
            We do not sell, trade, or otherwise transfer your information to third parties. We only
            work with the following service providers who help us operate our website:
          </p>
          <ul className="list-disc pl-6 mb-4" style={{ color: 'var(--text-subtle)' }}>
            <li>Bunny.net (CDN services)</li>
            <li>Beehive (newsletter management)</li>
            <li>Counter.dev (anonymous analytics)</li>
            <li>Vercel Analytics (anonymous performance and usage analytics)</li>
            <li>
              <a
                href="https://search.google.com/search-console"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--text-brand)' }}
                className="hover:underline"
              >
                Google Search Console
              </a>{' '}
              (aggregated search performance data: queries, impressions, clicks, CTR, and average
              position)
            </li>
          </ul>

          <h3 className="text-2xl font-semibold mb-4" style={{ color: 'var(--text-default)' }}>
            Data Security
          </h3>
          <p className="mb-4" style={{ color: 'var(--text-subtle)' }}>
            We implement appropriate security measures to protect your information. Your email
            address is stored securely through our newsletter service provider.
          </p>

          <h3 className="text-2xl font-semibold mb-4" style={{ color: 'var(--text-default)' }}>
            Your Rights
          </h3>
          <ul className="list-disc pl-6 mb-4" style={{ color: 'var(--text-subtle)' }}>
            <li>You have the right to unsubscribe from our newsletter at any time.</li>
            <li>Request information about what data we hold about you.</li>
            <li>Request deletion of your email address from our newsletter database.</li>
          </ul>

          <h3 className="text-2xl font-semibold mb-4" style={{ color: 'var(--text-default)' }}>
            Contact Us
          </h3>
          <p className="mb-4" style={{ color: 'var(--text-subtle)' }}>
            If you have any questions about this Privacy Policy or our data practices, please
            contact us at kawaiier@tutanota.com.
          </p>

          <h3 className="text-2xl font-semibold mb-4" style={{ color: 'var(--text-default)' }}>
            Changes to This Policy
          </h3>
          <p className="mb-4" style={{ color: 'var(--text-subtle)' }}>
            We may update this Privacy Policy from time to time. We will notify you of any changes
            by posting the new Privacy Policy on this page and updating the &apos;Last
            updated&apos; date.
          </p>
        </section>
      </div>
      <Footer />
    </>
  );
}
