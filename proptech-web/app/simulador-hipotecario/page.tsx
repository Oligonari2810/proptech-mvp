'use client';

import React, { useState, useEffect } from 'react';
import { useToast } from '../components/ToastNotification';
import { LoadingOptimized } from '../components/LoadingOptimized';
import { useRouter } from 'next/navigation';

interface SimulacionHipoteca {
  montoPropiedad: number;
  enganche: number;
  plazoAnios: number;
  tasaInteres: number;
  ingresosMensuales: number;
  deudasMensuales: number;
}

interface ResultadoSimulacion {
  cuotaMensual: number;
  montoFinanciar: number;
  capacidadPago: number;
  aprobado: boolean;
  montoMaximoRecomendado: number;
  totalIntereses: number;
  totalPagar: number;
}

export default function SimuladorHipotecario() {
  const router = useRouter();
  const [simulacion, setSimulacion] = useState<SimulacionHipoteca>({
    montoPropiedad: 5000000,
    enganche: 20,
    plazoAnios: 20,
    tasaInteres: 8.5,
    ingresosMensuales: 80000,
    deudasMensuales: 20000
  });
  
  const [resultado, setResultado] = useState<ResultadoSimulacion | null>(null);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const calcularHipoteca = () => {
    setLoading(true);
    
    try {
      const montoFinanciar = simulacion.montoPropiedad * (1 - simulacion.enganche / 100);
      const tasaMensual = simulacion.tasaInteres / 100 / 12;
      const plazoMeses = simulacion.plazoAnios * 12;
      
      // Calcular cuota mensual (fórmula de amortización)
      const cuotaMensual = montoFinanciar * 
        (tasaMensual * Math.pow(1 + tasaMensual, plazoMeses)) / 
        (Math.pow(1 + tasaMensual, plazoMeses) - 1);
      
      // Capacidad de pago (35% de ingresos disponibles)
      const ingresosDisponibles = simulacion.ingresosMensuales - simulacion.deudasMensuales;
      const capacidadPago = ingresosDisponibles * 0.35;
      
      const aprobado = cuotaMensual <= capacidadPago;
      
      // Calcular monto máximo recomendado
      const montoMaximoRecomendado = capacidadPago * 
        ((Math.pow(1 + tasaMensual, plazoMeses) - 1) / 
         (tasaMensual * Math.pow(1 + tasaMensual, plazoMeses)));
      
      // Calcular total de intereses
      const totalPagar = cuotaMensual * plazoMeses;
      const totalIntereses = totalPagar - montoFinanciar;
      
      const resultadoCalculado: ResultadoSimulacion = {
        cuotaMensual: Math.round(cuotaMensual),
        montoFinanciar: Math.round(montoFinanciar),
        capacidadPago: Math.round(capacidadPago),
        aprobado,
        montoMaximoRecomendado: Math.round(montoMaximoRecomendado),
        totalIntereses: Math.round(totalIntereses),
        totalPagar: Math.round(totalPagar)
      };
      
      setResultado(resultadoCalculado);
      
      addToast({
        type: aprobado ? 'success' : 'warning',
        title: aprobado ? '¡Pre-aprobación potencial!' : 'Necesitas ajustar tu búsqueda',
        message: aprobado ? 
          `Tu cuota mensual sería de RD$ ${resultadoCalculado.cuotaMensual.toLocaleString()}` :
          `Tu capacidad de pago es RD$ ${resultadoCalculado.capacidadPago.toLocaleString()}`,
        duration: 5000,
      });
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Error en el cálculo',
        message: 'Por favor, verifica los datos ingresados',
        duration: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  const buscarPropiedades = () => {
    if (resultado) {
      router.push(`/comprar?max_price=${resultado.montoMaximoRecomendado}`);
    }
  };

  useEffect(() => {
    // Calcular automáticamente al cambiar los valores
    if (simulacion.montoPropiedad > 0 && simulacion.ingresosMensuales > 0) {
      calcularHipoteca();
    }
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">Simulador de Crédito Hipotecario</h1>
        <p className="text-gray-600 text-lg">
          Descubre cuánto puedes pagar y obtén pre-aprobación en minutos
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Formulario de simulación */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-6">Tu Situación Financiera</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Precio de la propiedad (RD$)
              </label>
              <input
                type="number"
                value={simulacion.montoPropiedad}
                onChange={(e) => setSimulacion({...simulacion, montoPropiedad: Number(e.target.value)})}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                min="0"
                step="1000"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Enganche: {simulacion.enganche}%
              </label>
              <input
                type="range"
                min="10"
                max="50"
                value={simulacion.enganche}
                onChange={(e) => setSimulacion({...simulacion, enganche: Number(e.target.value)})}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>10%</span>
                <span className="font-semibold">{simulacion.enganche}%</span>
                <span>50%</span>
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Enganche: RD$ {Math.round(simulacion.montoPropiedad * simulacion.enganche / 100).toLocaleString()}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Plazo (años)</label>
              <select 
                value={simulacion.plazoAnios}
                onChange={(e) => setSimulacion({...simulacion, plazoAnios: Number(e.target.value)})}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="15">15 años</option>
                <option value="20">20 años</option>
                <option value="25">25 años</option>
                <option value="30">30 años</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Tasa de interés anual: {simulacion.tasaInteres}%
              </label>
              <input
                type="range"
                min="6"
                max="12"
                step="0.1"
                value={simulacion.tasaInteres}
                onChange={(e) => setSimulacion({...simulacion, tasaInteres: Number(e.target.value)})}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>6%</span>
                <span className="font-semibold">{simulacion.tasaInteres}%</span>
                <span>12%</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Ingresos mensuales (RD$)
              </label>
              <input
                type="number"
                value={simulacion.ingresosMensuales}
                onChange={(e) => setSimulacion({...simulacion, ingresosMensuales: Number(e.target.value)})}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                min="0"
                step="1000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Deudas mensuales (RD$)
              </label>
              <input
                type="number"
                value={simulacion.deudasMensuales}
                onChange={(e) => setSimulacion({...simulacion, deudasMensuales: Number(e.target.value)})}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                min="0"
                step="1000"
              />
            </div>
            
            <button
              onClick={calcularHipoteca}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <LoadingOptimized type="spinner" size="sm" />
                  <span className="ml-2">Calculando...</span>
                </span>
              ) : (
                'Calcular Mi Hipoteca'
              )}
            </button>
          </div>
        </div>
        
        {/* Resultados y Pre-aprobación */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-6">Tu Resultado</h2>
          
          {resultado ? (
            <div className={`p-6 rounded-lg border-2 ${
              resultado.aprobado 
                ? 'bg-green-50 border-green-300' 
                : 'bg-yellow-50 border-yellow-300'
            }`}>
              <div className="text-center mb-6">
                <div className={`text-3xl font-bold mb-2 ${
                  resultado.aprobado ? 'text-green-600' : 'text-yellow-600'
                }`}>
                  {resultado.aprobado ? '✅ Pre-aprobado' : '⚠️ Ajusta tu búsqueda'}
                </div>
                <p className="text-sm text-gray-600">
                  {resultado.aprobado 
                    ? 'Cumples con los requisitos para esta propiedad'
                    : 'Tu capacidad de pago es menor al monto requerido'}
                </p>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-700">Cuota mensual estimada:</span>
                  <span className="font-bold text-lg text-blue-600">
                    RD$ {resultado.cuotaMensual.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-700">Monto a financiar:</span>
                  <span className="font-semibold">
                    RD$ {resultado.montoFinanciar.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-700">Tu capacidad de pago:</span>
                  <span className="font-semibold text-green-600">
                    RD$ {resultado.capacidadPago.toLocaleString()}
                  </span>
                </div>

                {!resultado.aprobado && (
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-gray-700">Monto máximo recomendado:</span>
                    <span className="font-semibold text-purple-600">
                      RD$ {resultado.montoMaximoRecomendado.toLocaleString()}
                    </span>
                  </div>
                )}

                <div className="mt-4 pt-4 border-t">
                  <div className="text-xs text-gray-600 space-y-1">
                    <div className="flex justify-between">
                      <span>Total a pagar ({simulacion.plazoAnios} años):</span>
                      <span className="font-semibold">RD$ {resultado.totalPagar.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Intereses totales:</span>
                      <span className="font-semibold text-red-600">RD$ {resultado.totalIntereses.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <button 
                  onClick={buscarPropiedades}
                  className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                    resultado.aprobado
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-purple-600 text-white hover:bg-purple-700'
                  }`}
                >
                  {resultado.aprobado 
                    ? 'Solicitar Pre-aprobación' 
                    : 'Ver Propiedades en Mi Rango'}
                </button>
                
                <button 
                  className="w-full border-2 border-blue-600 text-blue-600 py-3 rounded-lg hover:bg-blue-50 transition-colors font-semibold"
                  onClick={() => addToast({
                    type: 'info',
                    title: 'Próximamente',
                    message: 'Función de comparación con bancos RD en desarrollo',
                    duration: 3000,
                  })}
                >
                  Comparar con 6 Bancos RD
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <div className="text-6xl mb-4">🏠</div>
              <p className="text-lg">Completa el formulario para ver tu simulación</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Integración con búsqueda de propiedades */}
      {resultado && (
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Propiedades en Tu Rango de Precio</h3>
          <div className="text-center py-4">
            <p className="text-gray-600 mb-4">
              Encontramos propiedades que se ajustan a tu capacidad de pago
            </p>
            <button 
              onClick={buscarPropiedades}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Explorar Propiedades Hasta RD$ {resultado.montoMaximoRecomendado.toLocaleString()}
            </button>
          </div>
        </div>
      )}

      {/* Información adicional */}
      <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-4">💡 Información Importante</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <h4 className="font-semibold mb-2">📋 Requisitos Pre-aprobación:</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Ingresos comprobables</li>
              <li>Historial crediticio positivo</li>
              <li>Documentación completa</li>
              <li>Enganche mínimo 10%</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">🏦 Bancos Colaboradores:</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Banco Popular</li>
              <li>Banco de Reservas</li>
              <li>Banco BHD León</li>
              <li>Banco Scotiabank</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

