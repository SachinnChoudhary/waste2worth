import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const publicPaths = [
  "/",
  "/login",
  "/signup",
  "/verify-pending",
  "/about",
  "/how-it-works",
  "/privacy",
  "/terms",
  "/auth/callback",
  "/api/auth/register",
  "/api/auth/signout",
  "/api/auth/callback",
];

function isPublicPath(pathname: string): boolean {
  // Exact match or starts-with for path groups
  return publicPaths.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow static assets, _next internals, and favicon
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|gif|webp|css|js|woff2?)$/)
  ) {
    return NextResponse.next();
  }

  // Refresh the Supabase session (keeps cookies in sync)
  const { supabaseResponse, user } = await updateSession(request);

  // Public paths don't require auth
  if (isPublicPath(pathname)) {
    // If already logged in and visiting /login or /signup, redirect to dashboard
    if (user && (pathname === "/login" || pathname === "/signup")) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
    return supabaseResponse;
  }

  // Protected paths — redirect to login if not authenticated
  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    // Preserve the originally requested URL so we can redirect back after login
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
