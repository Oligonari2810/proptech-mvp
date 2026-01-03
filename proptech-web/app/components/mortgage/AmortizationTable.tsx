'use client';

import React, { useState } from 'react';
import { AmortizationRow } from '@/app/lib/mortgage/types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  amortization: AmortizationRow[];
}

export function AmortizationTable({ amortization }: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // 12 meses por página
  const totalPages = Math.ceil(amortization.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = amortization.slice(startIndex, endIndex);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800">
          📊 Tabla de Amortización
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm text-gray-600">
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Mes</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700">Cuota</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700">Capital</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700">Intereses</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700">Saldo Restante</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((row) => (
              <tr key={row.mes} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 text-gray-700">{row.mes}</td>
                <td className="py-3 px-4 text-right font-medium text-gray-900">
                  RD$ {row.cuota.toLocaleString('es-DO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td className="py-3 px-4 text-right text-green-600">
                  RD$ {row.capital.toLocaleString('es-DO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td className="py-3 px-4 text-right text-red-600">
                  RD$ {row.intereses.toLocaleString('es-DO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td className="py-3 px-4 text-right text-gray-600">
                  RD$ {row.saldoRestante.toLocaleString('es-DO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-xs text-gray-500 text-center">
        Mostrando {startIndex + 1} - {Math.min(endIndex, amortization.length)} de {amortization.length} meses
      </div>
    </div>
  );
}

