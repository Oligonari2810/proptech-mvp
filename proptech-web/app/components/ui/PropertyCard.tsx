"use client";
import React from "react";

interface PropertyCardProps {
  id: string;
  title: string;
  price: number;
  location: string;
  imageUrl?: string;
  bedrooms?: number;
  area?: number;
  onClick?: (id: string) => void;
}

export default function PropertyCard({
  id,
  title,
  price,
  location,
  imageUrl,
  bedrooms,
  area,
  onClick,
}: PropertyCardProps) {
  return (
    <button
      type="button"
      onClick={() => onClick?.(id)}
      className="w-full text-left cursor-pointer rounded-3xl border border-gray-200 bg-white overflow-hidden shadow-card hover:shadow-lg transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500"
      aria-label={`Propiedad ${title}`}
    >
      {imageUrl ? (
        <div className="aspect-[4/3] w-full bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500 text-sm">Imagen no disponible</span>
        </div>
      ) : (
        <div className="aspect-[4/3] bg-gray-100" />
      )}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-ink-900">{title}</h3>
          <span className="text-green-600 font-semibold">€{price.toLocaleString()}</span>
        </div>
        <p className="text-gray-600 text-sm">{location}</p>
        <div className="mt-2 flex gap-4 text-sm text-gray-700">
          {typeof bedrooms !== "undefined" && <span>🛏️ {bedrooms} hab.</span>}
          {typeof area !== "undefined" && <span>📐 {area} m²</span>}
        </div>
      </div>
    </button>
  );
}

