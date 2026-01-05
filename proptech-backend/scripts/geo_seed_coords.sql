-- Geo v4 (MVP) - Seed de coordenadas (lat/lng) por ubicación
-- Útil cuando las propiedades no tienen coordenadas y el mapa bbox queda vacío.
--
-- Uso:
--   psql "$DATABASE_URL" -f proptech-backend/scripts/geo_seed_coords.sql
--
-- Nota:
-- - Solo rellena filas SIN lat/lng
-- - Añade un pequeño "jitter" aleatorio para que no se solapen todos los puntos.

UPDATE properties
SET
  latitude = CASE
    WHEN location ILIKE '%santo domingo%' THEN 18.4861 + (random() - 0.5) * 0.08
    WHEN location ILIKE '%punta cana%' OR location ILIKE '%bavaro%' OR location ILIKE '%bávaro%' THEN 18.5820 + (random() - 0.5) * 0.08
    WHEN location ILIKE '%santiago%' THEN 19.4517 + (random() - 0.5) * 0.08
    WHEN location ILIKE '%la romana%' THEN 18.4273 + (random() - 0.5) * 0.08
    ELSE 18.4861 + (random() - 0.5) * 0.10
  END,
  longitude = CASE
    WHEN location ILIKE '%santo domingo%' THEN -69.9312 + (random() - 0.5) * 0.08
    WHEN location ILIKE '%punta cana%' OR location ILIKE '%bavaro%' OR location ILIKE '%bávaro%' THEN -68.4055 + (random() - 0.5) * 0.08
    WHEN location ILIKE '%santiago%' THEN -70.6970 + (random() - 0.5) * 0.08
    WHEN location ILIKE '%la romana%' THEN -68.9728 + (random() - 0.5) * 0.08
    ELSE -69.9312 + (random() - 0.5) * 0.10
  END
WHERE latitude IS NULL OR longitude IS NULL;

-- Backfill geom a partir de lat/lng (requiere postgis + columna geom)
UPDATE properties
SET geom = ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)
WHERE geom IS NULL AND longitude IS NOT NULL AND latitude IS NOT NULL;

-- Resumen rápido
SELECT
  COUNT(*) AS total,
  COUNT(*) FILTER (WHERE latitude IS NOT NULL AND longitude IS NOT NULL) AS has_latlng,
  COUNT(*) FILTER (WHERE geom IS NOT NULL) AS has_geom
FROM properties;

