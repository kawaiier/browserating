export default function About() {
  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-50 rounded-lg shadow-md">
      <p className="text-gray-700 leading-relaxed text-lg font-light">
        All browsers have been tested on a{" "}
        <span className="font-medium text-indigo-600">
          clean install of macOS Ventura 13.6.9
        </span>
        . The testing was conducted on a{" "}
        <span className="font-medium text-indigo-600">
          15-inch MacBook Pro from 2019
        </span>
        , equipped with a{" "}
        <span className="font-medium text-indigo-600">
          2.3 GHz 8-core Intel Core i9 processor
        </span>{" "}
        and <span className="font-medium text-indigo-600">16 GB of RAM</span>,
        without any extensions enabled.
      </p>
    </div>
  );
}