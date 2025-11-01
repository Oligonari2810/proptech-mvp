'use client';

import React, { useState } from 'react';
import { TaxCalculationRD } from '../../lib/legal/types';
import { calculateRDTaxes } from '../../lib/legal/calculator';
import { TaxBreakdown } from './TaxBreakdown';

export function TaxCalculatorRD() {
  const [formData, setFormData] = useState({
    precioPropiedad: 0,
    tipoTransaccion: 'compra' as 'compra' | 'venta' | 'alquiler',
    tipoPropiedad: 'residencial' as 'residencial' | 'comercial' | 'terreno',
    primeraVenta: false,
    incluirImpuestoAnual: true
  });

  const taxResult = calculateRDTaxes(formData);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          🧮 Calculadora de Impuestos Inmobiliarios RD
        </h2>
        <p className="text-gray-600 mt-2">
          Calcula todos los impuestos y costos según las leyes dominicanas
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulario de Entrada */}
        <div className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-2">📝 Datos de la Transacción</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Precio de la Propiedad (DOP)
                </label>
                <input
                  type="number"
                  value={formData.precioPropiedad || ''}
                  onChange={(e) => setFormData({...formData, precioPropiedad: Number(e.target.value)})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej: 5,000,000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Transacción
                </label>
                <select
                  value={formData.tipoTransaccion}
                  onChange={(e) => setFormData({...formData, tipoTransaccion: e.target.value as any})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="compra">Compra</option>
                  <option value="venta">Venta</option>
                  <option value="alquiler">Alquiler</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Propiedad
                </label>
                <select
                  value={formData.tipoPropiedad}
                  onChange={(e) => setFormData({...formData, tipoPropiedad: e.target.value as any})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="residencial">Residencial</option>
                  <option value="comercial">Comercial</option>
                  <option value="terreno">Terreno</option>
                </select>
              </div>

              {formData.tipoTransaccion === 'compra' && (
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="primeraVenta"
                    checked={formData.primeraVenta}
                    onChange={(e) => setFormData({...formData, primeraVenta: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="primeraVenta" className="ml-2 text-sm text-gray-700">
                    ¿Es primera venta por constructor? (Aplica ITBIS 18%)
                  </label>
                </div>
              )}

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="impuestoAnual"
                  checked={formData.incluirImpuestoAnual}
                  onChange={(e) => setFormData({...formData, incluirImpuestoAnual: e.target.checked})}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="impuestoAnual" className="ml-2 text-sm text-gray-700">
                  Incluir impuesto inmobiliario anual
                </label>
              </div>
            </div>
          </div>

          {/* Información Legal */}
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h4 className="font-semibold text-yellow-800 mb-2">⚖️ Base Legal</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• <strong>ITBIS 18%:</strong> Ley 11-92 (solo primera venta por constructores)</li>
              <li>• <strong>Impuesto Transferencia 3%:</strong> Ley 173-07</li>
              <li>• <strong>Impuesto Inmobiliario:</strong> Ley 173-07</li>
              <li>• <strong>Honorarios Notariales:</strong> Ley 302 del Notariado</li>
            </ul>
          </div>
        </div>

        {/* Resultados */}
        <div>
          <TaxBreakdown calculation={taxResult} />
        </div>
      </div>
    </div>
  );
}

