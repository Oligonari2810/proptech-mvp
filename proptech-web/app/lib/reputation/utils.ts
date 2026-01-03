// Utilidades para sistema de reputación

export function formatTimeAgo(date: string | Date): string {
  const now = new Date();
  const reviewDate = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - reviewDate.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'hace unos segundos';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `hace ${diffInMinutes} ${diffInMinutes === 1 ? 'minuto' : 'minutos'}`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `hace ${diffInHours} ${diffInHours === 1 ? 'hora' : 'horas'}`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `hace ${diffInDays} ${diffInDays === 1 ? 'día' : 'días'}`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `hace ${diffInMonths} ${diffInMonths === 1 ? 'mes' : 'meses'}`;
  }

  const diffInYears = Math.floor(diffInMonths / 12);
  return `hace ${diffInYears} ${diffInYears === 1 ? 'año' : 'años'}`;
}

export function calculateAverageRating(ratings: number[]): number {
  if (ratings.length === 0) return 0;
  const sum = ratings.reduce((acc, rating) => acc + rating, 0);
  return sum / ratings.length;
}

export function getRatingDistribution(reviews: Array<{ rating: number }>) {
  const distribution = {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0
  };

  reviews.forEach(review => {
    const rating = Math.round(review.rating) as keyof typeof distribution;
    if (rating >= 1 && rating <= 5) {
      distribution[rating]++;
    }
  });

  return distribution;
}

