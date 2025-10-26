import { useEffect } from 'react'

export const useSkipNavigation = () => {
  useEffect(() => {
    // Crear skip navigation link
    const skipLink = document.createElement('a')
    skipLink.href = '#main-content'
    skipLink.textContent = 'Saltar al contenido principal'
    skipLink.className = 'skip-link'
    
    // Estilos para el skip link
    const style = document.createElement('style')
    style.textContent = `
      .skip-link {
        position: absolute;
        top: -40px;
        left: 6px;
        background: #000;
        color: white;
        padding: 8px;
        z-index: 10000;
        text-decoration: none;
      }
      .skip-link:focus {
        top: 6px;
      }
    `
    
    document.head.appendChild(style)
    document.body.insertBefore(skipLink, document.body.firstChild)
    
    return () => {
      document.head.removeChild(style)
      document.body.removeChild(skipLink)
    }
  }, [])
}
