import { AlertTriangle, BellRing } from 'lucide-react';

const cls = { info: 'alert-info', caution: 'alert-caution', high: 'alert-high', emergency: 'alert-emergency' };

export default function AlertList({ alerts = [] }) {
  return <div className="panel">
    <div className="panel-heading"><div><span className="eyebrow">SAFETY ALERTS</span><h3>{alerts.length ? `${alerts.length} Active Alert${alerts.length > 1 ? 's' : ''}` : 'No active alerts'}</h3></div><BellRing size={28}/></div>
    {alerts.length ? <div className="alert-list">{alerts.map((a) => <div key={a._id} className={`alert-item ${cls[a.severity] || cls.info}`}><AlertTriangle size={20}/><div><strong>{a.title}</strong><p>{a.description}</p><small>{a.source} • {new Date(a.issuedAt).toLocaleTimeString()}</small></div></div>)}</div> : <div className="empty-message">No active portal alerts for this beach. Continue following local instructions.</div>}
  </div>;
}
