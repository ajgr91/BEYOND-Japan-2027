"use client";
import { useEffect, useRef, useState } from "react";
import type { Stop } from "@/data/itinerary";

export default function Map({ stops }: { stops: Stop[] }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState<Stop>(stops[0]);
  useEffect(() => {
    let map: any;
    let mounted = true;
    (async () => {
      const L = await import("leaflet");
      if (!mounted || !mapRef.current || (mapRef.current as any)._leaflet_id) return;
      map = L.map(mapRef.current, { scrollWheelZoom: false }).setView([39.5, 138.4], 5);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(map);
      const route = stops.filter(s => !s.id.endsWith("-end")).map(s => [s.lat, s.lng] as [number,number]);
      L.polyline(route, { color: "#b74736", weight: 3, opacity: .8, dashArray: "7 8" }).addTo(map);
      stops.forEach((stop, i) => {
        const marker = L.circleMarker([stop.lat, stop.lng], {
          radius: stop.kind === "Base" ? 8 : 6,
          color: "#fffaf1", weight: 2, fillColor: stop.kind === "Base" ? "#b74736" : "#343b35", fillOpacity: 1
        }).addTo(map);
        marker.bindTooltip(stop.name, { direction: "top", offset: [0,-7] });
        marker.on("click", () => setActive(stop));
      });
      setReady(true);
      setTimeout(() => map.invalidateSize(), 150);
    })();
    return () => { mounted = false; if (map) map.remove(); };
  }, [stops]);
  return <div className="map-layout">
    <div className="map-frame"><div ref={mapRef} className="leaflet-map" />{!ready && <div className="map-loading">Preparando el mapa…</div>}</div>
    <aside className="map-info">
      <span className="eyebrow">PUNTO SELECCIONADO</span>
      <p className="map-region">{active.region} · {active.kind}</p>
      <h3>{active.name}</h3>
      <p>{active.note}</p>
      <div className="map-legend"><span><i className="legend-dot red" /> Bases</span><span><i className="legend-dot" /> Excursiones y paradas</span></div>
      <p className="map-hint">Selecciona cualquier punto del mapa para descubrirlo.</p>
    </aside>
  </div>;
}
