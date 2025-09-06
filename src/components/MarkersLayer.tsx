'use client';

import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

export interface MapMarker {
  position: [number, number];
  popupText: string;
  icon?: L.Icon;
}

export default function MarkersLayer({ markers }: { markers: MapMarker[] }) {
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
