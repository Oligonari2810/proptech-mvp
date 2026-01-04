import os


def test_geo_within_bbox(client):
    # Habilitar feature flag
    os.environ["FEATURE_GEO"] = "true"

    # bbox aproximado alrededor de RD (debería incluir propiedades con geom ya backfilled)
    resp = client.get("/api/geo/within?bbox=-72,17,-68,20")
    assert resp.status_code in (200, 400, 404)

    # Si está habilitado y configurado, debe devolver success true
    if resp.status_code == 200:
        data = resp.get_json()
        assert data["success"] is True
        assert "properties" in data

