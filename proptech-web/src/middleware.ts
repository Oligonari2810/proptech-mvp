import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  console.log("🌍 Middleware ejecutado en:", req.nextUrl.pathname); // 🔍 Log para depuración

  const token = req.cookies.get("auth_token"); // 🔐 Verificamos si hay un token de autenticación
  const isAuthenticated = !!token; // ✅ Si hay token, el usuario está autenticado

  // Permitir acceso libre a la página de login
  if (req.nextUrl.pathname.startsWith("/login")) {
    return NextResponse.next();
  }

  const adminRoutes = ["/admin", "/admin/properties/add"];

  if (adminRoutes.includes(req.nextUrl.pathname) && !isAuthenticated) {
    console.log("🚨 Acceso denegado a", req.nextUrl.pathname);
    return NextResponse.redirect(new URL("/login", req.url)); // 🚫 Redirige si no está autenticado
  }

  console.log("✅ Acceso permitido a", req.nextUrl.pathname);
  return NextResponse.next(); // ✅ Permite continuar si está autenticado
}

export const config = {
  matcher: ["/admin/:path*", "/login"], // 🔍 Aplica el middleware solo a rutas bajo `/admin/` y `/login`
};