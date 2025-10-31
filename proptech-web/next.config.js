/** @type {import('next').NextConfig} */
const nextConfig = {
  // Variables de entorno
  env: {
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL || 'https://proptech-mvp-1.onrender.com',
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
    domains: ['habitatprord.com', 'proptech-mvp-1.onrender.com', 'picsum.photos', 'images.unsplash.com', 'localhost', '*.ngrok-free.dev', '*.ngrok.app'],
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
  
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: 
              "default-src 'self' https://proptech-mvp-1.onrender.com; " +
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live; " +
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
              "font-src 'self' 'unsafe-inline' data: https://fonts.gstatic.com https://api.mapbox.com; " +
              "img-src 'self' data: blob: https:; " +
              "connect-src 'self' https://proptech-mvp-1.onrender.com https://api.mapbox.com https://events.mapbox.com wss://*.vercel.live;"
          }
        ]
      }
    ]
  },
};

module.exports = nextConfig;