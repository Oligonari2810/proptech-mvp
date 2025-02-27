"use client"; // Necesario para manejar interacciones

import { useState, useEffect } from "react";

const InvestmentTools = () => {
  const [investment, setInvestment] = useState<number | null>(null);
  const [roi, setRoi] = useState<number | null>(null);

  useEffect(() => {
    setRoi(null); // Limpiar ROI si el usuario cambia la inversión
  }, [investment]);

  const calculateROI = () => {
    if (investment === null || Number.isNaN(investment) || investment <= 0) {
      setRoi(null); // Evita cálculos incorrectos
      return;
    }
    setRoi(investment * 0.12);
  };

  return (
    <div className="container mx-auto p-6 min-h-screen flex flex-col items-center">
      <h1 className="text-4xl font-bold text-center">Herramientas de Inversión</h1>
      <p className="text-lg text-center max-w-2xl mt-2">
        Descubre herramientas para evaluar inversiones inmobiliarias.
      </p>

      {/* Simulador de Rentabilidad */}
      <div className="mt-6 p-6 border rounded-lg shadow-md max-w-md w-full bg-white">
        <h2 className="text-xl font-semibold text-center">Calculadora de Rentabilidad</h2>
        <p className="text-sm text-gray-600 text-center mb-4">
          Ingresa tu inversión y calcula el retorno esperado.
        </p>

        <input
          type="number"
          placeholder="Monto de inversión ($)"
          className="mt-2 p-3 border rounded-md w-full text-center"
          aria-label="Monto de inversión"
          onChange={(e) => setInvestment(Number(e.target.value))}
        />

        <button
          className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 w-full transition-all"
          onClick={calculateROI}
        >
          Calcular ROI
        </button>

        {roi !== null && (
          <p className="mt-4 text-lg font-bold text-center">
            Retorno estimado: <span className="text-green-600">${roi.toFixed(2)}</span> anuales
          </p>
        )}
      </div>
    </div>
  );
};

export default InvestmentTools;
