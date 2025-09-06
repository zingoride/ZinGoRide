'use client';

import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { ReactNode } from 'react';

interface MapWrapperProps {
  center?: [number, number];
  zoom?: number;
  className?: string;
  children?: ReactNode;
}

export default function MapWrapper({ 
  center = [24.8607, 67.0011], 
  zoom = 12, 
  className, 
  children 
}: MapWrapperProps) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom={true}
      className={className}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {children}
    </MapContainer>
  );
}
