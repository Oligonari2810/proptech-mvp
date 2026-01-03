"use client";

// Page debe ser dinámica para evitar prerender
export const dynamic = 'force-dynamic';
import { useEffect, useState } from "react";

interface APIEndpoint {
  name: string;
  endpoint: string;
  description: string;
  rate_limit: string;
  authentication: string;
}

export default function APIMarketplacePage() {
  const [endpoints, setEndpoints] = useState<APIEndpoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/marketplace/endpoints')
      .then(res => res.json())
      .then(data => setEndpoints(data.available_apis || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">API Marketplace</h1>
      {loading ? (
        <div>Cargando endpoints...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {endpoints.map((api, index) => (
            <div key={index} className="bg-white p-4 rounded-lg border">
              <h3 className="font-semibold text-lg">{api.name}</h3>
              <p className="text-gray-600 text-sm mt-1">{api.description}</p>
              <div className="mt-3 space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm">Endpoint:</span>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded">{api.endpoint}</code>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Límite:</span>
                  <span className="text-sm">{api.rate_limit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Autenticación:</span>
                  <span className="text-sm">{api.authentication}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


