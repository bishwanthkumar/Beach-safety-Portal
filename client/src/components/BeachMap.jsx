import { MapContainer, Marker, Popup, TileLayer, CircleMarker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect } from 'react';
import { useContext } from 'react';
import 'leaflet/dist/leaflet.css';
import { LanguageContext, useLanguage } from '../contexts/LanguageContext';

const icon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});

function Recenter({ center }) { const map = useMap(); useEffect(() => { map.setView(center, 13); }, [center, map]); return null; }

export default function BeachMap({ beach, facilities = [], focusPoint = null }) {
  const { language } = useContext(LanguageContext);
  const { t } = useLanguage(language);
  const center = [beach.coordinates.lat, beach.coordinates.lng];
  const mapCenter = focusPoint ? [focusPoint.lat, focusPoint.lng] : center;
  return <div className="map-wrap">
    <div className="map-header"><div><span className="eyebrow">{t('interactiveSafetyMap')}</span><h3>{beach.name}</h3></div><span className="map-legend">{t('mapLegend')}</span></div>
    <MapContainer center={center} zoom={13} scrollWheelZoom={false} className="leaflet-map">
      <Recenter center={mapCenter}/>
      <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={center} icon={icon}><Popup><strong>{beach.name}</strong><br/>{t('beachLocation')}</Popup></Marker>
      {facilities.slice(0, 7).map((f) => {
        const selected = focusPoint && f.coordinates?.lat === focusPoint.lat && f.coordinates?.lng === focusPoint.lng;
        return <CircleMarker key={f._id} center={[f.coordinates.lat, f.coordinates.lng]} radius={selected ? 11 : 7} pathOptions={selected ? { color: '#d95243', fillColor: '#f4b46a', fillOpacity: 1, weight: 3 } : undefined}><Popup><strong>{f.name}</strong><br/>{f.type}<br/>{f.distanceMeters} m {t('away')}</Popup></CircleMarker>;
      })}
    </MapContainer>
  </div>;
}
