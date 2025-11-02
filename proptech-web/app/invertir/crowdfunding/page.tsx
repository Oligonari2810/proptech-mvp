'use client';

import React, { useState } from 'react';
import { useToast } from '@/components/ToastNotification';
import { LoadingOptimized } from '@/components/LoadingOptimized';

interface OportunidadInversion {
  id: string;
  titulo: string;
  descripcion: string;
  montoTotal: number;
  montoRecaudado: number;
  inversionMinima: number;
  rentabilidadEsperada: number;
  plazoMeses: number;
  tipo: 'confotur' | 'residencial' | 'comercial';
  imagenes: string[];
  ubicacion: string;
  beneficiosFiscales: string[];
  fechaInicio: string;
  fechaCierre: string;
}

export default function CrowdfundingPage() {
  const { addToast } = useToast();
  const [oportunidades, setOportunidades] = useState<OportunidadInversion[]>([
    {
      id: '1',
      titulo: 'Residencial Turístico CONFOTUR - Punta Cana',
      descripcion: 'Desarrollo de 50 unidades vacacionales con rentabilidad garantizada del 8% anual. Proyecto elegible para beneficios fiscales CONFOTUR.',
      montoTotal: 50000000,
      montoRecaudado: 35000000,
      inversionMinima: 100000,
      rentabilidadEsperada: 12.5,
      plazoMeses: 36,
      tipo: 'confotur',
      ubicacion: 'Punta Cana, La Altagracia',
      beneficiosFiscales: ['Exención ITBIS', 'Exención Impuesto Rentas', 'Exención Impuesto Patrimonio'],
      imagenes: ['/proyecto1.jpg'],
      fechaInicio: '2024-01-01',
      fechaCierre: '2024-06-30'
    },
    {
      id: '2',
      titulo: 'Complejo Residencial Premium - Santo Domingo',
      descripcion: 'Desarrollo residencial de alta gama en zona exclusiva con 120 apartamentos. Ideal para inversión a largo plazo.',
      montoTotal: 80000000,
      montoRecaudado: 45000000,
      inversionMinima: 200000,
      rentabilidadEsperada: 10.8,
      plazoMeses: 48,
      tipo: 'residencial',
      ubicacion: 'Piantini, Distrito Nacional',
      beneficiosFiscales: ['Depreciación Acelerada'],
      imagenes: ['/proyecto2.jpg'],
      fechaInicio: '2024-02-01',
      fechaCierre: '2024-08-31'
    }
  ]);

  const [inversionSeleccionada, setInversionSeleccionada] = useState<string>('');
  const [montoInversion, setMontoInversion] = useState<number>(100000);
  const [loading, setLoading] = useState(false);

  const calcularRentabilidad = (monto: number, rentabilidad: number, plazo: number) => {
    return monto * (rentabilidad / 100) * (plazo / 12);
  };

  const handleConfirmarInversion = async () => {
    if (!inversionSeleccionada) {
      addToast({
        type: 'warning',
        title: 'Selecciona un proyecto',
        message: 'Por favor, selecciona un proyecto antes de invertir',
        duration: 3000,
      });
      return;
    }

    if (montoInversion < (oportunidades.find(o => o.id === inversionSeleccionada)?.inversionMinima || 0)) {
      addToast({
        type: 'error',
        title: 'Monto insuficiente',
        message: `La inversión mínima es RD$ ${oportunidades.find(o => o.id === inversionSeleccionada)?.inversionMinima.toLocaleString()}`,
        duration: 4000,
      });
      return;
    }

    setLoading(true);
    
    // Simular llamada API
    setTimeout(() => {
      setLoading(false);
      addToast({
        type: 'success',
        title: '¡Inversión registrada!',
        message: 'Recibirás un email con los detalles de tu inversión en breve',
        duration: 5000,
      });
    }, 2000);
  };

  const oportunidadActual = oportunidades.find(o => o.id === inversionSeleccionada);
  const porcentajeRecaudado = oportunidadActual 
    ? (oportunidadActual.montoRecaudado / oportunidadActual.montoTotal) * 100 
    : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Inversión Inmobiliaria Fraccionada</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Invierte en proyectos inmobiliarios de alto rendimiento desde{' '}
          <strong className="text-blue-600">RD$ 100,000</strong> y aprovecha los beneficios{' '}
          <strong className="text-green-600">CONFOTUR</strong>
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Lista de Oportunidades */}
        <div className="lg:col-span-2 space-y-6">
          {oportunidades.map((oportunidad) => (
            <div key={oportunidad.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{oportunidad.titulo}</h3>
                    <p className="text-gray-600 mb-2">{oportunidad.descripcion}</p>
                    <p className="text-sm text-gray-500">📍 {oportunidad.ubicacion}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ml-4 ${
                    oportunidad.tipo === 'confotur' 
                      ? 'bg-green-100 text-green-800' 
                      : oportunidad.tipo === 'residencial'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-purple-100 text-purple-800'
                  }`}>
                    {oportunidad.tipo.toUpperCase()}
                  </span>
                </div>

                {/* Métricas de Inversión */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{oportunidad.rentabilidadEsperada}%</div>
                    <div className="text-xs text-gray-600">Rentabilidad Anual</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{oportunidad.plazoMeses} meses</div>
                    <div className="text-xs text-gray-600">Plazo</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      RD$ {oportunidad.inversionMinima.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-600">Inversión Mínima</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {Math.round((oportunidad.montoRecaudado / oportunidad.montoTotal) * 100)}%
                    </div>
                    <div className="text-xs text-gray-600">Recaudado</div>
                  </div>
                </div>

                {/* Barra de Progreso */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progreso de recaudación</span>
                    <span>
                      RD$ {oportunidad.montoRecaudado.toLocaleString()} / RD$ {oportunidad.montoTotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-green-600 h-3 rounded-full transition-all duration-300" 
                      style={{ width: `${(oportunidad.montoRecaudado / oportunidad.montoTotal) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Beneficios CONFOTUR */}
                {oportunidad.tipo === 'confotur' && (
                  <div className="mb-4 p-3 bg-green-50 rounded-lg">
                    <h4 className="font-semibold mb-2 text-green-800">✅ Beneficios Fiscales CONFOTUR:</h4>
                    <div className="flex flex-wrap gap-2">
                      {oportunidad.beneficiosFiscales.map((beneficio, index) => (
                        <span key={index} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                          {beneficio}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setInversionSeleccionada(oportunidad.id)}
                  className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                    inversionSeleccionada === oportunidad.id
                      ? 'bg-blue-700 text-white'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {inversionSeleccionada === oportunidad.id ? '✓ Seleccionado' : 'Invertir en Este Proyecto'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Panel de Inversión */}
        <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4 h-fit">
          <h3 className="text-xl font-semibold mb-4">Calcula Tu Inversión</h3>
          
          {inversionSeleccionada && oportunidadActual ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Monto a Invertir (RD$)</label>
                <input
                  type="number"
                  value={montoInversion}
                  onChange={(e) => setMontoInversion(Number(e.target.value))}
                  min={oportunidadActual.inversionMinima}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Mínimo: RD$ {oportunidadActual.inversionMinima.toLocaleString()}
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
                <h4 className="font-semibold mb-3 text-gray-800">Proyección de Retorno</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-2 border-b border-blue-200">
                    <span className="text-gray-700">Inversión:</span>
                    <span className="font-semibold">RD$ {montoInversion.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-blue-200">
                    <span className="text-gray-700">Rentabilidad anual:</span>
                    <span className="font-semibold text-green-600">
                      {oportunidadActual.rentabilidadEsperada}%
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-blue-200">
                    <span className="text-gray-700">Ganancia esperada ({oportunidadActual.plazoMeses} meses):</span>
                    <span className="font-semibold text-green-600">
                      +RD$ {calcularRentabilidad(
                        montoInversion, 
                        oportunidadActual.rentabilidadEsperada,
                        oportunidadActual.plazoMeses
                      ).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t-2 border-blue-300">
                    <span className="font-semibold text-gray-800">Total proyectado:</span>
                    <span className="font-bold text-blue-600 text-lg">
                      RD$ {(montoInversion + calcularRentabilidad(
                        montoInversion, 
                        oportunidadActual.rentabilidadEsperada,
                        oportunidadActual.plazoMeses
                      )).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleConfirmarInversion}
                disabled={loading || montoInversion < oportunidadActual.inversionMinima}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <LoadingOptimized type="spinner" size="sm" />
                    <span className="ml-2">Procesando...</span>
                  </span>
                ) : (
                  'Confirmar Inversión'
                )}
              </button>
              
              <p className="text-xs text-gray-500 text-center">
                Al invertir, recibirás tokens digitales que representan tu participación en el proyecto
              </p>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <div className="text-6xl mb-4">💎</div>
              <p className="text-lg">Selecciona un proyecto para comenzar tu inversión</p>
            </div>
          )}
        </div>
      </div>

      {/* Información adicional */}
      <div className="mt-12 bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-4">📋 Cómo Funciona</h3>
        <div className="grid md:grid-cols-3 gap-6 text-sm">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-3xl mb-2">1️⃣</div>
            <h4 className="font-semibold mb-2">Selecciona Proyecto</h4>
            <p className="text-gray-600">Elige un proyecto inmobiliario que se ajuste a tu perfil de inversión</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-3xl mb-2">2️⃣</div>
            <h4 className="font-semibold mb-2">Invierte</h4>
            <p className="text-gray-600">Realiza tu inversión desde RD$ 100,000 y recibe tokens digitales</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-3xl mb-2">3️⃣</div>
            <h4 className="font-semibold mb-2">Genera Retornos</h4>
            <p className="text-gray-600">Recibe rentabilidad mensual y beneficios fiscales CONFOTUR</p>
          </div>
        </div>
      </div>
    </div>
  );
}

