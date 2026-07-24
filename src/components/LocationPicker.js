"use client";
import { useEffect, useRef } from "react";

export default function LocationPicker({ value, onChange, center }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    let cancelled = false;

    import("leaflet").then((L) => {
      if (cancelled || !mapRef.current || mapInstance.current) return;

      // Leaflet's default marker icon paths break under most bundlers —
      // point them at the CDN copies instead.
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const start =
        value?.lat != null && value?.lng != null ? [value.lat, value.lng] : [center.lat, center.lng];

      const map = L.map(mapRef.current).setView(start, 14);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      const marker = L.marker(start, { draggable: true }).addTo(map);
      marker.on("dragend", () => {
        const { lat, lng } = marker.getLatLng();
        onChange({ lat, lng });
      });
      map.on("click", (e) => {
        marker.setLatLng(e.latlng);
        onChange({ lat: e.latlng.lat, lng: e.latlng.lng });
      });

      mapInstance.current = map;

      if (value?.lat == null) {
        onChange({ lat: start[0], lng: start[1] });
      }
    });

    return () => {
      cancelled = true;
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div ref={mapRef} className="h-72 w-full rounded-xl border border-sage overflow-hidden" />
      <p className="font-body text-xs text-ink/60 mt-2">
        Drag the pin or tap the map to set exactly where we should bring the equipment.
      </p>
    </div>
  );
}
