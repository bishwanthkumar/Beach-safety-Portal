import { useContext } from 'react';
import { CloudSun, Droplets, Wind, Thermometer } from 'lucide-react';
import { LanguageContext, useLanguage } from '../contexts/LanguageContext';

export default function WeatherCard({ weather }) {
  const { language } = useContext(LanguageContext);
  const { t } = useLanguage(language);
  if (!weather || weather.error) return <div className="panel empty-panel">{t('weatherUnavailable')} {t('refresh')}</div>;
  const weatherDescription = weatherCodeLabel(weather.weatherCode, t) || weather.description;
  return <div className="weather-panel panel">
    <div className="panel-heading"><div><span className="eyebrow">{t('liveWeather')}</span><h3>{weatherDescription}</h3></div><CloudSun size={36}/></div>
    <div className="weather-main"><strong>{Math.round(weather.temperature)}°C</strong><span>{t('feelsLike')} {Math.round(weather.apparentTemperature)}°C</span></div>
    <div className="metric-grid">
      <div><Droplets size={17}/><span>{t('humidity')}</span><strong>{weather.humidity}%</strong></div>
      <div><Wind size={17}/><span>{t('wind')}</span><strong>{Math.round(weather.windSpeed)} km/h</strong></div>
      <div><Thermometer size={17}/><span>{t('precipitation')}</span><strong>{weather.precipitation ?? 0} mm</strong></div>
      <div><CloudSun size={17}/><span>{t('cloudCover')}</span><strong>{weather.cloudCover}%</strong></div>
    </div>
    <div className="data-source">{t('source')}: {weather.source} • {t('updated')} {weather.time ? new Date(weather.time).toLocaleString() : t('now')}</div>
  </div>;
}

function weatherCodeLabel(code, t) {
  const labels = { 0: 'clearSky', 1: 'mainlyClear', 2: 'partlyCloudy', 3: 'overcast', 45: 'fog', 48: 'fog', 51: 'lightDrizzle', 53: 'drizzle', 55: 'denseDrizzle', 61: 'lightRain', 63: 'rain', 65: 'heavyRain', 80: 'rainShowers', 81: 'rainShowers', 82: 'heavyRainShowers', 95: 'thunderstorm', 96: 'thunderstormHail', 99: 'thunderstormHail' };
  return labels[code] ? t(labels[code]) : '';
}
