import { useEffect, useRef } from 'react';

// Removed interface definition
// interface MapplsMapProps {
//   latitude: number;
//   longitude: number;
//   zoom?: number;
//   height?: string;
// }

export function MapplsMap({ latitude, longitude, zoom = 15, height = '400px' }) {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const loadMapplsScript = () => {
      if (!window.mappls) {
        const script = document.createElement('script');
        script.src = `https://apis.mappls.com/advancedmaps/api/${import.meta.env.VITE_MAPPLS_API_KEY || 'demo'}/map_sdk?layer=vector&v=3.0`;
        script.async = true;
        script.onload = initializeMap;
        document.body.appendChild(script);
      } else {
        initializeMap();
      }
    };

    const initializeMap = () => {
      if (mapRef.current && window.mappls) {
        const map = new window.mappls.Map(mapRef.current, {
          center: [latitude, longitude],
          zoom: zoom,
          zoomControl: true,
          location: true,
        });

        new window.mappls.Marker({
          map: map,
          position: [latitude, longitude],
        });
      }
    };

    loadMapplsScript();
  }, [latitude, longitude, zoom]);

  return (
    <div
      ref={mapRef}
      style={{ width: '100%', height }}
      className="rounded-lg overflow-hidden border"
    />
  );
}
