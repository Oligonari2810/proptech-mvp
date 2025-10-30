'use client';

import { useEffect, useMemo, useState } from 'react';

interface Lead {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  budget?: number;
  source?: string;
  createdAt: string;
  notes?: string;
}

const DEFAULT_STAGES = [
  { key: 'new', title: 'Nuevos' },
  { key: 'qualified', title: 'Calificados' },
  { key: 'visit', title: 'Visita Programada' },
  { key: 'offer', title: 'Oferta' },
  { key: 'won', title: 'Ganados' },
];

type StageKey = 'new' | 'qualified' | 'visit' | 'offer' | 'won';

interface BoardState {
  new: Lead[];
  qualified: Lead[];
  visit: Lead[];
  offer: Lead[];
  won: Lead[];
}

interface LeadPipelineProps {
  initialLeads?: Partial<BoardState>;
  onChange?: (state: BoardState) => void;
}

export default function LeadPipeline({ initialLeads, onChange }: LeadPipelineProps) {
  const [board, setBoard] = useState<BoardState>(() => ({
    new: initialLeads?.new || [],
    qualified: initialLeads?.qualified || [],
    visit: initialLeads?.visit || [],
    offer: initialLeads?.offer || [],
    won: initialLeads?.won || [],
  }));

  useEffect(() => {
    onChange?.(board);
  }, [board, onChange]);

  const totals = useMemo(() => {
    const count = (arr: Lead[]) => arr.length;
    const sumBudget = (arr: Lead[]) => arr.reduce((s, l) => s + (l.budget || 0), 0);
    return {
      totalLeads: Object.values(board).reduce((s, arr) => s + count(arr), 0),
      potentialRevenue: Object.values(board).reduce((s, arr) => s + sumBudget(arr), 0),
    };
  }, [board]);

  const moveLead = (from: StageKey, to: StageKey, index: number) => {
    if (from === to) return;
    setBoard((prev) => {
      const lead = prev[from][index];
      const fromArr = [...prev[from]];
      fromArr.splice(index, 1);
      const toArr = [...prev[to], lead];
      return { ...prev, [from]: fromArr, [to]: toArr } as BoardState;
    });
  };

  const addLead = () => {
    const id = crypto.randomUUID();
    setBoard((prev) => ({
      ...prev,
      new: [
        {
          id,
          name: 'Nuevo lead',
          email: 'lead@example.com',
          phone: '+1 809 000 0000',
          budget: 150000,
          source: 'Web',
          createdAt: new Date().toISOString(),
          notes: 'Interesado en 2 habitaciones',
        },
        ...prev.new,
      ],
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Pipeline de Leads</h2>
          <p className="text-sm text-gray-600">Arrastra leads entre etapas para actualizar su estado</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-xs text-gray-500">Leads Totales</div>
            <div className="text-lg font-semibold">{totals.totalLeads}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500">Revenue Potencial</div>
            <div className="text-lg font-semibold">${totals.potentialRevenue.toLocaleString()}</div>
          </div>
          <button onClick={addLead} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">+ Nuevo lead</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {DEFAULT_STAGES.map(({ key, title }) => (
          <div key={key} className="bg-gray-50 rounded-lg border border-gray-200 p-3">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
              <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">{(board as any)[key].length}</span>
            </div>
            <div className="space-y-3 min-h-[120px]">
              {(board as any)[key].map((lead: Lead, idx: number) => (
                <div key={lead.id} className="bg-white rounded-md border border-gray-200 p-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900 text-sm">{lead.name}</div>
                      <div className="text-xs text-gray-500">{lead.email}</div>
                    </div>
                    <div className="text-sm font-semibold text-indigo-700">${(lead.budget || 0).toLocaleString()}</div>
                  </div>
                  <div className="mt-2 text-xs text-gray-600">{lead.notes}</div>
                  <div className="mt-3 flex items-center gap-2 text-xs">
                    {DEFAULT_STAGES.map((s) => (
                      <button
                        key={s.key}
                        onClick={() => moveLead(key as StageKey, s.key as StageKey, idx)}
                        className={`px-2 py-1 rounded border ${s.key === key ? 'bg-gray-100 text-gray-500' : 'hover:bg-indigo-50 border-gray-200'}`}
                        disabled={s.key === key}
                        title={`Mover a ${s.title}`}
                      >
                        {s.title[0]}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


