"use client";
import { useState } from "react";

export default function ReportScheduler() {
  const [schedule, setSchedule] = useState("weekly");
  const [template, setTemplate] = useState("performance");
  const [status, setStatus] = useState("");

  const handleSave = () => {
    // Stub: guardar programación en backend
    setStatus(`Programado ${schedule} con plantilla ${template}`);
  };

  return (
    <div className="bg-white p-4 rounded-lg border">
      <h3 className="font-semibold mb-2">Programación de Reportes</h3>
      <div className="flex flex-wrap gap-3 items-center">
        <select className="border rounded px-2 py-1" value={schedule} onChange={(e)=>setSchedule(e.target.value)}>
          <option value="daily">Diario</option>
          <option value="weekly">Semanal</option>
          <option value="monthly">Mensual</option>
        </select>
        <select className="border rounded px-2 py-1" value={template} onChange={(e)=>setTemplate(e.target.value)}>
          <option value="performance">Rendimiento</option>
          <option value="financial">Financiero</option>
          <option value="market_analysis">Análisis Mercado</option>
        </select>
        <button className="px-3 py-1 bg-green-600 text-white rounded" onClick={handleSave}>Guardar</button>
      </div>
      {status && <p className="text-sm text-gray-600 mt-2">{status}</p>}
    </div>
  );
}


