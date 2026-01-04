"""add postgis geom to properties

Revision ID: 004_add_postgis_geom
Revises: 7f459ebc87af
Create Date: 2026-01-04

"""

from alembic import op
import sqlalchemy as sa

try:
    from geoalchemy2 import Geometry
except Exception:  # pragma: no cover
    Geometry = None  # type: ignore


# revision identifiers, used by Alembic.
revision = "004_add_postgis_geom"
down_revision = "7f459ebc87af"
branch_labels = None
depends_on = None


def upgrade():
    bind = op.get_bind()
    dialect = bind.dialect.name

    if dialect != "postgresql":
        # Para desarrollo local sqlite: no aplicamos PostGIS.
        return

    # Habilitar PostGIS
    op.execute("CREATE EXTENSION IF NOT EXISTS postgis")

    if Geometry is None:
        raise RuntimeError("GeoAlchemy2 is required for PostGIS migrations")

    # Añadir columna geom
    op.add_column("properties", sa.Column("geom", Geometry(geometry_type="POINT", srid=4326), nullable=True))

    # Backfill desde lat/long
    op.execute(
        """
        UPDATE properties
        SET geom = ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)
        WHERE geom IS NULL AND longitude IS NOT NULL AND latitude IS NOT NULL
        """
    )

    # Índice espacial
    op.create_index("idx_properties_geom", "properties", ["geom"], postgresql_using="gist")


def downgrade():
    bind = op.get_bind()
    dialect = bind.dialect.name
    if dialect != "postgresql":
        return

    op.drop_index("idx_properties_geom", table_name="properties")
    op.drop_column("properties", "geom")

