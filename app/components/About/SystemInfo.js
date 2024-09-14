export default function SystemInfo({ title, details }) {
    return (
      <details open>
        <summary>{title}</summary>
        <div className="ml-4 pt-2 border-t border-gray-200 mt-2">
          {details}
        </div>
      </details>
    );
  }