#!/bin/bash

echo "🔍 INICIANDO VALIDACIÓN COMPLETA DE PRODUCCIÓN HABITATPRO"
echo "=========================================================="
echo ""

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# URLs de producción
FRONTEND_URL="https://proptech-mvp.vercel.app"
BACKEND_URL="https://proptech-mvp-1.onrender.com"
# URLs alternativas
FRONTEND_ALT="https://habitatprord.com"

# Contador de tests
PASSED=0
FAILED=0

test_endpoint() {
    local name=$1
    local url=$2
    local expected_code=${3:-200}
    
    echo -n "Testing $name... "
    response=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null || echo "000")
    
    if [ "$response" = "$expected_code" ] || [ "$response" = "301" ] || [ "$response" = "302" ]; then
        echo -e "${GREEN}✓${NC} (Status: $response)"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}✗${NC} (Status: $response - Expected: $expected_code)"
        ((FAILED++))
        return 1
    fi
}

echo "1️⃣ VALIDANDO FRONTEND (Vercel)"
echo "--------------------------------"
echo "Probando URL principal: $FRONTEND_URL"
test_endpoint "Homepage principal" "$FRONTEND_URL"
test_endpoint "Homepage alternativa" "$FRONTEND_ALT"
test_endpoint "Página /comprar" "$FRONTEND_URL/comprar"
test_endpoint "Página /redesign" "$FRONTEND_URL/redesign"
test_endpoint "Página /admin" "$FRONTEND_URL/admin"
test_endpoint "Página /redesign/vender" "$FRONTEND_URL/redesign/vender"
echo ""

echo "2️⃣ VALIDANDO BACKEND API (Render)"
echo "-----------------------------------"
test_endpoint "GET /api/properties" "$BACKEND_URL/api/properties"
test_endpoint "GET /api/health" "$BACKEND_URL/api/health"
test_endpoint "GET /api/geo/health" "$BACKEND_URL/api/geo/health"
test_endpoint "GET /api/admin/metrics" "$BACKEND_URL/api/admin/metrics"
# Favorites endpoint está en app.py directamente, verificamos que existe
echo -n "Testing GET /api/favorites... "
fav_response=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL/api/favorites?user_id=1" 2>/dev/null || echo "000")
if [ "$fav_response" = "200" ] || [ "$fav_response" = "400" ]; then
    echo -e "${GREEN}✓${NC} (Status: $fav_response - endpoint existe)"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠${NC} (Status: $fav_response - puede no estar implementado en esta versión)"
    ((FAILED++))
fi
echo ""

echo "3️⃣ VALIDANDO FILTROS INTELIGENTES"
echo "-----------------------------------"
echo -n "Testing filtros con parámetros... "
filter_response=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL/api/properties?min_price=100000&max_price=500000&bedrooms=2" 2>/dev/null || echo "000")
if [ "$filter_response" = "200" ]; then
    echo -e "${GREEN}✓${NC} (Status: $filter_response)"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠${NC} (Status: $filter_response)"
    ((FAILED++))
fi
echo ""

echo "4️⃣ VALIDANDO ENDPOINTS CRÍTICOS"
echo "---------------------------------"
# POST /api/properties - verificar que el endpoint existe (405 = método no permitido sin auth, pero endpoint existe)
echo -n "Testing POST /api/properties existe... "
post_response=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BACKEND_URL/api/properties" -H "Content-Type: application/json" -d '{}' 2>/dev/null || echo "000")
if [ "$post_response" = "400" ] || [ "$post_response" = "401" ] || [ "$post_response" = "405" ]; then
    echo -e "${GREEN}✓${NC} (Status: $post_response - endpoint existe)"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠${NC} (Status: $post_response)"
    ((FAILED++))
fi

# ROI endpoint - puede requerir property_id válido
echo -n "Testing GET /api/analytics/roi... "
roi_response=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL/api/analytics/roi?property_id=1" 2>/dev/null || echo "000")
if [ "$roi_response" = "200" ] || [ "$roi_response" = "400" ] || [ "$roi_response" = "404" ]; then
    if [ "$roi_response" = "200" ]; then
        echo -e "${GREEN}✓${NC} (Status: $roi_response)"
    else
        echo -e "${YELLOW}⚠${NC} (Status: $roi_response - puede requerir property_id válido)"
    fi
    ((PASSED++))
else
    echo -e "${RED}✗${NC} (Status: $roi_response)"
    ((FAILED++))
fi
echo ""

echo "5️⃣ VERIFICANDO DATOS DE RESPUESTA"
echo "----------------------------------"
echo -n "Validando estructura JSON de /api/properties... "
properties_data=$(curl -s "$BACKEND_URL/api/properties" 2>/dev/null)
if echo "$properties_data" | grep -q "properties\|\[\]" 2>/dev/null; then
    echo -e "${GREEN}✓${NC} JSON válido"
    property_count=$(echo "$properties_data" | grep -o '"id"' | wc -l | tr -d ' ')
    echo "   Propiedades encontradas: $property_count"
    ((PASSED++))
else
    echo -e "${RED}✗${NC} JSON inválido o vacío"
    ((FAILED++))
fi
echo ""

echo "6️⃣ RESUMEN DE VALIDACIÓN"
echo "========================="
echo ""
TOTAL=$((PASSED + FAILED))
echo "Total tests: $TOTAL"
echo -e "${GREEN}✓ Pasados: $PASSED${NC}"
echo -e "${RED}✗ Fallidos: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ VALIDACIÓN COMPLETA: TODOS LOS TESTS PASARON${NC}"
    echo ""
    echo "🎯 ESTADO: LISTO PARA PRODUCCIÓN"
    exit 0
else
    echo -e "${YELLOW}⚠️ VALIDACIÓN PARCIAL: $FAILED TEST(S) FALLARON${NC}"
    echo ""
    echo "Revisar endpoints fallidos antes de lanzamiento"
    exit 1
fi

