import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/lib/auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const session = req.auth;
  const { pathname } = req.nextUrl;

  const isPublicRoute =
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/verify-pending" ||
    pathname.startsWith("/api/auth");

  if (isPublicRoute) {
    if (session && (pathname === "/login" || pathname === "/signup")) {
      if (session.user?.role === "ADMIN") {
        return NextResponse.redirect(new URL("/admin", req.url));
      }
      if (session.user?.companyVerified) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
      return NextResponse.redirect(new URL("/verify-pending", req.url));
    }
    return NextResponse.next();
  }

  if (!session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (pathname.startsWith("/admin")) {
    if (session.user?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/dashboard")) {
    if (session.user?.role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    if (!session.user?.companyVerified) {
      return NextResponse.redirect(new URL("/verify-pending", req.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
