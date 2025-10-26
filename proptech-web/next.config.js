/** @type {import('next').NextConfig} */
const nextConfig = {
  // Variables de entorno
  env: {
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000',
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
    domains: ['localhost', '*.ngrok-free.dev', '*.ngrok.app'],
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