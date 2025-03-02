import Link from "next/link";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "HábitatProRD",
  description: "Tu plataforma inmobiliaria innovadora",
};

import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <meta property="og:title" content="HábitatProRD" />
        <meta property="og:description" content="Tu plataforma inmobiliaria innovadora" />
      </head>
      <body className={inter.className}>
        {/* 🔹 Agregamos un header con la navegación */}
        <header className="bg-blue-600 text-white p-4">
          <nav className="flex justify-center space-x-6">
            <Link href="/">Inicio</Link>
            <Link href="/properties">Propiedades</Link>
            <Link href="/services">Servicios</Link> {/* 🔥 Enlace a la página de servicios */}
            <Link href="/contact">Contacto</Link>
          </nav>
        </header>

        <main className="container mx-auto p-6">{children}</main>
      </body>
    </html>
  );
}
