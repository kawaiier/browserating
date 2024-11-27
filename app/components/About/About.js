import SystemInfo from "./SystemInfo";
import TestProcedure from "./TestProcedure";
import ScoreExplanation from "./ ScoreExplanation";

export default function About() {
  return (
    <section className="max-w-4xl mx-auto px-4 py-8 mt-12 bg-gray-50 rounded-lg shadow-md">
      <SystemInfo
        title="macOS System Information (Apple Silicon)"
        details={
          <>
            All browsers have been tested on a{" "}
            <span className="font-medium text-[#7853E0]">
              clean install of macOS Sequoia 15.1.1.
            </span>
            The testing was conducted on a{" "}
            <span className="font-medium text-[#7853E0]">
              14-inch MacBook Pro from 2023
            </span>
            , equipped with an{" "}
            <span className="font-medium text-[#7853E0]">M3 Pro processor</span>{" "}
            and <span className="font-medium text-[#7853E0]">36 GB of RAM</span>
          </>
        }
      />
      <SystemInfo
        title="macOS System Information (Intel)"
        details={
          <>
            All browsers have been tested on a{" "}
            <span className="font-medium text-[#7853E0]">
              clean install of macOS Ventura 13.6.9.
            </span>
            The testing was conducted on a{" "}
            <span className="font-medium text-[#7853E0]">
              15-inch MacBook Pro from 2019
            </span>
            , equipped with a{" "}
            <span className="font-medium text-[#7853E0]">
              2.3 GHz 8-core Intel Core i9 processor
            </span>{" "}
            and <span className="font-medium text-[#7853E0]">16 GB of RAM</span>
          </>
        }
      />
      <SystemInfo
        title="Windows System Information"
        details={
          <>
            All browsers have been tested on an{" "}
            <span className="font-medium text-[#7853E0]">
              old install of Windows 10 Pro.
            </span>
            The testing was conducted on a{" "}
            <span className="font-medium text-[#7853E0]">
              Lenovo Ideapad Gaming 3 Laptop
            </span>
            , equipped with an{" "}
            <span className="font-medium text-[#7853E0]">
              AMD Ryzen 5 5600H with Radeon Graphics 3.3 GHz processor
            </span>{" "}
            and <span className="font-medium text-[#7853E0]">16 GB of RAM</span>
          </>
        }
      />
      <SystemInfo
        title="Android System Information"
        details={
          <>
            All browsers have been tested on{" "}
            <span className="font-medium text-[#7853E0]">
              Nothing OS 2.6 Android 14.
            </span>
            The test was conducted on a{" "}
            <span className="font-medium text-[#7853E0]">
              Nothing Phone (2a)
            </span>
            , equipped with an{" "}
            <span className="font-medium text-[#7853E0]">
              Dimensity 7200 Pro CPU with Mali-G610 MC4 GPU
            </span>{" "}
            and <span className="font-medium text-[#7853E0]">8 GB of RAM</span>
          </>
        }
      />
      <TestProcedure />
      <hr className="border-gray-200 my-4" />
      <ScoreExplanation />
    </section>
  );
}
