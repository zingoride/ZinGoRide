'use client';

import L from 'leaflet';
import MapWrapper from './MapWrapper';
import MarkersLayer from './MarkersLayer';

// Fix default icons, which is a common issue with Leaflet and bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});


export interface MapMarker {
  position: [number, number];
  popupText: string;
  icon?: L.Icon;
}

interface DynamicMapProps {
  markers?: MapMarker[];
  center?: [number, number];
  zoom?: number;
  className?: string;
}

const DynamicMap = ({ 
  markers = [], 
  center = [24.8607, 67.0011], 
  zoom = 12, 
  className 
}: DynamicMapProps) => {
  
  return (
    <MapWrapper center={center} zoom={zoom} className={className}>
      <MarkersLayer markers={markers} />
    </MapWrapper>
  );
};

export default DynamicMap;
