"use client";
import { useState } from 'react';

interface ImagePlaceholderProps {
  width: number;
  height: number;
  alt: string;
  className?: string;
  category: string;
  type: string;
}

export default function ImagePlaceholder({ 
  width, 
  height, 
  alt, 
  className = "",
  category,
  type
}: ImagePlaceholderProps) {
  const [loaded] = useState(false);
  
  const getPlaceholderContent = () => {
    const contents: Record<string, Record<string, { icon: string; title: string; color: string }>> = {
      hero: {
        main: { icon: '🏠', title: 'Hogar de Lujo', color: 'from-blue-500 to-purple-600' },
        alternative: { icon: '🌅', title: 'Villa Tropical', color: 'from-orange-400 to-pink-500' }
      },
      lifestyle: {
        kitchen: { icon: '🍳', title: 'Cocina Moderna', color: 'from-green-400 to-blue-500' },
        living: { icon: '🛋️', title: 'Sala Acogedora', color: 'from-purple-400 to-pink-500' },
        community: { icon: '🏘️', title: 'Comunidad', color: 'from-teal-400 to-green-500' }
      },
      professionals: {
        broker: { icon: '👨‍💼', title: 'Broker Profesional', color: 'from-indigo-500 to-purple-600' },
        team: { icon: '👥', title: 'Equipo', color: 'from-blue-500 to-indigo-600' }
      },
      dashboards: {
        admin: { icon: '📊', title: 'Dashboard Admin', color: 'from-gray-600 to-gray-800' }
      }
    };
    
    return contents[category]?.[type] || 
           { icon: '🖼️', title: 'Imagen Premium', color: 'from-gray-400 to-gray-600' };
  };

  const content = getPlaceholderContent();

  return (
    <div 
      className={`relative overflow-hidden rounded-lg ${className}`}
      style={{ width, height }}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${content.color} flex items-center justify-center`}>
        <div className="text-center text-white">
          <div className="text-6xl mb-4">{content.icon}</div>
          <h3 className="text-xl font-bold mb-2">{content.title}</h3>
          <p className="text-sm opacity-90">Imagen Premium</p>
          <p className="text-xs opacity-75 mt-2">{width}x{height}px</p>
        </div>
      </div>
      
      {/* Overlay de carga */}
      {!loaded && (
        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      )}
      
      {/* Texto de alt para accesibilidad */}
      <span className="sr-only">{alt}</span>
    </div>
  );
}

// 🎨 COMPONENTE ESPECÍFICO PARA HERO IMAGES
export function HeroPlaceholder({ 
  type = "main", 
  className = "",
  width = 1920,
  height = 1080
}: {
  type?: string;
  className?: string;
  width?: number;
  height?: number;
}) {
  return (
    <ImagePlaceholder
      width={width}
      height={height}
      alt="HabitatPro - Tu hogar ideal te espera"
      className={`rounded-lg shadow-2xl ${className}`}
      category="hero"
      type={type}
    />
  );
}

// 🏠 COMPONENTE ESPECÍFICO PARA LIFESTYLE IMAGES
export function LifestylePlaceholder({ 
  type, 
  className = "",
  width = 600,
  height = 400
}: {
  type: string;
  className?: string;
  width?: number;
  height?: number;
}) {
  return (
    <ImagePlaceholder
      width={width}
      height={height}
      alt={`Lifestyle ${type} - HabitatPro`}
      className={`rounded-lg shadow-lg ${className}`}
      category="lifestyle"
      type={type}
    />
  );
}

// 👨‍💼 COMPONENTE ESPECÍFICO PARA PROFESSIONAL IMAGES
export function ProfessionalPlaceholder({ 
  type, 
  className = "",
  width = 400,
  height = 400
}: {
  type: string;
  className?: string;
  width?: number;
  height?: number;
}) {
  return (
    <ImagePlaceholder
      width={width}
      height={height}
      alt={`Professional ${type} - HabitatPro`}
      className={`rounded-full shadow-lg ${className}`}
      category="professionals"
      type={type}
    />
  );
}
