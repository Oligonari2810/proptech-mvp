## HabitatPro 4.0 (sin rewrite) — Roadmap ejecutable

### Principio rector
- **No reescribir**. Evolucionar el MVP por capas usando **feature flags** y módulos nuevos, manteniendo producción estable.

---

## Fase 0 — Estabilidad, seguridad operativa y contratos (0–2 semanas)

- **Contratos de API estables**
  - Propiedades siempre devuelven `image_url` + `images[]` (con fallback).
  - Errores con shape consistente: `{ success: false, error: { code, message } }` (estandarizar).
- **Observabilidad mínima**
  - Logs estructurados por request (request_id, user_id, endpoint, latency_ms).
  - Health check extendido (db, redis, external deps).
- **Gobierno de secretos**
  - Rotación + checklist; nunca compartir credenciales fuera del panel de secretos.

Deliverables:
- ADRs mínimos (ver `docs/architecture/ARCHITECTURE_TARGET.md`).
- Feature flags base en backend y frontend.

---

## Fase 1 — Geo como ventaja competitiva (2–6 semanas)

Objetivo: búsqueda por mapa y por zonas **de verdad**.

- **PostGIS**
  - `properties.geom` (POINT) + índices GIST.
  - Tabla `neighborhoods` (POLYGON/MULTIPOLYGON) con metadata (ciudad, slug, score).
- **API Geo**
  - `/api/geo/within` (bbox/polygon)
  - `/api/geo/nearby` (radius)
  - `/api/geo/neighborhoods` (list/detail)
- **POIs**
  - Ingesta inicial (escuelas, hospitales, playas, etc.) por ciudad/zona.

Métricas:
- p95 búsqueda mapa < 600ms
- % propiedades con geom > 95%

---

## Fase 2 — IA productizada (6–12 semanas)

- **RAG Legal RD (citaciones)**
  - Fuentes versionadas + evaluación automática (golden set).
  - UI: “explica y cita” (no solo texto).
- **AVM serio**
  - Pipeline reproducible, features, explainability.
  - Monitoreo drift y calidad por zona.
- **Leads**
  - Scoring + SLA + recomendaciones por broker.

---

## Fase 3 — SaaS/Enterprise (3–6 meses)

- **Multi-tenant** (brokers/desarrolladores)
- **Roles/Permisos** granulares (RBAC/ABAC)
- **Marketplace + integraciones** (Zapier/Make/webhooks)

---

## Notas
- Digital Twins / Tokenización: **solo** cuando haya un caso de negocio y marco regulatorio claro para RD.

