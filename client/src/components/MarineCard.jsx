import { useContext } from 'react';
import { Waves, Navigation, Gauge } from 'lucide-react';
import { LanguageContext, useLanguage } from '../contexts/LanguageContext';

export default function MarineCard({ marine }) {
  const { language } = useContext(LanguageContext);
  const { t } = useLanguage(language);
  if (!marine || marine.error) return <div className="panel empty-panel">{t('marineUnavailable')}</div>;
  return <div className="marine-panel panel">
    <div className="panel-heading"><div><span className="eyebrow">{t('liveSeaConditions')}</span><h3>{t('marineOverview')}</h3></div><Waves size={34}/></div>
    <div className="metric-grid marine-grid">
      <div><Waves size={17}/><span>{t('waveHeight')}</span><strong>{marine.waveHeight ?? '—'} m</strong></div>
      <div><Gauge size={17}/><span>{t('wavePeriod')}</span><strong>{marine.wavePeriod ?? '—'} s</strong></div>
      <div><Navigation size={17}/><span>{t('current')}</span><strong>{marine.currentVelocity ?? '—'} km/h</strong></div>
      <div><Waves size={17}/><span>{t('seaSurfaceTemperature')}</span><strong>{marine.seaSurfaceTemperature ?? '—'}°C</strong></div>
    </div>
    <div className="data-source">{t('source')}: {marine.source} • {t('coastalModelNote')}</div>
  </div>;
}
