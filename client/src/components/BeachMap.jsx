import { MapContainer, Marker, Popup, TileLayer, CircleMarker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect } from 'react';
import 'leaflet/dist/leaflet.css';

const icon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});

function Recenter({ center }) { const map = useMap(); useEffect(() => { map.setView(center, 13); }, [center, map]); return null; }

export default function BeachMap({ beach, facilities = [] }) {
  const center = [beach.coordinates.lat, beach.coordinates.lng];
  return <div className="map-wrap">
    <div className="map-header"><div><span className="eyebrow">INTERACTIVE SAFETY MAP</span><h3>{beach.name}</h3></div><span className="map-legend">Beach • Facilities • Safety points</span></div>
    <MapContainer center={center} zoom={13} scrollWheelZoom={false} className="leaflet-map">
      <Recenter center={center}/>
      <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={center} icon={icon}><Popup><strong>{beach.name}</strong><br/>Beach location</Popup></Marker>
      {facilities.slice(0, 7).map((f) => <CircleMarker key={f._id} center={[f.coordinates.lat, f.coordinates.lng]} radius={7}><Popup><strong>{f.name}</strong><br/>{f.type}<br/>{f.distanceMeters} m away</Popup></CircleMarker>)}
    </MapContainer>
  </div>;
}
