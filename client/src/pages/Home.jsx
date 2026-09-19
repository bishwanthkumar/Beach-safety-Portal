import { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, ShieldCheck, Waves, MapPinned, Siren, ArrowRight,
  ChevronRight, CloudSun, Wind, Droplets, HeartPulse, Navigation,
  Clock3, Sparkles
} from 'lucide-react';
import { searchBeaches } from '../api';
import LoadingScreen from '../components/LoadingScreen';
import { LanguageContext, useLanguage } from '../contexts/LanguageContext';

const popular = [
  { name: 'Marina Beach', location: 'Chennai', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=90', id: 'fallback-0', accent: 'Urban coast' },
  { name: "Elliot's Beach", location: 'Chennai', image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1000&q=90', id: 'fallback-1', accent: 'Promenade' },
  { name: 'Kovalam Beach', location: 'Chengalpattu', image: 'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?auto=format&fit=crop&w=1000&q=90', id: 'fallback-2', accent: 'Surf & coast' }
];

const browseTiles = [
  ['Chennai Coast', 'Explore urban beaches', '#e8f6fb'],
  ['Heritage Coast', 'Mahabalipuram · Poompuhar', '#fff6e8'],
  ['South Coast', 'Rameswaram · Kanyakumari', '#eef8f1']
];

export default function Home() {
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState('');
  const nav = useNavigate();
  const { language } = useContext(LanguageContext);
  const { t } = useLanguage(language);

  const searchHint = useMemo(() => q.trim() ? `Search results for "${q.trim()}"` : t('searchHint'), [q, t]);

  useEffect(() => {
    const query = q.trim();
    if (query.length < 2) {
      setSuggestions([]);
      return undefined;
    }
    const timer = setTimeout(async () => {
      try {
        setSuggestions(await searchBeaches(query));
      } catch {
        setSuggestions([]);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [q]);

  async function doSearch(e) {
    e?.preventDefault();
    if (!q.trim()) return;
    setError('');
    setLoading(true);
    try {
      const items = await searchBeaches(q.trim());
      setSuggestions(items);
      if (!items.length) setError(`${t('noBeachFound')} "${q.trim()}". ${t('tryBeachName')}`);
      if (items[0]?._id) setTimeout(() => nav(`/beaches/${items[0]._id}`), 950);
    } catch (err) {
      setSuggestions([]);
      setError(err.message || 'Could not search right now.');
      setLoading(false);
    }
  }

  return (
    <div className="home-page page-transition">
      {loading && <LoadingScreen text={`${t('preparingSearch')} ${q.trim()}`} language={language} />}

      <section className="home-hero">
        <div className="hero-bg"></div>
        <div className="hero-shade"></div>
        <div className="hero-glow hero-glow-a"></div>
        <div className="hero-glow hero-glow-b"></div>
        <div className="hero-glow hero-glow-c"></div>

        <div className="container hero-content">
          <span className="hero-pill"><ShieldCheck size={15}/> {t('safetyFirstCoastalPortal')}</span>
          <h1>{t('heroTitle')}<br/><span>{t('heroSubtitle')}</span></h1>
          <p>
            {t('heroDescription')}
          </p>

          <form className="home-search" onSubmit={doSearch}>
            <Search size={21}/>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('searchPlaceholder')} aria-label="Search beaches" />
            <button type="submit" className="btn btn-primary btn-sm">{t('search')}</button>
          </form>

          <div className="search-hint"><Navigation size={13}/> {searchHint}</div>

          {q.trim().length >= 2 && suggestions.length > 0 && (
            <div className="live-search-results" aria-label={t('searchResults')}>
              <div className="live-search-heading"><span>{t('chooseBeach')}</span><small>{suggestions.length} {t('matches')}</small></div>
              {suggestions.slice(0, 5).map((b) => (
                <button type="button" className="live-search-card" key={b._id} onClick={() => nav(`/beaches/${b._id}`)}>
                  <span className="live-search-marker"><MapPinned size={16}/></span>
                  <span className="live-search-copy"><strong>{b.name}</strong><small>{b.district}, {b.state || t('india')}</small></span>
                  <ChevronRight size={17}/>
                </button>
              ))}
            </div>
          )}

          <div className="quick-pills">
            <span><CloudSun size={15}/> {t('liveWeather')}</span>
            <span><Waves size={15}/> {t('marineConditions')}</span>
            <span><MapPinned size={15}/> {t('safetyMap')}</span>
            <span><Siren size={15}/> {t('emergencyHelp')}</span>
          </div>

          <div className="hero-snapshot" aria-label="BeachSafe live overview">
            <div className="snapshot-heading"><span className="live-dot"></span><span>LIVE COASTAL OVERVIEW</span><small>Updated just now</small></div>
            <div className="snapshot-grid">
              <div><strong>28+</strong><span>{t('beachEntries')}</span></div>
              <div><strong>24/7</strong><span>{t('safetyGuide')}</span></div>
              <div><strong>112</strong><span>{t('emergencyHelp')}</span></div>
            </div>
          </div>
        </div>

        <div className="hero-bottom-trust">
          <div><ShieldCheck size={15}/> {t('beachLevelSafetyView')}</div>
          <div><Clock3 size={15}/> {t('timestampedInformation')}</div>
          <div><HeartPulse size={15}/> {t('safetyOverSightseeing')}</div>
        </div>
      </section>

      {error && (
        <section className="container search-error">
          <strong>{t('searchNotice')}</strong><span>{error}</span>
        </section>
      )}

      {suggestions.length > 1 && (
        <section className="container search-results-inline">
          <div className="section-title-row">
            <div><span className="eyebrow">{t('searchResults')}</span><h2>{t('chooseBeach')}</h2></div>
          </div>
          <div className="result-chips">
            {suggestions.slice(0, 8).map((b) => (
              <button key={b._id} onClick={() => nav(`/beaches/${b._id}`)}>
                <span><strong>{b.name}</strong><small>{b.district}, Tamil Nadu</small></span>
                <ChevronRight size={15}/>
              </button>
            ))}
          </div>
        </section>
      )}

      <section className="container trust-strip pattern-dots">
        <div className="trust-main">
          <span className="eyebrow">{t('searchCheckAct')}</span>
          <h2>{t('oneBeachPage')}</h2>
          <p>{t('trustDescription')}</p>
        </div>
        <div className="trust-metrics">
            <div><strong>28+</strong><span>{t('beachEntries')}</span></div>
          <div><strong>Live</strong><span>{t('liveWeatherLayer')}</span></div>
          <div><strong>1-tap</strong><span>{t('oneTapEmergency')}</span></div>
        </div>
      </section>

      <section className="container safety-preview gradient-overlay">
        <div className="floating-element floating-element-1"></div>
        <div className="floating-element floating-element-2"></div>
        <div className="floating-element floating-element-3"></div>
        <div className="section-title-row section-title-spaced">
          <div><span className="eyebrow">{t('safetyAtGlance')}</span><h2>{t('whatBeachSafeChecks')}</h2></div>
          <span className="soft-count">{t('builtAroundDecision')}</span>
        </div>

        <div className="safety-preview-grid">
          <div className="safety-preview-card featured">
            <div className="preview-icon"><ShieldCheck size={21}/></div>
            <div><span className="card-kicker">{t('safetyStatus')}</span><h3>{t('seeCurrentAdvisory')}</h3><p>{t('safetyStatusDescription')}</p></div>
            <ArrowRight size={18}/>
          </div>
          <div className="safety-preview-card">
            <div className="preview-icon"><CloudSun size={21}/></div>
            <div><span className="card-kicker">{t('weather')}</span><h3>{t('liveLocalConditions')}</h3><p>{t('weatherDescription')}</p></div>
          </div>
          <div className="safety-preview-card">
            <div className="preview-icon"><Waves size={21}/></div>
            <div><span className="card-kicker">{t('marine')}</span><h3>{t('knowWhatSeaDoing')}</h3><p>{t('marineDescription')}</p></div>
          </div>
          <div className="safety-preview-card">
            <div className="preview-icon"><Siren size={21}/></div>
            <div><span className="card-kicker">{t('emergencySupport')}</span><h3>{t('actQuickly')}</h3><p>{t('emergencyDescription')}</p></div>
          </div>
        </div>
      </section>

      <section className="discover-band pattern-waves">
        <div className="container discover-band-inner">
          <div><span className="eyebrow">{t('discoverCoast')}</span><h2>{t('browseByCoastalCharacter')}</h2></div>
          <div className="browse-tiles">
            {browseTiles.map(([title, sub, bg]) => (
              <button key={title} className="browse-tile" style={{ background: bg }} onClick={() => setQ(title.replace(' Coast',''))}>
                <span>{title}</span><small>{sub}</small><ChevronRight size={15}/>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="container popular-section">
        <div className="section-title-row">
          <div><span className="eyebrow">{t('tamilNaduCoast')}</span><h2>{t('startExploring')}</h2></div>
          <span className="soft-count">{t('searchFullDirectory')}</span>
        </div>

        <div className="popular-grid">
          {popular.map((b) => (
            <button className="popular-card" key={b.id} onClick={() => nav(`/beaches/${b.id}`)}>
              <img src={b.image} alt={b.name}/>
              <div className="popular-gradient"></div>
              <div className="popular-content">
                <span>{b.location} · {b.accent}</span>
                <h3>{b.name}</h3>
                <small>{t('openFullSafetyPage')} <ArrowRight size={14}/></small>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="container service-strip">
        <div className="service-item"><Droplets size={21}/><span>{t('humidity')}</span><small>{t('weatherDetail')}</small></div>
        <div className="service-item"><Wind size={21}/><span>{t('wind')}</span><small>{t('currentReading')}</small></div>
        <div className="service-item"><Waves size={21}/><span>{t('waveData')}</span><small>{t('marineLayer')}</small></div>
        <div className="service-item"><MapPinned size={21}/><span>{t('nearbyHelp')}</span><small>{t('mapBased')}</small></div>
        <div className="service-item"><Sparkles size={21}/><span>{t('safetyGuide')}</span><small>{t('quickToRead')}</small></div>
      </section>

      <section className="container emergency-home-strip" id="emergency">
        <div><span className="eyebrow">{t('emergencySupportTitle')}</span><h2>{t('needHelpQuickly')}</h2><p>{t('emergencyDescription')}</p></div>
        <button className="btn btn-danger" onClick={() => window.location.href = 'tel:112'}><Siren size={18}/> {t('call112')}</button>
      </section>
    </div>
  );
}