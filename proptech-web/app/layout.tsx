import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Header } from './components/Header'
import { generateOrganizationSchema } from '../lib/seo/schema'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'HabitatPro - Plataforma Inmobiliaria con IA Emocional',
  description: 'La plataforma inmobiliaria más avanzada con IA emocional para encontrar tu hogar perfecto',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const organizationSchema = generateOrganizationSchema()
  
  return (
    <html lang="es">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className={inter.className}>
        <Header />
        {children}
      </body>
    </html>
  )
}
