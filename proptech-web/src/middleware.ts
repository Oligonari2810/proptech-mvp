import { NextResponse } from "next/server";

import { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const isAdmin = request.cookies.get("admin_token"); // 🔹 Si usas JWT, cambia esto
  if (!isAdmin) {
    return NextResponse.redirect(new URL("/", request.url)); // 🔹 Si no es admin, redirige a la página principal
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"], // 🔹 Aplica la restricción a todas las rutas dentro de /admin
};
