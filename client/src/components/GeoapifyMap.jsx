import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';

export function GeoapifyMap({ latitude, longitude, zoom = 15, height = '100px' }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const apiKey = '25c3691574244d2383d6c47cc479ff5a';

  useEffect(() => {
    if (!apiKey) {
      console.error("Geoapify API key is not configured in .env file.");
      return;
    }

    // The map style URL including the API key
    const mapStyle = `https://maps.geoapify.com/v1/styles/positron/style.json?apiKey=${apiKey}`;

    // Initialize the map only once
    if (!map.current && mapContainer.current) {
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: mapStyle,
        center: [longitude, latitude], // Note: MapLibre uses [lng, lat]
        zoom: zoom,
      });

      // Add a marker to the map
      new maplibregl.Marker()
        .setLngLat([longitude, latitude])
        .addTo(map.current);
    }

    // Cleanup function to remove the map instance when the component unmounts
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [latitude, longitude, zoom, apiKey]);

  return (
    <div
      ref={mapContainer}
      style={{ width: '100%', height }}
      className="rounded-lg overflow-hidden border"
      data-testid="geoapify-map-container"
    />
  );
}