import React from "react";
import Badge from "./Badge";

export interface Property {
  id: string;
  title: string;
  price: number;
  bedrooms: number;
  area: number;
  location: string;
  tags?: string[];
  imageUrl?: string;
}

export interface PropertyCardProps {
  property: Property;
  onClick?: (id: string) => void;
}

export default function PropertyCard({
  property,
  onClick,
}: PropertyCardProps) {
  const { id, title, price, bedrooms, area, location, tags = [], imageUrl } =
    property;

  return (
    <article
      key={id}
      onClick={() => onClick?.(id)}
      className="cursor-pointer rounded-3xl border border-gray-200 bg-white overflow-hidden shadow-card hover:shadow-lg transition"
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
          <h3 className="font-semibold text-ink-900">
            ${price.toLocaleString()} • {bedrooms} hab • {area} m²
          </h3>
          <Badge>{tags[0] ?? "Disponible"}</Badge>
        </div>
        <p className="text-sm text-ink-600 mt-1">{title || location}</p>
        <p className="text-xs text-ink-600 mt-2">{location}</p>
      </div>
    </article>
  );
}
