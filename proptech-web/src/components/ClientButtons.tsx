"use client"; // 🔥 Esto lo convierte en un Client Component

import Button from "@/components/Button";

export default function ClientButtons() {
  return (
    <div className="flex gap-4 items-center flex-col sm:flex-row">
      <Button
        text="Ver Propiedades"
        className="bg-green-500 text-white"
        onClick={() => alert("Ver Propiedades")}
      />
      <Button
        text="Herramientas de Inversión"
        className="bg-blue-500 text-white"
        onClick={() => alert("Herramientas de Inversión")}
      />
    </div>
  );
}
