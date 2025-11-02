'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

interface MegamenuTriggerProps {
  title: string;
  href: string;
  isActive: boolean;
  onHover: () => void;
  onMouseLeave?: () => void;
  badge?: string;
  icon?: string;
}

export function MegamenuTrigger({
  title,
  href,
  isActive,
  onHover,
  onMouseLeave,
  badge,
  icon
}: MegamenuTriggerProps) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseLeave = () => {
    // Delay para permitir movimiento al megamenú
    if (onMouseLeave) {
      timeoutRef.current = setTimeout(() => {
        onMouseLeave();
        timeoutRef.current = null;
      }, 300);
    }
  };

  const handleMouseEnter = () => {
    // Cancelar timeout si el mouse vuelve al trigger
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    onHover();
  };

  useEffect(() => {
    return () => {
      // Limpiar timeout al desmontar
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        href={href}
        className={`
          group flex items-center gap-1 px-3 py-2 rounded-md font-medium text-sm transition-all duration-200
          ${isActive
            ? 'text-blue-700 bg-blue-50'
            : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
          }
        `}
      >
        {icon && <span className="text-base">{icon}</span>}
        <span>{title}</span>
        {badge && (
          <span className="ml-1 px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded">
            {badge}
          </span>
        )}
        <ChevronDown
          className={`
            w-4 h-4 transition-transform duration-200
            ${isActive ? 'rotate-180 text-blue-700' : 'text-gray-400 group-hover:text-blue-600'}
          `}
        />
      </Link>
      
      {/* Active Indicator */}
      {isActive && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full" />
      )}
    </div>
  );
}

