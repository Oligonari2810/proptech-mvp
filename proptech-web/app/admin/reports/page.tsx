"use client";
import ReportGenerator from "@/app/components/reports/ReportGenerator";
import ReportScheduler from "@/app/components/reports/ReportScheduler";

export default function ExecutiveReportsPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Reportes Ejecutivos</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border">
          <h2 className="text-lg font-semibold mb-4">Generar Reporte</h2>
          <ReportGenerator />
        </div>
        <div className="bg-white p-6 rounded-lg border">
          <h2 className="text-lg font-semibold mb-4">Programar Reportes</h2>
          <ReportScheduler />
        </div>
      </div>
    </div>
  );
}


