'use client';

import MapWrapper from './MapWrapper';
import L from 'leaflet';
import MarkersLayer from './markers-layer';

export interface MapMarker {
  position: [number, number];
  popupText: string;
  icon?: L.Icon;
}

export const carIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

export const customerIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
    iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});


interface DynamicMapProps {
  markers?: MapMarker[];
  center?: [number, number];
  zoom?: number;
  className?: string;
}

const DynamicMap = ({ markers = [], center = [24.8607, 67.0011], zoom = 12, className }: DynamicMapProps) => {
  return (
    <MapWrapper center={center} zoom={zoom} className={className}>
      <MarkersLayer markers={markers} />
    </MapWrapper>
  );
};

export default DynamicMap;
