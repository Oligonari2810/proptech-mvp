'use client';

import React from 'react';
import { Star } from 'lucide-react';

interface Props {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  showNumber?: boolean;
  readonly?: boolean;
  onChange?: (rating: number) => void;
  className?: string;
}

export function RatingStars({
  rating,
  maxRating = 5,
  size = 'md',
  showNumber = false,
  readonly = true,
  onChange,
  className = ''
}: Props) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const [hoveredRating, setHoveredRating] = React.useState<number | null>(null);
  const displayRating = hoveredRating ?? rating;

  const handleClick = (newRating: number) => {
    if (!readonly && onChange) {
      onChange(newRating);
    }
  };

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {Array.from({ length: maxRating }, (_, index) => {
        const starValue = index + 1;
        const filled = starValue <= displayRating;
        
        return (
          <button
            key={index}
            type="button"
            onClick={() => handleClick(starValue)}
            onMouseEnter={() => !readonly && setHoveredRating(starValue)}
            onMouseLeave={() => setHoveredRating(null)}
            disabled={readonly}
            className={`
              ${sizeClasses[size]} transition-colors
              ${readonly ? 'cursor-default' : 'cursor-pointer'}
              ${filled ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
              ${!readonly ? 'hover:text-yellow-400 hover:fill-yellow-400' : ''}
            `}
            aria-label={`${starValue} estrellas`}
          >
            <Star className="w-full h-full" />
          </button>
        );
      })}
      {showNumber && (
        <span className="ml-2 text-sm font-medium text-gray-700">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}

