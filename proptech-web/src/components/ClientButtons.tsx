"use client"; // 🔥 Esto lo convierte en un Client Component

import Button from "@/components/Button";

export default function ClientButtons() {
  const handleViewProperties = () => {
    alert("Ver Propiedades");
  };

  const handleInvestmentTools = () => {
    alert("Herramientas de Inversión");
  };

  return (
    <div className="flex gap-4 items-center flex-col sm:flex-row">
      <Button
        text="Ver Propiedades"
        className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600"
        onClick={handleViewProperties}
      />
      <Button
        text="Herramientas de Inversión"
        className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600"
        onClick={handleInvestmentTools}
      />
    </div>
  );
}
