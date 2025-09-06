'use client';

import { Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { MapMarker } from './dynamic-map';
import { useEffect } from 'react';

// This component is responsible only for rendering the markers.
// It uses the `useMap` hook to get the parent map instance.
// This prevents the entire map from re-rendering when markers change.
const MarkersLayer = ({ markers }: { markers: MapMarker[] }) => {
  const map = useMap();
  
  // When markers change, we might want to fit the map bounds to them.
  useEffect(() => {
    if (markers.length > 0) {
      const bounds = L.latLngBounds(markers.map(m => m.position));
      // map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [markers, map]);

  return (
    <>
      {markers.map((marker, idx) => (
        <Marker key={idx} position={marker.position} icon={marker.icon || new L.Icon.Default()}>
          <Popup>{marker.popupText}</Popup>
        </Marker>
      ))}
    </>
  );
};

export default MarkersLayer;
