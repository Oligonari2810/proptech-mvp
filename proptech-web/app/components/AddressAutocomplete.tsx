'use client';

import { useState, useEffect, useRef } from 'react';

interface AddressAutocompleteProps {
  value: string;
  onChange: (address: string, coordinates?: { lat: number; lng: number }) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  country?: string; // Restringir a país específico
}

export function AddressAutocomplete({
  value,
  onChange,
  placeholder = 'Buscar dirección...',
  required = false,
  className = '',
  country = 'do', // República Dominicana por defecto
}: AddressAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const autocompleteServiceRef = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesServiceRef = useRef<google.maps.places.PlacesService | null>(null);

  // Inicializar Google Places API
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;
    
    if (!apiKey) {
      console.warn('Google Places API key no configurada. El autocompletado no funcionará.');
      return;
    }

    // Cargar script de Google Maps si no está cargado
    if (typeof window !== 'undefined' && !window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&language=es&region=${country}`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        if (window.google?.maps?.places) {
          autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();
          const mapDiv = document.createElement('div');
          placesServiceRef.current = new window.google.maps.places.PlacesService(mapDiv);
        }
      };
      
      document.head.appendChild(script);
    } else if (window.google?.maps?.places) {
      // Si ya está cargado, inicializar directamente
      autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();
      const mapDiv = document.createElement('div');
      placesServiceRef.current = new window.google.maps.places.PlacesService(mapDiv);
    }

    return () => {
      // Cleanup si es necesario
    };
  }, [country]);

  // Obtener sugerencias de autocompletado
  const getSuggestions = (input: string) => {
    if (!autocompleteServiceRef.current || input.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setLoading(true);

    const request: google.maps.places.AutocompletionRequest = {
      input,
      componentRestrictions: country ? { country: country.toUpperCase() } : undefined,
      language: 'es',
      types: ['address'], // Solo direcciones
    };

    autocompleteServiceRef.current.getPlacePredictions(request, (predictions, status) => {
      setLoading(false);
      
      if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
        const addresses = predictions.map(p => p.description);
        setSuggestions(addresses);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    });
  };

  // Obtener detalles completos de una dirección (incluyendo coordenadas)
  const getPlaceDetails = (address: string, callback: (address: string, coords?: { lat: number; lng: number }) => void) => {
    if (!placesServiceRef.current) {
      callback(address);
      return;
    }

    // Buscar place_id desde las sugerencias o hacer una nueva búsqueda
    const request: google.maps.places.FindPlaceFromQueryRequest = {
      query: address,
      fields: ['place_id', 'geometry', 'formatted_address'],
    };

    // Usar Geocoder como alternativa más confiable
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address, region: country.toUpperCase() }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        const location = results[0].geometry.location;
        callback(results[0].formatted_address, {
          lat: location.lat(),
          lng: location.lng(),
        });
      } else {
        callback(address);
      }
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    onChange(inputValue);
    getSuggestions(inputValue);
  };

  const handleSelectSuggestion = (address: string) => {
    onChange(address);
    setShowSuggestions(false);
    
    // Obtener coordenadas
    getPlaceDetails(address, (fullAddress, coords) => {
      onChange(fullAddress, coords);
    });
  };

  // Cerrar sugerencias al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fallback si Google Places no está disponible
  const baseClassName = `w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`;

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleInputChange}
        onFocus={() => value.length >= 3 && setShowSuggestions(true)}
        placeholder={placeholder}
        required={required}
        className={baseClassName}
        autoComplete="off"
      />
      
      {loading && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
        </div>
      )}

      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSelectSuggestion(suggestion)}
              className="w-full text-left px-4 py-2 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-colors"
            >
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-sm text-gray-700">{suggestion}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Declarar tipos globales para TypeScript
declare global {
  interface Window {
    google?: {
      maps: {
        places: {
          AutocompleteService: new () => google.maps.places.AutocompleteService;
          PlacesService: new (element: HTMLElement) => google.maps.places.PlacesService;
          PlacesServiceStatus: {
            OK: string;
            ZERO_RESULTS: string;
            [key: string]: string;
          };
        };
        Geocoder: new () => google.maps.Geocoder;
        GeocoderStatus: {
          OK: string;
          [key: string]: string;
        };
      };
    };
  }
}

