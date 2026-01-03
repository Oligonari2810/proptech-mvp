'use client';

import { useState } from 'react';
import { Play, Pause, RotateCcw, Maximize2, X } from 'lucide-react';

interface VirtualTourProps {
  propertyId: number;
  tourUrl?: string; // URL de tour 360° (Matterport, Google Street View, etc.)
  videos?: string[]; // URLs de videos walkthrough
  images?: string[]; // Imágenes para tour básico
  className?: string;
}

export function VirtualTour({ 
  propertyId, 
  tourUrl, 
  videos = [], 
  images = [],
  className = ''
}: VirtualTourProps) {
  const [currentView, setCurrentView] = useState<'tour' | 'video' | 'images'>('tour');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Si hay tour URL (Matterport), mostrarlo
  if (tourUrl && currentView === 'tour') {
    return (
      <div className={`relative w-full h-[500px] rounded-lg overflow-hidden bg-gray-900 ${className}`}>
        <iframe
          src={tourUrl}
          className="w-full h-full"
          allow="fullscreen; vr"
          title={`Virtual Tour - Property ${propertyId}`}
        />
        <div className="absolute top-4 right-4 flex gap-2 z-10">
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="bg-white/90 hover:bg-white text-gray-900 rounded-lg p-2 transition-colors"
            aria-label="Pantalla completa"
          >
            {isFullscreen ? <X size={20} /> : <Maximize2 size={20} />}
          </button>
        </div>
      </div>
    );
  }

  // Si hay videos, mostrar reproductor de video
  if (videos.length > 0 && currentView === 'video') {
    return (
      <div className={`relative w-full h-[500px] rounded-lg overflow-hidden bg-gray-900 ${className}`}>
        <video
          src={videos[currentVideoIndex]}
          controls
          className="w-full h-full object-cover"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
        {videos.length > 1 && (
          <div className="absolute bottom-4 left-4 right-4 flex gap-2 overflow-x-auto">
            {videos.map((video, index) => (
              <button
                key={index}
                onClick={() => setCurrentVideoIndex(index)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  index === currentVideoIndex
                    ? 'bg-brand-600 text-white'
                    : 'bg-white/90 text-gray-900 hover:bg-white'
                }`}
              >
                Video {index + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Tour básico con imágenes 360°
  if (images.length > 0 && currentView === 'images') {
    return (
      <div className={`relative w-full h-[500px] rounded-lg overflow-hidden bg-gray-900 ${className}`}>
        <div className="relative w-full h-full">
          <img
            src={images[currentImageIndex]}
            alt={`Tour 360° - Imagen ${currentImageIndex + 1}`}
            className="w-full h-full object-cover"
          />
          {images.length > 1 && (
            <>
              <button
                onClick={() => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 rounded-full p-2 transition-colors"
                aria-label="Imagen anterior"
              >
                ←
              </button>
              <button
                onClick={() => setCurrentImageIndex((prev) => (prev + 1) % images.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 rounded-full p-2 transition-colors"
                aria-label="Siguiente imagen"
              >
                →
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                    aria-label={`Ir a imagen ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // Estado vacío - mostrar opciones para subir tours
  return (
    <div className={`relative w-full h-[500px] rounded-lg overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center ${className}`}>
      <div className="text-center p-6">
        <RotateCcw size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Tour Virtual No Disponible</h3>
        <p className="text-sm text-gray-500 mb-4">
          Esta propiedad no tiene tour virtual configurado.
        </p>
        <div className="flex gap-2 justify-center">
          <button className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-sm font-medium transition-colors">
            Solicitar Tour 360°
          </button>
          <button className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm font-medium transition-colors">
            Subir Video Walkthrough
          </button>
        </div>
      </div>
    </div>
  );
}

// Componente para selector de tipo de tour
export function VirtualTourSelector({ 
  propertyId,
  onTourTypeSelect 
}: { 
  propertyId: number;
  onTourTypeSelect: (type: 'matterport' | 'video' | 'images') => void;
}) {
  return (
    <div className="flex gap-2 mb-4 p-2 bg-gray-50 rounded-lg">
      <button
        onClick={() => onTourTypeSelect('matterport')}
        className="px-4 py-2 bg-white hover:bg-gray-100 text-gray-700 rounded-lg text-sm font-medium transition-colors border border-gray-200"
      >
        Tour 360° Matterport
      </button>
      <button
        onClick={() => onTourTypeSelect('video')}
        className="px-4 py-2 bg-white hover:bg-gray-100 text-gray-700 rounded-lg text-sm font-medium transition-colors border border-gray-200"
      >
        Video Walkthrough
      </button>
      <button
        onClick={() => onTourTypeSelect('images')}
        className="px-4 py-2 bg-white hover:bg-gray-100 text-gray-700 rounded-lg text-sm font-medium transition-colors border border-gray-200"
      >
        Galería 360°
      </button>
    </div>
  );
}

