'use client';

import React from 'react';
import { ListingTier } from '@/app/lib/featured/types';
import { getFeaturedBadge } from '@/app/lib/featured/config';

interface Props {
  tier: ListingTier;
  compact?: boolean;
  className?: string;
}

export function FeaturedBadge({ tier, compact = false, className = '' }: Props) {
  const badge = getFeaturedBadge(tier);

  if (!badge || tier === 'basic') {
    return null;
  }

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-800 border-blue-200',
    gold: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    purple: 'bg-purple-100 text-purple-800 border-purple-200'
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold border
        ${colorClasses[badge.color as keyof typeof colorClasses] || colorClasses.blue}
        ${compact ? 'text-xs' : 'text-sm'}
        ${className}
      `}
    >
      <span>{badge.icon}</span>
      {!compact && <span>{badge.text}</span>}
    </span>
  );
}

