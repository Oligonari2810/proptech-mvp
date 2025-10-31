-- Script SQL para agregar columnas faltantes en PostgreSQL

-- Agregar columnas a tabla properties si no existen
DO $$ 
BEGIN
    -- Verificar y agregar latitude
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='latitude') THEN
        ALTER TABLE properties ADD COLUMN latitude FLOAT;
    END IF;

    -- Verificar y agregar longitude
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='longitude') THEN
        ALTER TABLE properties ADD COLUMN longitude FLOAT;
    END IF;

    -- Verificar y agregar created_at
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='created_at') THEN
        ALTER TABLE properties ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    END IF;

    -- Verificar y agregar type
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='type') THEN
        ALTER TABLE properties ADD COLUMN type VARCHAR(50);
    END IF;

    -- Verificar y agregar operation
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='operation') THEN
        ALTER TABLE properties ADD COLUMN operation VARCHAR(20);
    END IF;

    -- Verificar y agregar area
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='area') THEN
        ALTER TABLE properties ADD COLUMN area FLOAT;
    END IF;

    -- Verificar y agregar features
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='features') THEN
        ALTER TABLE properties ADD COLUMN features JSONB;
    END IF;

    -- Verificar y agregar emotional_tags
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='emotional_tags') THEN
        ALTER TABLE properties ADD COLUMN emotional_tags JSONB;
    END IF;

    -- Verificar y agregar images
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='images') THEN
        ALTER TABLE properties ADD COLUMN images JSONB;
    END IF;

    -- Verificar y agregar is_active
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='is_active') THEN
        ALTER TABLE properties ADD COLUMN is_active BOOLEAN DEFAULT TRUE;
    END IF;

END $$;

-- Verificar columnas agregadas
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name='properties' 
ORDER BY ordinal_position;

