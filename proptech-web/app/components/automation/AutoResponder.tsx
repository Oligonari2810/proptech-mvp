'use client';

import { useState } from 'react';

interface Template {
  id: string;
  name: string;
  channel: 'email' | 'whatsapp';
  subject?: string;
  body: string;
}

const DEFAULT_TEMPLATES: Template[] = [
  { id: 'welcome', name: 'Bienvenida', channel: 'email', subject: 'Gracias por tu interés', body: 'Hola {{name}}, gracias por tu interés en {{property}}...' },
  { id: 'visit', name: 'Confirmación de visita', channel: 'whatsapp', body: 'Hola {{name}}, confirmamos tu visita el {{date}} a las {{time}}.' },
];

export default function AutoResponder() {
  const [templates, setTemplates] = useState<Template[]>(DEFAULT_TEMPLATES);
  const [status, setStatus] = useState<string | null>(null);

  const sendTest = async (templateId: string) => {
    setStatus('Enviando prueba...');
    await new Promise((r) => setTimeout(r, 800));
    setStatus('✅ Mensaje de prueba enviado');
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">AutoResponder de Leads</h2>
          <p className="text-sm text-gray-600">Plantillas y respuestas automáticas por canal.</p>
        </div>
        {status && <span className="text-sm text-gray-700">{status}</span>}
      </div>

      <div className="space-y-3">
        {templates.map((t) => (
          <div key={t.id} className="border border-gray-200 rounded-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-gray-900">{t.name}</div>
                <div className="text-xs text-gray-500">Canal: {t.channel.toUpperCase()}</div>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1 text-sm rounded border border-gray-300 hover:bg-gray-50">Editar</button>
                <button onClick={() => sendTest(t.id)} className="px-3 py-1 text-sm rounded bg-indigo-600 text-white hover:bg-indigo-700">Enviar prueba</button>
              </div>
            </div>
            {t.subject && <div className="mt-2 text-sm text-gray-700"><strong>Asunto:</strong> {t.subject}</div>}
            <pre className="mt-2 bg-gray-50 p-3 rounded text-sm overflow-x-auto">{t.body}</pre>
          </div>
        ))}
      </div>
    </div>
  );
}


