import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { ItineraryStop } from '../types';

interface KarachiMapProps {
  stops: ItineraryStop[];
  onSelectStop?: (stop: ItineraryStop) => void;
  className?: string;
}

export const KarachiMap: React.FC<KarachiMapProps> = ({
  stops,
  onSelectStop,
  className = 'h-64 w-full rounded-2xl overflow-hidden',
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Default to central Karachi coordinates
      const map = L.map(mapContainerRef.current, {
        center: [24.84, 67.03],
        zoom: 12,
        zoomControl: false,
        attributionControl: false,
      });

      // OpenStreetMap tiles (free, reliable)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
      }).addTo(map);

      // Add compact zoom control in top right
      L.control.zoom({ position: 'topright' }).addTo(map);

      mapInstanceRef.current = map;
      layerGroupRef.current = L.layerGroup().addTo(map);
    }

    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    if (!map || !layerGroup) return;

    // Clear previous markers & routes
    layerGroup.clearLayers();

    if (stops.length === 0) return;

    const latLngs: L.LatLngExpression[] = [];

    stops.forEach((stop, index) => {
      const { lat, lng, name, area } = stop.place;
      latLngs.push([lat, lng]);

      // Custom HTML Marker Icon
      const customIcon = L.divIcon({
        className: 'custom-map-marker',
        html: `
          <div style="
            background: #0D9488;
            color: #ffffff;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            border: 2px solid #ffffff;
            box-shadow: 0 4px 10px rgba(0,0,0,0.25);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 11px;
            font-weight: 700;
            cursor: pointer;
            transform: translate(-14px, -14px);
          ">
            ${index + 1}
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const marker = L.marker([lat, lng], { icon: customIcon }).addTo(layerGroup);

      marker.bindPopup(`
        <div style="font-family: inherit; padding: 4px;">
          <div style="font-size: 10px; font-weight: 700; color: #0D9488; text-transform: uppercase;">Stop ${index + 1} · ${area}</div>
          <div style="font-size: 13px; font-weight: 700; color: #0f172a; margin-top: 2px;">${name}</div>
          <div style="font-size: 11px; color: #64748b; margin-top: 4px;">Arrive: <b>${stop.arrival_time}</b> · Cost: Rs. ${stop.cost}</div>
        </div>
      `);

      if (onSelectStop) {
        marker.on('click', () => onSelectStop(stop));
      }
    });

    // Draw route connecting all stops
    if (latLngs.length > 1) {
      const polyline = L.polyline(latLngs, {
        color: '#F97316',
        weight: 3.5,
        opacity: 0.85,
        dashArray: '6, 8',
      }).addTo(layerGroup);

      map.fitBounds(polyline.getBounds(), { padding: [35, 35] });
    } else if (latLngs.length === 1) {
      map.setView(latLngs[0], 13);
    }
  }, [stops, onSelectStop]);

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className={`relative ${className} border border-slate-200 shadow-inner`}>
      <div ref={mapContainerRef} className="w-full h-full" />
      <div className="absolute bottom-2 left-2 z-[400] bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-semibold text-slate-700 shadow-sm flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-[#0D9488] animate-pulse" />
        Karachi Transit Routing
      </div>
    </div>
  );
};
