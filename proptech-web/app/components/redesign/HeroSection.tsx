'use client';

import React from 'react';
import Image from 'next/image';
import Button from './Button';

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  imageUrl?: string;
}

export default function HeroSection({
  title = "Donde las llaves abren más que puertas, abren sueños",
  subtitle = "La inteligencia artificial que siente lo que necesitas, combinada con el calor humano que mereces en cada paso",
  imageUrl = "/images/hero/hero_family_livingroom_16x9.jpg"
}: HeroSectionProps) {
  return (
    <section className="relative h-[85vh] min-h-[600px] w-full overflow-hidden">
      {/* Imagen de fondo */}
      <div className="absolute inset-0">
        <Image
          src={imageUrl}
          alt="Familia feliz en hogar moderno"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        {/* Overlay gradiente */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
      </div>

      {/* Contenido */}
      <div className="relative z-10 h-full flex flex-col justify-end">
        <div className="container mx-auto px-4 pb-16 md:pb-24">
          <div className="max-w-3xl">
            <h1 className="text-display text-white mb-6 drop-shadow-lg">
              {title}
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl drop-shadow-md">
              {subtitle}
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Button size="lg" variant="primary">
                Encontrar mi hogar
              </Button>
              <Button size="lg" variant="outline" className="bg-white/10 border-white text-white hover:bg-white hover:text-dark-green">
                Explorar propiedades
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}

