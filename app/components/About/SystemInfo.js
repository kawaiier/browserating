export default function SystemInfo({ title, details }) {
  return (
    <details>
      <summary>{title}</summary>
      <div className="ml-4 pt-2 border-t border-gray-200 my-4">{details}</div>
    </details>
  );
}
