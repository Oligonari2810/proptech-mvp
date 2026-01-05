"use client";
import { useState, useEffect, useRef } from "react";
import { getMapboxToken, isValidMapboxToken } from "../lib/mapboxConfig";
import SavedSearchesMenu from "../components/search/SavedSearchesMenu";
import { SaveSearchButton } from "../components/SaveSearchButton";

interface Property {
  id: string | number;
  title: string;
  price: number;
  location: string;
  bedrooms: number;
  area?: number;
  square_meters?: number;
  latitude?: number;
  longitude?: number;
  // Soporte legacy/variantes
  lat?: number;
  lng?: number;
}

export default function MapPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [propertiesSource, setPropertiesSource] = useState<"geo" | "all">("all");
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});

  type MapboxModule = typeof import("mapbox-gl")["default"];
  type MapboxMap = InstanceType<MapboxModule["Map"]>;

  const mapRef = useRef<MapboxMap | null>(null);
  const mapboxRef = useRef<MapboxModule | null>(null);
  const inflightRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<number | null>(null);
  const propertiesRef = useRef<Property[]>([]);

  const SOURCE_ID = "properties-src";
  const SOURCE_HEAT_ID = "properties-heat-src";
  const LAYER_CLUSTERS = "properties-clusters";
  const LAYER_CLUSTER_COUNT = "properties-cluster-count";
  const LAYER_UNCLUSTERED = "properties-unclustered";
  const LAYER_HEATMAP = "properties-heatmap";

  const getCoords = (property: Property): { lat: number; lng: number } | null => {
    const lat = property.latitude ?? property.lat;
    const lng = property.longitude ?? property.lng;
    if (typeof lat !== "number" || typeof lng !== "number") return null;
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
    return { lat, lng };
  };

  const toFeatureCollection = (list: Property[]) => {
    return {
      type: "FeatureCollection",
      features: list
        .map((p) => {
          const coords = getCoords(p);
          if (!coords) return null;
          return {
            type: "Feature",
            geometry: { type: "Point", coordinates: [coords.lng, coords.lat] },
            properties: {
              id: String(p.id),
              title: p.title ?? "",
              location: p.location ?? "",
              price: p.price ?? null,
            },
          };
        })
        .filter(Boolean),
    } as any;
  };

  const loadAllProperties = async (signal?: AbortSignal) => {
    const res = await fetch(`/api/properties-proxy`, { cache: "no-store", signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const list = Array.isArray(data) ? data : data.properties || [];
    setPropertiesSource("all");
    setProperties(list);
  };

  const loadPropertiesWithinViewport = async (map: MapboxMap, signal?: AbortSignal) => {
    // bbox: minLng,minLat,maxLng,maxLat
    const b = map.getBounds();
    if (!b) throw new Error("NO_BOUNDS");
    const west = Number(b.getWest().toFixed(6));
    const south = Number(b.getSouth().toFixed(6));
    const east = Number(b.getEast().toFixed(6));
    const north = Number(b.getNorth().toFixed(6));
    const bbox = `${west},${south},${east},${north}`;

    // Ajustar límite por zoom (menos puntos cuando estás lejos)
    const zoom = typeof map.getZoom === "function" ? map.getZoom() : 10;
    const limit = zoom < 9 ? 250 : zoom < 12 ? 750 : 1500;

    // Pasar filtros desde la URL (/map?operation=compra&min_price=...)
    const qs = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
    // Allowlist para evitar filtrar por cualquier cosa
    const allow = new Set(["operation", "property_type", "type", "min_price", "max_price", "bedrooms", "bathrooms"]);
    const extra = new URLSearchParams();
    for (const [k, v] of qs.entries()) {
      if (allow.has(k) && v) extra.set(k, v);
    }
    // Persistir para mostrar en UI
    setActiveFilters(Object.fromEntries(extra.entries()));

    const url = `/api/backend/api/geo/within?bbox=${encodeURIComponent(bbox)}&limit=${limit}&${extra.toString()}`;

    const res = await fetch(url, {
      cache: "no-store",
      signal,
      headers: { Accept: "application/json" },
    });

    // Si GEO no está activo (404) o falla, hacemos fallback al endpoint clásico
    if (!res.ok) {
      throw new Error(`GEO_HTTP_${res.status}`);
    }

    const data = await res.json();
    const list = Array.isArray(data) ? data : data.properties || [];
    setPropertiesSource("geo");
    setProperties(list);
  };

  useEffect(() => {
    // Precarga mínima (si GEO todavía no está listo o el mapa tarda)
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    loadAllProperties(controller.signal).catch((err) => {
      console.error("Error loading properties:", err);
      // Fallback de demostración para no bloquear la vista
      setPropertiesSource("all");
      setProperties([
        {
          id: "demo-1",
          title: "Propiedad Demo",
          price: 250000,
          location: "Santo Domingo",
          latitude: 18.4861,
          longitude: -69.9312,
          bedrooms: 2,
        },
      ]);
    }).finally(() => clearTimeout(timeout));
    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    // Inicializar Mapbox una sola vez
    const init = async () => {
      try {
        const token = getMapboxToken();
        if (!isValidMapboxToken(token)) {
          setMapError("Token de Mapbox no configurado o inválido. Define NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN.");
          return;
        }

        const mapboxgl = (await import("mapbox-gl")).default as unknown as MapboxModule;
        mapboxRef.current = mapboxgl;
        mapboxgl.accessToken = token;

        const container = document.getElementById("map-container");
        if (!container) {
          setMapError("No se encontró el contenedor del mapa.");
          return;
        }

        // Soportar links compartibles: /map?center=lng,lat&zoom=12
        let initialCenter: [number, number] = [-69.9312, 18.4861];
        let initialZoom = 10;
        try {
          const qs = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
          const center = (qs.get("center") || "").trim();
          const zoomRaw = (qs.get("zoom") || "").trim();
          if (center) {
            const parts = center.split(",").map((x) => Number(x.trim()));
            if (parts.length === 2 && Number.isFinite(parts[0]) && Number.isFinite(parts[1])) {
              initialCenter = [parts[0], parts[1]];
            }
          }
          if (zoomRaw) {
            const z = Number(zoomRaw);
            if (Number.isFinite(z)) initialZoom = Math.max(2, Math.min(18, z));
          }
        } catch {
          // noop
        }

        const map = new mapboxgl.Map({
          container,
          style: "mapbox://styles/mapbox/streets-v12",
          center: initialCenter,
          zoom: initialZoom,
        });

        mapRef.current = map;

        map.on("error", (e: unknown) => {
          console.error("❌ Error Mapbox en /map:", e);
          const maybeAny = e as { error?: { message?: string }; message?: string } | null;
          setMapError(maybeAny?.error?.message || maybeAny?.message || "Error cargando el mapa");
        });

        map.on("load", () => {
          setMapLoaded(true);
        });
      } catch (e: unknown) {
        console.error("❌ Error inicializando Mapbox:", e);
        setMapError(e instanceof Error ? e.message : "Error inicializando Mapbox");
      }
    };

    init();

    return () => {
      // Cleanup
      try {
        mapRef.current?.remove();
        mapRef.current = null;
      } catch {
        // noop
      }
    };
  }, []);

  useEffect(() => {
    // Cargar por viewport (bbox) cuando el mapa ya está listo
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    const schedule = () => {
      // Debounce de movimientos/zoom
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
      debounceRef.current = window.setTimeout(async () => {
        // Cancelar request anterior
        if (inflightRef.current) inflightRef.current.abort();
        const controller = new AbortController();
        inflightRef.current = controller;

        // Guardar center/zoom en URL (shareable) al finalizar movimiento
        try {
          const c = map.getCenter();
          setCenterZoomInUrl(c.lng, c.lat, map.getZoom());
        } catch {
          // noop
        }

        try {
          await loadPropertiesWithinViewport(map, controller.signal);
        } catch (err) {
          // Solo fallback si realmente falla el GEO
          console.warn("Fallo GEO dentro de viewport, usando fallback:", err);
          try {
            await loadAllProperties(controller.signal);
          } catch (e2) {
            console.error("Fallback loadAllProperties también falló:", e2);
          }
        }
      }, 350);
    };

    // Inicial
    schedule();

    // Actualizar al mover/zoom
    map.on("moveend", schedule);
    map.on("zoomend", schedule);

    return () => {
      try {
        map.off("moveend", schedule);
        map.off("zoomend", schedule);
      } catch {
        // noop
      }
      if (inflightRef.current) inflightRef.current.abort();
      inflightRef.current = null;
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
      debounceRef.current = null;
    };
  }, [mapLoaded]);

  useEffect(() => {
    // Permitir "Cerca de mí" sin recargar: escuchar evento y centrar el mapa
    const handler = (ev: Event) => {
      const e = ev as CustomEvent<{ lng: number; lat: number; zoom?: number }>;
      const map = mapRef.current;
      if (!map || !e.detail) return;
      const { lng, lat, zoom } = e.detail;
      try {
        map.easeTo({ center: [lng, lat], zoom: zoom ?? map.getZoom() });
        setCenterZoomInUrl(lng, lat, zoom ?? map.getZoom());
      } catch {
        // noop
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("habitatpro:map-center", handler as EventListener);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("habitatpro:map-center", handler as EventListener);
      }
    };
  }, []);

  useEffect(() => {
    propertiesRef.current = properties;
  }, [properties]);

  // Selección ↔ URL (?selected=)
  useEffect(() => {
    try {
      const qs = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
      const selected = (qs.get("selected") || "").trim();
      if (!selected) return;
      const found = properties.find((p) => String(p.id) === selected);
      if (found) setSelectedProperty(found);
    } catch {
      // noop
    }
  }, [properties]);

  const setSelectedInUrl = (id: string | null) => {
    if (typeof window === "undefined") return;
    try {
      const url = new URL(window.location.href);
      if (id) url.searchParams.set("selected", id);
      else url.searchParams.delete("selected");
      window.history.replaceState({}, "", url.toString());
    } catch {
      // noop
    }
  };

  const setCenterZoomInUrl = (lng: number, lat: number, zoom: number) => {
    if (typeof window === "undefined") return;
    try {
      const url = new URL(window.location.href);
      url.searchParams.set("center", `${lng.toFixed(6)},${lat.toFixed(6)}`);
      url.searchParams.set("zoom", String(Math.round(zoom * 10) / 10));
      window.history.replaceState({}, "", url.toString());
    } catch {
      // noop
    }
  };

  useEffect(() => {
    // Configurar clustering/layers una sola vez cuando el mapa está listo
    const map = mapRef.current;
    const mapboxgl = mapboxRef.current;
    if (!map || !mapboxgl || !mapLoaded) return;

    if (!map.getSource(SOURCE_ID)) {
      map.addSource(SOURCE_ID, {
        type: "geojson",
        data: toFeatureCollection([]),
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50,
      } as any);

      // Fuente sin clustering para heatmap (mismo dataset)
      map.addSource(SOURCE_HEAT_ID, {
        type: "geojson",
        data: toFeatureCollection([]),
      } as any);

      // Heatmap (se muestra solo en zoom bajo)
      map.addLayer({
        id: LAYER_HEATMAP,
        type: "heatmap",
        source: SOURCE_HEAT_ID,
        maxzoom: 10,
        paint: {
          "heatmap-weight": ["interpolate", ["linear"], ["coalesce", ["get", "price"], 0], 0, 0, 1000000, 1],
          "heatmap-intensity": ["interpolate", ["linear"], ["zoom"], 0, 0.8, 10, 1.8],
          "heatmap-color": [
            "interpolate",
            ["linear"],
            ["heatmap-density"],
            0,
            "rgba(0,0,0,0)",
            0.2,
            "rgba(14,165,233,0.35)",
            0.4,
            "rgba(37,99,235,0.55)",
            0.6,
            "rgba(124,58,237,0.65)",
            0.8,
            "rgba(239,68,68,0.75)",
            1,
            "rgba(239,68,68,0.95)",
          ],
          "heatmap-radius": ["interpolate", ["linear"], ["zoom"], 0, 18, 10, 40],
          "heatmap-opacity": ["interpolate", ["linear"], ["zoom"], 0, 0.9, 10, 0.0],
        },
      } as any);

      map.addLayer({
        id: LAYER_CLUSTERS,
        type: "circle",
        source: SOURCE_ID,
        filter: ["has", "point_count"],
        paint: {
          "circle-color": ["step", ["get", "point_count"], "#2563eb", 50, "#7c3aed", 200, "#ef4444"],
          "circle-radius": ["step", ["get", "point_count"], 16, 50, 22, 200, 28],
          "circle-opacity": 0.85,
        },
      } as any);

      map.addLayer({
        id: LAYER_CLUSTER_COUNT,
        type: "symbol",
        source: SOURCE_ID,
        filter: ["has", "point_count"],
        layout: {
          "text-field": "{point_count_abbreviated}",
          "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
          "text-size": 12,
        },
        paint: { "text-color": "#ffffff" },
      } as any);

      map.addLayer({
        id: LAYER_UNCLUSTERED,
        type: "circle",
        source: SOURCE_ID,
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-color": "#0ea5e9",
          "circle-radius": 8,
          "circle-stroke-width": 2,
          "circle-stroke-color": "#ffffff",
          "circle-opacity": 0.9,
        },
      } as any);

      const updateVisibility = () => {
        const z = map.getZoom();
        const showHeat = z < 9;
        // Heatmap
        try {
          map.setLayoutProperty(LAYER_HEATMAP, "visibility", showHeat ? "visible" : "none");
          map.setLayoutProperty(LAYER_CLUSTERS, "visibility", showHeat ? "none" : "visible");
          map.setLayoutProperty(LAYER_CLUSTER_COUNT, "visibility", showHeat ? "none" : "visible");
          map.setLayoutProperty(LAYER_UNCLUSTERED, "visibility", showHeat ? "none" : "visible");
        } catch {
          // noop
        }
      };

      updateVisibility();
      map.on("zoom", updateVisibility);

      map.on("click", LAYER_CLUSTERS, (e: unknown) => {
        const evt = e as { point?: { x: number; y: number }; features?: Array<{ properties?: any }> };
        const feature = evt.features?.[0];
        const clusterId = feature?.properties?.cluster_id;
        if (clusterId == null) return;

        const src = map.getSource(SOURCE_ID) as unknown as {
          getClusterExpansionZoom?: (clusterId: number, cb: (err?: any, zoom?: number) => void) => void;
        };
        if (!src?.getClusterExpansionZoom) return;

        src.getClusterExpansionZoom(Number(clusterId), (_err, zoom) => {
          if (evt.point) {
            const lngLat = map.unproject([evt.point.x, evt.point.y]);
            map.easeTo({ center: [lngLat.lng, lngLat.lat], zoom: zoom ?? map.getZoom() + 2 });
          }
        });
      });

      map.on("click", LAYER_UNCLUSTERED, (e: unknown) => {
        const evt = e as { features?: Array<{ properties?: any; geometry?: any }> };
        const feature = evt.features?.[0];
        const propId = feature?.properties?.id ? String(feature.properties.id) : null;
        if (!propId) return;

        const p = propertiesRef.current.find((x) => String(x.id) === propId);
        if (p) {
          setSelectedProperty(p);
          setSelectedInUrl(propId);
        }

        try {
          const coords = feature?.geometry?.coordinates;
          if (Array.isArray(coords) && coords.length === 2) {
            new mapboxgl.Popup()
              .setLngLat([coords[0], coords[1]])
              .setHTML(
                `<div class="p-2">
                  <h3 class="font-bold">${feature?.properties?.title ?? "Propiedad"}</h3>
                  <p class="text-sm text-gray-600">${feature?.properties?.location ?? ""}</p>
                  <p class="text-lg font-bold text-blue-600">€${(feature?.properties?.price ?? "N/A").toLocaleString?.() ?? feature?.properties?.price ?? "N/A"}</p>
                </div>`
              )
              .addTo(map);
          }
        } catch {
          // noop
        }
      });

      map.on("mouseenter", LAYER_CLUSTERS, () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", LAYER_CLUSTERS, () => {
        map.getCanvas().style.cursor = "";
      });
      map.on("mouseenter", LAYER_UNCLUSTERED, () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", LAYER_UNCLUSTERED, () => {
        map.getCanvas().style.cursor = "";
      });
    }

    return () => {
      // No removemos layers aquí: map.remove() en cleanup principal.
    };
  }, [mapLoaded]);

  useEffect(() => {
    // Actualizar data del source cuando cambian propiedades
    const map = mapRef.current;
    if (!map || !mapLoaded) return;
    const src = map.getSource(SOURCE_ID) as unknown as { setData?: (data: any) => void };
    if (!src?.setData) return;
    const fc = toFeatureCollection(properties);
    src.setData(fc);
    const heat = map.getSource(SOURCE_HEAT_ID) as unknown as { setData?: (data: any) => void };
    if (heat?.setData) heat.setData(fc);
  }, [properties, mapLoaded]);

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <h1 className="text-2xl font-bold text-ink-900">Mapa de Propiedades</h1>
        <p className="text-ink-600">Explora propiedades en el mapa interactivo con MapBox</p>
        <div className="mt-3 flex items-center gap-3">
          <SavedSearchesMenu />
          <SaveSearchButton
            href={
              typeof window !== "undefined"
                ? `/map${window.location.search || ""}`
                : "/map"
            }
            defaultName="Mapa"
          />
        </div>
        <div className="mt-2 text-sm text-gray-500">
          {properties.length} propiedades cargadas • {mapLoaded ? "Mapa cargado" : "Cargando mapa..."} •{" "}
          {propertiesSource === "geo" ? "Vista (bbox)" : "Listado completo"}
          {Object.keys(activeFilters).length > 0 ? (
            <>
              {" "}
              • Filtros:{" "}
              {Object.entries(activeFilters)
                .map(([k, v]) => `${k}=${v}`)
                .join(" · ")}
            </>
          ) : null}
        </div>
      </div>

      {/* Mapa y Panel */}
      <div className="flex-1 flex">
        {/* Mapa */}
        <div className="flex-1">
          <div 
            id="map-container" 
            className="h-full w-full"
            style={{ minHeight: '400px' }}
          >
            {!!mapError && (
              <div className="h-full flex items-center justify-center bg-red-50">
                <div className="text-center max-w-md px-6">
                  <p className="text-red-700 font-semibold mb-2">No se pudo cargar el mapa</p>
                  <p className="text-red-700 text-sm">{mapError}</p>
                </div>
              </div>
            )}
            {!mapError && !mapLoaded && (
              <div className="h-full flex items-center justify-center bg-gray-100">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p className="text-gray-600">Cargando mapa interactivo...</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Panel lateral de propiedades */}
        {selectedProperty && (
          <div className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
            <h3 className="font-bold text-lg mb-2">{selectedProperty.title}</h3>
            <p className="text-gray-600 mb-2">{selectedProperty.location}</p>
            <p className="text-brand-500 font-bold text-xl">€{selectedProperty.price?.toLocaleString() || 'N/A'}</p>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between">
                <span>Dormitorios:</span>
                <span className="font-semibold">{selectedProperty.bedrooms || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span>Área:</span>
                <span className="font-semibold">{selectedProperty.area || selectedProperty.square_meters || 'N/A'} m²</span>
              </div>
            </div>
            <button 
              onClick={() => {
                setSelectedProperty(null);
                setSelectedInUrl(null);
              }}
              className="mt-4 w-full px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Cerrar detalles
            </button>
          </div>
        )}
      </div>
    </div>
  );
}