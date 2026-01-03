"""add emotional_profile column to properties

Revision ID: 003_add_emotional_profile
Revises: 002_optimize_indexes
Create Date: 2024-11-02

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '003_add_emotional_profile'
down_revision = '002_optimize_indexes'
branch_labels = None
depends_on = None


def upgrade():
    """Agregar columna emotional_profile a properties si no existe"""
    try:
        # Verificar si la columna ya existe (para PostgreSQL)
        connection = op.get_bind()
        if connection.dialect.name == 'postgresql':
            result = connection.execute(sa.text("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name='properties' 
                AND column_name='emotional_profile'
            """))
            
            if result.fetchone() is None:
                # Columna no existe, agregarla
                op.add_column('properties', sa.Column('emotional_profile', postgresql.JSON(astext_type=sa.Text()), nullable=True))
                print("✅ Columna emotional_profile agregada a properties")
            else:
                print("ℹ️  Columna emotional_profile ya existe en properties")
        else:
            # Para SQLite, simplemente agregar la columna
            op.add_column('properties', sa.Column('emotional_profile', sa.JSON(), nullable=True))
            print("✅ Columna emotional_profile agregada a properties (SQLite)")
    except Exception as e:
        print(f"⚠️  Error agregando columna emotional_profile (puede que ya exista): {e}")
        # Continuar sin error si la columna ya existe


def downgrade():
    """Remover columna emotional_profile de properties"""
    try:
        op.drop_column('properties', 'emotional_profile')
        print("✅ Columna emotional_profile removida de properties")
    except Exception as e:
        print(f"⚠️  Error removiendo columna emotional_profile: {e}")
        # Continuar sin error si no se puede remover

