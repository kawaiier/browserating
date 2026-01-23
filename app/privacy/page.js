import Footer from "../components/Footer";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export const metadata = {
  title: "Privacy Policy - BrowseRating",
  description: "Learn about how BrowseRating collects, uses, and protects your information.",
};

export default function PrivacyPage() {
  return (
    <>
      <header className="fixed top-0 left-0 right-0 w-full bg-gray-50 shadow-sm z-50">
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
            <h1 className="text-2xl font-bold  bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent leading-normal ">
              Browserating
            </h1>
          </Link>
        </div>
      </header>

      <div className="pt-16">
        <section className="max-w-4xl mx-auto p-10 my-12 bg-gray-50 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold mb-6">Privacy Policy</h2>
          <p className="text-sm text-gray-600 mb-4">
            Last updated: March 9, 2025
          </p>

          <h3 className="text-2xl font-semibold mb-4">Introduction</h3>
          <p className="mb-4">
            This Privacy Policy explains how we collect, use, and protect your
            information when you use our website. We are committed to ensuring
            the privacy and security of your data while providing you with a
            transparent understanding of our practices.
          </p>

          <h3 className="text-2xl font-semibold mb-4">
            Information We Collect
          </h3>

          <h4 className="text-xl font-semibold mb-2">
            Newsletter Subscription
          </h4>
          <ul className="list-disc pl-6 mb-4">
            <li>
              We collect email addresses when you voluntarily subscribe to our
              newsletter through Beehive.
            </li>
            <li>
              Your email address is used solely for sending you our newsletter
              and related communications.
            </li>
            <li>
              You can unsubscribe from our newsletter at any time by using the
              unsubscribe link provided in each email.
            </li>
          </ul>

          <h4 className="text-xl font-semibold mb-2">
            Anonymous Usage Statistics
          </h4>
          <p className="mb-4">
            We use Counter.dev and Vercel Analytics to collect anonymous
            statistical information about website visits, including:
          </p>
          <ul className="list-disc pl-6 mb-4">
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
          <p className="mb-4">This data is:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Collected anonymously</li>
            <li>
              Aggregated on hourly, daily, weekly, monthly, and yearly basis
            </li>
            <li>
              Partially deleted after certain time periods to enhance privacy
            </li>
            <li>Never used to personally identify individual users</li>
          </ul>

          <h4 className="text-xl font-semibold mb-2">Technical Services</h4>
          <p className="mb-4">
            We use Bunny.net as our CDN provider, which may process technical
            information necessary for delivering our website content efficiently
            and securely.
          </p>

          <h3 className="text-2xl font-semibold mb-4">
            How We Use Your Information
          </h3>
          <ol className="list-decimal pl-6 mb-4">
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

          <h3 className="text-2xl font-semibold mb-4">
            Data Sharing and Third Parties
          </h3>
          <p className="mb-4">
            We do not sell, trade, or otherwise transfer your information to
            third parties. We only work with the following service providers who
            help us operate our website:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Bunny.net (CDN services)</li>
            <li>Beehive (newsletter management)</li>
            <li>Counter.dev (anonymous analytics)</li>
            <li>
              Vercel Analytics (anonymous performance and usage analytics)
            </li>
          </ul>

          <h3 className="text-2xl font-semibold mb-4">Data Security</h3>
          <p className="mb-4">
            We implement appropriate security measures to protect your
            information. Your email address is stored securely through our
            newsletter service provider.
          </p>

          <h3 className="text-2xl font-semibold mb-4">Your Rights</h3>
          <ul className="list-disc pl-6 mb-4">
            <li>
              You have the right to unsubscribe from our newsletter at any time.
            </li>
            <li>Request information about what data we hold about you.</li>
            <li>
              Request deletion of your email address from our newsletter
              database.
            </li>
          </ul>

          <h3 className="text-2xl font-semibold mb-4">Contact Us</h3>
          <p className="mb-4">
            If you have any questions about this Privacy Policy or our data
            practices, please contact us at kawaiier@tutanota.com.
          </p>

          <h3 className="text-2xl font-semibold mb-4">
            Changes to This Policy
          </h3>
          <p className="mb-4">
            We may update this Privacy Policy from time to time. We will notify
            you of any changes by posting the new Privacy Policy on this page
            and updating the &apos;Last updated&apos; date.
          </p>
        </section>
      </div>
      <Footer />
    </>
  );
}
