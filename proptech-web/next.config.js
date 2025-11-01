/** @type {import('next').NextConfig} */
const nextConfig = {
  // Variables de entorno
  env: {
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL || 'https://proptech-mvp-1.onrender.com',
    NEXT_PUBLIC_GOOGLE_PLACES_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY || '',
    NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '',
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
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live https://api.mapbox.com https://maps.googleapis.com; " +
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://api.mapbox.com; " +
              "font-src 'self' 'unsafe-inline' data: blob: https://fonts.gstatic.com https://api.mapbox.com https://*.mapbox.com; " +
              "img-src 'self' data: blob: https://*.mapbox.com https://images.unsplash.com https:; " +
              "connect-src 'self' https://proptech-mvp-1.onrender.com https://*.mapbox.com https://*.tiles.mapbox.com https://events.mapbox.com https://maps.googleapis.com wss://*.vercel.live; " +
              "worker-src 'self' blob:; " +
              "child-src 'self' blob:; " +
              "frame-src 'self';"
          }
        ]
      }
    ]
  },
};

module.exports = nextConfig;