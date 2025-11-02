'use client';

import React, { useState } from 'react';
import { Review, ReviewResponse } from '@/app/lib/reputation/types';
import { RatingStars } from './RatingStars';
import { ThumbsUp, ThumbsDown, Reply, Verified } from 'lucide-react';
import { formatTimeAgo } from '@/app/lib/reputation/utils';

interface Props {
  review: Review;
  onHelpful?: (reviewId: string, helpful: boolean) => void;
  onReply?: (reviewId: string, comment: string) => void;
  canReply?: boolean; // Si el usuario actual puede responder
}

export function ReviewCard({ review, onHelpful, onReply, canReply = false }: Props) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitReply = async () => {
    if (!replyText.trim() || !onReply) return;

    setIsSubmitting(true);
    try {
      await onReply(review.id, replyText);
      setReplyText('');
      setShowReplyForm(false);
    } catch (error) {
      console.error('Error submitting reply:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const timeAgo = formatTimeAgo(review.createdAt);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
            {review.userName.charAt(0).toUpperCase()}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-gray-900">{review.userName}</span>
              {review.verified && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                  <Verified className="w-3 h-3" />
                  Verificado
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <RatingStars rating={review.rating} size="sm" readonly />
              <span className="text-xs text-gray-500">{timeAgo}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Title */}
      {review.title && (
        <h4 className="font-semibold text-gray-900 mb-2">{review.title}</h4>
      )}

      {/* Comment */}
      <p className="text-gray-700 mb-4 whitespace-pre-line">{review.comment}</p>

      {/* Tags */}
      {review.tags && review.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {review.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Images */}
      {review.images && review.images.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mb-4">
          {review.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Foto ${index + 1} de ${review.userName}`}
              className="w-full h-24 object-cover rounded-lg"
            />
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onHelpful?.(review.id, true)}
            className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ThumbsUp className="w-4 h-4" />
            <span>Útil</span>
            {review.helpfulCount && review.helpfulCount > 0 && (
              <span className="text-xs">({review.helpfulCount})</span>
            )}
          </button>

          {canReply && (
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              <Reply className="w-4 h-4" />
              <span>Responder</span>
            </button>
          )}
        </div>
      </div>

      {/* Reply Form */}
      {showReplyForm && canReply && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Escribe tu respuesta..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            rows={3}
          />
          <div className="flex items-center justify-end gap-2 mt-2">
            <button
              onClick={() => {
                setShowReplyForm(false);
                setReplyText('');
              }}
              className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmitReply}
              disabled={!replyText.trim() || isSubmitting}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Enviando...' : 'Enviar respuesta'}
            </button>
          </div>
        </div>
      )}

      {/* Responses */}
      {review.responses && review.responses.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
          {review.responses.map((response) => (
            <div key={response.id} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold text-gray-900">{response.authorName}</span>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                  {response.authorRole === 'broker' ? 'Broker' : 'Propietario'}
                </span>
                <span className="text-xs text-gray-500">
                  {formatTimeAgo(response.createdAt)}
                </span>
              </div>
              <p className="text-gray-700 text-sm">{response.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

