from flask import Blueprint, jsonify, request

from utils.feature_flags import FeatureFlags

geo_bp = Blueprint("geo", __name__, url_prefix="/api/geo")


@geo_bp.get("/health")
def geo_health():
    if not FeatureFlags.GEO:
        return jsonify({"success": False, "error": "FEATURE_GEO_DISABLED"}), 404
    return jsonify({"success": True, "status": "ok"})


@geo_bp.get("/within")
def geo_within():
    """
    MVP placeholder:
    - Próxima fase: implementar PostGIS (bbox/polygon) con índices GIST.
    - Query params esperados (fase 1): bbox=minLng,minLat,maxLng,maxLat
    """
    if not FeatureFlags.GEO:
        return jsonify({"success": False, "error": "FEATURE_GEO_DISABLED"}), 404

    bbox = request.args.get("bbox")
    return jsonify(
        {
            "success": True,
            "bbox": bbox,
            "properties": [],
            "note": "Geo v4 placeholder. Implementar PostGIS en Fase 1.",
        }
    )

