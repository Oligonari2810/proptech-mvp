'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { TaxCalculationRD } from '@/app/lib/legal/types';
import { calculateRDTaxes } from '@/app/lib/legal/calculator';
import { ChevronRight } from 'lucide-react';

interface Props {
  precioPropiedad: number;
  tipoPropiedad?: 'residencial' | 'comercial' | 'terreno';
  showFull?: boolean;
}

export function TaxCalculatorCompact({ precioPropiedad, tipoPropiedad = 'residencial', showFull = false }: Props) {
  const [formData, setFormData] = useState({
    precioPropiedad,
    tipoTransaccion: 'compra' as 'compra' | 'venta' | 'alquiler',
    tipoPropiedad,
    primeraVenta: false,
    incluirImpuestoAnual: false
  });

  const taxResult = calculateRDTaxes(formData);

  // Actualizar precio cuando cambie la prop
  React.useEffect(() => {
    setFormData(prev => ({ ...prev, precioPropiedad }));
  }, [precioPropiedad]);

  if (precioPropiedad <= 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">🧮 Calculadora de Impuestos</h3>
        <p className="text-sm text-gray-600">Ingresa el precio de la propiedad para calcular impuestos</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">🧮 Calculadora de Impuestos</h3>
        <Link
          href="/calculadora-impuestos"
          className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
        >
          Ver completa <ChevronRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Configuración rápida */}
      {showFull && (
        <div className="space-y-3 mb-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Precio</label>
            <input
              type="number"
              value={formData.precioPropiedad || ''}
              onChange={(e) => setFormData({...formData, precioPropiedad: Number(e.target.value)})}
              className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Tipo</label>
            <select
              value={formData.tipoTransaccion}
              onChange={(e) => setFormData({...formData, tipoTransaccion: e.target.value as any})}
              className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500"
            >
              <option value="compra">Compra</option>
              <option value="venta">Venta</option>
              <option value="alquiler">Alquiler</option>
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="primeraVenta"
              checked={formData.primeraVenta}
              onChange={(e) => setFormData({...formData, primeraVenta: e.target.checked})}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="primeraVenta" className="ml-2 text-xs text-gray-700">
              Primera venta (ITBIS 18%)
            </label>
          </div>
        </div>
      )}

      {/* Resultados compactos */}
      <div className="space-y-3">
        {taxResult.resultados.itbis && (
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">ITBIS (18%):</span>
            <span className="text-sm font-semibold text-gray-900">
              RD$ {taxResult.resultados.itbis.toLocaleString('es-DO')}
            </span>
          </div>
        )}

        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <span className="text-sm text-gray-600">Imp. Transferencia (3%):</span>
          <span className="text-sm font-semibold text-gray-900">
            RD$ {taxResult.resultados.impuestoTransferencia.toLocaleString('es-DO')}
          </span>
        </div>

        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <span className="text-sm text-gray-600">Honorarios Notariales:</span>
          <span className="text-sm font-semibold text-gray-900">
            RD$ {taxResult.resultados.gastosNotariales.toLocaleString('es-DO')}
          </span>
        </div>

        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <span className="text-sm text-gray-600">Certificaciones:</span>
          <span className="text-sm font-semibold text-gray-900">
            RD$ {taxResult.resultados.certificaciones.toLocaleString('es-DO')}
          </span>
        </div>

        <div className="flex justify-between items-center py-2">
          <span className="text-sm font-semibold text-gray-900">Total Costos:</span>
          <span className="text-lg font-bold text-blue-600">
            RD$ {(taxResult.resultados.total - taxResult.precioPropiedad).toLocaleString('es-DO')}
          </span>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-gray-900">Total a Pagar:</span>
            <span className="text-xl font-bold text-green-600">
              RD$ {taxResult.resultados.total.toLocaleString('es-DO')}
            </span>
          </div>
        </div>
      </div>

      <Link
        href="/calculadora-impuestos"
        className="mt-4 block text-center text-xs text-blue-600 hover:text-blue-800 underline"
      >
        Ver desglose completo →
      </Link>
    </div>
  );
}

