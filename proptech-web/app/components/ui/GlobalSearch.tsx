"use client";
/**
 * GlobalSearch simplificado — HabitatPro Enterprise
 * --------------------------------------------------
 * - Usa Input, Select, Button, Chip (Fase 2)
 * - Envía SearchState simple al handler `onSearch`
 * - Integrado con VoiceSearch para búsqueda por voz
 */
import React, { useState } from "react";
import Input from "./Input";
import Select from "./Select";
import Button from "./Button";
import Chip from "./Chip";
import { VoiceSearch } from "../VoiceSearch";
import { useToast } from "../ToastNotification";
import type { SearchState, GlobalSearchProps } from "./types/search";

const DEFAULT_CHIPS = ["Novedades", "Con terraza", "Cerca de playa", "Amueblado"];

export default function GlobalSearch({ onSearch, className = "" }: GlobalSearchProps) {
  const { addToast } = useToast();
  const [filters, setFilters] = useState<SearchState>({
    query: "",
    type: "",
    priceRange: "",
    bedrooms: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!filters.query.trim()) {
      addToast({
        type: 'warning',
        title: 'Búsqueda vacía',
        message: 'Por favor, ingresa una ubicación o término de búsqueda',
        duration: 3000,
      });
      return;
    }
    onSearch(filters);
  };

  const handleVoiceResult = (text: string) => {
    setFilters((prev) => ({ ...prev, query: text }));
    addToast({
      type: 'success',
      title: 'Voz reconocida',
      message: `Buscando: "${text}"`,
      duration: 2000,
    });
    // Auto-submit después de reconocer voz
    onSearch({ ...filters, query: text });
  };

  const handleVoiceError = (error: string) => {
    addToast({
      type: 'error',
      title: 'Error en búsqueda por voz',
      message: error,
      duration: 4000,
    });
  };

  return (
    <section
      className={`rounded-3xl border border-gray-200 bg-white p-6 shadow-card ${className}`}
      aria-label="Buscador global"
    >
      <h2 className="text-xl font-bold text-ink-900 mb-4">Encuentra tu propiedad ideal</h2>

      <form onSubmit={handleSubmit} className="grid md:grid-cols-[2fr,1fr,1fr,auto] gap-3">
        <div className="relative flex items-center gap-2">
          <Input
            placeholder="Ubicación, barrio o referencia..."
            value={filters.query}
            onChange={(e) => setFilters((f) => ({ ...f, query: e.target.value }))}
            aria-label="Buscar por ubicación o referencia"
            className="flex-1"
          />
          <VoiceSearch
            onResult={handleVoiceResult}
            onError={handleVoiceError}
            className="flex-shrink-0"
          />
        </div>

        <Select
          value={filters.type}
          onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value }))}
          aria-label="Tipo de propiedad"
        >
          <option value="">Tipo</option>
          <option value="apartamento">Apartamento</option>
          <option value="casa">Casa</option>
          <option value="local">Local</option>
        </Select>

        <Select
          value={filters.priceRange}
          onChange={(e) => setFilters((f) => ({ ...f, priceRange: e.target.value }))}
          aria-label="Rango de precio"
        >
          <option value="">Precio</option>
          <option value="0-150000">0 – 150 k</option>
          <option value="150000-300000">150 – 300 k</option>
          <option value="300000+">300 k +</option>
        </Select>

        <Button type="submit" className="whitespace-nowrap" aria-label="Buscar propiedades">
          Buscar
        </Button>
      </form>

      <div className="mt-4 flex flex-wrap gap-2" aria-label="Filtros rápidos">
        {DEFAULT_CHIPS.map((label) => (
          <Chip
            key={label}
            label={label}
            onClick={() => setFilters((f) => ({ ...f, query: label }))}
          />
        ))}
      </div>
    </section>
  );
}