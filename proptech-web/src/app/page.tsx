import Logo from "@/components/Logo";
import ClientButtons from "@/components/ClientButtons";

export default function Home() {
  return (
    <div
      className="relative min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: "url('/images/tokenizacion-bg.png')", // 🎯 Nueva imagen de fondo
      }}
    >
      {/* 📡 Overlay Oscuro para Resaltar Contenido */}
      <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <main className="text-center text-white space-y-6">
          {/* 🎉 Logo Centrado */}
          <Logo />
          
          {/* 📝 Mensaje Principal */}
          <h1 className="text-5xl font-bold">
            Automatiza la Venta y Tokenización de Propiedades en 7 Días
          </h1>
          <p className="text-lg text-gray-200 max-w-lg mx-auto">
            Invierte desde USD $10,000 en propiedades tokenizadas utilizando criptomonedas o dinero fiat.
          </p>

          {/* 🚀 Botón Principal */}
          <a
            href="/tokenizacion"
            className="bg-blue-500 text-white px-8 py-3 rounded-lg shadow-lg hover:bg-blue-700"
          >
            Conoce Más
          </a>

          {/* 📢 Beneficios Destacados */}
          <div className="mt-8 flex flex-wrap justify-center gap-8">
            <div className="p-4 bg-white bg-opacity-20 rounded-lg shadow-md w-60">
              <h4 className="text-xl font-bold">🔗 Tokenización Segura</h4>
              <p className="text-sm">Invierte en propiedades de lujo fraccionadas desde USD $10,000.</p>
            </div>
            <div className="p-4 bg-white bg-opacity-20 rounded-lg shadow-md w-60">
              <h4 className="text-xl font-bold">⚡️ Automatización Total</h4>
              <p className="text-sm">Publica, tokeniza y vende propiedades sin esfuerzo.</p>
            </div>
            <div className="p-4 bg-white bg-opacity-20 rounded-lg shadow-md w-60">
              <h4 className="text-xl font-bold">📈 Rentabilidad Garantizada</h4>
              <p className="text-sm">Obtén retornos anuales con propiedades tokenizadas.</p>
            </div>
          </div>

          {/* 🟢 Botones Secundarios */}
          <div className="mt-8">
            <ClientButtons />
          </div>
        </main>
      </div>
    </div>
  );
}
