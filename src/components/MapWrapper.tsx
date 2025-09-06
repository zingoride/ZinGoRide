'use client';

import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { ReactNode, useMemo } from 'react';

interface MapWrapperProps {
  center: [number, number];
  zoom: number;
  children?: ReactNode;
  className?: string;
}

export default function MapWrapper({ center, zoom, children, className }: MapWrapperProps) {
  
  // By wrapping the MapContainer in a component that does not re-render unnecessarily,
  // we prevent the map from being re-initialized.
  const displayMap = useMemo(
    () => (
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {children}
      </MapContainer>
    ),
    // The dependency array is intentionally left empty to ensure the map initializes only once.
    // Center and zoom props are passed to the container but won't cause re-initialization.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <div className={className} style={{ height: '100%', width: '100%' }}>
      {displayMap}
    </div>
  );
}
