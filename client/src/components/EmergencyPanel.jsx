import { Phone, Hospital, MapPin, ShieldAlert } from 'lucide-react';

export default function EmergencyPanel({ beach }) {
  const call = (number) => { window.location.href = `tel:${number}`; };
  return <section className="emergency-panel" id="emergency">
    <div className="emergency-copy"><div className="emergency-mark"><ShieldAlert size={25}/></div><div><span className="eyebrow">EMERGENCY SUPPORT</span><h2>Need help right now?</h2><p>Use the quickest available emergency route. Location sharing requires your permission.</p></div></div>
    <div className="emergency-actions">
      <button onClick={() => call('112')}><Phone size={17}/> Call 112</button>
      <button className="secondary-action"><Hospital size={17}/> Nearest Hospital</button>
      <button className="secondary-action"><MapPin size={17}/> Share Location</button>
      <div className="emergency-near"><span>Nearest lifeguard</span><strong>{beach?.lifeguard?.nearestTowerMeters || 320} m</strong></div>
    </div>
  </section>;
}
