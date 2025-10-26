from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
import os

class DatabaseOptimizer:
    def __init__(self):
        self.engine = create_engine(os.getenv('DATABASE_URL', 'sqlite:///habitatpro.db'))
        self.Session = sessionmaker(bind=self.engine)
    
    def create_indexes(self):
        """Crear índices para optimizar queries frecuentes"""
        indexes = [
            "CREATE INDEX IF NOT EXISTS idx_properties_location ON property(location)",
            "CREATE INDEX IF NOT EXISTS idx_properties_price ON property(price)",
            "CREATE INDEX IF NOT EXISTS idx_properties_type ON property(property_type)",
            "CREATE INDEX IF NOT EXISTS idx_users_email ON user(email)",
            "CREATE INDEX IF NOT EXISTS idx_properties_created_at ON property(published_date)",
        ]
        
        with self.engine.connect() as conn:
            for index_sql in indexes:
                try:
                    conn.execute(text(index_sql))
                except Exception as e:
                    print(f"Warning: Could not create index: {e}")
            conn.commit()
    
    def analyze_query_performance(self):
        """Analizar performance de queries"""
        try:
            with self.engine.connect() as conn:
                if 'sqlite' in str(self.engine.url):
                    # SQLite specific analysis
                    result = conn.execute(text("""
                        SELECT name, sql FROM sqlite_master 
                        WHERE type='index' AND name LIKE 'idx_%'
                    """))
                    return result.fetchall()
                else:
                    # PostgreSQL specific analysis
                    result = conn.execute(text("""
                        SELECT schemaname, tablename, attname, n_distinct, correlation
                        FROM pg_stats 
                        WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
                        ORDER BY n_distinct DESC
                    """))
                    return result.fetchall()
        except Exception as e:
            print(f"Error analyzing performance: {e}")
            return []
    
    def vacuum_and_analyze(self):
        """Ejecutar VACUUM y ANALYZE para mantenimiento"""
        try:
            with self.engine.connect() as conn:
                if 'postgresql' in str(self.engine.url):
                    conn.execute(text("VACUUM ANALYZE"))
                    conn.commit()
                else:
                    # SQLite optimization
                    conn.execute(text("VACUUM"))
                    conn.execute(text("ANALYZE"))
                    conn.commit()
        except Exception as e:
            print(f"Error during optimization: {e}")

# Inicializar optimizador
db_optimizer = DatabaseOptimizer()
