export default function SystemInfo({ title, details }) {
  return (
    <details>
      <summary className="dark:text-gray-300 text-gray-700">{title}</summary>
      <div className="ml-4 pt-2 border-t border-gray-200 my-4">{details}</div>
    </details>
  );
}
