from flask import Blueprint, jsonify, request
from sqlalchemy import func

from models import Property
from utils.feature_flags import FeatureFlags

geo_bp = Blueprint("geo", __name__, url_prefix="/api/geo")


@geo_bp.get("/health")
def geo_health():
    if not FeatureFlags.GEO:
        return jsonify({"success": False, "error": "FEATURE_GEO_DISABLED"}), 404
    return jsonify({"success": True, "status": "ok"})


def _parse_bbox(value: str) -> tuple[float, float, float, float]:
    parts = [p.strip() for p in value.split(",")]
    if len(parts) != 4:
        raise ValueError("bbox must be minLng,minLat,maxLng,maxLat")
    min_lng, min_lat, max_lng, max_lat = map(float, parts)
    if min_lng > max_lng or min_lat > max_lat:
        raise ValueError("bbox min values must be <= max values")
    return min_lng, min_lat, max_lng, max_lat


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

    # Envelope WGS84
    envelope = func.ST_MakeEnvelope(min_lng, min_lat, max_lng, max_lat, 4326)

    query = (
        Property.query.filter(Property.is_active == True)  # noqa: E712
        .filter(Property.geom.isnot(None))
        .filter(func.ST_Intersects(Property.geom, envelope))
        .limit(500)
    )

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

    return jsonify({"success": True, "bbox": bbox, "count": len(properties), "properties": properties})

