/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone", // Permite mejor compatibilidad con Vercel
  compiler: {
    styledComponents: true, // ✅ Agregado para mejor compatibilidad con estilos
  },
};

module.exports = nextConfig;