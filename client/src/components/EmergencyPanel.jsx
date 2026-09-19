import { useContext } from 'react';
import { Copy, Hospital, MapPin, Phone, ShieldAlert } from 'lucide-react';
import { LanguageContext, useLanguage } from '../contexts/LanguageContext';

export default function EmergencyPanel({ beach }) {
  const { language } = useContext(LanguageContext);
  const { t } = useLanguage(language);
  const call = (number) => { window.location.href = `tel:${number}`; };
  const coordinates = beach?.coordinates ? `${beach.coordinates.lat}, ${beach.coordinates.lng}` : t('locationUnavailable');
  const copyLocation = async () => {
    try { await navigator.clipboard.writeText(`${beach?.name || t('beachSafe')}, ${coordinates}`); } catch { /* clipboard permission is optional */ }
  };
  return <section className="emergency-panel" id="emergency">
    <div className="emergency-copy"><div className="emergency-mark"><ShieldAlert size={25}/></div><div><span className="eyebrow">{t('emergencySupportTitle')}</span><h2>{t('needHelpRightNow')}</h2><p>{t('emergencyInstructions')}</p><div className="emergency-location"><MapPin size={15}/><span><strong>{beach?.name || t('currentBeach')}</strong><small>{t('gpsReference')}: {coordinates}</small></span><button type="button" onClick={copyLocation} aria-label={t('copyBeachLocation')}><Copy size={15}/></button></div></div></div>
    <div className="emergency-actions">
      <button onClick={() => call('112')}><Phone size={17}/> {t('call112')}</button>
      <button className="secondary-action" onClick={() => document.getElementById('map')?.scrollIntoView({ behavior: 'smooth' })}><Hospital size={17}/> {t('nearbySupport')}</button>
      <div className="emergency-near"><span>{t('nearestLifeguard')}</span><strong>{beach?.lifeguard?.nearestTowerMeters || 320} {t('meters')}</strong></div>
    </div>
  </section>;
}
