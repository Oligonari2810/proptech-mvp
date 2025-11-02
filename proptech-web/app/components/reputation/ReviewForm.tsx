'use client';

import React, { useState } from 'react';
import { RatingStars } from './RatingStars';
import { CheckCircle } from 'lucide-react';

interface ReviewFormProps {
  propertyId?: number;
  brokerId?: number;
  category: 'property' | 'broker' | 'process';
  onSubmit: (review: {
    rating: number;
    title?: string;
    comment: string;
    category: 'property' | 'broker' | 'process';
    tags?: string[];
  }) => Promise<void>;
  onCancel?: () => void;
  canVerifyTransaction?: boolean; // Si requiere verificación de transacción
}

export function ReviewForm({
  propertyId,
  brokerId,
  category,
  onSubmit,
  onCancel,
  canVerifyTransaction = false
}: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transactionVerified, setTransactionVerified] = useState(false);

  const categoryLabels = {
    property: 'Propiedad',
    broker: 'Broker',
    process: 'Proceso de Transacción'
  };

  const availableTags = {
    property: [
      'Transacción rápida',
      'Fotos exactas',
      'Descripción precisa',
      'Ubicación excelente',
      'Buen precio'
    ],
    broker: [
      'Atención excelente',
      'Respuesta rápida',
      'Conocimiento de zona',
      'Profesional',
      'Transparente'
    ],
    process: [
      'Proceso fluido',
      'Documentación clara',
      'Sin problemas',
      'Comunicación constante',
      'Soporte durante todo el proceso'
    ]
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      alert('Por favor selecciona una calificación');
      return;
    }

    if (!comment.trim()) {
      alert('Por favor escribe un comentario');
      return;
    }

    if (canVerifyTransaction && !transactionVerified) {
      alert('Por favor verifica que completaste una transacción');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        rating,
        title: title.trim() || undefined,
        comment: comment.trim(),
        category,
        tags: selectedTags.length > 0 ? selectedTags : undefined
      });
      // Reset form
      setRating(0);
      setTitle('');
      setComment('');
      setSelectedTags([]);
      setTransactionVerified(false);
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Error al enviar la reseña. Por favor intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Escribe una reseña sobre {categoryLabels[category]}
      </h3>

      {/* Verificación de transacción */}
      {canVerifyTransaction && (
        <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={transactionVerified}
              onChange={(e) => setTransactionVerified(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="text-sm text-blue-800">
              Verifico que completé una transacción con esta {category === 'property' ? 'propiedad' : category === 'broker' ? 'broker' : 'proceso'}
            </span>
          </label>
          <p className="text-xs text-blue-600 mt-2 ml-6">
            Solo puedes escribir reseñas verificadas después de completar una transacción
          </p>
        </div>
      )}

      {/* Rating */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Calificación
        </label>
        <RatingStars
          rating={rating}
          readonly={false}
          onChange={setRating}
          size="lg"
          showNumber
        />
      </div>

      {/* Title (opcional) */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Título (opcional)
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ej: Excelente experiencia"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          maxLength={100}
        />
      </div>

      {/* Comment */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Comentario *
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Comparte tu experiencia..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          rows={5}
          required
          maxLength={1000}
        />
        <p className="text-xs text-gray-500 mt-1">
          {comment.length}/1000 caracteres
        </p>
      </div>

      {/* Tags */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Etiquetas (opcional)
        </label>
        <div className="flex flex-wrap gap-2">
          {availableTags[category].map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className={`
                px-3 py-1 rounded-full text-sm font-medium transition-colors
                ${selectedTags.includes(tag)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting || rating === 0 || !comment.trim()}
          className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4" />
              Publicar reseña
            </>
          )}
        </button>
      </div>
    </form>
  );
}

