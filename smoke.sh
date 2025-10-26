#!/usr/bin/env bash
# smoke.sh — Smoke test para HabitatPro (front+back)

set -euo pipefail

FRONT_URL="${FRONT_URL:-https://habitatprord.com}"
BACK_URL="${BACK_URL:-https://habitatpro-backend.onrender.com}"
CURL_OPTS=(--silent --show-error --max-time 12 --connect-timeout 6 --location)

# Colores
GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; BLUE='\033[0;34m'; NC='\033[0m'

need(){ command -v "$1" >/dev/null 2>&1; }
fail(){ echo -e "${RED}✖ $1${NC}"; return 1; }
ok(){   echo -e "${GREEN}✔ $1${NC}"; }

need curl || { echo -e "${RED}curl no encontrado${NC}"; exit 2; }

retry(){
  local tries="${3:-3}" delay="${4:-1}"
  local desc="$1" cmd="$2"
  local i=1
  while true; do
    eval "$cmd" && { ok "$desc"; return 0; }
    (( i>=tries )) && { fail "$desc"; return 1; }
    echo -e "${YELLOW}↻ Reintentando ($i/$tries)...${NC}"
    sleep "$delay"; ((i++))
  done
}

http_status(){
  curl "${CURL_OPTS[@]}" -o /dev/null -w "%{http_code}" "$1"
}

http_body(){
  curl "${CURL_OPTS[@]}" "$1"
}

RESULTS=()

check_backend_health(){
  local url="$BACK_URL/health"
  local code; code="$(http_status "$url")"
  [[ "$code" == "200" ]] || { fail "BACK /health ($code)"; return 1; }
  ok "BACK /health OK"
}

check_backend_version(){
  local url="$BACK_URL/version"
  local code; code="$(http_status "$url")"
  [[ "$code" == "200" ]] || { fail "BACK /version ($code)"; return 1; }
  ok "BACK /version OK"
}

check_backend_properties(){
  local url="$BACK_URL/api/properties"
  local code; code="$(http_status "$url")"
  [[ "$code" == "200" ]] || { fail "BACK /api/properties ($code)"; return 1; }
  local body; body="$(http_body "$url")"
  local count=0
  if command -v jq >/dev/null 2>&1; then
    count="$(echo "$body" | jq 'if type=="array" then length else ( .properties // .data // [] | length ) end' 2>/dev/null || echo 0)"
  else
    count="$(echo "$body" | tr -cd '{' | wc -c | awk '{print $1}')"
  fi
  if [[ "$count" -ge 50 ]]; then
    ok "BACK /api/properties OK (≥50) — count=$count"
  else
    fail "BACK /api/properties insuficiente — count=$count (se esperan ≥50)"
    return 1
  fi
}

check_front_page(){
  local path="$1" expect="$2"
  local url="$FRONT_URL$path"
  local code; code="$(http_status "$url")"
  [[ "$code" == "200" ]] || { fail "FRONT $path ($code)"; return 1; }
  ok "FRONT $path OK"
}

check_front_comprar_not_empty(){
  local url="$FRONT_URL/comprar"
  local body; body="$(http_body "$url" | head -c 40000)"
  if echo "$body" | grep -qi "0 casas esperando"; then
    fail "FRONT /comprar muestra '0 casas esperando'"
    return 1
  fi
  ok "FRONT /comprar no muestra '0 casas esperando'"
}

echo -e "${BLUE}==> Smoke test HabitatPro${NC}"
echo "FRONT: $FRONT_URL"
echo "BACK : $BACK_URL"
echo

retry "Backend /health" "check_backend_health" 3 2 || RESULTS+=("BACK_HEALTH")
retry "Backend /version" "check_backend_version" 3 2 || RESULTS+=("BACK_VERSION")
retry "Backend /api/properties (≥50)" "check_backend_properties" 3 4 || RESULTS+=("BACK_PROPERTIES")
retry "Front /comprar status" "check_front_page '/comprar' ''" 2 3 || RESULTS+=("FRONT_COMPRAR")
retry "Front /comprar NO vacío" "check_front_comprar_not_empty" 2 3 || RESULTS+=("FRONT_COMPRAR_EMPTY")
retry "Front /valorar" "check_front_page '/valorar' ''" 2 3 || RESULTS+=("FRONT_VALORAR")
retry "Front /admin" "check_front_page '/admin' ''" 2 3 || RESULTS+=("FRONT_ADMIN")

echo
if [[ ${#RESULTS[@]} -eq 0 ]]; then
  echo -e "${GREEN}✅ SMOKE TEST PASS — Todo OK en producción${NC}"
  exit 0
else
  echo -e "${RED}❌ SMOKE TEST FAIL — Checks fallidos:${NC}"
  for r in "${RESULTS[@]}"; do echo " - $r"; done
  exit 1
fi
