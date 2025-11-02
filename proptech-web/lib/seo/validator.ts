/**
 * SEO Validator - Valida que las páginas tengan todos los elementos SEO necesarios
 */

export interface SEOValidationResult {
  hasTitle: boolean;
  hasMetaDescription: boolean;
  hasCanonical: boolean;
  hasSchema: boolean;
  hasOGTags: boolean;
  hasTwitterCard: boolean;
  score: number; // 0-100
  issues: string[];
  warnings: string[];
}

/**
 * Valida los elementos SEO de una página
 */
export function validateSEOPage(html: string): SEOValidationResult {
  const result: SEOValidationResult = {
    hasTitle: false,
    hasMetaDescription: false,
    hasCanonical: false,
    hasSchema: false,
    hasOGTags: false,
    hasTwitterCard: false,
    score: 0,
    issues: [],
    warnings: [],
  };

  // Verificar title tag
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (titleMatch) {
    result.hasTitle = true;
    const title = titleMatch[1].trim();
    if (title.length < 30 || title.length > 60) {
      result.warnings.push(`Title tag debería tener entre 30-60 caracteres (actual: ${title.length})`);
    }
  } else {
    result.issues.push('Falta tag <title>');
  }

  // Verificar meta description
  const metaDescMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["'][^>]*>/i);
  if (metaDescMatch) {
    result.hasMetaDescription = true;
    const desc = metaDescMatch[1].trim();
    if (desc.length < 120 || desc.length > 160) {
      result.warnings.push(`Meta description debería tener entre 120-160 caracteres (actual: ${desc.length})`);
    }
  } else {
    result.issues.push('Falta meta description');
  }

  // Verificar canonical
  const canonicalMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i);
  result.hasCanonical = !!canonicalMatch;
  if (!result.hasCanonical) {
    result.issues.push('Falta link canonical');
  }

  // Verificar schema markup
  const schemaMatch = html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>/i);
  result.hasSchema = !!schemaMatch;
  if (!result.hasSchema) {
    result.warnings.push('No se encontró schema markup');
  }

  // Verificar OpenGraph tags
  const ogTitleMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*>/i);
  const ogDescMatch = html.match(/<meta[^>]*property=["']og:description["'][^>]*>/i);
  result.hasOGTags = !!(ogTitleMatch && ogDescMatch);
  if (!result.hasOGTags) {
    result.warnings.push('Faltan tags OpenGraph');
  }

  // Verificar Twitter Card
  const twitterCardMatch = html.match(/<meta[^>]*name=["']twitter:card["'][^>]*>/i);
  result.hasTwitterCard = !!twitterCardMatch;
  if (!result.hasTwitterCard) {
    result.warnings.push('Falta Twitter Card');
  }

  // Calcular score
  let score = 0;
  if (result.hasTitle) score += 20;
  if (result.hasMetaDescription) score += 20;
  if (result.hasCanonical) score += 15;
  if (result.hasSchema) score += 20;
  if (result.hasOGTags) score += 15;
  if (result.hasTwitterCard) score += 10;
  result.score = score;

  return result;
}

/**
 * Valida Core Web Vitals (simulado - requiere herramientas externas)
 */
export async function validateCoreWebVitals(url: string): Promise<{
  lcp: number | null;
  fid: number | null;
  cls: number | null;
  score: 'good' | 'needs-improvement' | 'poor';
}> {
  // En producción, esto debería usar PageSpeed Insights API
  // Por ahora, devuelve estructura esperada
  return {
    lcp: null, // Largest Contentful Paint (debe ser < 2.5s)
    fid: null, // First Input Delay (debe ser < 100ms)
    cls: null, // Cumulative Layout Shift (debe ser < 0.1)
    score: 'good',
  };
}

