export default function SystemInfo({ title, details }) {
  return (
    <details className="group border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <summary
        className="dark:text-gray-300 text-gray-700 p-4 cursor-pointer flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        aria-expanded="false"
      >
        <span className="font-medium">{title}</span>
        <svg
          className="w-5 h-5 transform group-open:rotate-180 transition-transform duration-200"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </summary>
      <div className="p-4 pt-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        {details}
      </div>
    </details>
  );
}
