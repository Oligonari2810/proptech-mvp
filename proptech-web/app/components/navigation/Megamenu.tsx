'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface MegamenuItem {
  name: string;
  href: string;
  count?: string;
  featured?: boolean;
  trending?: boolean;
}

interface MegamenuCategory {
  title: string;
  links: MegamenuItem[];
}

interface MegamenuProps {
  type: 'comprar' | 'alquilar' | 'vender';
  featuredItems: MegamenuItem[];
  categories: MegamenuCategory[];
  tools: MegamenuCategory[];
  onClose: () => void;
}

export function Megamenu({ type, featuredItems, categories, tools, onClose }: MegamenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      // Limpiar timeout si existe
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [onClose]);

  // Manejar mouse enter en megamenú
  const handleMegamenuEnter = () => {
    // Cancelar cualquier timeout de cierre - CRÍTICO para mantener abierto
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  // Manejar mouse leave del megamenú con delay
  const handleMegamenuLeave = () => {
    // Limpiar timeout anterior si existe
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Crear timeout con delay de 400ms antes de cerrar
    // Esto permite que el usuario regrese al megamenú si se fue accidentalmente
    timeoutRef.current = setTimeout(() => {
      onClose();
      timeoutRef.current = null;
    }, 400);
  };

  return (
    <div
      ref={menuRef}
      className="megamenu-container bg-white border-b border-gray-200 shadow-xl z-[60] animate-in slide-in-from-top-2 duration-300 relative"
      onMouseEnter={handleMegamenuEnter}
      onMouseLeave={handleMegamenuLeave}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Featured Items */}
          <div className="lg:col-span-1">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Destacados
            </h3>
            <div className="space-y-3">
              {featuredItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  onClick={onClose}
                  className="group block p-3 rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-gray-900 group-hover:text-blue-600">
                          {item.name}
                        </span>
                        {item.trending && (
                          <span className="px-1.5 py-0.5 bg-orange-100 text-orange-700 text-xs font-semibold rounded">
                            🔥
                          </span>
                        )}
                        {item.featured && (
                          <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded">
                            ⭐
                          </span>
                        )}
                      </div>
                      {item.count && (
                        <p className="text-xs text-gray-500">{item.count}</p>
                      )}
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
            {categories.map((category, index) => (
              <div key={index}>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                  {category.title}
                </h3>
                <ul className="space-y-2">
                  {category.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link
                        href={link.href}
                        onClick={onClose}
                        className="group flex items-center justify-between py-2 text-sm text-gray-700 hover:text-blue-600 transition-colors"
                      >
                        <span>{link.name}</span>
                        <div className="flex items-center gap-2">
                          {link.count && (
                            <span className="text-xs text-gray-500 group-hover:text-blue-600">
                              {link.count}
                            </span>
                          )}
                          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-all" />
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Tools */}
          <div className="lg:col-span-1">
            {tools.map((toolCategory, index) => (
              <div key={index}>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                  {toolCategory.title}
                </h3>
                <ul className="space-y-2">
                  {toolCategory.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link
                        href={link.href}
                        onClick={onClose}
                        className="group flex items-center gap-2 py-2 text-sm text-gray-700 hover:text-blue-600 transition-colors"
                      >
                        <span>{link.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

