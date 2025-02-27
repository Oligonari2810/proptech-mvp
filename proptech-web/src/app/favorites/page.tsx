"use client"; // Para que el estado funcione en Next.js

import { useState } from "react";

const FavoritesPage = () => {
  const [favorites] = useState<string[]>([]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold">Mis Favoritos</h1>
      <p className="text-lg">Aquí puedes ver las propiedades que has guardado.</p>

      {favorites.length === 0 ? (
        <p className="mt-4 text-gray-600">No tienes propiedades guardadas aún.</p>
      ) : (
        <ul className="mt-4">
          {favorites.map((fav, index) => (
            <li key={index} className="p-2 border-b">{fav}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FavoritesPage;
