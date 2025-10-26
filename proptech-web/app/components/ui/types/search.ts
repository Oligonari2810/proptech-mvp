/**
 * Tipos simplificados para GlobalSearch
 * — Compatibles con el handler actual
 */
export interface SearchState {
  query: string;
  type?: string;
  priceRange?: string;
  bedrooms?: string;
}

export interface GlobalSearchProps {
  onSearch: (filters: SearchState) => void;
  className?: string;
}
