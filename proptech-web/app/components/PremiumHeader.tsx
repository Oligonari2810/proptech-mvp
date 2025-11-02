'use client';

/**
 * PremiumHeader — Navegación Top-Tier con Megamenús
 * -----------------------------------------------------
 * Características:
 * - Megamenús interactivos por categoría (Comprar, Alquilar, Vender)
 * - Estados hover/active mejorados con animaciones
 * - Logo premium con gradiente
 * - Mobile navigation optimizada
 * - Badges de contadores (inventory en tiempo real)
 * - Integración completa con herramientas legales
 */

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Menu, X, Calculator } from 'lucide-react';
import { NotificationBell } from './notifications/NotificationBell';
import { UserDropdown } from './UserDropdown';
import { MegamenuTrigger } from './navigation/MegamenuTrigger';
import { NavLink } from './navigation/NavLink';
import { Megamenu } from './navigation/Megamenu';
import { MobileMenu } from './navigation/MobileMenu';
import { compraMegamenu, alquilerMegamenu, venderMegamenu } from './navigation/megamenuData';

export function PremiumHeader() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isAuthenticated = !!session?.user;
  const userRole = (session?.user as any)?.role;

  const [activeMegamenu, setActiveMegamenu] = useState<'comprar' | 'alquilar' | 'vender' | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // Navegación principal
  const publicNavItems = [
    { href: '/invertir', label: 'Invertir', icon: '💹' },
  ];

  const legalNavItems = [
    { href: '/calculadora-impuestos', label: 'Calculadora', icon: '🧮' },
    { href: '/leyes-inmobiliarias', label: 'Leyes RD', icon: '📚' },
    { href: '/tramites-inmobiliarios', label: 'Trámites', icon: '🧭' },
    { href: '/confotur', label: 'CONFOTUR', icon: '🏖️' },
  ];

  const handleMegamenuHover = (type: 'comprar' | 'alquilar' | 'vender') => {
    // Cancelar timeout de cierre si existe
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setActiveMegamenu(type);
  };

  const handleMegamenuClose = () => {
    // Limpiar timeout anterior si existe
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Crear timeout con delay aumentado para permitir movimiento al megamenú
    timeoutRef.current = setTimeout(() => {
      setActiveMegamenu(null);
      timeoutRef.current = null;
    }, 300); // Reducido a 300ms pero más confiable
  };

  const handleMegamenuMouseLeave = () => {
    // Cuando el mouse sale del trigger, iniciar el timeout de cierre
    // Pero si el mouse entra al megamenú antes, se cancelará
    handleMegamenuClose();
  };

  const getCurrentMegamenu = () => {
    switch (activeMegamenu) {
      case 'comprar':
        return compraMegamenu;
      case 'alquilar':
        return alquilerMegamenu;
      case 'vender':
        return venderMegamenu;
      default:
        return null;
    }
  };

  const currentMegamenu = getCurrentMegamenu();

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Navigation Bar */}
        <div className="flex items-center justify-between h-16">
          {/* Logo + Brand */}
          <Link
            href="/"
            className="flex items-center space-x-3 group"
            aria-label="HabitatPro — Inicio"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <span className="text-white font-bold text-lg">H</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent hidden sm:block">
              HabitatPro
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav 
            className="hidden lg:flex items-center space-x-1"
            onMouseLeave={(e) => {
              // Solo cerrar si no estamos moviéndonos hacia el megamenú
              // Verificar que el mouse no está yendo hacia el megamenú
              const relatedTarget = e.relatedTarget as HTMLElement;
              if (activeMegamenu && relatedTarget && !relatedTarget.closest('.megamenu-container')) {
                // El mouse salió del nav y no está yendo al megamenú
                handleMegamenuClose();
              }
            }}
          >
            {/* Comprar con Megamenu */}
            <MegamenuTrigger
              title="Comprar"
              href="/comprar"
              icon="🏠"
              isActive={activeMegamenu === 'comprar' || pathname.startsWith('/comprar')}
              onHover={() => handleMegamenuHover('comprar')}
              onMouseLeave={handleMegamenuMouseLeave}
              badge="500+"
            />

            {/* Alquilar con Megamenu */}
            <MegamenuTrigger
              title="Alquilar"
              href="/alquilar"
              icon="🔑"
              isActive={activeMegamenu === 'alquilar' || pathname.startsWith('/alquilar')}
              onHover={() => handleMegamenuHover('alquilar')}
              onMouseLeave={handleMegamenuMouseLeave}
              badge="200+"
            />

            {/* Vender con Megamenu */}
            <MegamenuTrigger
              title="Vender"
              href="/vender"
              icon="📈"
              isActive={activeMegamenu === 'vender' || pathname.startsWith('/vender') || pathname === '/valorar'}
              onHover={() => handleMegamenuHover('vender')}
              onMouseLeave={handleMegamenuMouseLeave}
            />

            {/* Otros enlaces simples */}
            {publicNavItems.map((item) => (
              <NavLink key={item.href} href={item.href} icon={item.icon}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Right Side: CTA + User */}
          <div className="flex items-center space-x-3">
            {/* Calculadora Button */}
            <Link
              href="/calculadora-impuestos"
              className="hidden md:flex items-center justify-center w-10 h-10 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              aria-label="Calculadora de Impuestos"
            >
              <Calculator className="w-5 h-5" />
            </Link>

            {/* Notification Bell */}
            {isAuthenticated && <NotificationBell />}

            {/* Auth Buttons / User Dropdown */}
            {!isAuthenticated ? (
              <>
                <Link
                  href="/auth/signin"
                  className="hidden md:inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-semibold text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                >
                  Iniciar sesión
                </Link>
                <Link
                  href="/auth/register"
                  className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-sm hover:shadow-md transition-all"
                >
                  Publicar Propiedad
                </Link>
              </>
            ) : (
              <UserDropdown
                userEmail={session?.user?.email || undefined}
                userName={session?.user?.name || undefined}
                userRole={userRole}
                avatarUrl={(session?.user as any)?.image || (session?.user as any)?.avatar_url || undefined}
              />
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white">
            <MobileMenu
              navItems={[
                { href: '/comprar', label: 'Comprar', icon: '🏠' },
                { href: '/alquilar', label: 'Alquilar', icon: '🔑' },
                { href: '/vender', label: 'Vender', icon: '📈' },
                ...publicNavItems,
              ]}
              legalItems={legalNavItems}
              isAuthenticated={isAuthenticated}
              onClose={() => setMobileMenuOpen(false)}
            />
          </div>
        )}
      </div>

      {/* Megamenu Dropdown - FUERA del contenedor para full-width */}
      {activeMegamenu && currentMegamenu && (
        <div 
          className="fixed left-0 right-0 z-[60] relative"
          style={{ top: '64px' }} // Altura del header (h-16 = 64px)
          onMouseEnter={() => {
            // Cancelar cierre cuando mouse entra en la zona del megamenú o conexión
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
              timeoutRef.current = null;
            }
          }}
          onMouseLeave={(e) => {
            // Verificar que el mouse realmente salió (no está yendo a otro elemento del megamenú)
            const relatedTarget = e.relatedTarget as HTMLElement;
            if (!relatedTarget || !relatedTarget.closest('.megamenu-container')) {
              // El mouse salió completamente del área del megamenú
              handleMegamenuClose();
            }
          }}
        >
          {/* Zona de conexión continua más grande entre trigger y megamenú */}
          {/* Esta zona invisible conecta el header con el megamenú para evitar gaps */}
          <div 
            className="h-12 bg-transparent pointer-events-auto absolute left-0 right-0"
            style={{ 
              top: '-12px', // Conectar con el header (64px - 12px = 52px desde el top del megamenú)
              zIndex: 1000 // Asegurar que está por encima
            }}
            onMouseEnter={() => {
              // Cancelar cierre en la zona de conexión - CRÍTICO
              if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
              }
            }}
            onMouseLeave={() => {
              // Si el mouse sale de la zona de conexión sin entrar al megamenú, iniciar cierre
              // Pero solo si no está entrando al megamenú
            }}
          />
          <Megamenu
            type={activeMegamenu}
            featuredItems={currentMegamenu.featuredItems}
            categories={currentMegamenu.categories}
            tools={currentMegamenu.tools}
            onClose={handleMegamenuClose}
          />
        </div>
      )}
    </header>
  );
}

