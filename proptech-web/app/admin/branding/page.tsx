"use client";
import ThemeProvider from "@/app/components/white-label/ThemeProvider";
import BrandCustomizer from "@/app/components/white-label/BrandCustomizer";

export default function BrandingPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Personalización de Marca</h1>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white p-6 rounded-lg border">
          <h2 className="text-lg font-semibold mb-4">Editor de Tema</h2>
          <ThemeProvider>
            <div className="text-sm text-gray-600">Tema por defecto aplicado.</div>
          </ThemeProvider>
        </div>
        <div className="bg-white p-6 rounded-lg border">
          <h2 className="text-lg font-semibold mb-4">Personalizador de Marca</h2>
          <BrandCustomizer />
        </div>
      </div>
    </div>
  );
}


