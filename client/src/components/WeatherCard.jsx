import { CloudSun, Droplets, Wind, Thermometer } from 'lucide-react';

export default function WeatherCard({ weather }) {
  if (!weather || weather.error) return <div className="panel empty-panel">Live weather is temporarily unavailable. Please refresh.</div>;
  return <div className="weather-panel panel">
    <div className="panel-heading"><div><span className="eyebrow">LIVE WEATHER</span><h3>{weather.description}</h3></div><CloudSun size={36}/></div>
    <div className="weather-main"><strong>{Math.round(weather.temperature)}°C</strong><span>Feels like {Math.round(weather.apparentTemperature)}°C</span></div>
    <div className="metric-grid">
      <div><Droplets size={17}/><span>Humidity</span><strong>{weather.humidity}%</strong></div>
      <div><Wind size={17}/><span>Wind</span><strong>{Math.round(weather.windSpeed)} km/h</strong></div>
      <div><Thermometer size={17}/><span>Precipitation</span><strong>{weather.precipitation ?? 0} mm</strong></div>
      <div><CloudSun size={17}/><span>Cloud cover</span><strong>{weather.cloudCover}%</strong></div>
    </div>
    <div className="data-source">Source: {weather.source} • Updated {weather.time ? new Date(weather.time).toLocaleString() : 'now'}</div>
  </div>;
}
