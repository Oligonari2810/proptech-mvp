// Configuración de tiers para Featured Listings

import { ListingTierConfig, ListingTier } from './types';

export const listingTiers: ListingTierConfig[] = [
  {
    tier: 'basic',
    name: 'Básico',
    description: 'Listado estándar sin beneficios especiales',
    pricePerWeek: 0,
    durationWeeks: 1,
    features: [
      'Listado en búsquedas',
      'Página de detalle'
    ],
    badges: {
      text: '',
      color: 'gray',
      icon: ''
    },
    benefits: {
      homepage: false,
      searchTop: false,
      badge: false,
      analytics: false,
      emailMarketing: false,
      pushNotifications: false
    }
  },
  {
    tier: 'featured',
    name: 'Destacado',
    description: 'Mayor visibilidad en búsquedas y homepage',
    pricePerWeek: 2999, // RD$ 2,999/semana (~$50 USD)
    durationWeeks: 1,
    features: [
      'Badge "Destacado" visible',
      'Prioridad en búsquedas',
      'Aparece en sección destacados homepage',
      'Analytics básicos'
    ],
    badges: {
      text: '⭐ Destacado',
      color: 'blue',
      icon: '⭐'
    },
    benefits: {
      homepage: true,
      searchTop: true,
      badge: true,
      analytics: true,
      emailMarketing: false,
      pushNotifications: false
    }
  },
  {
    tier: 'premium',
    name: 'Premium',
    description: 'Máxima visibilidad con herramientas avanzadas',
    pricePerWeek: 5999, // RD$ 5,999/semana (~$100 USD)
    durationWeeks: 1,
    features: [
      'Badge "Premium" dorado',
      'Top de búsquedas (siempre primero)',
      'Sección destacados homepage (prioridad)',
      'Analytics avanzados',
      'Email marketing incluido',
      'Push notifications'
    ],
    badges: {
      text: '👑 Premium',
      color: 'gold',
      icon: '👑'
    },
    benefits: {
      homepage: true,
      searchTop: true,
      badge: true,
      analytics: true,
      emailMarketing: true,
      pushNotifications: true
    }
  },
  {
    tier: 'platinum',
    name: 'Platinum',
    description: 'Experiencia VIP con todas las herramientas',
    pricePerWeek: 9999, // RD$ 9,999/semana (~$165 USD)
    durationWeeks: 1,
    features: [
      'Badge "Platinum" exclusivo',
      'Top absoluto de búsquedas',
      'Slider principal homepage',
      'Analytics premium + reportes',
      'Email marketing prioritario',
      'Push notifications prioritarias',
      'Soporte dedicado',
      'Destacado en newsletter'
    ],
    badges: {
      text: '💎 Platinum',
      color: 'purple',
      icon: '💎'
    },
    benefits: {
      homepage: true,
      searchTop: true,
      badge: true,
      analytics: true,
      emailMarketing: true,
      pushNotifications: true
    }
  }
];

export function getTierConfig(tier: ListingTier): ListingTierConfig | undefined {
  return listingTiers.find(t => t.tier === tier);
}

export function calculatePrice(tier: ListingTier, weeks: number): number {
  const tierConfig = getTierConfig(tier);
  if (!tierConfig) return 0;
  return tierConfig.pricePerWeek * weeks;
}

export function getFeaturedBadge(tier: ListingTier): { text: string; color: string; icon: string } | null {
  const tierConfig = getTierConfig(tier);
  if (!tierConfig || tier === 'basic') return null;
  return tierConfig.badges;
}

