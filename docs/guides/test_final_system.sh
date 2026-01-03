#!/bin/bash
# 🎯 TESTING FINAL HABITATPRO - Validación completa del sistema

echo "═══════════════════════════════════════════════════════════════════"
echo "🎯 TESTING FINAL HABITATPRO"
echo "═══════════════════════════════════════════════════════════════════"
echo ""

echo "🔧 FASE 1: BACKEND HEALTH CHECK"
echo "─────────────────────────────────────────────────────────────────"
HEALTH=$(curl -s "https://proptech-mvp-1.onrender.com/api/health")
echo "$HEALTH" | python3 -c "import sys, json; d=json.load(sys.stdin); print(f\"Status: {d.get('status')}\"); print(f\"DB: {d.get('services', {}).get('database')}\"); print(f\"Properties: {d.get('metrics', {}).get('total_properties')}\"); print(f\"Users: {d.get('metrics', {}).get('total_users')}\");"
echo ""

echo "📊 FASE 2: PROPERTIES API"
echo "─────────────────────────────────────────────────────────────────"
PROPS=$(curl -s "https://proptech-mvp-1.onrender.com/api/properties")
echo "$PROPS" | python3 -c "import sys, json; d=json.load(sys.stdin); print(f\"Success: {d.get('success')}\"); print(f\"Count: {d.get('count', 'N/A')}\"); print(f\"Error: {d.get('error', 'None')[:100] if d.get('error') else 'None'}\");" 2>&1 | head -5
echo ""

echo "🧠 FASE 3: IA VALUATION ENDPOINT"
echo "─────────────────────────────────────────────────────────────────"
IA_VAL=$(curl -s -X POST "https://proptech-mvp-1.onrender.com/api/ai/valuation" \
  -H "Content-Type: application/json" \
  -d '{"property_data": {"price": 300000, "bedrooms": 3, "bathrooms": 2, "surface": 120}}')
echo "$IA_VAL" | python3 -c "import sys, json; d=json.load(sys.stdin); print(f\"Estimated Value: ${d.get('estimatedValue', 'N/A'):,}\"); print(f\"Confidence: {d.get('confidence', 'N/A')}\"); print(f\"Error: {d.get('error', 'None')[:100] if d.get('error') else 'None'}\");" 2>&1 | head -5
echo ""

echo "🎯 FASE 4: IA RECOMMENDATIONS ENDPOINT"
echo "─────────────────────────────────────────────────────────────────"
IA_REC=$(curl -s -X POST "https://proptech-mvp-1.onrender.com/api/ai/recommend" \
  -H "Content-Type: application/json" \
  -d '{"user_preferences": {"budget": 400000, "bedrooms": 3}}')
echo "$IA_REC" | python3 -c "import sys, json; d=json.load(sys.stdin); print(f\"Recommendations: {len(d.get('recommendations', []))}\"); print(f\"Error: {d.get('error', 'None')[:100] if d.get('error') else 'None'}\");" 2>&1 | head -5
echo ""

echo "═══════════════════════════════════════════════════════════════════"
echo "✅ TESTING COMPLETADO"
echo "═══════════════════════════════════════════════════════════════════"
