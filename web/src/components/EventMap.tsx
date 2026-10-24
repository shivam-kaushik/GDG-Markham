import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AREAS } from '../lib/scoring';
import type { EventItem } from '../types';

interface Props {
  events: EventItem[];
  homeArea: string;
  label: string;
}

/** Minimal map: OpenStreetMap tiles, small pins, home marker. A list with the same events sits beside it. */
export function EventMap({ events, homeArea, label }: Props) {
  const el = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!el.current) return;
    const home = AREAS[homeArea] ?? AREAS.L3R;
    const map = L.map(el.current, { scrollWheelZoom: false }).setView([home.lat, home.lng], 12);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    L.circleMarker([home.lat, home.lng], { radius: 8, color: '#0b57d0', fillColor: '#0b57d0', fillOpacity: 0.9 })
      .bindTooltip(home.label)
      .addTo(map);

    for (const e of events) {
      L.circleMarker([e.lat, e.lng], { radius: 9, color: '#1f5a3c', fillColor: '#1f5a3c', fillOpacity: 0.85 })
        .bindTooltip(e.title)
        .on('click', () => navigate(`/event/${e.id}`))
        .addTo(map);
    }
    return () => {
      map.remove();
    };
  }, [events, homeArea, navigate]);

  return <div ref={el} className="map" role="img" aria-label={label} />;
}
