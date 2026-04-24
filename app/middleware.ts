import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  
  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
  const isPublicRoute = ["/", "/login", "/setup"].includes(nextUrl.pathname);
  const isApiRouteProtected = nextUrl.pathname.startsWith("/api/auth/username");
  
  // Allow NextAuth API routes
  if (isApiAuthRoute) {
    return NextResponse.next();
  }
  
  // Allow public routes
  if (isPublicRoute) {
    // If logged in and trying to access /login, redirect to groups
    if (isLoggedIn && nextUrl.pathname === "/login") {
      return NextResponse.redirect(new URL("/groups", nextUrl));
    }
    return NextResponse.next();
  }
  
  // Protect routes - require authentication
  if (!isLoggedIn) {
    const callbackUrl = nextUrl.pathname;
    return NextResponse.redirect(
      new URL(`/login?callbackUrl=${callbackUrl}`, nextUrl)
    );
  }
  
  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*$).)",
  ],
};