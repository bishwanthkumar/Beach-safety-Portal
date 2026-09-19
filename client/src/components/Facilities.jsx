import { Hotel, Utensils, Car, Bath, Stethoscope, Droplets, Accessibility, LifeBuoy } from 'lucide-react';

const icons = { Hotel, Restaurant: Utensils, Parking: Car, Restroom: Bath, 'First Aid': Stethoscope, 'Drinking Water': Droplets, 'Accessible Access': Accessibility, Lifeguard: LifeBuoy };

export default function Facilities({ facilities = [] }) {
  return <section className="facilities-section">
    <div className="section-title-row"><div><span className="eyebrow">NEARBY SUPPORT</span><h2>Facilities & useful places</h2></div><span className="soft-count">{facilities.length} nearby</span></div>
    <div className="facility-grid">{facilities.map((f) => { const I = icons[f.type] || LifeBuoy; return <div className="facility-card" key={f._id}><div className="facility-icon"><I size={20}/></div><div><strong>{f.name}</strong><span>{f.type}</span><small>{f.distanceMeters} m away</small></div></div>; })}</div>
  </section>;
}
