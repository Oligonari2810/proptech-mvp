// Tipos para sistema de reputación

export interface Review {
  id: string;
  propertyId?: number;
  brokerId?: number;
  userId: number;
  userName: string;
  userAvatar?: string;
  rating: number; // 1-5 estrellas
  title?: string;
  comment: string;
  category: 'property' | 'broker' | 'process'; // Tipo de review
  verified: boolean; // Solo reviews de transacciones completadas
  createdAt: string;
  updatedAt?: string;
  helpfulCount?: number; // "¿Fue útil esta reseña?"
  responses?: ReviewResponse[];
  images?: string[]; // Fotos del usuario
  tags?: string[]; // Etiquetas: "Transacción rápida", "Atención excelente", etc.
}

export interface ReviewResponse {
  id: string;
  reviewId: string;
  authorId: number; // Broker o dueño
  authorName: string;
  authorRole: 'broker' | 'owner' | 'admin';
  comment: string;
  createdAt: string;
}

export interface RatingSummary {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    5: number; // Cantidad de 5 estrellas
    4: number;
    3: number;
    2: number;
    1: number;
  };
  categoryRatings?: {
    property?: RatingSummary; // Ratings específicos de propiedad
    broker?: RatingSummary; // Ratings de broker
    process?: RatingSummary; // Ratings del proceso
  };
}

export interface ReputationBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  criteria: string; // Cómo obtener este badge
}

export interface BrokerReputation {
  brokerId: number;
  brokerName: string;
  brokerAvatar?: string;
  overallRating: number;
  totalReviews: number;
  badges: ReputationBadge[];
  responseRate: number; // % de reviews respondidas
  averageResponseTime: string; // Tiempo promedio de respuesta
  categoryRatings: {
    communication: number;
    professionalism: number;
    knowledge: number;
    negotiation: number;
  };
}

export interface PropertyReputation {
  propertyId: number;
  overallRating: number;
  totalReviews: number;
  categoryRatings: {
    accuracy: number; // ¿Las fotos/descripción coinciden?
    condition: number; // Estado de la propiedad
    location: number; // Ubicación
    value: number; // Relación precio/calidad
  };
}

