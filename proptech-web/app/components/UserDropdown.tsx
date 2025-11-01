'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface UserDropdownProps {
  userEmail?: string;
  userName?: string;
  userRole?: string;
  avatarUrl?: string;
}

export function UserDropdown({ 
  userEmail, 
  userName, 
  userRole,
  avatarUrl 
}: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();
  const router = useRouter();

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut({ 
        redirect: false,
        callbackUrl: '/' 
      });
      router.push('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const isAdmin = userRole === 'admin' || userRole === 'super_admin';
  const displayName = userName || userEmail || 'Usuario';
  const initials = displayName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Botón Usuario */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="
          flex items-center gap-2
          px-3 py-2 rounded-xl
          text-sm font-medium
          text-ink-700 hover:text-ink-900
          hover:bg-gray-50
          transition-colors
          focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2
        "
        aria-label="Menú de usuario"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={displayName}
            width={32}
            height={32}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs font-semibold">
            {initials}
          </div>
        )}
        <span className="hidden md:inline">{displayName}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="
          absolute right-0 mt-2 w-56
          bg-white rounded-xl shadow-lg
          border border-gray-100
          py-2 z-50
          animate-in fade-in slide-in-from-top-2 duration-200
        ">
          {/* Header del dropdown */}
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-semibold text-ink-900">{displayName}</p>
            <p className="text-xs text-ink-500 truncate">{userEmail}</p>
            {isAdmin && (
              <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium text-brand-700 bg-brand-50 rounded-md">
                {userRole === 'super_admin' ? 'Super Admin' : 'Administrador'}
              </span>
            )}
          </div>

          {/* Opciones del menú */}
          <div className="py-1">
            <Link
              href="/profile"
              onClick={() => setIsOpen(false)}
              className="
                flex items-center gap-3 px-4 py-2
                text-sm text-ink-700 hover:bg-gray-50
                transition-colors
              "
            >
              <span>👤</span>
              <span>Mi perfil</span>
            </Link>

            <Link
              href="/dashboard/favorites"
              onClick={() => setIsOpen(false)}
              className="
                flex items-center gap-3 px-4 py-2
                text-sm text-ink-700 hover:bg-gray-50
                transition-colors
              "
            >
              <span>❤️</span>
              <span>Favoritos</span>
            </Link>

            <Link
              href="/properties?myProperties=true"
              onClick={() => setIsOpen(false)}
              className="
                flex items-center gap-3 px-4 py-2
                text-sm text-ink-700 hover:bg-gray-50
                transition-colors
              "
            >
              <span>🏠</span>
              <span>Mis propiedades</span>
            </Link>

            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className="
                  flex items-center gap-3 px-4 py-2
                  text-sm text-ink-700 hover:bg-gray-50
                  transition-colors
                  border-t border-gray-100 mt-1 pt-1
                "
              >
                <span>⚙️</span>
                <span>Panel Admin</span>
              </Link>
            )}

            <button
              onClick={handleSignOut}
              className="
                w-full flex items-center gap-3 px-4 py-2
                text-sm text-red-600 hover:bg-red-50
                transition-colors
                border-t border-gray-100 mt-1 pt-1
              "
            >
              <span>🚪</span>
              <span>Cerrar sesión</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
