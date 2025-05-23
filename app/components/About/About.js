import ScoreExplanation from "./ScoreExplanation";
import SystemInfo from "./SystemInfo";
import TestProcedure from "./TestProcedure";

export default function About() {
  return (
    <section
      className="dark:text-gray-300 text-gray-700 max-w-4xl mx-auto px-4 py-8 mt-12 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/50"
      aria-labelledby="about-heading"
    >
      <h2
        id="about-heading"
        className="text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"
      >
        About Our Testing Methodology
      </h2>

      <div className="space-y-6">
        <SystemInfo
          title="macOS System Information (Apple Silicon)"
          details={
            <>
              All browsers have been tested on a{" "}
              <span className="font-medium text-[#7853E0] dark:text-[#9B7BE8]">
                clean install of macOS Sequoia 15.4.{" "}
              </span>
              The testing was conducted on a{" "}
              <span className="font-medium text-[#7853E0] dark:text-[#9B7BE8]">
                14-inch MacBook Pro from 2023
              </span>
              , equipped with an{" "}
              <span className="font-medium text-[#7853E0] dark:text-[#9B7BE8]">
                M3 Pro processor
              </span>{" "}
              and{" "}
              <span className="font-medium text-[#7853E0] dark:text-[#9B7BE8]">
                36 GB of RAM
              </span>
            </>
          }
        />
        <SystemInfo
          title="macOS System Information (Intel)"
          details={
            <>
              All browsers have been tested on a{" "}
              <span className="font-medium text-[#7853E0] dark:text-[#9B7BE8]">
                clean install of macOS Ventura 13.6.9.
              </span>
              The testing was conducted on a{" "}
              <span className="font-medium text-[#7853E0] dark:text-[#9B7BE8]">
                15-inch MacBook Pro from 2019
              </span>
              , equipped with a{" "}
              <span className="font-medium text-[#7853E0] dark:text-[#9B7BE8]">
                2.3 GHz 8-core Intel Core i9 processor
              </span>{" "}
              and{" "}
              <span className="font-medium text-[#7853E0] dark:text-[#9B7BE8]">
                16 GB of RAM
              </span>
            </>
          }
        />
        <SystemInfo
          title="Windows System Information"
          details={
            <>
              All browsers have been tested on an{" "}
              <span className="font-medium text-[#7853E0] dark:text-[#9B7BE8]">
                old install of Windows 10 Pro.
              </span>
              The testing was conducted on a{" "}
              <span className="font-medium text-[#7853E0] dark:text-[#9B7BE8]">
                Lenovo Ideapad Gaming 3 Laptop
              </span>
              , equipped with an{" "}
              <span className="font-medium text-[#7853E0] dark:text-[#9B7BE8]">
                AMD Ryzen 5 5600H with Radeon Graphics 3.3 GHz processor
              </span>{" "}
              and{" "}
              <span className="font-medium text-[#7853E0] dark:text-[#9B7BE8]">
                16 GB of RAM
              </span>
            </>
          }
        />
        <SystemInfo
          title="Android System Information"
          details={
            <>
              All browsers have been tested on{" "}
              <span className="font-medium text-[#7853E0] dark:text-[#9B7BE8]">
                Nothing OS 2.6 Android 14.
              </span>
              The test was conducted on a{" "}
              <span className="font-medium text-[#7853E0] dark:text-[#9B7BE8]">
                Nothing Phone (2a)
              </span>
              , equipped with an{" "}
              <span className="font-medium text-[#7853E0] dark:text-[#9B7BE8]">
                Dimensity 7200 Pro CPU with Mali-G610 MC4 GPU
              </span>{" "}
              and{" "}
              <span className="font-medium text-[#7853E0] dark:text-[#9B7BE8]">
                8 GB of RAM
              </span>
            </>
          }
        />
        <SystemInfo
          title="iPad System Information"
          details={
            <>
              All browsers have been tested on{" "}
              <span className="font-medium text-[#7853E0] dark:text-[#9B7BE8]">
                iPadOS 18.5.
              </span>
              The test was conducted on a{" "}
              <span className="font-medium text-[#7853E0] dark:text-[#9B7BE8]">
                iPad Mini 7th Generation
              </span>
              , equipped with a{" "}
              <span className="font-medium text-[#7853E0] dark:text-[#9B7BE8]">
                A17 Pro CPU
              </span>{" "}
              and{" "}
              <span className="font-medium text-[#7853E0] dark:text-[#9B7BE8]">
                8 GB of RAM
              </span>
            </>
          }
        />
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
            Testing Procedure
          </h3>
          <TestProcedure />
        </div>
        <hr className="border-gray-200 dark:border-gray-700 my-4" />
        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
            Understanding the Scores
          </h3>
          <ScoreExplanation />
        </div>
      </div>
    </section>
  );
}
