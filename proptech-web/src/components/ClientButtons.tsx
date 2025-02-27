"use client"; // 🔥 Esto lo convierte en un Client Component

import { useRouter } from "next/navigation";
import Button from "@/components/Button";

export default function ClientButtons() {
  const router = useRouter(); // ✅ Hook de Next.js para manejar navegación

  return (
    <div className="flex gap-4 items-center flex-wrap justify-center">
      <Button
        text="Explorar Propiedades"
        className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600"
        onClick={() => router.push("/properties")} // 🔥 Redirige a /properties
      />
      <Button
        text="Mis Favoritos"
        className="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-yellow-600"
        onClick={() => router.push("/favorites")} // 🔥 Redirige a /favorites
      />
      <Button
        text="Solicitar Tasación"
        className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600"
        onClick={() => router.push("/appraisal")} // 🔥 Redirige a /appraisal
      />
      <Button
        text="Herramientas de Inversión"
        className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600"
        onClick={() => router.push("/investment-tools")} // 🔥 Redirige a /investment-tools
      />
    </div>
  );
}

