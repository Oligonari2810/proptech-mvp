"use client";

// Page debe ser dinámica para evitar prerender
export const dynamic = 'force-dynamic';

import { useEffect, useState, Suspense } from "react";

interface MarketComparison {
  zone: string;
  avg_roi: number;
  avg_price: number;
  demand_level: string;
}

interface ROIMetrics {
  success: boolean;
  property_id: number;
  property_title?: string;
  purchase_price: number;
  estimated_rent: number;
  operating_costs: number;
  annual_appreciation: number;
  rental_yield: number;
  total_roi: number;
  cash_flow: number;
  comparison: MarketComparison[];
  error?: string;
  available_properties?: number[];
}

interface Property {
  id: number;
  title: string;
  price: number;
  location: string;
}

function ROIDashboardContent() {
  const [roiData, setRoiData] = useState<ROIMetrics | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Cargar lista de propiedades disponibles
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const base = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "https://proptech-mvp-1.onrender.com";
        const res = await fetch(`${base}/api/properties`);
        if (!res.ok) throw new Error("Error cargando propiedades");
        const data = await res.json();
        const list: Property[] = Array.isArray(data)
          ? data
          : Array.isArray(data.properties)
            ? data.properties
            : [];
        setProperties(list);
        if (list.length > 0) setSelectedPropertyId(String(list[0].id));
        setError(null);
      } catch (e) {
        setError("No se pudieron cargar las propiedades");
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  // Cargar ROI al cambiar selección
  useEffect(() => {
    if (!selectedPropertyId) return;
    const fetchROI = async () => {
      try {
        setLoading(true);
        const base = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "https://proptech-mvp-1.onrender.com";
        const res = await fetch(`${base}/api/analytics/roi?property_id=${selectedPropertyId}`);
        const data = await res.json();
        if (!res.ok || data.success === false) {
          throw new Error(data.error || `Error ${res.status}`);
        }
        setRoiData(data);
        setError(null);
      } catch (e) {
        setError(e instanceof Error ? e.message : "No se pudo cargar ROI");
        setRoiData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchROI();
  }, [selectedPropertyId]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard ROI - Análisis de Inversión</h1>
      </div>

      {/* Selector dinámico de propiedad */}
      <div className="flex items-center gap-3">
        <label className="text-sm text-gray-700">Seleccionar Propiedad</label>
        <select
          className="border rounded px-2 py-1 text-sm min-w-56"
          value={selectedPropertyId}
          onChange={(e) => setSelectedPropertyId(e.target.value)}
          disabled={properties.length === 0}
        >
          {properties.length === 0 ? (
            <option value="">No hay propiedades</option>
          ) : (
            properties.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} — €{(p.price || 0).toLocaleString()}
              </option>
            ))
          )}
        </select>
        {properties.length > 0 && (
          <span className="text-xs text-gray-500">{properties.length} disponible(s)</span>
        )}
      </div>

      {loading && (
        <div className="p-6 flex justify-center items-center h-40">
          <div className="text-lg">Cargando análisis ROI...</div>
        </div>
      )}

      {error && !loading && (
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
          <h2 className="text-red-800 font-bold">Error al cargar datos ROI</h2>
          <p className="text-red-600">{error}</p>
          <p className="text-sm text-red-500 mt-2">
            Verifica que el backend esté ejecutándose en {process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "https://proptech-mvp-1.onrender.com"}
          </p>
        </div>
      )}

      {!error && !loading && roiData && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricCard title="ROI Total" value={`${(roiData.total_roi * 100).toFixed(1)}%`} />
            <MetricCard title="Rental Yield" value={`${(roiData.rental_yield * 100).toFixed(1)}%`} />
            <MetricCard title="Cash Flow Anual" value={`€${roiData.cash_flow.toLocaleString()}`} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ROIBreakdown data={roiData} />
            <ComparisonTable comparisons={roiData.comparison} />
          </div>

          <div>
            <button
              onClick={() => {
                try {
                  const rows = [
                    ['Propiedad', 'Precio Compra', 'Renta Mensual Est.', 'ROI Total', 'Cash Flow Anual'],
                    [
                      roiData.property_title || selectedPropertyId,
                      roiData.purchase_price,
                      roiData.estimated_rent,
                      (roiData.total_roi * 100).toFixed(1) + '%',
                      roiData.cash_flow
                    ]
                  ];
                  const csv = rows.map(r => r.join(',')).join('\n');
                  const blob = new Blob([csv], { type: 'text/csv' });
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `roi-${selectedPropertyId}.csv`;
                  a.click();
                  URL.revokeObjectURL(url);
                } catch { /* noop */ }
              }}
              className="mt-4 inline-flex items-center px-3 py-2 border rounded text-sm hover:bg-gray-50"
            >
              📥 Exportar CSV
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function MetricCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow border">
      <h3 className="text-sm font-medium text-gray-600">{title}</h3>
      <p className="text-2xl font-bold text-green-600 mt-1">{value}</p>
    </div>
  );
}

function ROIBreakdown({ data }: { data: ROIMetrics }) {
  const items = [
    { label: "Precio Compra", value: `€${data.purchase_price.toLocaleString()}` },
    { label: "Renta Anual Est.", value: `€${data.estimated_rent.toLocaleString()}` },
    { label: "Costes Operativos", value: `€${data.operating_costs.toLocaleString()}` },
    { label: "Apreciación Anual", value: `€${data.annual_appreciation.toLocaleString()}` },
  ];
  return (
    <div className="bg-white p-4 rounded-lg shadow border">
      <h3 className="text-lg font-semibold mb-3">Desglose</h3>
      <div className="space-y-2">
        {items.map((it) => (
          <div key={it.label} className="flex items-center justify-between text-sm">
            <span className="text-gray-600">{it.label}</span>
            <span className="font-medium">{it.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ComparisonTable({ comparisons }: { comparisons: MarketComparison[] }) {
  const rows = comparisons && comparisons.length > 0 ? comparisons : [];
  return (
    <div className="bg-white p-4 rounded-lg shadow border">
      <h3 className="text-lg font-semibold mb-3">Comparativa de Mercado</h3>
      {rows.length === 0 ? (
        <p className="text-sm text-gray-500">Sin datos de comparación</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-600">
                <th className="py-2 pr-3">Zona</th>
                <th className="py-2 pr-3">ROI Medio</th>
                <th className="py-2 pr-3">Precio Medio</th>
                <th className="py-2">Demanda</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, idx) => (
                <tr key={idx} className="border-t">
                  <td className="py-2 pr-3">{r.zone}</td>
                  <td className="py-2 pr-3">{(r.avg_roi * 100).toFixed(1)}%</td>
                  <td className="py-2 pr-3">€{r.avg_price.toLocaleString()}</td>
                  <td className="py-2">{r.demand_level}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function ROIDashboard() {
  return (
    <Suspense fallback={
      <div className="p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando dashboard ROI...</p>
        </div>
      </div>
    }>
      <ROIDashboardContent />
    </Suspense>
  );
}

