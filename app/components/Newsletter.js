import { useEffect, useRef } from "react";

export default function Newsletter() {
  const iframeRef = useRef(null);

  useEffect(() => {
    // Ensure iframe loads properly
    const iframe = iframeRef.current;
    if (iframe) {
      iframe.addEventListener("load", () => {
        iframe.style.width = "100%";
      });
    }
  }, []);

  return (
    <section className="max-w-4xl mx-auto px-4 py-8 mt-12 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-lg dark:shadow-gray-900/50">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Stay Updated with Browser Performance
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Get notified when we publish new browser performance comparisons
        </p>
      </div>

      <form className="max-w-md mx-auto">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
            bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 
            placeholder-gray-500 dark:placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400
            transition-colors duration-200"
            required
          />
          <button
            type="submit"
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 
            text-white font-medium rounded-lg shadow-md 
            hover:from-purple-700 hover:to-blue-700 
            focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400
            transition-all duration-200 transform hover:scale-105"
          >
            Subscribe
          </button>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </form>
    </section>
  );
}
