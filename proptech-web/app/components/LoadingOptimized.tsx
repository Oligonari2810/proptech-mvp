'use client';
import React from 'react';
import { PropertySkeleton } from './PropertySkeleton';
import { Skeleton, CardSkeleton } from './ui/Skeleton';

interface LoadingOptimizedProps {
  type?: 'spinner' | 'skeleton' | 'pulse' | 'property' | 'card';
  size?: 'sm' | 'md' | 'lg';
  count?: number;
  className?: string;
}

export const LoadingOptimized: React.FC<LoadingOptimizedProps> = ({
  type = 'spinner',
  size = 'md',
  count = 1,
  className = '',
}) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  const renderLoading = () => {
    switch (type) {
      case 'spinner':
        return (
          <div className={`flex justify-center items-center ${className}`}>
            <div
              className={`animate-spin rounded-full border-b-2 border-blue-600 ${sizes[size]}`}
              role="status"
              aria-label="Cargando"
            >
              <span className="sr-only">Cargando...</span>
            </div>
          </div>
        );

      case 'skeleton':
        return (
          <div className={`space-y-2 ${className}`}>
            {Array.from({ length: count }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        );

      case 'pulse':
        return (
          <div className={`animate-pulse ${className}`}>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        );

      case 'property':
        return (
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
            {Array.from({ length: count }).map((_, i) => (
              <PropertySkeleton key={i} />
            ))}
          </div>
        );

      case 'card':
        return (
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
            {Array.from({ length: count }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        );

      default:
        return (
          <div className={`flex justify-center items-center ${className}`}>
            <div className={`animate-spin rounded-full border-b-2 border-blue-600 ${sizes[size]}`} />
          </div>
        );
    }
  };

  return renderLoading();
};

export const PageLoading: React.FC<{ message?: string }> = ({ message = 'Cargando...' }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <LoadingOptimized type="spinner" size="lg" />
      <p className="mt-4 text-gray-600">{message}</p>
    </div>
  </div>
);

export const SectionLoading: React.FC<{ message?: string }> = ({ message = 'Cargando...' }) => (
  <div className="py-12 flex flex-col items-center justify-center">
    <LoadingOptimized type="spinner" size="md" />
    <p className="mt-3 text-sm text-gray-500">{message}</p>
  </div>
);

