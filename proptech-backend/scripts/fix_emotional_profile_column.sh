#!/bin/bash
# Script para agregar columna emotional_profile directamente en PostgreSQL
# Ejecutar EN RENDER cuando el deploy falle por esta columna

echo "================================================================"
echo "🔧 SCRIPT PARA AGREGAR COLUMNA emotional_profile"
echo "================================================================"

# Verificar que DATABASE_URL esté configurada
if [ -z "$DATABASE_URL" ]; then
    echo "❌ ERROR: DATABASE_URL no está configurada"
    exit 1
fi

echo ""
echo "1. Conectando a base de datos..."
echo "   DATABASE_URL encontrada: $(echo $DATABASE_URL | sed 's/:[^:]*@/@***@/')"

# Verificar si la columna ya existe
echo ""
echo "2. Verificando si la columna ya existe..."

psql $DATABASE_URL -c "
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name='properties' AND column_name='emotional_profile';
" 2>/dev/null

if [ $? -eq 0 ]; then
    EXISTS=$(psql $DATABASE_URL -t -c "
    SELECT COUNT(*) 
    FROM information_schema.columns 
    WHERE table_name='properties' AND column_name='emotional_profile';
    " 2>/dev/null | xargs)
    
    if [ "$EXISTS" = "1" ]; then
        echo "   ✅ La columna emotional_profile YA EXISTE"
        echo "   ✅ No es necesario agregarla"
        exit 0
    fi
fi

echo "   ⚠️ La columna NO existe - procediendo a agregarla"

# Agregar la columna
echo ""
echo "3. Agregando columna emotional_profile..."

psql $DATABASE_URL -c "
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS emotional_profile JSON;
" 2>&1

if [ $? -eq 0 ]; then
    echo "   ✅ Columna agregada exitosamente"
    
    # Verificar
    echo ""
    echo "4. Verificando que la columna se creó..."
    psql $DATABASE_URL -c "
    SELECT column_name, data_type, is_nullable
    FROM information_schema.columns 
    WHERE table_name='properties' AND column_name='emotional_profile';
    "
    
    echo ""
    echo "================================================================"
    echo "✅ ÉXITO: Columna emotional_profile agregada definitivamente"
    echo "================================================================"
    exit 0
else
    echo ""
    echo "================================================================"
    echo "❌ ERROR: No se pudo agregar la columna"
    echo "================================================================"
    exit 1
fi

