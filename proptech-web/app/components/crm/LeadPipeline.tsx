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
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const buildBoardFromLeads = (leads: Array<any>): BoardState => {
    const empty: BoardState = { new: [], qualified: [], visit: [], offer: [], won: [] };
    for (const l of leads) {
      const item: Lead = {
        id: String(l.id ?? crypto.randomUUID()),
        name: String(l.name ?? 'Lead'),
        email: l.email,
        phone: l.phone,
        budget: Number(l.value ?? l.budget ?? 0),
        source: l.source ?? 'Web',
        createdAt: l.createdAt ?? new Date().toISOString(),
        notes: l.notes ?? (l.property_interested ? `Interesado en #${l.property_interested}` : undefined),
      };
      const stage = (l.stage ?? 'new') as StageKey;
      if ((empty as any)[stage]) (empty as any)[stage].push(item);
      else empty.new.push(item);
    }
    return empty;
  };

  // Cargar datos reales con fallback mock si no hay initialLeads
  useEffect(() => {
    const hasInitial =
      (initialLeads?.new?.length || 0) +
      (initialLeads?.qualified?.length || 0) +
      (initialLeads?.visit?.length || 0) +
      (initialLeads?.offer?.length || 0) +
      (initialLeads?.won?.length || 0);
    if (hasInitial) return;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://proptech-mvp-1.onrender.com';
        const res = await fetch(`${backendUrl}/api/crm/leads`, { cache: 'no-store' });
        if (!res.ok) throw new Error('Endpoint no disponible');
        const data = await res.json();
        const leads = data.leads || data || [];
        setBoard(buildBoardFromLeads(leads));
      } catch (e) {
        const mock = Array.from({ length: 10 }, (_, i) => ({
          id: `mock-${i + 1}`,
          name: `Lead Demo ${i + 1}`,
          email: `lead${i + 1}@demo.com`,
          phone: `+1 809 555 ${String(1000 + i)}`,
          value: [90000, 120000, 180000, 250000, 400000][i % 5],
          stage: ['new', 'qualified', 'visit', 'offer', 'won'][i % 5],
          source: ['Web', 'Landing', 'WhatsApp'][i % 3],
          createdAt: new Date(Date.now() - i * 86400000).toISOString(),
          notes: 'Mock automático',
        }));
        setBoard(buildBoardFromLeads(mock));
        setError('Usando datos de demostración');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [initialLeads]);

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
      {loading && (
        <div className="text-sm text-gray-600">Cargando leads del CRM...</div>
      )}
      {error && (
        <div className="text-sm text-yellow-700 bg-yellow-50 border border-yellow-200 rounded px-3 py-2">{error}</div>
      )}
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


