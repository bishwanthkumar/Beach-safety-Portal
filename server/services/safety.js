export function computeSafetyStatus({ beach, marine, alerts = [] }) {
  const active = alerts.filter((a) => a.active !== false);
  let severity = 0;
  let reasons = [];

  const wave = Number(marine?.waveHeight ?? NaN);
  const current = Number(marine?.currentVelocity ?? NaN);

  if (Number.isFinite(wave)) {
    if (wave >= 2.0) { severity = Math.max(severity, 2); reasons.push('High modeled wave height'); }
    else if (wave >= 1.2) { severity = Math.max(severity, 1); reasons.push('Moderate modeled wave height'); }
  }

  if (Number.isFinite(current)) {
    if (current >= 1.2) { severity = Math.max(severity, 2); reasons.push('Stronger modeled surface current'); }
    else if (current >= 0.7) { severity = Math.max(severity, 1); reasons.push('Moderate modeled surface current'); }
  }

  const alertWeight = active.reduce((m, a) => Math.max(m, ({ info: 0, caution: 1, high: 2, emergency: 2 }[a.severity] ?? 0)), 0);
  severity = Math.max(severity, alertWeight, beach.safety?.alertLevel === 'high' ? 2 : beach.safety?.alertLevel === 'yellow' ? 1 : 0);

  if (active.length > 0) reasons.push(`${active.length} active portal alert${active.length > 1 ? 's' : ''}`);

  const status = severity >= 2
    ? { key: 'red', label: 'Not recommended for water entry' }
    : severity === 1
      ? { key: 'yellow', label: 'Recommended with caution' }
      : { key: 'green', label: 'No Active Advisory' };

  return {
    ...status,
    reason: reasons.length ? reasons.join(' • ') : 'No application-level advisory is recorded.',
    generatedAt: new Date().toISOString(),
    methodology: 'Demo rule engine using current marine data plus portal alerts. Official authority decisions always take precedence.'
  };
}
