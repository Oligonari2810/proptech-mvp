#!/bin/bash
# Smoke test para verificar endpoints HTTP y WebSocket

set -e

BASE_URL="http://localhost:8000"
PROPERTY_ID="1"
USER_ID="1"

echo "=========================================="
echo "🧪 SMOKE TEST - HABITATPRO BACKEND"
echo "=========================================="
echo "Asegúrate de que el backend esté corriendo en $BASE_URL"
echo ""

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Contador de tests
TESTS_PASSED=0
TESTS_FAILED=0

test_endpoint() {
    local name=$1
    local method=$2
    local url=$3
    local data=$4
    
    echo -n "Testing $name... "
    
    if [ -z "$data" ]; then
        response=$(curl -s -w "\n%{http_code}" -X "$method" "$url" 2>&1)
    else
        response=$(curl -s -w "\n%{http_code}" -X "$method" "$url" \
            -H "Content-Type: application/json" \
            -d "$data" 2>&1)
    fi
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" -ge 200 ] && [ "$http_code" -lt 300 ]; then
        echo -e "${GREEN}✅ PASS${NC} (HTTP $http_code)"
        TESTS_PASSED=$((TESTS_PASSED + 1))
        return 0
    else
        echo -e "${RED}❌ FAIL${NC} (HTTP $http_code)"
        echo "  Response: $body"
        TESTS_FAILED=$((TESTS_FAILED + 1))
        return 1
    fi
}

# Test 1: Health check
echo "1. Health Check"
test_endpoint "GET /api/health" "GET" "$BASE_URL/api/health"
echo ""

# Test 2: Chat History
echo "2. Chat Endpoints"
test_endpoint "GET /api/chat/history/$PROPERTY_ID" "GET" "$BASE_URL/api/chat/history/$PROPERTY_ID"
echo ""

# Test 3: Send Message (REST)
echo "3. Send Message (REST)"
test_endpoint "POST /api/chat/send" "POST" "$BASE_URL/api/chat/send" \
    '{"propertyId":"'$PROPERTY_ID'","text":"Hola desde smoke test","brokerId":"B1"}'
echo ""

# Test 4: Notifications
echo "4. Notification Endpoints"
test_endpoint "GET /api/notifications/user/$USER_ID" "GET" "$BASE_URL/api/notifications/user/$USER_ID"
echo ""

# Test 5: Create Notification
echo "5. Create Notification (REST)"
test_endpoint "POST /api/notifications/create" "POST" "$BASE_URL/api/notifications/create" \
    '{"userId":"'$USER_ID'","title":"Ping","message":"Demo desde smoke test","type":"info"}'
echo ""

# Test 6: Mark Notification Read
echo "6. Mark Notification Read"
test_endpoint "POST /api/notifications/mark-read" "POST" "$BASE_URL/api/notifications/mark-read" \
    '{"userId":"'$USER_ID'","notificationId":"1"}'
echo ""

# Test 7: Properties
echo "7. Properties Endpoint"
test_endpoint "GET /api/properties" "GET" "$BASE_URL/api/properties"
echo ""

# Resumen
echo "=========================================="
echo "📊 RESUMEN DE TESTS"
echo "=========================================="
echo -e "${GREEN}✅ Tests pasados: $TESTS_PASSED${NC}"
echo -e "${RED}❌ Tests fallidos: $TESTS_FAILED${NC}"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ Todos los tests HTTP pasaron!${NC}"
    echo ""
    echo "Siguiente paso: Ejecutar smoke_socketio.py para probar WebSockets:"
    echo "  python smoke_socketio.py"
    exit 0
else
    echo -e "${RED}❌ Algunos tests fallaron${NC}"
    exit 1
fi

