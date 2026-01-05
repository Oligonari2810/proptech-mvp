from flask import Blueprint, jsonify, request
from sqlalchemy import func, text

from models import Property, db
from utils.feature_flags import FeatureFlags

geo_bp = Blueprint("geo", __name__, url_prefix="/api/geo")


@geo_bp.get("/health")
def geo_health():
    if not FeatureFlags.GEO:
        return jsonify({"success": False, "error": "FEATURE_GEO_DISABLED"}), 404
    # MVP: endpoint debe ser robusto (no 500), aunque falten permisos/tabla/columna.
    status = "ok"

    try:
        db.session.execute(text("SELECT 1"))
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

    # Dialecto real (lo que estaba fallando en producción)
    dialect = "unknown"
    try:
        dialect = db.engine.dialect.name
    except Exception:
        try:
            dialect = db.session.get_bind().dialect.name  # type: ignore[union-attr]
        except Exception:
            dialect = "unknown"

    if dialect != "postgresql":
        return (
            jsonify(
                {
                    "success": True,
                    "status": "ok",
                    "dialect": dialect,
                    "postgis": False,
                    "notes": "Geo bbox requiere PostgreSQL+PostGIS",
                }
            ),
            200,
        )

    def _safe_bool_query(q: str) -> bool:
        try:
            row = db.session.execute(text(q)).mappings().first()
            return bool(row and row.get("ok"))
        except Exception:
            return False

    def _safe_stats() -> dict:
        try:
            row = db.session.execute(
                text(
                    """
                    SELECT
                      COUNT(*)::int AS total,
                      COUNT(*) FILTER (WHERE geom IS NULL)::int AS geom_null,
                      COUNT(*) FILTER (WHERE longitude IS NOT NULL AND latitude IS NOT NULL)::int AS has_latlng
                    FROM properties
                    """
                )
            ).mappings().first()
            if not row:
                return {}
            # Asegurar JSON-serializable (evitar RowMapping/Decimal)
            raw = dict(row)
            return {
                "total": int(raw.get("total", 0) or 0),
                "geom_null": int(raw.get("geom_null", 0) or 0),
                "has_latlng": int(raw.get("has_latlng", 0) or 0),
            }
        except Exception as e:
            nonlocal status
            status = "degraded"
            return {"error": str(e)[:180]}

    postgis_ok = _safe_bool_query("SELECT EXISTS(SELECT 1 FROM pg_extension WHERE extname='postgis') AS ok")
    geom_col_ok = _safe_bool_query(
        """
        SELECT EXISTS(
          SELECT 1
          FROM information_schema.columns
          WHERE table_name='properties' AND column_name='geom'
        ) AS ok
        """
    )
    gist_ok = _safe_bool_query(
        """
        SELECT EXISTS(
          SELECT 1
          FROM pg_indexes
          WHERE tablename='properties' AND indexname='idx_properties_geom'
        ) AS ok
        """
    )

    stats = _safe_stats()
    needs_backfill = bool(stats and stats.get("has_latlng", 0) > 0 and stats.get("geom_null", 0) > 0)

    if not (postgis_ok and geom_col_ok and gist_ok):
        status = "degraded"

    return (
        jsonify(
            {
                "success": True,
                "status": status,
                "dialect": dialect,
                "postgis": postgis_ok,
                "geom_column": geom_col_ok,
                "gist_index": gist_ok,
                "stats": stats,
                "needs_backfill": needs_backfill,
            }
        ),
        200,
    )


@geo_bp.post("/backfill")
def geo_backfill():
    """
    Backfill idempotente para producción (MVP).
    Requiere token de admin/super_admin cuando AuthService está disponible.
    """
    if not FeatureFlags.GEO:
        return jsonify({"success": False, "error": "FEATURE_GEO_DISABLED"}), 404

    # Best-effort auth (no romper si AuthService no está disponible por config)
    try:
        from auth import AuthService  # local import para evitar ciclos

        user = AuthService.get_current_user()
        if not user:
            return jsonify({"success": False, "error": "UNAUTHORIZED"}), 401
        if getattr(user, "role", None) not in ("admin", "super_admin"):
            return jsonify({"success": False, "error": "FORBIDDEN"}), 403
    except Exception:
        return jsonify({"success": False, "error": "AUTH_NOT_AVAILABLE"}), 501

    try:
        if db.engine.dialect.name != "postgresql":
            return jsonify({"success": False, "error": "POSTGRES_REQUIRED"}), 400

        db.session.execute(text("CREATE EXTENSION IF NOT EXISTS postgis"))
        db.session.execute(
            text(
                """
                ALTER TABLE properties
                ADD COLUMN IF NOT EXISTS geom geometry(Point, 4326)
                """
            )
        )
        res = db.session.execute(
            text(
                """
                UPDATE properties
                SET geom = ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)
                WHERE geom IS NULL AND longitude IS NOT NULL AND latitude IS NOT NULL
                """
            )
        )
        updated = getattr(res, "rowcount", None)
        db.session.execute(text("CREATE INDEX IF NOT EXISTS idx_properties_geom ON properties USING GIST (geom)"))
        db.session.commit()

        return jsonify({"success": True, "updated": updated})
    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "error": str(e)}), 500


