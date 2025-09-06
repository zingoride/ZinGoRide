'use client';

import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import type { MapMarker } from './dynamic-map';

const MarkersLayer = ({ markers }: { markers: MapMarker[] }) => {
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
