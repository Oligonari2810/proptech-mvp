'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronRight } from 'lucide-react';

interface MobileMenuProps {
  navItems: Array<{ href: string; label: string; icon?: string }>;
  legalItems: Array<{ href: string; label: string; icon?: string }>;
  isAuthenticated: boolean;
  onClose: () => void;
}

export function MobileMenu({ navItems, legalItems, isAuthenticated, onClose }: MobileMenuProps) {
  const pathname = usePathname();
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="lg:hidden">
      <nav className="flex flex-col py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`
                flex items-center justify-between px-4 py-3 rounded-lg font-medium text-sm transition-colors
                ${isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                }
              `}
            >
              <div className="flex items-center gap-3">
                {item.icon && <span className="text-lg">{item.icon}</span>}
                <span>{item.label}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </Link>
          );
        })}

        {/* Legal Items */}
        {legalItems.length > 0 && (
          <div className="pt-4 border-t border-gray-200">
            {legalItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`
                    flex items-center justify-between px-4 py-3 rounded-lg font-medium text-sm transition-colors
                    ${isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    {item.icon && <span className="text-lg">{item.icon}</span>}
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </Link>
              );
            })}
          </div>
        )}
      </nav>
    </div>
  );
}

