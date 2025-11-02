#!/bin/bash

# Script Maestro: Testing Pre-Lanzamiento Completo
# Ejecuta todos los tests antes del lanzamiento

set -e  # Exit on error

echo "🚀 TESTING PRE-LANZAMIENTO HABITATPRO"
echo "======================================"
echo ""

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PASSED=0
FAILED=0

# Función para ejecutar test y capturar resultado
run_test() {
    local test_name=$1
    local test_command=$2
    
    echo ""
    echo "📋 Ejecutando: $test_name"
    echo "----------------------------------------"
    
    if eval "$test_command"; then
        echo -e "${GREEN}✅ $test_name: PASÓ${NC}"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}❌ $test_name: FALLÓ${NC}"
        ((FAILED++))
        return 1
    fi
}

# Verificar que estamos en el directorio correcto
if [ ! -d "proptech-web" ] || [ ! -d "proptech-backend" ]; then
    echo -e "${RED}❌ Error: Ejecutar desde la raíz del proyecto${NC}"
    exit 1
fi

echo "📍 Directorio: $(pwd)"
echo ""

# TEST 1: Health Check de APIs Backend
echo "🧪 TEST 1: Health Check de APIs Backend"
if run_test "Health Check APIs" "cd proptech-backend && python3 scripts/health_check_apis.py"; then
    echo "✅ Backend APIs operativas"
else
    echo "⚠️  Algunas APIs no están disponibles - verificar antes de lanzamiento"
fi

# TEST 2: Testing IA Emocional (si ts-node disponible)
if command -v ts-node &> /dev/null || command -v npx &> /dev/null; then
    echo ""
    echo "🧪 TEST 2: Testing IA Emocional Frontend"
    if command -v ts-node &> /dev/null; then
        run_test "IA Emocional Testing" "cd proptech-web && ts-node scripts/test-ia-emocional.ts"
    else
        run_test "IA Emocional Testing" "cd proptech-web && npx ts-node scripts/test-ia-emocional.ts"
    fi
else
    echo ""
    echo -e "${YELLOW}⚠️  ts-node no disponible - saltando test IA Emocional frontend${NC}"
    echo "   Instalar: npm install -g ts-node"
fi

# TEST 3: Build Frontend
echo ""
echo "🧪 TEST 3: Build Frontend"
if run_test "Build Next.js" "cd proptech-web && npm run build"; then
    echo "✅ Frontend build exitoso"
else
    echo "❌ Frontend build falló - REVISAR antes de lanzamiento"
fi

# TEST 4: Verificar variables de entorno (check básico)
echo ""
echo "🧪 TEST 4: Verificación Variables de Entorno"
if [ -f "proptech-web/.env.local" ] || [ -f "proptech-web/.env" ]; then
    echo "✅ Archivo .env encontrado"
    PASSED=$((PASSED + 1))
else
    echo -e "${YELLOW}⚠️  Archivo .env no encontrado en frontend${NC}"
    echo "   Verificar configuración de variables de entorno"
fi

if [ -f "proptech-backend/.env" ] || [ -f "proptech-backend/.env.local" ]; then
    echo "✅ Archivo .env encontrado en backend"
    PASSED=$((PASSED + 1))
else
    echo -e "${YELLOW}⚠️  Archivo .env no encontrado en backend${NC}"
    echo "   Verificar configuración de variables de entorno"
fi

# Resumen final
echo ""
echo "======================================"
echo "📊 RESUMEN FINAL DE TESTING"
echo "======================================"
echo ""
echo -e "${GREEN}✅ Tests Pasados: $PASSED${NC}"
echo -e "${RED}❌ Tests Fallados: $FAILED${NC}"
echo ""

# Verificar checklist producción
echo "📋 CHECKLIST PRODUCTION READY:"
echo "   Ver: docs/checklists/PRODUCTION_READY_CHECKLIST.md"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🏆 ¡TODOS LOS TESTS PASARON!${NC}"
    echo ""
    echo "✅ Sistema listo para lanzamiento"
    echo ""
    echo "📝 PRÓXIMOS PASOS:"
    echo "   1. Revisar checklist producción"
    echo "   2. Deploy a producción"
    echo "   3. Ejecutar health check post-deploy"
    echo "   4. Iniciar onboarding brokers beta"
    echo ""
    exit 0
else
    echo -e "${RED}⚠️  ALGUNOS TESTS FALLARON${NC}"
    echo ""
    echo "❌ Revisar errores antes de lanzamiento"
    echo ""
    echo "📝 ACCIONES REQUERIDAS:"
    echo "   1. Revisar logs de errores arriba"
    echo "   2. Corregir problemas identificados"
    echo "   3. Re-ejecutar tests"
    echo "   4. Solo proceder con lanzamiento si todos los tests pasan"
    echo ""
    exit 1
fi

