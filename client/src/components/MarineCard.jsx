import { Waves, Navigation, Gauge } from 'lucide-react';

export default function MarineCard({ marine }) {
  if (!marine || marine.error) return <div className="panel empty-panel">Live marine data is temporarily unavailable.</div>;
  return <div className="marine-panel panel">
    <div className="panel-heading"><div><span className="eyebrow">LIVE SEA CONDITIONS</span><h3>Marine overview</h3></div><Waves size={34}/></div>
    <div className="metric-grid marine-grid">
      <div><Waves size={17}/><span>Wave Height</span><strong>{marine.waveHeight ?? '—'} m</strong></div>
      <div><Gauge size={17}/><span>Wave Period</span><strong>{marine.wavePeriod ?? '—'} s</strong></div>
      <div><Navigation size={17}/><span>Current</span><strong>{marine.currentVelocity ?? '—'} km/h</strong></div>
      <div><Waves size={17}/><span>Sea Surface Temp</span><strong>{marine.seaSurfaceTemperature ?? '—'}°C</strong></div>
    </div>
    <div className="data-source">Source: {marine.source} • Coastal model values can have limited accuracy close to shore.</div>
  </div>;
}
