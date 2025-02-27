/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  images: {
    domains: ["localhost", "proptech-mvp-1.onrender.com"], // Asegurar carga de imágenes externas
  },
  eslint: {
    ignoreDuringBuilds: true, // ✅ Evita errores de ESLint en el despliegue
  },
};

module.exports = nextConfig;