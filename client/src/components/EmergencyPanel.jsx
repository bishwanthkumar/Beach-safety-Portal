import { Copy, Hospital, MapPin, Phone, ShieldAlert } from 'lucide-react';

export default function EmergencyPanel({ beach }) {
  const call = (number) => { window.location.href = `tel:${number}`; };
  const coordinates = beach?.coordinates ? `${beach.coordinates.lat}, ${beach.coordinates.lng}` : 'Location unavailable';
  const copyLocation = async () => {
    try { await navigator.clipboard.writeText(`${beach?.name || 'BeachSafe beach'}, ${coordinates}`); } catch { /* clipboard permission is optional */ }
  };
  return <section className="emergency-panel" id="emergency">
    <div className="emergency-copy"><div className="emergency-mark"><ShieldAlert size={25}/></div><div><span className="eyebrow">EMERGENCY SUPPORT</span><h2>Need help right now?</h2><p>Call 112, tell the operator the beach name, and describe the nearest lifeguard tower or landmark.</p><div className="emergency-location"><MapPin size={15}/><span><strong>{beach?.name || 'Current beach'}</strong><small>GPS reference: {coordinates}</small></span><button type="button" onClick={copyLocation} aria-label="Copy beach location"><Copy size={15}/></button></div></div></div>
    <div className="emergency-actions">
      <button onClick={() => call('112')}><Phone size={17}/> Call 112</button>
      <button className="secondary-action" onClick={() => document.getElementById('map')?.scrollIntoView({ behavior: 'smooth' })}><Hospital size={17}/> Nearby support</button>
      <div className="emergency-near"><span>Nearest lifeguard</span><strong>{beach?.lifeguard?.nearestTowerMeters || 320} m</strong></div>
    </div>
  </section>;
}
