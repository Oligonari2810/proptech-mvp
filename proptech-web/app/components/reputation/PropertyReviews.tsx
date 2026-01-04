'use client';

import React, { useState, useEffect } from 'react';
import { Review, RatingSummary } from '@/app/lib/reputation/types';
import { ReviewCard } from './ReviewCard';
import { ReviewForm } from './ReviewForm';
import { RatingSummary as RatingSummaryComponent } from './RatingSummary';
import { useSession } from 'next-auth/react';
import { Plus } from 'lucide-react';

interface Props {
  propertyId: number;
  initialReviews?: Review[];
  initialSummary?: RatingSummary;
}

export function PropertyReviews({ propertyId, initialReviews = [], initialSummary }: Props) {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [summary, setSummary] = useState<RatingSummary | undefined>(initialSummary);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const canWriteReview = !!session?.user; // Solo usuarios autenticados

  useEffect(() => {
    loadReviews();
  }, [propertyId]);

  const loadReviews = async () => {
    try {
      const response = await fetch(`/api/backend/api/reviews/property/${propertyId}`, { cache: 'no-store' });
      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews || []);
        setSummary(data.summary);
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
    }
  };

  const handleSubmitReview = async (reviewData: {
    rating: number;
    title?: string;
    comment: string;
    category: 'property' | 'broker' | 'process';
    tags?: string[];
  }) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/backend/api/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          propertyId,
          ...reviewData,
          category: 'property' // Sobrescribir category después del spread
        })
      });

      if (response.ok) {
        await loadReviews();
        setShowReviewForm(false);
      } else {
        throw new Error('Error al enviar la reseña');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Error al enviar la reseña. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleHelpful = async (reviewId: string, helpful: boolean) => {
    try {
      await fetch(`/api/backend/api/reviews/${reviewId}/helpful`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ helpful })
      });
      // Recargar reviews para actualizar contador
      await loadReviews();
    } catch (error) {
      console.error('Error marking helpful:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Reseñas y Calificaciones</h2>
        {canWriteReview && !showReviewForm && (
          <button
            onClick={() => setShowReviewForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
          >
            <Plus className="w-4 h-4" />
            Escribir reseña
          </button>
        )}
      </div>

      {/* Summary */}
      {summary && (
        <div className="mb-6">
          <RatingSummaryComponent summary={summary} />
        </div>
      )}

      {/* Review Form */}
      {showReviewForm && (
        <div className="mb-6">
          <ReviewForm
            propertyId={propertyId}
            category="property"
            onSubmit={handleSubmitReview}
            onCancel={() => setShowReviewForm(false)}
            canVerifyTransaction={false} // Por ahora sin verificación requerida
          />
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="mb-2">Aún no hay reseñas para esta propiedad</p>
            {canWriteReview && (
              <button
                onClick={() => setShowReviewForm(true)}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Sé el primero en escribir una reseña
              </button>
            )}
          </div>
        ) : (
          reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onHelpful={handleHelpful}
              canReply={false} // Por ahora solo brokers pueden responder
            />
          ))
        )}
      </div>
    </div>
  );
}

