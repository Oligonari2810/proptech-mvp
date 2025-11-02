// Sistema de badges de reputación

import { ReputationBadge } from './types';

export const reputationBadges: ReputationBadge[] = [
  {
    id: 'verified',
    name: 'Verificado',
    description: 'Broker o propiedad verificado por HabitatPro',
    icon: '✓',
    color: 'blue',
    criteria: 'Completó verificación de identidad y documentos'
  },
  {
    id: 'quick-response',
    name: 'Respuesta Rápida',
    description: 'Responde a consultas en menos de 2 horas',
    icon: '⚡',
    color: 'green',
    criteria: 'Promedio de respuesta < 2 horas en últimos 30 días'
  },
  {
    id: 'expert',
    name: 'Experto en Zona',
    description: 'Más de 10 transacciones completadas en esta zona',
    icon: '🏆',
    color: 'purple',
    criteria: '10+ transacciones exitosas en la misma zona'
  },
  {
    id: 'top-rated',
    name: 'Top Rated',
    description: 'Calificación promedio superior a 4.5 estrellas',
    icon: '⭐',
    color: 'gold',
    criteria: 'Rating promedio ≥ 4.5 con mínimo 5 reviews'
  },
  {
    id: 'transaction-master',
    name: 'Master en Transacciones',
    description: 'Más de 50 transacciones completadas',
    icon: '💼',
    color: 'indigo',
    criteria: '50+ transacciones exitosas'
  },
  {
    id: 'five-star',
    name: '5 Estrellas',
    description: '100% de reviews con 5 estrellas (mínimo 10)',
    icon: '⭐',
    color: 'yellow',
    criteria: '100% de reviews son 5 estrellas con mínimo 10 reviews'
  },
  {
    id: 'helpful',
    name: 'Muy Útil',
    description: 'Reviews marcadas como útiles por la comunidad',
    icon: '👍',
    color: 'teal',
    criteria: 'Reviews con más de 10 "útil" votes'
  },
  {
    id: 'responsive',
    name: 'Muy Responsivo',
    description: 'Responde a 100% de reviews en menos de 24h',
    icon: '💬',
    color: 'pink',
    criteria: '100% de reviews respondidas en < 24h'
  }
];

export function getBadgesForBroker(
  rating: number,
  totalReviews: number,
  responseRate: number,
  averageResponseTime: number, // en minutos
  transactionsCount: number,
  zoneTransactions: number
): ReputationBadge[] {
  const earnedBadges: ReputationBadge[] = [];

  // Badges base
  earnedBadges.push(reputationBadges.find(b => b.id === 'verified')!);

  // Respuesta rápida (< 2 horas promedio)
  if (averageResponseTime < 120) {
    earnedBadges.push(reputationBadges.find(b => b.id === 'quick-response')!);
  }

  // Muy responsivo (100% respuesta)
  if (responseRate === 100 && averageResponseTime < 1440) {
    earnedBadges.push(reputationBadges.find(b => b.id === 'responsive')!);
  }

  // Top Rated
  if (rating >= 4.5 && totalReviews >= 5) {
    earnedBadges.push(reputationBadges.find(b => b.id === 'top-rated')!);
  }

  // 5 Estrellas perfectas
  if (rating === 5 && totalReviews >= 10) {
    earnedBadges.push(reputationBadges.find(b => b.id === 'five-star')!);
  }

  // Master en transacciones
  if (transactionsCount >= 50) {
    earnedBadges.push(reputationBadges.find(b => b.id === 'transaction-master')!);
  }

  // Experto en zona
  if (zoneTransactions >= 10) {
    earnedBadges.push(reputationBadges.find(b => b.id === 'expert')!);
  }

  return earnedBadges;
}

