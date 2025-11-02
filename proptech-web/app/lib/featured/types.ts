// Tipos para sistema de Featured Listings

export type ListingTier = 'basic' | 'featured' | 'premium' | 'platinum';

export interface FeaturedListing {
  id: number;
  propertyId: number;
  tier: ListingTier;
  startDate: string;
  endDate: string;
  isActive: boolean;
  priority?: number; // Para ordenamiento (1 = más prioritario)
  createdAt: string;
  updatedAt?: string;
}

export interface ListingTierConfig {
  tier: ListingTier;
  name: string;
  description: string;
  pricePerWeek: number; // En RD$
  durationWeeks: number;
  features: string[];
  badges: {
    text: string;
    color: string;
    icon: string;
  };
  benefits: {
    homepage: boolean;
    searchTop: boolean;
    badge: boolean;
    analytics: boolean;
    emailMarketing: boolean;
    pushNotifications: boolean;
  };
}

export interface FeaturedListingAnalytics {
  listingId: number;
  propertyId: number;
  views: number;
  clicks: number;
  inquiries: number;
  favorites: number;
  conversionRate: number; // Inquiries / Views
  startDate: string;
  endDate: string;
}

