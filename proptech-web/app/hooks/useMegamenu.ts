'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

/**
 * Hook personalizado para manejar megamenús con zona de tolerancia
 * y delays para prevenir cierre prematuro
 */
export function useMegamenu() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isHoveringMegamenuRef = useRef(false);

  // Limpiar timeout cuando el componente se desmonta
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  /**
   * Maneja cuando el mouse entra en un trigger de menú
   */
  const handleMenuEnter = useCallback((menu: string) => {
    // Si hay un timeout pendiente, cancelarlo
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    // Si estamos sobre el megamenú, no cambiar el menú activo
    if (isHoveringMegamenuRef.current) {
      return;
    }
    
    setActiveMenu(menu);
  }, []);

  /**
   * Maneja cuando el mouse sale de un trigger de menú
   */
  const handleMenuLeave = useCallback(() => {
    // Si ya estamos sobre el megamenú, no cerrar
    if (isHoveringMegamenuRef.current) {
      return;
    }

    // Limpiar timeout anterior si existe
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Crear nuevo timeout con delay de 200ms
    timeoutRef.current = setTimeout(() => {
      // Solo cerrar si no estamos sobre el megamenú
      if (!isHoveringMegamenuRef.current) {
        setActiveMenu(null);
      }
      timeoutRef.current = null;
    }, 200);
  }, []);

  /**
   * Maneja cuando el mouse entra en el megamenú
   */
  const handleMegamenuEnter = useCallback(() => {
    // Marcar que estamos sobre el megamenú
    isHoveringMegamenuRef.current = true;

    // Cancelar cualquier timeout de cierre
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  /**
   * Maneja cuando el mouse sale del megamenú
   */
  const handleMegamenuLeave = useCallback(() => {
    // Marcar que ya no estamos sobre el megamenú
    isHoveringMegamenuRef.current = false;

    // Limpiar timeout anterior si existe
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Crear nuevo timeout con delay de 200ms
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
      timeoutRef.current = null;
    }, 200);
  }, []);

  /**
   * Cierra el megamenú manualmente (por ejemplo, al hacer click)
   */
  const closeMenu = useCallback(() => {
    isHoveringMegamenuRef.current = false;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setActiveMenu(null);
  }, []);

  return {
    activeMenu,
    handleMenuEnter,
    handleMenuLeave,
    handleMegamenuEnter,
    handleMegamenuLeave,
    closeMenu
  };
}

