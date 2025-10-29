"use client";
import { useState } from "react";

export default function ReportGenerator() {
  const [format, setFormat] = useState<string>("PDF");
  const [status, setStatus] = useState<string>("");

  const handleGenerate = async () => {
    setStatus("Generando reporte...");
    // Stub: conectar con backend cuando esté disponible
    setTimeout(() => setStatus(`Reporte generado en formato ${format}`), 600);
  };

  return (
    <div className="bg-white p-4 rounded-lg border">
      <h3 className="font-semibold mb-2">Generador de Reportes</h3>
      <div className="flex items-center gap-3">
        <select className="border rounded px-2 py-1" value={format} onChange={(e)=>setFormat(e.target.value)}>
          <option>PDF</option>
          <option>CSV</option>
          <option>Excel</option>
        </select>
        <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={handleGenerate}>Generar</button>
      </div>
      {status && <p className="text-sm text-gray-600 mt-2">{status}</p>}
    </div>
  );
}


