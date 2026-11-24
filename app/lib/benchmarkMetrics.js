export function isFiniteMetric(value) {
  return typeof value === 'number' && Number.isFinite(value);
}

export function getSpeedometerTrend(versions) {
  const scores = (records) =>
    records.map((version) => version.scores?.speedometer3).filter(isFiniteMetric);
  const recent = scores(versions.slice(-3));
  const older = scores(versions.slice(-6, -3));
  if (recent.length === 0 || older.length === 0) return { trend: 'stable', change: 0 };

  const recentAverage = recent.reduce((sum, score) => sum + score, 0) / recent.length;
  const olderAverage = older.reduce((sum, score) => sum + score, 0) / older.length;
  const change = olderAverage === 0 ? 0 : ((recentAverage - olderAverage) / olderAverage) * 100;

  if (Math.abs(change) < 2) return { trend: 'stable', change: 0 };
  return { trend: change > 0 ? 'improving' : 'declining', change };
}
