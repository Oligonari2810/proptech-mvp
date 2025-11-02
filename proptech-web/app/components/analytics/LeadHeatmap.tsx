"use client";
import { useEffect, useState, Suspense } from "react";
import Map, { Source, Layer } from "react-map-gl";

interface Lead {
  id: number;
  location: { lat: number; lng: number };
  conversion_score: number;
  name: string;
}

interface LeadHeatmapProps {
  leads?: Lead[];
}

function LeadHeatmapContent({ leads }: LeadHeatmapProps) {
  const [geoJsonData, setGeoJsonData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);

  useEffect(() => {
    const buildFromLeads = (arr: Lead[]) => ({
      type: 'FeatureCollection',
      features: arr.map((lead) => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [lead.location.lng, lead.location.lat] },
        properties: { weight: lead.conversion_score || 1 },
      })),
    });

    const buildFromZones = (zones: any[]) => ({
      type: 'FeatureCollection',
      features: zones.map((z) => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [z.lng, z.lat] },
        properties: { weight: z.leadCount || 1 },
      })),
    });

    const load = async () => {
      try {
        if (Array.isArray(leads) && leads.length > 0) {
          setGeoJsonData(buildFromLeads(leads));
          setError(null);
          return;
        }
        const base = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
        const res = await fetch(`${base}/api/analytics/lead-heatmap`, { cache: 'no-store' });
        const data = await res.json();
        const zones = data.zones || [];
        setGeoJsonData(buildFromZones(zones));
        setError(null);
      } catch (e) {
        setError('No se pudo cargar el mapa de calor');
        setGeoJsonData(null);
      }
    };

    load();
  }, [leads]);

  const heatmapLayer: any = {
    id: "heatmap-layer",
    type: "heatmap" as const,
    source: "leads-data",
    maxzoom: 15,
    paint: {
      "heatmap-weight": ["interpolate", ["linear"], ["get", "weight"], 0, 0, 1, 1],
      "heatmap-intensity": ["interpolate", ["linear"], ["zoom"], 0, 1, 15, 3],
      "heatmap-color": [
        "interpolate",
        ["linear"],
        ["heatmap-density"],
        0,
        "rgba(0, 0, 255, 0)",
        0.2,
        "rgb(0, 0, 255)",
        0.4,
        "rgb(0, 255, 0)",
        0.6,
        "rgb(255, 255, 0)",
        0.8,
        "rgb(255, 165, 0)",
        1,
        "rgb(255, 0, 0)",
      ],
      "heatmap-radius": ["interpolate", ["linear"], ["zoom"], 0, 2, 15, 25],
      "heatmap-opacity": 0.7,
    },
  };

  const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

  return (
    <div className="h-96 w-full rounded-lg overflow-hidden">
      {!MAPBOX_TOKEN && (
        <div className="flex items-center justify-center h-full text-sm text-yellow-800 bg-yellow-50 border border-yellow-200">
          Configura NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN para ver el mapa.
        </div>
      )}
      {error && (
        <div className="absolute z-10 m-2 text-xs text-yellow-800 bg-yellow-50 border border-yellow-200 rounded px-2 py-1">{error}</div>
      )}
      {MAPBOX_TOKEN && typeof window !== 'undefined' && !mapError && (
      <Map
        initialViewState={{ longitude: -3.70379, latitude: 40.41678, zoom: 10 }}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
        onError={() => setMapError('No se pudo inicializar Mapbox (token o permisos).')}
      >
        {geoJsonData && (
          <Source id="leads-data" type="geojson" data={geoJsonData}>
            <Layer {...heatmapLayer} />
          </Source>
        )}
      </Map>
      )}
      {mapError && (
        <div className="flex items-center justify-center h-full text-sm text-yellow-800 bg-yellow-50 border border-yellow-200 p-3">
          {mapError}. Asegura que el token es válido para localhost y que la red permite api.mapbox.com/tiles.
        </div>
      )}
    </div>
  );
}

export default function LeadHeatmap({ leads }: LeadHeatmapProps) {
  return (
    <Suspense fallback={<div className="h-96 flex items-center justify-center">Cargando mapa...</div>}>
      <LeadHeatmapContent leads={leads} />
    </Suspense>
  );
}


