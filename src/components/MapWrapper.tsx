'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';
import L, { Map } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer } from 'react-leaflet';

// Fix default icons, which is a common issue with Leaflet and bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});


interface MapWrapperProps {
  center: [number, number];
  zoom: number;
  children?: React.ReactNode;
  className?: string;
}

export default function MapWrapper({ center, zoom, children, className }: MapWrapperProps) {
  // By wrapping MapContainer in this component that takes children,
  // we ensure the map itself is not re-rendered when only the children (e.g., markers) change.
  // This is a standard pattern to avoid the "Map container already initialized" error in React.
  return (
    <div className={className} style={{ height: '100%', width: '100%' }}>
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
        // A unique key can force a re-render, but we want to avoid that.
        // The structural sharing of the component is the key here.
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {children}
      </MapContainer>
    </div>
  );
}
