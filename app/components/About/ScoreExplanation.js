export default function ScoreExplanation() {
  return (
    <div className="space-y-4">
      <p className="leading-relaxed" style={{ color: 'var(--text-default)' }}>
        <span className="font-bold" style={{ color: 'var(--text-brand)' }}>
          The higher the score, the faster the browser.
        </span>{' '}
        Speedometer 3.1 measures browser performance by simulating user
        interactions on various web applications.
      </p>

      <div
        className="p-4 rounded-lg"
        style={{ backgroundColor: 'var(--surface-sunken)' }}
      >
        <h4 className="font-medium mb-2" style={{ color: 'var(--text-default)' }}>
          Score Interpretation:
        </h4>
        <ul className="list-disc list-inside space-y-2" style={{ color: 'var(--text-subtle)' }}>
          <li>
            <span className="font-medium" style={{ color: 'var(--text-default)' }}>Speedometer 3.1:</span> Higher scores
            indicate faster JavaScript and DOM performance
          </li>
          <li>
            <span className="font-medium" style={{ color: 'var(--text-default)' }}>RAM Usage:</span> Lower values
            indicate more efficient memory usage
          </li>
          <li>
            <span className="font-medium" style={{ color: 'var(--text-default)' }}>Adblock:</span> Higher scores indicate
            better ad-blocking capabilities
          </li>
        </ul>
      </div>

      <p className="leading-relaxed text-sm italic" style={{ color: 'var(--text-subtle)' }}>
        Note: Performance may vary based on your specific hardware, operating
        system version, and browser configuration.
      </p>
    </div>
  );
}
