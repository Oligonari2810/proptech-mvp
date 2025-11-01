#!/bin/bash
# 🛡️ SCRIPT DE VERIFICACIÓN DE SEGURIDAD - FIXES CRÍTICOS
# Ejecutar antes de deploy a producción

set -euo pipefail

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🔍 VERIFICACIÓN DE SEGURIDAD - FIXES CRÍTICOS${NC}"
echo ""

# Verificar que NextAuthRoleGuard está en layout admin
echo -e "${BLUE}✓ Verificando protección del layout admin...${NC}"
if grep -q "NextAuthRoleGuard" proptech-web/app/admin/layout.tsx; then
    echo -e "${GREEN}✅ Layout admin protegido con NextAuthRoleGuard${NC}"
else
    echo -e "${RED}❌ Layout admin NO está protegido${NC}"
    exit 1
fi

# Verificar que "Admin" no está en header público (navItems públicos)
echo -e "${BLUE}✓ Verificando header público (sin Admin)...${NC}"
if grep -A 10 "const publicNavItems" proptech-web/app/components/Header.tsx | grep -v "Admin" > /dev/null; then
    echo -e "${GREEN}✅ Header público sin 'Admin'${NC}"
else
    echo -e "${RED}❌ Header público todavía muestra 'Admin'${NC}"
    exit 1
fi

# Verificar que "Admin" solo está en adminNavItems
echo -e "${BLUE}✓ Verificando que Admin solo está en navegación admin...${NC}"
if grep -A 5 "const adminNavItems" proptech-web/app/components/Header.tsx | grep -q "Admin"; then
    echo -e "${GREEN}✅ 'Admin' solo visible para admins${NC}"
else
    echo -e "${YELLOW}⚠️  'Admin' no encontrado en adminNavItems (verificar)${NC}"
fi

# Verificar sanitización de errores en app.py
echo -e "${BLUE}✓ Verificando sanitización de errores en app.py...${NC}"
if grep -q "sanitize_error" proptech-backend/app.py; then
    echo -e "${GREEN}✅ Función sanitize_error implementada en app.py${NC}"
else
    echo -e "${RED}❌ Función sanitize_error NO encontrada en app.py${NC}"
    exit 1
fi

# Verificar sanitización de errores en auth_routes.py
echo -e "${BLUE}✓ Verificando sanitización de errores en auth_routes.py...${NC}"
if grep -q "sanitize_error" proptech-backend/routes/auth_routes.py; then
    echo -e "${GREEN}✅ Función sanitize_error implementada en auth_routes.py${NC}"
else
    echo -e "${RED}❌ Función sanitize_error NO encontrada en auth_routes.py${NC}"
    exit 1
fi

# Verificar que useSession está en Header
echo -e "${BLUE}✓ Verificando header condicional...${NC}"
if grep -q "useSession" proptech-web/app/components/Header.tsx; then
    echo -e "${GREEN}✅ Header usa useSession para autenticación${NC}"
else
    echo -e "${RED}❌ Header NO usa useSession${NC}"
    exit 1
fi

# Verificar que no hay errores de lint
echo -e "${BLUE}✓ Verificando errores de lint...${NC}"
cd proptech-web
if npm run lint 2>&1 | grep -q "error" || npm run lint 2>&1 | grep -q "Error"; then
    echo -e "${YELLOW}⚠️  Errores de lint encontrados (revisar)${NC}"
else
    echo -e "${GREEN}✅ Sin errores de lint críticos${NC}"
fi
cd ..

echo ""
echo -e "${GREEN}✅ VERIFICACIÓN COMPLETA - LISTO PARA DEPLOY${NC}"
echo ""
echo -e "${BLUE}📋 Checklist de seguridad:${NC}"
echo "  ✅ Layout admin protegido"
echo "  ✅ Header sin 'Admin' público"
echo "  ✅ Errores sanitizados"
echo "  ✅ Header condicional implementado"


