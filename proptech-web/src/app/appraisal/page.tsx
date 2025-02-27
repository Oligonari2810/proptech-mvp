"use client";

import { useState } from "react";

const AppraisalRequest = () => {
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Solicitud enviada para: ${address}`);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold">Solicitar Tasación</h1>
      <p className="text-lg">Completa el formulario para solicitar una tasación de tu propiedad.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <input
          type="text"
          placeholder="Dirección de la propiedad"
          className="p-2 border rounded-md w-full"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
        <textarea
          placeholder="Detalles adicionales"
          className="p-2 border rounded-md w-full"
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          Enviar Solicitud
        </button>
      </form>
    </div>
  );
};

export default AppraisalRequest;
