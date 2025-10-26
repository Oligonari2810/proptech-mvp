// 🎨 CONFIGURACIÓN DE ASSETS VISUALES HABITATPRO
// Estructura preparada para integración con imágenes de Midjourney

export const HABITATPRO_IMAGES = {
  hero: {
    main: '/images/hero/hero_family_livingroom_16x9.webp',
    alternative: '/images/hero/tropical-villa-sunset.webp',
    fallback: '/images/Banner.jpg' // Imagen actual como respaldo
  },
  lifestyle: {
    kitchen: '/images/lifestyle/modern-kitchen-couple.webp',
    living: '/images/lifestyle/cozy-living-room-evening.webp', 
    community: '/images/lifestyle/community-amenities.webp',
    fallback: '/images/tokenizacion-bg.png'
  },
  professionals: {
    broker: '/images/professionals/broker-portrait.webp',
    team: '/images/professionals/team-meeting.webp',
    fallback: '/images/Logo.png'
  },
  dashboards: {
    admin: '/images/dashboards/admin-interface-preview.webp',
    fallback: '/images/Logo.png'
  }
}

// 🎯 TAMAÑOS OPTIMIZADOS PARA DIFERENTES USOS
export const IMAGE_SIZES = {
  hero: { width: 1920, height: 1080 }, // 16:9
  card: { width: 600, height: 400 },   // 3:2
  avatar: { width: 400, height: 400 }, // 1:1
  dashboard: { width: 1200, height: 800 } // 3:2
}

// 🚀 FUNCIÓN HELPER PARA CARGAR IMÁGENES CON FALLBACK
export const getImageWithFallback = (category: keyof typeof HABITATPRO_IMAGES, type: string) => {
  const categoryImages = HABITATPRO_IMAGES[category] as Record<string, string>
  return categoryImages[type] || categoryImages.fallback
}

// 📱 CONFIGURACIÓN RESPONSIVE
export const RESPONSIVE_IMAGES = {
  hero: {
    mobile: '/images/hero/family-home-luxury-mobile.webp',
    tablet: '/images/hero/family-home-luxury-tablet.webp',
    desktop: '/images/hero/family-home-luxury.webp'
  }
}
