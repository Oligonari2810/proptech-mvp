"use client"; // 🔥 Esto lo convierte en un Client Component

import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import { useEffect } from "react";

export default function ClientButtons() {
  const router = useRouter(); // ✅ Hook de Next.js para manejar navegación

  // Prefetch de rutas para mejorar velocidad de navegación
  useEffect(() => {
    router.prefetch("/properties");
    router.prefetch("/favorites");
    router.prefetch("/appraisal");
    router.prefetch("/investment-tools");
    router.prefetch("/about");
    router.prefetch("/contact");
  }, [router]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 justify-center items-center text-center mt-6">
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
        className="bg-green-500 text-white hover:bg-green-600"
        onClick={() => router.push("/appraisal")} // 🔥 Revisado: ruta corregida
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
