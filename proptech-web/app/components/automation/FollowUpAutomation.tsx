'use client';

import { useState } from 'react';

interface SequenceStep {
  id: string;
  dayOffset: number;
  action: 'email' | 'whatsapp' | 'task';
  templateId?: string;
  note?: string;
}

export default function FollowUpAutomation() {
  const [steps, setSteps] = useState<SequenceStep[]>([
    { id: 's1', dayOffset: 0, action: 'email', templateId: 'welcome' },
    { id: 's2', dayOffset: 2, action: 'whatsapp', templateId: 'visit' },
    { id: 's3', dayOffset: 7, action: 'task', note: 'Llamar para seguimiento' },
  ]);

  const addStep = () => setSteps(prev => [...prev, { id: crypto.randomUUID(), dayOffset: 3, action: 'task', note: 'Nuevo paso' }]);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Seguimiento Automático</h2>
          <p className="text-sm text-gray-600">Define secuencias de seguimiento por evento.</p>
        </div>
        <button onClick={addStep} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">+ Paso</button>
      </div>

      <div className="space-y-3">
        {steps.map((s, idx) => (
          <div key={s.id} className="border border-gray-200 rounded-md p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
              <div>
                <label className="block text-sm mb-1 text-gray-700">Días</label>
                <input type="number" value={s.dayOffset} onChange={(e) => {
                  const val = parseInt(e.target.value) || 0;
                  setSteps(prev => prev.map((p, i) => i === idx ? { ...p, dayOffset: val } : p));
                }} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
              </div>
              <div>
                <label className="block text-sm mb-1 text-gray-700">Acción</label>
                <select value={s.action} onChange={(e) => {
                  const val = e.target.value as SequenceStep['action'];
                  setSteps(prev => prev.map((p, i) => i === idx ? { ...p, action: val } : p));
                }} className="w-full px-3 py-2 border border-gray-300 rounded-md">
                  <option value="email">Email</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="task">Tarea</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1 text-gray-700">Plantilla</label>
                <input type="text" placeholder="ID plantilla" value={s.templateId || ''} onChange={(e) => setSteps(prev => prev.map((p, i) => i === idx ? { ...p, templateId: e.target.value } : p))} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
              </div>
              <div>
                <label className="block text-sm mb-1 text-gray-700">Nota</label>
                <input type="text" placeholder="Descripción" value={s.note || ''} onChange={(e) => setSteps(prev => prev.map((p, i) => i === idx ? { ...p, note: e.target.value } : p))} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


