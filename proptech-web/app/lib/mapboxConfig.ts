/**
 * Configuración centralizada de Mapbox
 * Soluciona problemas de carga de token en cliente/producción
 */

declare global {
  interface Window {
    __MAPBOX_TOKEN__?: string;
  }
}

/**
 * Obtiene el token de Mapbox de forma confiable
 * Funciona tanto en servidor como cliente, desarrollo y producción
 */
export function getMapboxToken(): string {
  // En cliente, intentar múltiples fuentes
  if (typeof window !== 'undefined') {
    // 1. Variable global (si se setea manualmente)
    if (window.__MAPBOX_TOKEN__) {
      return window.__MAPBOX_TOKEN__;
    }
    
    // 2. Atributo data-* en HTML (útil para producción)
    const tokenFromHtml = document.querySelector('[data-mapbox-token]')?.getAttribute('data-mapbox-token');
    if (tokenFromHtml) {
      return tokenFromHtml;
    }
    
    // 3. Variable de entorno Next.js (solo si está en NEXT_PUBLIC_*)
    const envToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (envToken && envToken.length > 20) {
      return envToken;
    }
  }
  
  // 4. En servidor, usar env directamente
  if (typeof process !== 'undefined') {
    const serverToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (serverToken && serverToken.length > 20) {
      return serverToken;
    }
  }
  
  // 5. Sin fallback hardcodeado (evita exponer tokens en el repo)
  console.warn('⚠️ Token de Mapbox no configurado. Define NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN (o NEXT_PUBLIC_MAPBOX_TOKEN).');
  return '';
}

/**
 * Valida que un token de Mapbox tenga formato correcto
 */
export function isValidMapboxToken(token: string | null | undefined): boolean {
  if (!token) return false;
  if (token.length < 20) return false;
  if (!token.startsWith('pk.')) return false;
  return true;
}

/**
 * Configura el token de Mapbox globalmente (útil para inicialización)
 */
export function setMapboxTokenGlobal(token?: string): void {
  const finalToken = token || getMapboxToken();
  if (typeof window !== 'undefined') {
    window.__MAPBOX_TOKEN__ = finalToken;
  }
}

