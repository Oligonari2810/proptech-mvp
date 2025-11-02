import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import 'mapbox-gl/dist/mapbox-gl.css'
import { PremiumHeader } from './components/PremiumHeader'
import { FrontendMonitoring } from './components/Monitoring'
import { SessionProviderWrapper } from './providers/SessionProviderWrapper'
import { generateHomepageSchemas } from '../lib/seo/schemaExtended'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'HabitatPro RD - Plataforma Inmobiliaria con IA Emocional | Propiedades República Dominicana',
  description: 'Encuentra tu propiedad ideal en RD con IA emocional. Calculadoras hipotecarias, asesoría legal CONFOTUR y sistema de reputación verificada. La plataforma inmobiliaria más completa de República Dominicana.',
  keywords: 'propiedades república dominicana, casas en venta santo domingo, apartamentos alquiler capital rd, inmobiliarias dominicanas, calculadora hipotecaria bancos rd, impuestos compra propiedad rd, ley confotur inversión extranjera',
  openGraph: {
    title: 'HabitatPro RD - Plataforma Inmobiliaria con IA Emocional',
    description: 'Encuentra tu propiedad ideal en República Dominicana con IA emocional y herramientas legales completas',
    url: 'https://habitatprord.com',
    siteName: 'HabitatPro RD',
    locale: 'es_DO',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HabitatPro RD - Plataforma Inmobiliaria con IA',
    description: 'Encuentra tu propiedad ideal en RD con IA emocional',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const schemas = generateHomepageSchemas()
  
  return (
    <html lang="es-DO">
      <head>
        <link rel="canonical" href="https://habitatprord.com" />
        <link rel="alternate" hrefLang="es" href="https://habitatprord.com" />
        <link rel="alternate" hrefLang="es-DO" href="https://habitatprord.com" />
        <link rel="alternate" hrefLang="x-default" href="https://habitatprord.com" />
        {/* Schema Markup: Organization, RealEstateAgent, WebSite */}
        {schemas.map((schema, index) => (
          <script
            key={index}
            type="application/ld+json"
            suppressHydrationWarning
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
      </head>
      <body className={inter.className}>
        <SessionProviderWrapper>
          <FrontendMonitoring />
          <a href="#main-content" className="skip-link">
            Saltar al contenido principal
          </a>
          <PremiumHeader />
          <main id="main-content">
            {children}
          </main>
        </SessionProviderWrapper>
      </body>
    </html>
  )
}
