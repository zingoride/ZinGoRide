'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  // Initialize map
  useEffect(() => {
    if (mapInstanceRef.current || !mapContainerRef.current) return;

    mapInstanceRef.current = L.map(mapContainerRef.current).setView(center, zoom);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(mapInstanceRef.current);
    
    // Cleanup on unmount
    return () => {
      mapInstanceRef.current?.remove();
      mapInstanceRef.current = null;
    };
  }, [center, zoom]);


  // Update markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing markers from the map and the ref array
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add new markers
    markers.forEach(markerInfo => {
      const marker = L.marker(markerInfo.position, { icon: markerInfo.icon || new L.Icon.Default() })
        .addTo(map)
        .bindPopup(markerInfo.popupText);
      markersRef.current.push(marker);
    });

    // Auto-fit bounds if there are markers
    if (markers.length > 0) {
      const bounds = L.latLngBounds(markers.map(m => m.position));
      if (bounds.isValid()) {
         map.fitBounds(bounds, { padding: [50, 50] });
      }
    }

  }, [markers]);

  return (
    <div
      ref={mapContainerRef}
      className={className}
      style={{ height: '100%', width: '100%' }}
    />
  );
};

export default DynamicMap;
