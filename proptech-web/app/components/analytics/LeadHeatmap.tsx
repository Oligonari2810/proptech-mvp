"use client";
import { useEffect, useState } from "react";
import Map, { Source, Layer } from "react-map-gl";

interface Lead {
  id: number;
  location: { lat: number; lng: number };
  conversion_score: number;
  name: string;
}

interface LeadHeatmapProps {
  leads: Lead[];
}

export default function LeadHeatmap({ leads }: LeadHeatmapProps) {
  const [geoJsonData, setGeoJsonData] = useState<any>(null);

  useEffect(() => {
    const geoJson = {
      type: "FeatureCollection",
      features: leads.map((lead) => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [lead.location.lng, lead.location.lat],
        },
        properties: {
          weight: lead.conversion_score || 1,
        },
      })),
    } as const;
    setGeoJsonData(geoJson);
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
      <Map
        initialViewState={{ longitude: -3.70379, latitude: 40.41678, zoom: 10 }}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
      >
        {geoJsonData && (
          <Source id="leads-data" type="geojson" data={geoJsonData}>
            <Layer {...heatmapLayer} />
          </Source>
        )}
      </Map>
    </div>
  );
}