def _parse_bbox(value: str) -> tuple[float, float, float, float]:
    parts = [p.strip() for p in value.split(",")]
    if len(parts) != 4:
        raise ValueError("bbox must be minLng,minLat,maxLng,maxLat")
    min_lng, min_lat, max_lng, max_lat = map(float, parts)
    if min_lng > max_lng or min_lat > max_lat:
        raise ValueError("bbox min values must be <= max values")
    return min_lng, min_lat, max_lng, max_lat


def _parse_int(value: str | None) -> int | None:
    if value is None:
        return None
    s = str(value).strip()
    if not s:
        return None
    try:
        return int(s)
    except ValueError:
        return None


def _parse_float(value: str | None) -> float | None:
    if value is None:
        return None
    s = str(value).strip()
    if not s:
        return None
    try:
        return float(s)
    except ValueError:
        return None


@geo_bp.get("/within")
def geo_within():
    """
    Geo real (Fase 1): devuelve propiedades activas dentro de un bbox usando PostGIS.
    Query param:
      - bbox=minLng,minLat,maxLng,maxLat
    """
    if not FeatureFlags.GEO:
        return jsonify({"success": False, "error": "FEATURE_GEO_DISABLED"}), 404

    bbox = request.args.get("bbox")
    if not bbox:
        return jsonify({"success": False, "error": "MISSING_BBOX"}), 400

    try:
        min_lng, min_lat, max_lng, max_lat = _parse_bbox(bbox)
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400

    # Limitar resultados (evitar overload del mapa)
    limit = _parse_int(request.args.get("limit"))
    limit = 500 if limit is None else limit
    limit = max(1, min(limit, 2000))  # cap MVP

    # Filtros opcionales (alineados con /api/properties)
    operation = (request.args.get("operation") or "").strip() or None
    # soportar property_type y type (legacy)
    property_type = (request.args.get("property_type") or request.args.get("type") or "").strip() or None
    min_price = _parse_float(request.args.get("min_price"))
    max_price = _parse_float(request.args.get("max_price"))
    bedrooms = _parse_int(request.args.get("bedrooms"))
    bathrooms = _parse_int(request.args.get("bathrooms"))

    # Envelope WGS84
    envelope = func.ST_MakeEnvelope(min_lng, min_lat, max_lng, max_lat, 4326)

    query = Property.query.filter(Property.is_active == True)  # noqa: E712
    query = query.filter(Property.geom.isnot(None))
    query = query.filter(func.ST_Intersects(Property.geom, envelope))

    if operation:
        query = query.filter(Property.operation == operation)
    if property_type:
        query = query.filter(Property.property_type == property_type)
    if min_price is not None:
        query = query.filter(Property.price >= min_price)
    if max_price is not None:
        query = query.filter(Property.price <= max_price)
    if bedrooms is not None:
        query = query.filter(Property.bedrooms >= bedrooms)
    if bathrooms is not None:
        query = query.filter(Property.bathrooms >= bathrooms)

    query = query.limit(limit)

    properties = []
    for p in query.all():
        image_url = getattr(p, "image_url", None) or "https://via.placeholder.com/800x600?text=HabitatPro"
        images = p.images if isinstance(getattr(p, "images", None), list) and p.images else [image_url]
        properties.append(
            {
                "id": p.id,
                "title": p.title,
                "price": p.price,
                "location": p.location,
                "operation": p.operation,
                "property_type": p.property_type,
                "latitude": p.latitude,
                "longitude": p.longitude,
                "image_url": image_url,
                "images": images,
            }
        )

    return jsonify(
        {
            "success": True,
            "bbox": bbox,
            "count": len(properties),
            "limit": limit,
            "filters": {
                "operation": operation,
                "property_type": property_type,
                "min_price": min_price,
                "max_price": max_price,
                "bedrooms": bedrooms,
                "bathrooms": bathrooms,
            },
            "properties": properties,
        }
    )

