"use client";

import { useState, useEffect } from "react";
import axios from "axios";

const InvestmentTools = () => {
  const [investment, setInvestment] = useState<number | null>(null);
  const [roi, setRoi] = useState<number | null>(null);
  const [tasacion, setTasacion] = useState<number | null>(null);
  const [propertyData, setPropertyData] = useState({
    metros_cuadrados: "",
    habitaciones: "",
    banos: "",
    antiguedad: "",
    precio_zona: "",
    infraestructura: "",
    seguridad: "",
    tendencia_mercado: "",
    anios_futuro: "",
    tipo: "casa",
  });

  useEffect(() => {
    setRoi(null);
  }, [investment]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPropertyData({ ...propertyData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post<{ valor_estimado: number }>("http://127.0.0.1:5000/api/valuation", propertyData);
      setTasacion(response.data.valor_estimado);
    } catch (error) {
      console.error("Error en la tasación", error);
    }
  };

  const calculateROI = () => {
    if (investment === null || tasacion === null || investment <= 0) {
      setRoi(null);
      return;
    }
    setRoi(((tasacion - investment) / investment) * 100);
  };

  return (
    <div className="container mx-auto p-6 min-h-screen flex flex-col items-center">
      <h1 className="text-4xl font-bold text-center">Herramientas de Inversión</h1>
      <p className="text-lg text-center max-w-2xl mt-2">Descubre herramientas para evaluar inversiones inmobiliarias.</p>

      <div className="mt-6 p-6 border rounded-lg shadow-md max-w-md w-full bg-white">
        <h2 className="text-xl font-semibold text-center">Calculadora de Rentabilidad</h2>
        <p className="text-sm text-gray-600 text-center mb-4">Ingresa tu inversión y calcula el retorno esperado basado en la tasación.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {["metros_cuadrados", "habitaciones", "banos", "antiguedad", "precio_zona", "infraestructura", "seguridad", "tendencia_mercado", "anios_futuro"].map((field, index) => (
            <div key={index}>
              <label className="block text-gray-700 font-semibold">{field.replace("_", " ").toUpperCase()}</label>
              <select name={field} onChange={handleChange} required className="p-2 border rounded-md w-full">
                <option value="">Seleccione...</option>
                {[...Array(11).keys()].map((value) => (
                  <option key={value} value={value}>{value}</option>
                ))}
              </select>
            </div>
          ))}
          <label className="block text-gray-700 font-semibold">TIPO DE PROPIEDAD</label>
          <select name="tipo" onChange={handleChange} required className="p-2 border rounded-md w-full">
            <option value="casa">🏠 Casa</option>
            <option value="apartamento">🏢 Apartamento</option>
            <option value="comercial">🏬 Comercial</option>
          </select>
          <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 w-full">Obtener Tasación</button>
        </form>

        {tasacion !== null && (
          <div className="mt-4">
            <h3 className="text-xl text-center">Valor estimado: ${tasacion.toFixed(2)}</h3>
            <input type="number" placeholder="Monto de inversión ($)" className="mt-4 p-3 border rounded-md w-full text-center" onChange={(e) => setInvestment(Number(e.target.value))} />
            <button className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 w-full" onClick={calculateROI}>Calcular ROI</button>
            {roi !== null && <p className="mt-4 text-lg font-bold text-center">Retorno estimado: <span className="text-green-600">{roi.toFixed(2)}%</span></p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default InvestmentTools;