'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

interface EmotionalSuggestionsProps {
  suggestions: string[];
  onSuggestionClick: (suggestion: string) => void;
  isLoading?: boolean;
}

const DEFAULT_SUGGESTIONS = [
  'hogar tranquilo para mi familia',
  'apartamento vibrante para joven profesional',
  'casa acogedora para retiro',
  'inversión con buen rendimiento',
  'propiedad familiar con jardín',
  'apartamento moderno para trabajar desde casa'
];

export function EmotionalSuggestions({ 
  suggestions = DEFAULT_SUGGESTIONS, 
  onSuggestionClick,
  isLoading = false 
}: EmotionalSuggestionsProps) {
  const displaySuggestions = suggestions.length > 0 ? suggestions : DEFAULT_SUGGESTIONS;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Sparkles className="w-4 h-4 text-amber-500" />
        <span className="font-medium">Sugerencias de búsqueda:</span>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {displaySuggestions.slice(0, 6).map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSuggestionClick(suggestion)}
            disabled={isLoading}
            className="px-3 py-2 text-sm bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-full text-gray-700 hover:text-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}

