/**
 * Google Analytics 4 Helper Functions
 */

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';

// Pageview tracking
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag && GA_MEASUREMENT_ID) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

// Event tracking
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window !== 'undefined' && window.gtag && GA_MEASUREMENT_ID) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Custom events específicos de HabitatPro
export const trackEmotionalSearch = (query: string) => {
  event({
    action: 'busqueda_ia_emocional',
    category: 'IA Emocional',
    label: query,
  });
};

export const trackCalculatorUsed = (calculatorType: 'tax' | 'mortgage') => {
  event({
    action: 'calculadora_usada',
    category: 'Herramientas',
    label: calculatorType === 'tax' ? 'Impuestos' : 'Hipotecaria',
  });
};

export const trackBrokerContact = (brokerId: number) => {
  event({
    action: 'contacto_broker',
    category: 'Conversión',
    label: `broker_${brokerId}`,
  });
};

export const trackFeaturedListingClick = (listingId: number, tier: string) => {
  event({
    action: 'featured_listing_click',
    category: 'Monetización',
    label: `listing_${listingId}_${tier}`,
  });
};

export const trackPropertyViewFromIA = (propertyId: number) => {
  event({
    action: 'propiedad_vista_desde_ia',
    category: 'IA Emocional',
    label: `property_${propertyId}`,
  });
};

