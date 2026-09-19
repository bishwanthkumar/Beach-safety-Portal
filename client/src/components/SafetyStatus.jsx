import { AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';

const map = {
  green: { icon: CheckCircle2, title: 'No Active Advisory', className: 'status-green' },
  yellow: { icon: AlertTriangle, title: 'Caution', className: 'status-yellow' },
  red: { icon: ShieldAlert, title: 'Avoid Water', className: 'status-red' }
};

export default function SafetyStatus({ status }) {
  const cfg = map[status?.key] || map.green;
  const Icon = cfg.icon;
  return <div className={`status-card ${cfg.className}`}>
    <div className="status-icon"><Icon size={30}/></div>
    <div>
      <div className="eyebrow">CURRENT BEACH STATUS</div>
      <h2>{cfg.title}</h2>
      <p>{status?.reason}</p>
      <small>Information summary • {status?.generatedAt ? new Date(status.generatedAt).toLocaleTimeString() : 'updated now'}</small>
    </div>
  </div>;
}
