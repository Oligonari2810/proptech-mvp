import Logo from "@/components/Logo";
import Banner from "@/components/Banner";
import ClientButtons from "@/components/ClientButtons"; // ✅ Nuevo Client Component

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Logo />
        <h1 className="text-4xl font-bold">Bienvenido a HábitatProRD</h1>
        <p>Encuentra propiedades, haz estimaciones y toma decisiones de inversión inteligentes.</p>
        <Banner />
        <ClientButtons /> {/* ✅ Nuevo Client Component */}
        <footer className="flex gap-6 flex-wrap items-center justify-center mt-10">
          <a href="/about" className="text-blue-500">Acerca de HábitatProRD</a>
          <a href="/contact" className="text-blue-500">Contáctanos</a>
          <a href="/guide" className="text-blue-500">Guía de Inversión</a>
        </footer>
      </main>
    </div>
  );
}
