## Arquitectura objetivo (HabitatPro)

### Objetivo
Evolucionar el MVP a una plataforma PropTech “nivel 2026” **sin rewrite**: modularizar por dominios, introducir Geo/Data/IA de forma incremental y medible.

---

## Dominios (backend)
- **identity**: auth, sesiones, roles, auditoría
- **listings**: propiedades, media, estados, featured
- **crm**: leads, pipeline, actividades, SLAs
- **bookings**: reservas, calendar, notificaciones
- **geo**: PostGIS, zonas, POIs, búsqueda por mapa
- **ai**: RAG legal, AVM, recomendaciones, explainability

---

## Contratos (API)
- JSON consistente con `success`, `data`, `error`.
- Tipos estables para `Property`:
  - `id`, `title`, `price`, `location`, `operation`, `property_type/type`
  - `image_url` (string, siempre) + `images[]` (siempre array)
  - `latitude/longitude` (nullable) + `geom` (fase PostGIS)

---

## Feature flags
Feature flags por env para activar módulos sin romper producción:
- `FEATURE_GEO=true`
- `FEATURE_RAG_LEGAL=true`
- `FEATURE_AVM=true`
- `FEATURE_MULTI_TENANT=false`

---

## Observabilidad (mínimo)
- request_id por request
- logs estructurados
- métricas p95 y error rate por endpoint

