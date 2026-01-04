"""
Geo v4 - Backfill/Bootstrap PostGIS (idempotente)

Objetivo (MVP):
- Asegurar PostGIS (CREATE EXTENSION)
- Asegurar columna `properties.geom` (POINT, SRID 4326)
- Backfill de `geom` desde `longitude/latitude`
- Asegurar índice GIST

Uso (Render / local):
  DATABASE_URL=postgresql://... python proptech-backend/scripts/geo_backfill.py
"""

from __future__ import annotations

import os
import sys

from sqlalchemy import create_engine, text


def _get_database_url() -> str:
    url = (os.getenv("DATABASE_URL") or "").strip()
    if not url:
        raise RuntimeError("DATABASE_URL no configurada")
    return url


def main() -> int:
    url = _get_database_url()
    engine = create_engine(url, pool_pre_ping=True)

    with engine.begin() as conn:
        dialect = conn.dialect.name
        if dialect != "postgresql":
            print(f"SKIP: dialect={dialect} (PostGIS solo aplica a PostgreSQL)")
            return 0

        # 1) Extensión
        conn.execute(text("CREATE EXTENSION IF NOT EXISTS postgis"))

        # 2) Columna geom (idempotente)
        conn.execute(
            text(
                """
                ALTER TABLE properties
                ADD COLUMN IF NOT EXISTS geom geometry(Point, 4326)
                """
            )
        )

        # 3) Backfill (idempotente)
        res = conn.execute(
            text(
                """
                UPDATE properties
                SET geom = ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)
                WHERE geom IS NULL AND longitude IS NOT NULL AND latitude IS NOT NULL
                """
            )
        )
        updated = getattr(res, "rowcount", None)

        # 4) Índice espacial (idempotente)
        conn.execute(text("CREATE INDEX IF NOT EXISTS idx_properties_geom ON properties USING GIST (geom)"))

        # 5) Mini-métrica
        stats = conn.execute(
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

    print(
        "OK: geo backfill aplicado",
        f"updated={updated}",
        f"total={stats.get('total') if stats else 'n/a'}",
        f"geom_null={stats.get('geom_null') if stats else 'n/a'}",
        f"has_latlng={stats.get('has_latlng') if stats else 'n/a'}",
    )
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as e:
        print(f"ERROR: {e}", file=sys.stderr)
        raise

