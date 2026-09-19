import { useContext } from 'react';
import { AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { LanguageContext, useLanguage } from '../contexts/LanguageContext';

const map = {
  green: { icon: CheckCircle2, title: 'No Active Advisory', className: 'status-green' },
  yellow: { icon: AlertTriangle, title: 'Recommended With Caution', className: 'status-yellow' },
  red: { icon: ShieldAlert, title: 'Not Recommended For Water Entry', className: 'status-red' }
};

export default function SafetyStatus({ status }) {
  const { language } = useContext(LanguageContext);
  const { t } = useLanguage(language);
  const key = status?.key || 'green';
  const cfg = map[key] || map.green;
  const Icon = cfg.icon;
  const title = key === 'red' ? t('notRecommendedWaterEntry') : key === 'yellow' ? t('recommendedWithCaution') : t('noActiveAdvisory');
  return <div className={`status-card ${cfg.className}`}>
    <div className="status-icon"><Icon size={30}/></div>
    <div>
      <div className="eyebrow">CURRENT BEACH STATUS</div>
      <h2>{title}</h2>
      <p>{status?.reason}</p>
      <small>Information summary • {status?.generatedAt ? new Date(status.generatedAt).toLocaleTimeString() : 'updated now'}</small>
    </div>
  </div>;
}
