#!/bin/bash

# Script de Verificación Post-Deploy
# Ejecuta verificaciones automáticas después del deploy

set -e

echo "🔍 VERIFICACIÓN POST-DEPLOY - HABITATPRO"
echo "========================================"
echo ""

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Configuración (actualizar con tus URLs reales)
FRONTEND_URL="${FRONTEND_URL:-https://habitatprord.com}"
BACKEND_URL="${BACKEND_URL:-https://habitatpro-backend.onrender.com}"

PASSED=0
FAILED=0

# Función para verificar endpoint
check_endpoint() {
    local name=$1
    local url=$2
    local expected_status=${3:-200}
    
    echo "🔍 Verificando: $name"
    echo "   URL: $url"
    
    response=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null || echo "000")
    
    if [ "$response" = "$expected_status" ] || [ "$response" = "200" ]; then
        echo -e "   ${GREEN}✅ OK (Status: $response)${NC}"
        ((PASSED++))
        return 0
    else
        echo -e "   ${RED}❌ FALLÓ (Status: $response)${NC}"
        ((FAILED++))
        return 1
    fi
}

# Función para verificar JSON
check_json() {
    local name=$1
    local url=$2
    
    echo "🔍 Verificando JSON: $name"
    echo "   URL: $url"
    
    response=$(curl -s "$url" 2>/dev/null || echo "ERROR")
    
    if echo "$response" | jq . >/dev/null 2>&1; then
        echo -e "   ${GREEN}✅ JSON válido${NC}"
        ((PASSED++))
        return 0
    else
        echo -e "   ${YELLOW}⚠️  No es JSON válido o endpoint no responde${NC}"
        echo "   Response: ${response:0:100}"
        ((FAILED++))
        return 1
    fi
}

echo "📋 CONFIGURACIÓN:"
echo "   Frontend URL: $FRONTEND_URL"
echo "   Backend URL: $BACKEND_URL"
echo ""

# Verificar jq disponible
if ! command -v jq &> /dev/null; then
    echo -e "${YELLOW}⚠️  jq no disponible - instalando...${NC}"
    echo "   brew install jq (macOS)"
    echo "   o descomentar verificaciones JSON"
fi

echo ""
echo "1. 🌐 VERIFICACIÓN FRONTEND"
echo "==========================="

check_endpoint "Homepage" "$FRONTEND_URL"
check_endpoint "Comprar Page" "$FRONTEND_URL/comprar"
check_endpoint "Valorar Page" "$FRONTEND_URL/valorar"
check_endpoint "Calculadora Hipotecaria" "$FRONTEND_URL/calculadora-hipotecaria"
check_endpoint "Leyes RD" "$FRONTEND_URL/leyes-inmobiliarias"

echo ""
echo "2. 🔧 VERIFICACIÓN BACKEND"
echo "=========================="

if command -v jq &> /dev/null; then
    check_json "Health Check" "$BACKEND_URL/api/health"
    
    # Test Emotional Valuation API
    echo "🔍 Test Emotional Valuation API"
    response=$(curl -s -X POST "$BACKEND_URL/api/ai/valuation/emotional" \
        -H "Content-Type: application/json" \
        -d '{
            "area": 100,
            "bedrooms": 3,
            "bathrooms": 2,
            "propertyType": "apartment",
            "zone": "premium",
            "condition": "good",
            "year": 2020,
            "hasPool": false,
            "hasParking": true,
            "proximityBeach": 5,
            "proximitySchools": 1
        }' 2>/dev/null || echo "ERROR")
    
    if echo "$response" | jq . >/dev/null 2>&1; then
        echo -e "   ${GREEN}✅ Emotional Valuation API: OK${NC}"
        ((PASSED++))
    else
        echo -e "   ${YELLOW}⚠️  Emotional Valuation API: No responde correctamente${NC}"
        echo "   Response: ${response:0:100}"
        ((FAILED++))
    fi
    
    # Test Properties API
    check_json "Properties List" "$BACKEND_URL/api/properties?limit=5"
else
    echo -e "${YELLOW}⚠️  jq no disponible - saltando verificaciones JSON${NC}"
    check_endpoint "Health Check" "$BACKEND_URL/api/health"
    check_endpoint "Properties API" "$BACKEND_URL/api/properties?limit=5"
fi

echo ""
echo "3. 🔗 VERIFICACIÓN INTEGRACIÓN"
echo "=============================="

echo "🔍 Verificando que frontend puede conectar con backend..."
if curl -s "$FRONTEND_URL" | grep -q "habitatpro\|HabitatPro" 2>/dev/null; then
    echo -e "   ${GREEN}✅ Frontend carga correctamente${NC}"
    ((PASSED++))
else
    echo -e "   ${YELLOW}⚠️  Frontend puede tener problemas (verificar manualmente)${NC}"
    ((FAILED++))
fi

echo ""
echo "========================================"
echo "📊 RESUMEN VERIFICACIÓN"
echo "========================================"
echo ""
echo -e "${GREEN}✅ Pasados: $PASSED${NC}"
echo -e "${RED}❌ Fallados: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 ¡TODAS LAS VERIFICACIONES PASARON!${NC}"
    echo ""
    echo "✅ HabitatPro está funcionando correctamente en producción"
    echo ""
    echo "📝 PRÓXIMOS PASOS:"
    echo "   1. Enviar emails a brokers beta"
    echo "   2. Configurar analytics y monitoring"
    echo "   3. Iniciar onboarding brokers"
    echo ""
    exit 0
else
    echo -e "${YELLOW}⚠️  ALGUNAS VERIFICACIONES FALLARON${NC}"
    echo ""
    echo "📝 ACCIONES REQUERIDAS:"
    echo "   1. Revisar errores específicos arriba"
    echo "   2. Verificar logs en Vercel (frontend)"
    echo "   3. Verificar logs en Render (backend)"
    echo "   4. Verificar environment variables"
    echo "   5. Re-ejecutar verificaciones después de correcciones"
    echo ""
    exit 1
fi

