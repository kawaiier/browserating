export default function SystemInfo({ title, details }) {
  return (
    <details className="group border border-border-subtle dark:border-neutral-700 rounded-radius-md overflow-hidden">
      <summary
        className="dark:text-neutral-300 text-text-secondary p-4 cursor-pointer flex items-center justify-between hover:bg-bg-surface-subtle dark:hover:bg-neutral-700 transition-colors"
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
      <div className="p-4 pt-2 border-t border-border-subtle dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800">
        {details}
      </div>
    </details>
  );
}
