export default function About() {
  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-50 rounded-lg shadow-md">
      <details open>
        <summary>macOS System Information</summary>
        <div className="ml-4 pt-2 border-t border-gray-200 mt-2">
          All browsers have been tested on a{" "}
          <span className="font-medium text-indigo-600">
            clean install of macOS Ventura 13.6.9.
          </span>
          The testing was conducted on a{" "}
          <span className="font-medium text-indigo-600">
            15-inch MacBook Pro from 2019
          </span>
          , equipped with a{" "}
          <span className="font-medium text-indigo-600">
            2.3 GHz 8-core Intel Core i9 processor
          </span>{" "}
          and <span className="font-medium text-indigo-600">16 GB of RAM</span>
        </div>
      </details>
      <details open>
        <summary>Windows System Information</summary>
        <div className="ml-4 pt-2 border-t border-gray-200 mt-2">
          All browsers have been tested on an{" "}
          <span className="font-medium text-indigo-600">
            old install of Windows 10 Pro.
          </span>
          The testing was conducted on a{" "}
          <span className="font-medium text-indigo-600">
            Lenovo Ideapad Gaming 3 Laptop
          </span>
          , equipped with an{" "}
          <span className="font-medium text-indigo-600">
            AMD Ryzen 5 5600H with Radeon Graphics 3.3 GHz processor
          </span>{" "}
          and <span className="font-medium text-indigo-600">16 GB of RAM</span>
        </div>
      </details>

      <p className="text-gray-700 leading-relaxed text-lg font-light pt-2">
        For each browser,{" "}
        <span className="font-medium text-indigo-600">
          five tests were conducted
        </span>
        . The{" "}
        <span className="font-medium text-indigo-600">
          best and worst results were eliminated
        </span>
        , and the{" "}
        <span className="font-medium text-indigo-600">
          average of the remaining three tests was calculated
        </span>{" "}
        to determine the final result.
      </p>
    </div>
  );
}
