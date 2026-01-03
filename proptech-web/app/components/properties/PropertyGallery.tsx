'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';

interface PropertyGalleryProps {
  images: string[];
  title?: string;
  alt?: string;
}

export default function PropertyGallery({ images, title = 'Propiedad', alt }: PropertyGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Si no hay imágenes, usar placeholder
  const displayImages = images && images.length > 0 
    ? images 
    : ['https://via.placeholder.com/800x600?text=Sin+imagen'];

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % displayImages.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  // Navegación con teclado
  useEffect(() => {
    if (!lightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') setLightboxIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
      if (e.key === 'ArrowRight') setLightboxIndex((prev) => (prev + 1) % displayImages.length);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, displayImages.length]);

  return (
    <>
      <div className="space-y-4">
        {/* Imagen principal */}
        <div className="relative aspect-[16/9] w-full rounded-lg overflow-hidden bg-gray-100 group cursor-pointer" onClick={() => openLightbox(currentIndex)}>
          <Image
            src={displayImages[currentIndex]}
            alt={alt || `${title} - Imagen ${currentIndex + 1}`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
            unoptimized={displayImages[currentIndex]?.startsWith('https://via.placeholder')}
          />
          
          {/* Overlay con zoom icon */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <ZoomIn className="text-white w-12 h-12" />
          </div>

          {/* Controles de navegación */}
          {displayImages.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevSlide();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                aria-label="Imagen anterior"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextSlide();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                aria-label="Imagen siguiente"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Contador de imágenes */}
          {displayImages.length > 1 && (
            <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
              {currentIndex + 1} / {displayImages.length}
            </div>
          )}
        </div>

        {/* Thumbnails */}
        {displayImages.length > 1 && (
          <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
            {displayImages.map((image, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                  index === currentIndex
                    ? 'border-indigo-600 ring-2 ring-indigo-300'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Image
                  src={image}
                  alt={`${title} thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 25vw, 150px"
                  unoptimized={image?.startsWith('https://via.placeholder')}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
            aria-label="Cerrar"
          >
            <X className="w-8 h-8" />
          </button>

          <div className="relative max-w-7xl max-h-full" onClick={(e) => e.stopPropagation()}>
            <Image
              src={displayImages[lightboxIndex]}
              alt={alt || `${title} - Vista ampliada ${lightboxIndex + 1}`}
              width={1200}
              height={800}
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
              unoptimized={displayImages[lightboxIndex]?.startsWith('https://via.placeholder')}
            />

            {/* Navegación en lightbox */}
            {displayImages.length > 1 && (
              <>
                <button
                  onClick={() => setLightboxIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all"
                  aria-label="Anterior"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  onClick={() => setLightboxIndex((prev) => (prev + 1) % displayImages.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all"
                  aria-label="Siguiente"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full">
                  {lightboxIndex + 1} / {displayImages.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

