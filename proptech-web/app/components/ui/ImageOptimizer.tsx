"use client";
import Image from 'next/image';
import { useState } from 'react';
import { HABITATPRO_IMAGES, getImageWithFallback } from '../../config/images';
import ImagePlaceholder, { HeroPlaceholder, LifestylePlaceholder, ProfessionalPlaceholder } from './ImagePlaceholder';

interface ImageOptimizerProps {
  category: keyof typeof HABITATPRO_IMAGES;
  type: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  quality?: number;
}

export default function ImageOptimizer({ 
  category, 
  type, 
  alt, 
  className = "",
  priority = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  quality = 85
}: ImageOptimizerProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const imageSrc = getImageWithFallback(category, type);
  const fallbackSrc = getImageWithFallback(category, 'fallback');
  
  const handleError = () => {
    setImageError(true);
  };

  const handleLoad = () => {
    setImageLoaded(true);
  };

  // Si hay error o la imagen no se ha cargado, mostrar placeholder
  if (imageError || !imageLoaded) {
    const placeholderProps = {
      category,
      type,
      className,
      alt
    };

    switch (category) {
      case 'hero':
        return <HeroPlaceholder {...placeholderProps} type={type} />;
      case 'lifestyle':
        return <LifestylePlaceholder {...placeholderProps} type={type} />;
      case 'professionals':
        return <ProfessionalPlaceholder {...placeholderProps} type={type} />;
      default:
        return <ImagePlaceholder {...placeholderProps} width={600} height={400} />;
    }
  }

  return (
    <Image
      src={imageError ? fallbackSrc : imageSrc}
      alt={alt}
      fill
      className={className}
      priority={priority}
      sizes={sizes}
      quality={quality}
      onError={handleError}
      onLoad={handleLoad}
      style={{
        objectFit: 'cover',
        objectPosition: 'center'
      }}
    />
  );
}

// 🎨 COMPONENTE ESPECÍFICO PARA HERO IMAGES
export function HeroImage({ 
  type = "main", 
  className = "",
  priority = true 
}: {
  type?: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <div className={`relative w-full h-96 md:h-[500px] lg:h-[600px] ${className}`}>
      <ImageOptimizer
        category="hero"
        type={type}
        alt="HabitatPro - Tu hogar ideal te espera"
        className="rounded-lg shadow-2xl"
        priority={priority}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
        quality={90}
      />
    </div>
  );
}

// 🏠 COMPONENTE ESPECÍFICO PARA LIFESTYLE IMAGES
export function LifestyleImage({ 
  type, 
  className = "",
  aspectRatio = "aspect-[3/2]"
}: {
  type: string;
  className?: string;
  aspectRatio?: string;
}) {
  return (
    <div className={`relative w-full ${aspectRatio} ${className}`}>
      <ImageOptimizer
        category="lifestyle"
        type={type}
        alt={`Lifestyle ${type} - HabitatPro`}
        className="rounded-lg shadow-lg"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        quality={85}
      />
    </div>
  );
}

// 👨‍💼 COMPONENTE ESPECÍFICO PARA PROFESSIONAL IMAGES
export function ProfessionalImage({ 
  type, 
  className = "",
  aspectRatio = "aspect-square"
}: {
  type: string;
  className?: string;
  aspectRatio?: string;
}) {
  return (
    <div className={`relative w-full ${aspectRatio} ${className}`}>
      <ImageOptimizer
        category="professionals"
        type={type}
        alt={`Professional ${type} - HabitatPro`}
        className="rounded-full shadow-lg"
        sizes="(max-width: 768px) 200px, (max-width: 1200px) 300px, 400px"
        quality={90}
      />
    </div>
  );
}
