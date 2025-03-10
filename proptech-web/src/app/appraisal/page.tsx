"use client";

import { useState } from "react";
import axios from "axios";

/**
 * Interface representing the form data for an appraisal.
 *
 * @interface AppraisalFormData
 * @property {string} metros_cuadrados - The square meters of the property.
 * @property {string} habitaciones - The number of rooms in the property.
 * @property {string} banos - The number of bathrooms in the property.
 * @property {string} antiguedad - The age of the property.
 * @property {string} precio_zona - The price of the area where the property is located.
 * @property {string} infraestructura - The infrastructure quality of the property.
 * @property {string} seguridad - The security level of the property.
 * @property {string} tendencia_mercado - The market trend related to the property.
 * @property {string} anios_futuro - The future years projection for the property.
 * @property {string} tipo - The type of the property.
 */
interface AppraisalFormData {
  metros_cuadrados: string;
  habitaciones: string;
  banos: string;
  antiguedad: string;
  precio_zona: string;
  infraestructura: string;
  seguridad: string;
  tendencia_mercado: string;
  anios_futuro: string;
    tipo: "casa" | "apartamento" | "comercial";
  }
export default function AppraisalRequest() {
  const [formData, setFormData] = useState<AppraisalFormData>({
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
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post<{ valor_estimado: number }>(
        "http://127.0.0.1:5000/api/valuation",
        formData
      );
      setTasacion(response.data.valor_estimado);
    } catch (error) {
      console.error("❌ Error al solicitar la tasación:", error);
      setError("Hubo un error al procesar la tasación. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-lg bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold text-center">📏 Solicitar Tasación</h1>
      <p className="text-lg text-center text-gray-600 mb-4">
        Ingresa los detalles de tu propiedad para obtener una tasación estimada.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="number"
          name="metros_cuadrados"
          placeholder="Metros cuadrados"
          onChange={handleChange}
          required
          className="p-2 border rounded-md w-full"
        />
        <input
          type="number"
          name="habitaciones"
          placeholder="Habitaciones"
          onChange={handleChange}
          required
          className="p-2 border rounded-md w-full"
        />
        <input
          type="number"
          name="banos"
          placeholder="Baños"
          onChange={handleChange}
          required
          className="p-2 border rounded-md w-full"
        />
        <input
          type="number"
          name="antiguedad"
          placeholder="Antigüedad (años)"
          onChange={handleChange}
          required
          className="p-2 border rounded-md w-full"
        />
        <input
          type="number"
          name="precio_zona"
          placeholder="Precio por m² en la zona"
          onChange={handleChange}
          required
          className="p-2 border rounded-md w-full"
        />
        <input
          type="number"
          name="infraestructura"
          placeholder="Nivel de infraestructura (0-10)"
          onChange={handleChange}
          required
          className="p-2 border rounded-md w-full"
        />
        <input
          type="number"
          name="seguridad"
          placeholder="Nivel de seguridad (1-5)"
          onChange={handleChange}
          required
          className="p-2 border rounded-md w-full"
        />
        <input
          type="number"
          step="0.01"
          name="tendencia_mercado"
          placeholder="Tendencia del mercado (-0.05 a 0.05)"
          onChange={handleChange}
          required
          className="p-2 border rounded-md w-full"
        />
        <input
          type="number"
          name="anios_futuro"
          placeholder="Años a predecir"
          onChange={handleChange}
          required
          className="p-2 border rounded-md w-full"
        />
        <select
          name="tipo"
          onChange={handleChange}
          required
          className="p-2 border rounded-md w-full"
        >
          <option value="casa">🏠 Casa</option>
          <option value="apartamento">🏢 Apartamento</option>
          <option value="comercial">🏬 Comercial</option>
        </select>
        <button
          type="submit"
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 w-full transition-all"
          disabled={loading}
        >
          {loading ? "Cargando..." : "📊 Obtener Tasación"}
        </button>
      </form>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {tasacion !== null && (
        <div className="mt-4 text-center">
          <h3 className="text-xl font-bold text-gray-800">
            💰 Valor estimado: ${tasacion.toFixed(2)}
          </h3>
        </div>
      )}
    </div>
  );
}
