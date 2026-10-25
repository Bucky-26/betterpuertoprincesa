import { useEffect, useRef } from 'react';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Marker } from 'maplibre-gl';
import { createMap } from '../../lib/mapStyle';

// A single landmark on the street map, marked with a balayong-pink pin.
export default function LandmarkMap({
  center,
  label,
  zoom = 16,
}: {
  center: [number, number];
  label: string;
  zoom?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const map = createMap({ container: containerRef.current, center, zoom });

    const pin = document.createElement('div');
    pin.setAttribute('role', 'img');
    pin.setAttribute('aria-label', label);
    pin.className =
      'h-5 w-5 rounded-full border-[3px] border-white bg-balayong-500 shadow-[0_0_0_6px_rgb(217_75_127/0.25)]';
    new Marker({ element: pin }).setLngLat(center).addTo(map);

    return () => map.remove();
  }, [center, label, zoom]);

  return (
    <div className="relative z-0">
      <div
        ref={containerRef}
        className="h-80 w-full overflow-hidden rounded-xl lg:h-96"
      />
    </div>
  );
}
