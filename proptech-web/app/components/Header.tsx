"use client";

/**
 * Header Premium — HabitatPro Enterprise
 * -----------------------------------------------------
 * Objetivo:
 * - Mantener lógica y navegación existentes
 * - Aplicar diseño visual enterprise (paleta brand/accent, tipografía Inter)
 * - Preservar NotificationBell y responsive design
 * - A11y y focus states mejorados
 * - SEGURIDAD: Header condicional según autenticación
 */

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { NotificationBell } from "./notifications/NotificationBell";

export function Header() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const isAuthenticated = !!session?.user;
  const userRole = (session?.user as any)?.role;

  // 🔗 Navegación principal para usuarios públicos
  const publicNavItems = [
    { href: "/comprar", label: "Comprar", icon: "🏠" },
    { href: "/alquilar", label: "Alquilar", icon: "🔑" },
    { href: "/invertir", label: "Invertir", icon: "💹" },
    { href: "/vender", label: "Vender", icon: "📈" },
  ];

  // 🔗 Navegación para usuarios autenticados (agregar items adicionales)
  const authenticatedNavItems = [
    ...publicNavItems,
    { href: "/profile", label: "Mi cuenta", icon: "👤" },
    { href: "/dashboard/favorites", label: "Favoritos", icon: "❤️" },
  ];

  // 🔗 Navegación para admins (agregar link a Admin)
  const adminNavItems = [
    ...publicNavItems,
    { href: "/admin", label: "Admin", icon: "⚙️" },
    { href: "/profile", label: "Mi cuenta", icon: "👤" },
  ];

  // Determinar qué items mostrar según autenticación y rol
  let navItems = publicNavItems;
  if (isAuthenticated) {
    if (userRole === "admin" || userRole === "super_admin") {
      navItems = adminNavItems;
    } else {
      navItems = authenticatedNavItems;
    }
  }

  return (
    <header
      className="
        sticky top-0 z-50
        bg-white/90 backdrop-blur
        border-b border-gray-100
        shadow-[0_1px_4px_rgba(15,23,42,0.04)]
      "
    >
      {/* CONTENEDOR PRINCIPAL */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* LOGO + BRAND */}
          <Link
            href="/"
            className="flex items-center gap-2"
            aria-label="HabitatPro — Inicio"
          >
            <Image
              src="/images/Logo.png"
              alt="HabitatPro logo"
              width={32}
              height={32}
              className="rounded-2xl shadow-soft"
              priority
            />
            <span className="text-lg sm:text-xl font-extrabold tracking-tight text-ink-900">
              HabitatPro
            </span>
          </Link>

          {/* NAVEGACIÓN DESKTOP */}
          <nav className="hidden md:flex items-center gap-6 text-sm">
            {navItems.map(({ href, label }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`px-3 py-2 rounded-md font-medium transition-colors ${
                    active
                      ? "text-brand-700 bg-brand-50 shadow-inner"
                      : "text-ink-600 hover:text-ink-900 hover:bg-gray-50"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* CTA + NOTIFICATION */}
          <div className="flex items-center gap-4">
            {isAuthenticated && <NotificationBell />}
            {!isAuthenticated ? (
              <>
                <Link
                  href="/auth/signin"
                  className="
                    inline-flex items-center justify-center
                    px-4 py-2 rounded-2xl text-sm font-semibold
                    text-ink-700 hover:text-ink-900
                    transition-colors
                  "
                >
                  Iniciar sesión
                </Link>
                <Link
                  href="/auth/register"
                  className="
                    inline-flex items-center justify-center
                    px-4 py-2 rounded-2xl text-sm font-semibold
                    text-white bg-brand-600 hover:bg-brand-700
                    shadow-soft transition-colors
                  "
                >
                  Registrarse
                </Link>
              </>
            ) : (
              <Link
                href="/contacto"
                className="
                  inline-flex items-center justify-center
                  px-4 py-2 rounded-2xl text-sm font-semibold
                  text-white bg-brand-600 hover:bg-brand-700
                  shadow-soft transition-colors
                "
              >
                Contactar
              </Link>
            )}
          </div>
        </div>

        {/* NAVEGACIÓN MÓVIL */}
        <div className="md:hidden pb-3 border-t border-gray-100 mt-1">
          <nav className="grid grid-cols-2 gap-2 pt-3">
            {navItems.map(({ href, label, icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center justify-center gap-1 rounded-2xl px-3 py-2 text-sm font-medium text-center transition-colors ${
                    active
                      ? "bg-brand-50 text-brand-700"
                      : "text-ink-600 hover:text-ink-900 hover:bg-gray-50"
                  }`}
                >
                  <span>{icon}</span>
                  <span>{label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}