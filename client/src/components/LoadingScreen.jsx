import { Waves, ShieldCheck, CloudSun, MapPinned, Sparkles } from 'lucide-react';

export default function LoadingScreen({ text = 'Preparing beach safety data' }) {
  return (
    <div className="loading-overlay">
      <div className="loading-card premium-loader">
        <div className="loader-ripple"><div className="loader-orb"><Waves size={34}/></div></div>
        <div className="loader-title">{text || 'Preparing beach safety data'}</div>
        <div className="loader-sub">Fetching beach • weather • safety • facilities</div>
        <div className="loader-track"><div className="loader-fill"></div></div>
        <div className="loader-progress-label"><span>Connecting to BeachSafe</span><strong>Loading…</strong></div>
        <div className="loader-checks">
          <span><ShieldCheck size={13}/> Safety</span>
          <span><CloudSun size={13}/> Weather</span>
          <span><MapPinned size={13}/> Map</span>
          <span><Sparkles size={13}/> Facilities</span>
        </div>
      </div>
    </div>
  );
}
