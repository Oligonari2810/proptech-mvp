import React from "react";

const TokenBanner = () => {
  return (
    <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white text-center p-6 rounded-lg shadow-lg w-full sm:w-2/3">
      <h2 className="text-2xl font-bold">🚀 Tokenización de Propiedades Próximamente</h2>
      <p className="text-lg mt-2">
        Invierte desde USD $10,000 en propiedades de lujo utilizando criptomonedas o dinero fiat.
      </p>
      <a
        href="/tokenizacion"
        className="mt-4 inline-block bg-white text-blue-500 px-6 py-2 rounded-lg hover:bg-gray-100"
      >
        Conoce Más
      </a>
    </div>
  );
};

export default TokenBanner;
