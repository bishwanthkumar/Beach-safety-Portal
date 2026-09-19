import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Heart, Clock, MapPin, LifeBuoy, Share2, Navigation2, ShieldCheck, ChevronRight } from 'lucide-react';
import { getBeachFull } from '../api';
import LoadingScreen from '../components/LoadingScreen';
import SafetyStatus from '../components/SafetyStatus';
import WeatherCard from '../components/WeatherCard';
import MarineCard from '../components/MarineCard';
import AlertList from '../components/AlertList';
import Facilities from '../components/Facilities';
import BeachMap from '../components/BeachMap';
import EmergencyPanel from '../components/EmergencyPanel';
import ReportHazard from '../components/ReportHazard';
import FamilyChecklist from '../components/FamilyChecklist';
import { useLanguage } from '../contexts/LanguageContext';

export default function BeachDetails() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [watch, setWatch] = useState(localStorage.getItem(`watch-${id}`) === '1');
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');
  const { t } = useLanguage();

  useEffect(() => {
    let alive = true;
    setLoading(true); setError('');
    getBeachFull(id)
      .then((d) => alive && setData(d))
      .catch((e) => alive && setError(e.message || 'Could not load beach'))
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [id]);

  function toggleWatch() {
    const next = !watch;
    setWatch(next);
    localStorage.setItem(`watch-${id}`, next ? '1' : '0');
    setToast(next ? t('beachAddedWatchlist') : t('beachRemovedWatchlist'));
    setTimeout(() => setToast(''), 2200);
  }

  async function shareBeach() {
    const payload = { title: data?.beach?.name, text: `BeachSafe — ${data?.beach?.name}`, url: window.location.href };
    try {
      if (navigator.share) await navigator.share(payload);
      else await navigator.clipboard.writeText(window.location.href);
      setToast(t('beachLinkReady'));
    } catch { /* user cancelled sharing */ }
  }

  if (loading) return <LoadingScreen text={t('preparingBeachSafetyView')} />;
  if (error || !data) return <div className="container page-pad"><div className="error-box"><strong>Beach page unavailable</strong><p>{error || 'Beach not found.'}</p><Link to="/">← Back to search</Link></div></div>;

  const { beach, weather, marine, safetyStatus, alerts, facilities } = data;

  return (
    <main className="beach-page page-transition">
      {toast && <div className="toast-message"><ShieldCheck size={15}/>{toast}</div>}

      <section className="container beach-page-top">
        <Link to="/" className="back-link"><ArrowLeft size={15}/> {t('searchOtherBeaches')}</Link>

        <div className="beach-title-row">
          <div>
            <span className="eyebrow">{t('beachProfile')}</span>
            <h1>{beach.name}</h1>
            <p className="location-line"><MapPin size={15}/> {beach.district}, Tamil Nadu</p>
          </div>
          <div className="beach-actions">
            <button className={`btn btn-outline ${watch ? 'btn-primary' : ''}`} onClick={toggleWatch}><Heart size={16} fill={watch ? 'currentColor' : 'none'}/> {watch ? t('watching') : t('watch')}</button>
            <button className="btn btn-secondary" onClick={shareBeach}><Share2 size={16}/> {t('share')}</button>
          </div>
        </div>

        <div className="beach-photo-wrap">
          <img src={beach.image} alt={beach.name}/>
          <div className="beach-photo-shade"></div>
          <div className="beach-photo-content">
            <span className="photo-chip"><ShieldCheck size={13}/> {t('safetyInformation')}</span>
            <div>
              <strong>{beach.tags?.join('  •  ')}</strong>
              <small>{t('updatedEnvironmental')}</small>
            </div>
          </div>
        </div>

        <div className="beach-quick-nav">
          <a href="#safety"><ShieldCheck size={15}/> {t('safety')}</a>
          <a href="#weather"><CloudFallback/> {t('weather')}</a>
          <a href="#alerts"><BellFallback/> {t('alerts')}</a>
          <a href="#facilities"><LifeBuoy size={15}/> {t('facilities')}</a>
          <a href="#map"><MapFallback/> {t('map')}</a>
          <a href="#emergency"><SirenFallback/> {t('emergency')}</a>
        </div>
      </section>

      <section className="container beach-status-row" id="safety">
        <SafetyStatus status={safetyStatus}/>
        <div className="lifeguard-card professional-card">
          <div className="facility-icon"><LifeBuoy size={24}/></div>
          <div>
            <span className="eyebrow">{t('lifeguardService')}</span>
            <h3>{beach.lifeguard?.status || t('unknown')}</h3>
            <p><Clock size={14}/> {beach.lifeguard?.dutyHours || 'Not available'}</p>
            <small>{beach.lifeguard?.towers || 0} {t('watchTowers')} • {t('nearestTower')} {beach.lifeguard?.nearestTowerMeters || '—'} {t('meters')}</small>
          </div>
          <button className="tiny-outline">{t('locate')} <Navigation2 size={13}/></button>
        </div>
      </section>

      <section className="container data-section" id="weather">
        <div className="section-intro"><span className="eyebrow">{t('currentConditions')}</span><h2>{t('weatherMarineSnapshot')}</h2><p>{t('liveEnvironmentalReadings')}</p></div>
        <div className="weather-grid"><WeatherCard weather={weather}/><MarineCard marine={marine}/></div>
      </section>

      <section className="container content-grid" id="alerts">
        <div>
          <AlertList alerts={alerts}/>
          <div className="source-note"><ShieldCheck size={15}/> Weather and marine layers are informational. Official warnings, closures, signs and lifeguard instructions take precedence.</div>
        </div>
          <FamilyChecklist beach={beach} safetyStatus={safetyStatus} marine={marine}/>
      </section>

      <section className="container" id="facilities">
        <Facilities facilities={facilities}/>
      </section>

      <section className="container" id="map">
        <BeachMap beach={beach} facilities={facilities}/>
      </section>

      <section className="container action-grid">
        <ReportHazard beachId={beach._id}/>
        <div className="panel safety-guide-panel">
          <div className="panel-heading"><div><span className="eyebrow">{t('safetyGuide')}</span><h3>{t('beforeEnteringWater')}</h3></div><ShieldCheck size={24}/></div>
          <div className="guidelines">
            {[
              t('checkCurrentAlerts'),
              t('followLifeguardDirections'),
              t('keepChildrenSupervised'),
              t('knowNearestLifeguard'),
              t('notGuarantee')
            ].map((x) => <div key={x}><span>✓</span>{x}<ChevronRight size={14}/></div>)}
          </div>
        </div>
      </section>

      <div className="container" id="emergency">
        <EmergencyPanel beach={beach}/>
      </div>

      <section className="container disclaimer">
        <strong>{t('important')}</strong> {t('disclaimer')}
      </section>
    </main>
  );
}

function CloudFallback() { return <span className="tiny-emoji">🌤</span>; }
function BellFallback() { return <span className="tiny-emoji">⚠️</span>; }
function MapFallback() { return <span className="tiny-emoji">🗺️</span>; }
function SirenFallback() { return <span className="tiny-emoji">🚨</span>; }
