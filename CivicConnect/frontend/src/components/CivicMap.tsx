import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import type { Complaint } from '../types';

// Default custom marker icon
const createMarkerIcon = (priority: string = 'medium') => {
  let color = '#2563eb'; // blue
  if (priority === 'critical') color = '#dc2626'; // red
  else if (priority === 'high') color = '#f59e0b'; // amber
  else if (priority === 'low') color = '#10b981'; // emerald

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="32" height="32" stroke="#ffffff" stroke-width="1.5">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z"/>
  </svg>`;

  return L.divIcon({
    html: svg,
    className: 'custom-map-pin',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
};

interface CivicMapProps {
  complaints?: Complaint[];
  selectedLocation?: { lat: number; lng: number };
  onLocationSelect?: (lat: number, lng: number) => void;
  interactiveSelect?: boolean;
  center?: [number, number];
  zoom?: number;
  height?: string;
  onComplaintSelect?: (complaint: Complaint) => void;
}

// Subcomponent to handle clicks on the map for location picking
const LocationPickerHandler: React.FC<{
  onSelect: (lat: number, lng: number) => void;
}> = ({ onSelect }) => {
  useMapEvents({
    click(e) {
      onSelect(e.latlng.lat, e.latlng.lng);
    }
  });
  return null;
};

export const CivicMap: React.FC<CivicMapProps> = ({
  complaints = [],
  selectedLocation,
  onLocationSelect,
  interactiveSelect = false,
  center = [12.9716, 77.5946], // Bengaluru center
  zoom = 12,
  height = '500px',
  onComplaintSelect
}) => {
  const markerRef = useRef<any>(null);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-slate-200 shadow-inner" style={{ height }}>
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

        {/* Location Picker Interactive Mode */}
        {interactiveSelect && onLocationSelect && (
          <LocationPickerHandler onSelect={onLocationSelect} />
        )}

        {/* Draggable location marker for submission */}
        {selectedLocation && (
          <Marker
            position={[selectedLocation.lat, selectedLocation.lng]}
            icon={createMarkerIcon('critical')}
            draggable={interactiveSelect}
            eventHandlers={{
              dragend: (e) => {
                if (onLocationSelect) {
                  const latlng = e.target.getLatLng();
                  onLocationSelect(latlng.lat, latlng.lng);
                }
              }
            }}
          >
            <Popup>
              <div className="text-xs p-1 font-sans">
                <p className="font-bold text-slate-900">Selected Incident Spot</p>
                <p className="text-slate-600">
                  {selectedLocation.lat.toFixed(5)}, {selectedLocation.lng.toFixed(5)}
                </p>
                {interactiveSelect && (
                  <p className="text-[10px] text-primary-600 mt-1">Drag marker to adjust location.</p>
                )}
              </div>
            </Popup>
          </Marker>
        )}

        {/* Multiple complaints list view */}
        {complaints.map((item) => {
          if (!item.latitude || !item.longitude) return null;
          return (
            <Marker
              key={item.id}
              position={[Number(item.latitude), Number(item.longitude)]}
              icon={createMarkerIcon(item.priority)}
            >
              <Popup>
                <div className="p-1 max-w-[220px] font-sans">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 uppercase">
                      {item.complaint_number}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                        item.status === 'resolved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.priority === 'critical'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 line-clamp-2 mb-1">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-slate-600 line-clamp-2 mb-2">
                    {item.location_address}
                  </p>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                    <span className="text-[10px] font-medium text-slate-500">
                      👍 {item.upvotes_count || 0} Upvotes
                    </span>
                    <a
                      href={`/complaints/${item.id}`}
                      className="text-[11px] text-primary-600 font-semibold hover:underline"
                    >
                      View Details →
                    </a>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};
