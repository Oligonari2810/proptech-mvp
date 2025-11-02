/**
 * Google Analytics 4 (gtag) utilities
 * Helper functions for tracking pageviews and events
 */

// Google Analytics Measurement ID from environment variables
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';

/**
 * Track pageviews
 * https://developers.google.com/analytics/devguides/collection/gtagjs/pages
 */
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && GA_TRACKING_ID && (window as any).gtag) {
    (window as any).gtag('config', GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

/**
 * Track custom events
 * https://developers.google.com/analytics/devguides/collection/gtagjs/events
 */
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label: string;
  value?: number;
}) => {
  if (typeof window !== 'undefined' && GA_TRACKING_ID && (window as any).gtag) {
    (window as any).gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

/**
 * Track property views
 */
export const trackPropertyView = (propertyId: string, propertyTitle: string) => {
  event({
    action: 'view_property',
    category: 'engagement',
    label: propertyTitle,
    value: parseInt(propertyId) || 0,
  });
};

/**
 * Track search events
 */
export const trackSearch = (searchTerm: string, resultsCount: number) => {
  event({
    action: 'search',
    category: 'engagement',
    label: searchTerm,
    value: resultsCount,
  });
};

/**
 * Track calculator usage
 */
export const trackCalculator = (calculatorType: string) => {
  event({
    action: 'use_calculator',
    category: 'engagement',
    label: calculatorType,
  });
};

/**
 * Track form submissions
 */
export const trackFormSubmit = (formType: string) => {
  event({
    action: 'submit_form',
    category: 'conversion',
    label: formType,
  });
};

