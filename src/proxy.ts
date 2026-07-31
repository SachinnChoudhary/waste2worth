import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Always allow Next.js internal assets, auth API, and static files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const { supabaseResponse, user } = await updateSession(request);

  // Public routes that don't need auth
  const publicRoutes = ["/", "/login", "/signup", "/verify-pending", "/about", "/how-it-works", "/privacy", "/terms", "/auth/callback"];
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  if (isPublicRoute) {
    // Redirect authenticated users away from auth pages
    if (user && (pathname === "/login" || pathname === "/signup" || pathname === "/verify-pending")) {
      const role = user.user_metadata?.role || "COMPANY";

      if (role === "ADMIN") {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return supabaseResponse;
  }

  // All routes below require authentication
  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const role = user.user_metadata?.role || "COMPANY";

  // Admin routes
  if (pathname.startsWith("/admin")) {
    if (role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return supabaseResponse;
  }

  // Dashboard routes
  if (pathname.startsWith("/dashboard")) {
    if (role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return supabaseResponse;
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
