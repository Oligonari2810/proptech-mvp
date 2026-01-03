import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const isDev = process.env.NODE_ENV !== 'production'
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || ''
  const backendOrigin = (() => {
    try {
      return backendUrl ? new URL(backendUrl).origin : ''
    } catch {
      return ''
    }
  })()

  // Security Headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')

  // CSP
  const csp = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.vercel-insights.com https://api.mapbox.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://api.mapbox.com;
    img-src 'self' blob: data: https: https://api.mapbox.com https://*.tiles.mapbox.com;
    font-src 'self' https://fonts.gstatic.com https://api.mapbox.com;
    connect-src 'self' https://proptech-mvp-1.onrender.com ${backendOrigin} ${isDev ? 'http://localhost:8000 http://127.0.0.1:8000' : ''} https://api.mapbox.com https://events.mapbox.com https://*.tiles.mapbox.com;
    worker-src 'self' blob:;
    child-src 'self' blob:;
    frame-src 'none';
    base-uri 'self';
    form-action 'self';
  `.replace(/\s{2,}/g, ' ').trim()

  response.headers.set('Content-Security-Policy', csp)

  return response
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
