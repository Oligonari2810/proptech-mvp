'use client';

import React from 'react';
import { RatingSummary as RatingSummaryType } from '@/app/lib/reputation/types';
import { RatingStars } from './RatingStars';
import { calculateAverageRating } from '@/app/lib/reputation/utils';

interface Props {
  summary: RatingSummaryType;
  showDistribution?: boolean;
  title?: string;
}

export function RatingSummary({ summary, showDistribution = true, title }: Props) {
  const totalReviews = summary.totalReviews;
  const averageRating = summary.averageRating;
  const distribution = summary.ratingDistribution;

  if (totalReviews === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {title || 'Calificaciones'}
        </h3>
        <p className="text-gray-600 text-sm">Aún no hay reseñas</p>
      </div>
    );
  }

  const percentages = {
    5: totalReviews > 0 ? (distribution[5] / totalReviews) * 100 : 0,
    4: totalReviews > 0 ? (distribution[4] / totalReviews) * 100 : 0,
    3: totalReviews > 0 ? (distribution[3] / totalReviews) * 100 : 0,
    2: totalReviews > 0 ? (distribution[2] / totalReviews) * 100 : 0,
    1: totalReviews > 0 ? (distribution[1] / totalReviews) * 100 : 0
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          {title || 'Calificaciones'}
        </h3>
        <div className="text-right">
          <div className="text-3xl font-bold text-gray-900">{averageRating.toFixed(1)}</div>
          <RatingStars rating={averageRating} size="md" readonly showNumber={false} />
          <div className="text-sm text-gray-600 mt-1">
            {totalReviews} {totalReviews === 1 ? 'reseña' : 'reseñas'}
          </div>
        </div>
      </div>

      {showDistribution && (
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((stars) => (
            <div key={stars} className="flex items-center gap-3">
              <div className="flex items-center gap-1 w-16">
                <span className="text-sm font-medium text-gray-700">{stars}</span>
                <RatingStars rating={stars} size="sm" readonly showNumber={false} />
              </div>
              <div className="flex-1 bg-gray-200 rounded-full h-2 relative overflow-hidden">
                <div
                  className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${percentages[stars as keyof typeof percentages]}%` }}
                />
              </div>
              <div className="w-12 text-right text-sm text-gray-600">
                {distribution[stars as keyof typeof distribution]} ({percentages[stars as keyof typeof percentages].toFixed(0)}%)
              </div>
            </div>
          ))}
        </div>
      )}

      {summary.categoryRatings && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Calificaciones por Categoría</h4>
          <div className="grid grid-cols-2 gap-4">
            {summary.categoryRatings.property && (
              <div>
                <p className="text-xs text-gray-600 mb-1">Propiedad</p>
                <div className="flex items-center gap-2">
                  <RatingStars rating={summary.categoryRatings.property.averageRating} size="sm" readonly />
                  <span className="text-sm font-medium text-gray-900">
                    {summary.categoryRatings.property.averageRating.toFixed(1)}
                  </span>
                </div>
              </div>
            )}
            {summary.categoryRatings.broker && (
              <div>
                <p className="text-xs text-gray-600 mb-1">Broker</p>
                <div className="flex items-center gap-2">
                  <RatingStars rating={summary.categoryRatings.broker.averageRating} size="sm" readonly />
                  <span className="text-sm font-medium text-gray-900">
                    {summary.categoryRatings.broker.averageRating.toFixed(1)}
                  </span>
                </div>
              </div>
            )}
            {summary.categoryRatings.process && (
              <div>
                <p className="text-xs text-gray-600 mb-1">Proceso</p>
                <div className="flex items-center gap-2">
                  <RatingStars rating={summary.categoryRatings.process.averageRating} size="sm" readonly />
                  <span className="text-sm font-medium text-gray-900">
                    {summary.categoryRatings.process.averageRating.toFixed(1)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

