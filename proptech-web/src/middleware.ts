import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("auth_token"); // 🔐 Verificamos si hay un token de autenticación
  const isAuthenticated = !!token; // ✅ Si hay token, el usuario está autenticado
  
  const adminRoutes = ["/admin", "/admin/properties/add"];

  if (adminRoutes.includes(req.nextUrl.pathname) && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", req.url)); // 🚫 Redirige si no está autenticado
  }

  return NextResponse.redirect(new URL("/auth/login", req.url)); 

}

export const config = {
  matcher: ["/admin/:path*"] // 🔍 Aplica el middleware solo a rutas bajo `/admin/`
};
