import { useContext } from 'react';
import { Hotel, Utensils, Car, Bath, Stethoscope, Droplets, Accessibility, LifeBuoy } from 'lucide-react';
import { LanguageContext, useLanguage } from '../contexts/LanguageContext';

const icons = { Hotel, Restaurant: Utensils, Parking: Car, Restroom: Bath, 'First Aid': Stethoscope, 'Drinking Water': Droplets, 'Accessible Access': Accessibility, Lifeguard: LifeBuoy };

export default function Facilities({ facilities = [], onSelectFacility }) {
  const { language } = useContext(LanguageContext);
  const { t } = useLanguage(language);
  const typeLabels = { Hotel: t('hotel'), Restaurant: t('restaurant'), Parking: t('parking'), Restroom: t('restroom'), 'First Aid': t('firstAid'), 'Drinking Water': t('drinkingWater'), 'Accessible Access': t('accessibleAccess'), Lifeguard: t('lifeguardTower') };
  return <section className="facilities-section">
    <div className="section-title-row"><div><span className="eyebrow">{t('nearbySupport')}</span><h2>{t('facilitiesUsefulPlaces')}</h2></div><span className="soft-count">{facilities.length} {t('nearby')}</span></div>
    <div className="facility-grid">{facilities.map((f) => { const I = icons[f.type] || LifeBuoy; return <button type="button" className="facility-card" key={f._id} onClick={() => onSelectFacility?.(f)}><div className="facility-icon"><I size={20}/></div><div><strong>{f.name}</strong><span>{typeLabels[f.type] || f.type}</span><small>{f.distanceMeters} m {t('away')}</small></div></button>; })}</div>
  </section>;
}
