'use client';

import { Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect } from 'react';

export interface MapMarker {
  position: [number, number];
  popupText: string;
  icon?: L.Icon;
}

export default function MarkersLayer({ markers }: { markers: MapMarker[] }) {
  const map = useMap();

  // When markers change, this component re-renders, but the whole map doesn't.
  // We can add logic here to efficiently update markers if needed.
  useEffect(() => {
    if (markers.length > 0) {
      const bounds = L.latLngBounds(markers.map(m => m.position));
      if (bounds.isValid()) {
         map.fitBounds(bounds, { padding: [50, 50] });
      }
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
}
