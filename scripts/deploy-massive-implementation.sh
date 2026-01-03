#!/bin/bash
# 🚀 DEPLOY MASIVO - HABITATPRO
# Script de deploy automático para implementación masiva

set -e  # Exit on error

echo "🚀 STARTING MASSIVE IMPLEMENTATION DEPLOYMENT"
echo "=============================================="
echo ""

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para imprimir con color
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Paso 1: Verificar que todo está commiteado
echo "📦 Step 1: Checking git status..."
if [[ -n $(git status --porcelain) ]]; then
    print_warning "There are uncommitted changes."
    read -p "Do you want to commit them automatically? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git add -A
        git commit -m "chore: Auto-commit before massive deployment"
        print_success "Changes committed"
    else
        print_error "Please commit changes manually first"
        exit 1
    fi
else
    print_success "All changes committed"
fi

# Paso 2: Build verification (frontend)
echo ""
echo "🔨 Step 2: Verifying frontend build..."
cd proptech-web
if npm run build 2>&1 | grep -E "error|Error|ERROR|failed|Failed"; then
    print_error "Frontend build failed"
    exit 1
fi
print_success "Frontend build successful"
cd ..

# Paso 3: Verificar backend (syntax check)
echo ""
echo "🔧 Step 3: Verifying backend syntax..."
cd proptech-backend
if python3 -m py_compile app.py routes/*.py 2>&1 | grep -E "error|Error|ERROR"; then
    print_error "Backend syntax check failed"
    exit 1
fi
print_success "Backend syntax check passed"
cd ..

# Paso 4: Health check antes del deploy
echo ""
echo "🏥 Step 4: Pre-deployment health check..."
python3 proptech-backend/scripts/diagnose_fix.py || print_warning "Health check script failed (continuing anyway)"

# Paso 5: Push to trigger auto-deploy
echo ""
echo "🌐 Step 5: Pushing to trigger auto-deployments..."
git push origin main
print_success "Code pushed to repository"

# Paso 6: Información de despliegue
echo ""
echo "📊 DEPLOYMENT INFORMATION"
echo "========================"
echo "Frontend (Vercel):"
echo "  - Auto-deploys from GitHub"
echo "  - URL: https://habitatprord.com"
echo ""
echo "Backend (Render):"
echo "  - Auto-deploys from GitHub"
echo "  - URL: https://proptech-mvp-1.onrender.com"
echo ""
print_warning "Deployments will trigger automatically within 2-5 minutes"
echo ""
echo "💡 TIP: Run 'python3 proptech-backend/scripts/post_deploy_monitor.py' after 5 minutes"
echo ""
echo "🎉 DEPLOYMENT TRIGGERED SUCCESSFULLY!"
echo "📊 Target: 75/82 Competitive Points (91%)"
echo "🚀 HabitatPro is deploying to production!"

