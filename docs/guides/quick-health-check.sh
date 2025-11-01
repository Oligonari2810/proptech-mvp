#!/bin/bash

# 🔍 HEALTH CHECK RÁPIDO - HABITATPRO
# Script para verificación rápida de servicios de producción

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "🔍 HEALTH CHECK RÁPIDO - HABITATPRO"
echo "===================================="
echo ""

# Frontend
echo "🌐 Frontend (Vercel):"
HOME_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "https://habitatprord.com/" 2>/dev/null || echo "000")
COMPRAR_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "https://habitatprord.com/comprar" 2>/dev/null || echo "000")

if [ "$HOME_STATUS" = "200" ]; then
    echo -e "  Home: ${GREEN}✓ $HOME_STATUS${NC}"
else
    echo -e "  Home: ${RED}✗ $HOME_STATUS${NC}"
fi

if [ "$COMPRAR_STATUS" = "200" ]; then
    echo -e "  Comprar: ${GREEN}✓ $COMPRAR_STATUS${NC}"
else
    echo -e "  Comprar: ${YELLOW}⚠ $COMPRAR_STATUS${NC}"
fi

echo ""

# Backend
echo "⚙️ Backend (Render):"
API_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "https://proptech-mvp-1.onrender.com/api/properties" 2>/dev/null || echo "000")
HEALTH_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "https://proptech-mvp-1.onrender.com/api/health" 2>/dev/null || echo "000")

if [ "$API_STATUS" = "200" ]; then
    echo -e "  API Properties: ${GREEN}✓ $API_STATUS${NC}"
else
    echo -e "  API Properties: ${RED}✗ $API_STATUS${NC}"
fi

if [ "$HEALTH_STATUS" = "200" ]; then
    echo -e "  Health Check: ${GREEN}✓ $HEALTH_STATUS${NC}"
else
    echo -e "  Health Check: ${RED}✗ $HEALTH_STATUS${NC}"
fi

echo ""

# Resumen
if [ "$HOME_STATUS" = "200" ] && [ "$API_STATUS" = "200" ] && [ "$HEALTH_STATUS" = "200" ]; then
    echo -e "${GREEN}✅ TODOS LOS SERVICIOS OPERATIVOS${NC}"
    exit 0
else
    echo -e "${YELLOW}⚠️ ALGUNOS SERVICIOS REQUIEREN ATENCIÓN${NC}"
    exit 1
fi

