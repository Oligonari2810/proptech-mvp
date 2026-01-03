# Sistema de Assets Visuales HabitatPro

Resumen de integración y optimización de imágenes (Hero, Lifestyle, Profesionales, Dashboards).

## Estructura

```
proptech-web/public/images/
  hero/
  lifestyle/
  professionals/
  dashboards/
```

## Rutas clave
- Hero principal: `/images/hero/hero_family_livingroom_16x9.jpg` (o `.webp`)
- Fallbacks definidos en `proptech-web/app/config/images.ts`

## Recomendaciones
- Formato: WebP (preferido) o JPG de alta calidad
- Dimensiones: Hero 1920x1080, Card 600x400, Avatar 400x400
- Optimización: peso < 500KB cuando sea posible

## Placeholders y Optimización
- `ImageOptimizer.tsx` y `ImagePlaceholder.tsx` manejan carga, fallbacks y placeholders.

## Proceso
1. Coloca las imágenes en las rutas indicadas.
2. Verifica en `/admin/assets` y `/demo-assets`.
3. Ajusta estilos si es necesario.


