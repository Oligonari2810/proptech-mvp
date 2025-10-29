/** @type {import('next').NextConfig} */
const nextConfig = {
  // Variables de entorno
  env: {
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL || 'https://habitatpro-backend.onrender.com',
  },
  
  reactStrictMode: true,
  output: "standalone",
  compress: true,
  poweredByHeader: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  images: {
    formats: ['image/webp', 'image/avif'],
    domains: ['habitatprord.com', 'habitatpro-backend.onrender.com', 'picsum.photos', 'images.unsplash.com', 'localhost', '*.ngrok-free.dev', '*.ngrok.app'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.ngrok-free.dev",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.ngrok.app",
        pathname: "/**",
      },
    ],
  },
  
  experimental: {
    scrollRestoration: true,
  },
};

module.exports = nextConfig;