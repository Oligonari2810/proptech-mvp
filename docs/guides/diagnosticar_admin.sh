#!/bin/bash
# diagnosticar_admin.sh - Diagnóstico HabitatPro Admin

echo "🔍 INICIANDO DIAGNÓSTICO HABITATPRO ADMIN"
echo "═══════════════════════════════════════════════════════════════════"
echo ""

echo "📡 1. VERIFICANDO BACKEND EN RENDER.COM..."
echo "─────────────────────────────────────────────────────────────────"
curl -s -I https://proptech-mvp-1.onrender.com/api/health | head -3
echo ""
curl -s https://proptech-mvp-1.onrender.com/api/health | python3 -c "import sys, json; d=json.load(sys.stdin); print(f'Status: {d.get(\"status\")}'); print(f'DB: {d.get(\"services\", {}).get(\"database\")}');" 2>&1 || echo "❌ Error parseando respuesta"
echo ""

echo "📊 2. VERIFICANDO ENDPOINT PROPERTIES..."
echo "─────────────────────────────────────────────────────────────────"
curl -s -I https://proptech-mvp-1.onrender.com/api/properties | head -3
echo ""

echo "🔧 3. VERIFICANDO VARIABLES DE ENTORNO EN CÓDIGO..."
echo "─────────────────────────────────────────────────────────────────"
cd proptech-web
grep -r "NEXT_PUBLIC_" app/ | grep -E "(MAPBOX|BACKEND)" | head -5 || echo "No encontrado en app/"
grep -r "NEXT_PUBLIC_" .env* 2>/dev/null | head -3 || echo "No hay archivo .env local"
cd ..
echo ""

echo "🗺️ 4. VERIFICANDO USO DE MAPBOX EN CÓDIGO..."
echo "─────────────────────────────────────────────────────────────────"
grep -r "mapbox" proptech-web/app --include="*.tsx" --include="*.ts" | grep -i "token\|MAPBOX" | head -5 || echo "No encontrado"
echo ""

echo "✅ DIAGNÓSTICO COMPLETADO"
