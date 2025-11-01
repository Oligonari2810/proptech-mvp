#!/bin/bash
# Script para ejecutar tests de HabitatPro
# Requiere: venv activado o dependencias instaladas

set -e

echo "🧪 Ejecutando tests de HabitatPro..."
echo ""

# Verificar si estamos en un venv
if [ -z "$VIRTUAL_ENV" ]; then
    echo "⚠️  Virtual environment no detectado"
    echo "💡 Activa el venv primero: source venv/bin/activate"
    echo ""
    read -p "¿Continuar de todas formas? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Verificar que pytest está instalado
if ! python3 -m pytest --version &> /dev/null; then
    echo "❌ pytest no está instalado"
    echo "💡 Instala dependencias: pip install -r requirements.txt"
    exit 1
fi

echo "✅ Ejecutando tests..."
echo ""

# Ejecutar tests
python3 -m pytest tests/ -v --tb=short

echo ""
echo "✅ Tests completados"
