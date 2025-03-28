import Logo from "@/components/Logo";
import TokenBanner from "@/components/TokenBanner"; // 🎯 Nuevo banner para tokenización
import ClientButtons from "@/components/ClientButtons";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        {/* ✅ Logo Central */}
        <Logo />
        
        {/* 🎯 Nuevo Mensaje Enfocado en Tokenización */}
        <h1 className="text-4xl font-bold text-center sm:text-left">
          Automatiza la Venta y Tokenización de Propiedades en 7 Días
        </h1>
        <p className="text-lg text-center sm:text-left text-gray-700">
          HábitatProRD transforma el mercado inmobiliario con tecnología avanzada para brokers e inversionistas.
        </p>

        {/* 🚀 Nuevo Banner de Tokenización */}
        <TokenBanner />

        {/* 🟢 Botones de Registro para Brokers/Inmobiliarias/Desarrolladores */}
        <ClientButtons />

        {/* 📢 Footer con enlaces adicionales */}
        <footer className="flex gap-6 flex-wrap items-center justify-center mt-10">
          <a href="/about" className="text-blue-500 hover:underline">Acerca de HábitatProRD</a>
          <a href="/contact" className="text-blue-500 hover:underline">Contáctanos</a>
          <a href="/guide" className="text-blue-500 hover:underline">Guía de Inversión</a>
          <a href="/tokenizacion" className="text-blue-500 hover:underline">Tokenización</a>
        </footer>
      </main>
    </div>
  );
}
