"use client";
import ROIDashboard from "./roi/page";
import LeadHeatmap from "../../components/analytics/LeadHeatmap";

export default function AnalyticsDashboard() {
  const sampleLeads = [
    { id: 1, location: { lat: 40.4168, lng: -3.7038 }, conversion_score: 0.8, name: "Lead Madrid Centro" },
    { id: 2, location: { lat: 40.4233, lng: -3.7009 }, conversion_score: 0.6, name: "Lead Chamberí" },
    { id: 3, location: { lat: 40.4333, lng: -3.7167 }, conversion_score: 0.9, name: "Lead Salamanca" },
  ];

  return (
    <div className="space-y-8 p-6">
      <ROIDashboard />
      <div className="bg-white p-6 rounded-lg shadow border">
        <h2 className="text-xl font-bold mb-4">Mapa de Calor - Leads</h2>
        <LeadHeatmap leads={sampleLeads as any} />
      </div>
    </div>
  );
}
