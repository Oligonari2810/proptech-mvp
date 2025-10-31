#!/bin/bash
# Script para verificar variables de entorno necesarias

echo "🔍 VERIFICANDO VARIABLES DE ENTORNO NECESARIAS"
echo "═══════════════════════════════════════════════════════════════════"
echo ""

REQUIRED_VARS=(
  "NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN"
  "NEXT_PUBLIC_MAPBOX_TOKEN"
  "NEXT_PUBLIC_BACKEND_URL"
  "NEXTAUTH_SECRET"
)

echo "📋 VARIABLES REQUERIDAS:"
echo "─────────────────────────────────────────────────────────────────"
for var in "${REQUIRED_VARS[@]}"; do
  if grep -q "$var" .env* 2>/dev/null; then
    echo "✅ $var - Encontrada en .env"
  else
    echo "❌ $var - NO encontrada localmente"
    echo "   ⚠️  Debe estar configurada en Vercel Dashboard"
  fi
done

echo ""
echo "📝 NOTA IMPORTANTE:"
echo "─────────────────────────────────────────────────────────────────"
echo "Este script solo verifica archivos .env locales."
echo "En producción (Vercel), las variables deben estar en:"
echo "Vercel Dashboard → Project → Settings → Environment Variables"
echo ""
echo "Después de agregar variables en Vercel:"
echo "1. Vercel hará auto-deploy"
echo "2. O puedes forzar re-deploy manualmente"
echo ""
