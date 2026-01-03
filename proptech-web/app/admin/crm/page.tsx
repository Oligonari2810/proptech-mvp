'use client';

import { useMemo, useState } from 'react';
import NextAuthRoleGuard from '../../components/auth/NextAuthRoleGuard';
import LeadPipeline from '../../components/crm/LeadPipeline';
import GoogleSheetsIntegration from '../../components/integrations/GoogleSheetsIntegration';
import AutoResponder from '../../components/automation/AutoResponder';
import FollowUpAutomation from '../../components/automation/FollowUpAutomation';
import MarketAlerts from '../../components/automation/MarketAlerts';

type TabKey = 'pipeline' | 'automation' | 'integrations';

export default function CRMDashboard() {
  const [tab, setTab] = useState<TabKey>('pipeline');

  // Mock data realista para demo
  const mockLeads = useMemo(() => {
    const now = new Date();
    const mkLead = (i: number, stage: 'new' | 'qualified' | 'visit' | 'offer' | 'won') => ({
      id: `${stage}-${i}`,
      name: `Lead ${i} ${(stage).toUpperCase()}`,
      email: `lead${i}@demo.com`,
      phone: `+1 809 555 ${String(1000 + i).slice(-4)}`,
      budget: [75000, 120000, 180000, 260000, 520000, 950000][i % 6],
      source: ['Web', 'Landing', 'WhatsApp', 'Referral'][i % 4],
      createdAt: new Date(now.getTime() - i * 86400000).toISOString(),
      notes: ['Interesado en vista al mar', 'Prefiere zona céntrica', 'Busca 3 habitaciones', 'Financiación necesaria'][i % 4],
    });

    return {
      new: Array.from({ length: 7 }, (_, i) => mkLead(i + 1, 'new')),
      qualified: Array.from({ length: 6 }, (_, i) => mkLead(i + 1, 'qualified')),
      visit: Array.from({ length: 5 }, (_, i) => mkLead(i + 1, 'visit')),
      offer: Array.from({ length: 4 }, (_, i) => mkLead(i + 1, 'offer')),
      won: Array.from({ length: 3 }, (_, i) => mkLead(i + 1, 'won')),
    };
  }, []);

  return (
    <NextAuthRoleGuard allowedRoles={['admin', 'broker']}>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">CRM & Automatización</h1>
            <p className="text-gray-600 mt-1">Gestiona leads, automatiza respuestas y activa integraciones.</p>
          </div>

          {/* Tabs */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setTab('pipeline')}
                className={`px-4 py-3 text-sm font-medium ${tab === 'pipeline' ? 'text-indigo-700 border-b-2 border-indigo-600' : 'text-gray-600 hover:text-gray-800'}`}
              >
                Pipeline Leads
              </button>
              <button
                onClick={() => setTab('automation')}
                className={`px-4 py-3 text-sm font-medium ${tab === 'automation' ? 'text-indigo-700 border-b-2 border-indigo-600' : 'text-gray-600 hover:text-gray-800'}`}
              >
                Automatización
              </button>
              <button
                onClick={() => setTab('integrations')}
                className={`px-4 py-3 text-sm font-medium ${tab === 'integrations' ? 'text-indigo-700 border-b-2 border-indigo-600' : 'text-gray-600 hover:text-gray-800'}`}
              >
                Integraciones
              </button>
            </div>

            <div className="p-6">
              {tab === 'pipeline' && (
                <LeadPipeline initialLeads={mockLeads} />
              )}

              {tab === 'automation' && (
                <div className="space-y-6">
                  <AutoResponder />
                  <FollowUpAutomation />
                </div>
              )}

              {tab === 'integrations' && (
                <div className="space-y-6">
                  <GoogleSheetsIntegration />
                  <MarketAlerts />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </NextAuthRoleGuard>
  );
}


