/** @type {import('next').NextConfig} */
const nextConfig = {
  // experimental: {
  //   appDir: true,  // Si este genera error, elimínalo temporalmente
  // },
  reactStrictMode: true,
  output: 'standalone', // Esto es clave para que funcione en Vercel
};

module.exports = nextConfig;