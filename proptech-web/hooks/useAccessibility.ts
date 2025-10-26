import { useEffect } from 'react'

export const useAccessibility = () => {
  useEffect(() => {
    // Mejorar focus visible para navegación por teclado
    const handleFirstTab = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        document.body.classList.add('user-is-tabbing')
        window.removeEventListener('keydown', handleFirstTab)
      }
    }

    window.addEventListener('keydown', handleFirstTab)
    
    return () => {
      window.removeEventListener('keydown', handleFirstTab)
    }
  }, [])
}
