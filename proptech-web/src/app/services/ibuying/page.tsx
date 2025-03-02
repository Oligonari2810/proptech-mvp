"use client";

import { useState } from "react";

export default function iBuyingPage() {
  const [property, setProperty] = useState({
    address: "",
    price: "",
    condition: "good",
    urgency: "normal",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setProperty({
      ...property,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Tu solicitud ha sido enviada. Nuestro equipo evaluará la oferta.");
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">⚡ Venta Rápida con iBuying</h1>
      <p className="mb-4">Vende tu propiedad en solo 7 días con nuestra oferta instantánea.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input 
          type="text" 
          name="address" 
          placeholder="Dirección de la propiedad" 
          value={property.address} 
          onChange={handleChange} 
          className="w-full p-2 border rounded"
          required 
        />
        <input 
          type="number" 
          name="price" 
          placeholder="Precio estimado" 
          value={property.price} 
          onChange={handleChange} 
          className="w-full p-2 border rounded"
          required 
        />
        <select name="condition" value={property.condition} onChange={handleChange} className="w-full p-2 border rounded">
          <option value="good">Buen estado</option>
          <option value="needs_repair">Necesita reparaciones</option>
          <option value="bad">Mal estado</option>
        </select>
        <select name="urgency" value={property.urgency} onChange={handleChange} className="w-full p-2 border rounded">
          <option value="normal">Sin prisa</option>
          <option value="fast">Quiero vender en menos de 30 días</option>
          <option value="urgent">Necesito vender ya</option>
        </select>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Obtener Oferta</button>
      </form>
    </div>
  );
}
