import { useContext } from 'react';
import { AlertTriangle, BellRing } from 'lucide-react';
import { LanguageContext, useLanguage } from '../contexts/LanguageContext';

const cls = { info: 'alert-info', caution: 'alert-caution', high: 'alert-high', emergency: 'alert-emergency' };

export default function AlertList({ alerts = [] }) {
  const { language } = useContext(LanguageContext);
  const { t } = useLanguage(language);
  const translateAlert = (alert) => ({
    ...alert,
    title: alert.title === 'Strong wind advisory' ? t('strongWindAdvisory') : alert.title === 'High wave information' ? t('highWaveInformation') : alert.title,
    description: alert.description === 'Exercise care near open shore areas and follow local beach instructions.' ? t('strongWindDescription') : alert.description === 'Water entry should follow current local authority and lifeguard guidance.' ? t('highWaveDescription') : alert.description
  });
  return <div className="panel">
    <div className="panel-heading"><div><span className="eyebrow">{t('safetyAlerts')}</span><h3>{alerts.length ? `${alerts.length} ${t('activeAlert')}${alerts.length > 1 ? t('pluralSuffix') : ''}` : t('noActiveAlerts')}</h3></div><BellRing size={28}/></div>
    {alerts.length ? <div className="alert-list">{alerts.map((raw) => { const a = translateAlert(raw); return <div key={a._id} className={`alert-item ${cls[a.severity] || cls.info}`}><AlertTriangle size={20}/><div><strong>{a.title}</strong><p>{a.description}</p><small>{a.source} • {new Date(a.issuedAt).toLocaleTimeString()}</small></div></div>; })}</div> : <div className="empty-message">{t('noPortalAlerts')}</div>}
  </div>;
}
