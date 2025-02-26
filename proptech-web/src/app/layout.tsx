import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'HábitatProRD',
  description: 'Tu plataforma inmobiliaria innovadora',
};

import { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <head>
        {/* ✅ Forzando favicon */}
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        
        {/* ✅ Otros metadatos útiles */}
        <meta name="theme-color" content="#ffffff" />
        <meta property="og:title" content="HábitatProRD" />
        <meta property="og:description" content="Tu plataforma inmobiliaria innovadora" />
        <meta property="og:image" content="/images/Logo.png" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
