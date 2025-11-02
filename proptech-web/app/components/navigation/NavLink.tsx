'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavLinkProps {
  href: string;
  icon?: string;
  children: React.ReactNode;
  badge?: string;
  className?: string;
}

export function NavLink({ href, icon, children, badge, className = '' }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`
        group flex items-center gap-1.5 px-3 py-2 rounded-md font-medium text-sm transition-all duration-200 relative
        ${isActive
          ? 'text-blue-700 bg-blue-50'
          : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
        }
        ${className}
      `}
    >
      {icon && <span className="text-base">{icon}</span>}
      <span>{children}</span>
      {badge && (
        <span className="ml-1 px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded">
          {badge}
        </span>
      )}
      
      {/* Active Indicator */}
      {isActive && (
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full" />
      )}
    </Link>
  );
}

