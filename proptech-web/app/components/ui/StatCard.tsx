import React from "react";

export interface StatCardProps {
  label: string;
  value: string;
  delta?: string;
}

export default function StatCard({ label, value, delta }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 ring-4 ring-brand-100">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-ink-600">{label}</div>
          <div className="mt-1 text-xl font-bold text-ink-900">{value}</div>
        </div>
        {delta && <div className="text-xs text-ink-700">{delta}</div>}
      </div>
    </div>
  );
}
