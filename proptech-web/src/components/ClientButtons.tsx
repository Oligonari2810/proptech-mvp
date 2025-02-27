"use client"; // 🔥 Esto lo convierte en un Client Component

import { useRouter } from "next/navigation";
import Button from "@/components/Button";

export default function ClientButtons() {
  const router = useRouter(); // ✅ Hook de Next.js para manejar navegación

  return (
    <div className="flex flex-wrap gap-4 justify-center items-center text-center mt-6">
      <Button
        text="Explorar Propiedades"
        className="bg-blue-500 text-white hover:bg-blue-600"
        onClick={() => router.push("/properties")}
      />
      <Button
        text="Mis Favoritos"
        className="bg-yellow-500 text-white hover:bg-yellow-600"
        onClick={() => router.push("/favorites")}
      />
      <Button
        text="Solicitar Tasación"
        className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600"
        onClick={() => router.push("/appraisal")} // 🔥 Revisa que la ruta esté bien escrita
      />
      <Button
        text="Herramientas de Inversión"
        className="bg-indigo-500 text-white hover:bg-indigo-600"
        onClick={() => router.push("/investment-tools")}
      />
      <Button
        text="Acerca de HábitatProRD"
        className="bg-gray-500 text-white hover:bg-gray-600"
        onClick={() => router.push("/about")}
      />
      <Button
        text="Contáctanos"
        className="bg-red-500 text-white hover:bg-red-600"
        onClick={() => router.push("/contact")}
      />
    </div>
  );
}
