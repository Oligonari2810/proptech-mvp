"use client";

import { useState } from "react";
import axios from "axios";

export default function AppraisalRequest() {
  const [formData, setFormData] = useState({
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
  const [tasacion, setTasacion] = useState<number | null>(null);

  /**
   * Interface representing the form data for an appraisal.
   */
  interface FormData {
    metros_cuadrados: string;
    habitaciones: string;
    banos: string;
    antiguedad: string;
    precio_zona: string;
    infraestructura: string;
    seguridad: string;
    tendencia_mercado: string;
    anios_futuro: string;
    tipo: string;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:5000/api/valuation", formData);
      setTasacion((response.data as { valor_estimado: number }).valor_estimado);
    } catch (error) {
      console.error("Error al solicitar la tasación", error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold">Solicitar Tasación</h1>
      <p className="text-lg">Ingresa los detalles de tu propiedad para obtener una tasación estimada.</p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <input type="number" name="metros_cuadrados" placeholder="Metros cuadrados" onChange={handleChange} required />
        <input type="number" name="habitaciones" placeholder="Habitaciones" onChange={handleChange} required />
        <input type="number" name="banos" placeholder="Baños" onChange={handleChange} required />
        <input type="number" name="antiguedad" placeholder="Antigüedad (años)" onChange={handleChange} required />
        <input type="number" name="precio_zona" placeholder="Precio por m² en la zona" onChange={handleChange} required />
        <input type="number" name="infraestructura" placeholder="Nivel de infraestructura (0-10)" onChange={handleChange} required />
        <input type="number" name="seguridad" placeholder="Nivel de seguridad (1-5)" onChange={handleChange} required />
        <input type="number" step="0.01" name="tendencia_mercado" placeholder="Tendencia del mercado (-0.05 a 0.05)" onChange={handleChange} required />
        <input type="number" name="anios_futuro" placeholder="Años a predecir" onChange={handleChange} required />
        <select name="tipo" onChange={handleChange} required>
          <option value="casa">Casa</option>
          <option value="apartamento">Apartamento</option>
          <option value="comercial">Comercial</option>
        </select>
        <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
          Obtener Tasación
        </button>
      </form>
      {tasacion && <h3 className="mt-4 text-xl">Valor estimado: ${tasacion.toFixed(2)}</h3>}
    </div>
  );
}
