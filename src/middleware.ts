import { NextRequest, NextResponse } from "next/server";

import { getSessionCookie } from "better-auth/cookies";

// Define your route patterns
const publicRoutes = [
  "/",
  "/register",
  "/login",
  "/forgot-password",
  "/reset-password",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
];

const authRoutes = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
];

const protectedRoutes = ["/dashboard", "/profile", "/settings", "/admin"];

const adminRoutes = ["/admin"];

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for API routes, static files, and Next.js internals
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Get session cookie
  const sessionCookie = getSessionCookie(request);
  const isAuthenticated = !!sessionCookie;

  // Check if current path is public, auth, protected, or admin route
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
  const isAuthRoute = authRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
  const isAdminRoute = adminRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  // Redirect authenticated users away from auth routes
  if (isAuthenticated && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Redirect unauthenticated users from protected routes
  if (!isAuthenticated && (isProtectedRoute || isAdminRoute)) {
    const loginUrl = new URL("/login", request.url);
    // Preserve the original URL for redirect after login
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // For admin routes, we might want additional checks
  // Note: This only checks for session existence, not user roles
  // You should validate admin permissions on the server side
  if (isAuthenticated && isAdminRoute) {
    // You could add additional checks here if needed
    // For now, we'll let it pass and handle role validation server-side
  }

  return NextResponse.next();
}

// Alternative middleware with custom cookie configuration
export function createMiddlewareWithCustomConfig(cookieOptions?: {
  cookieName?: string;
  cookiePrefix?: string;
}) {
  return async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Skip middleware for API routes, static files, and Next.js internals
    if (
      pathname.startsWith("/api/") ||
      pathname.startsWith("/_next/") ||
      pathname.startsWith("/favicon.ico") ||
      pathname.includes(".")
    ) {
      return NextResponse.next();
    }

    // Get session cookie with custom configuration
    const sessionCookie = getSessionCookie(request, {
      cookieName: cookieOptions?.cookieName,
      cookiePrefix: cookieOptions?.cookiePrefix,
    });
    const isAuthenticated = !!sessionCookie;

    // Apply the same routing logic as above
    const isPublicRoute = publicRoutes.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`),
    );
    const isAuthRoute = authRoutes.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`),
    );
    const isProtectedRoute = protectedRoutes.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`),
    );
    const isAdminRoute = adminRoutes.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`),
    );

    if (isAuthenticated && isAuthRoute) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (!isAuthenticated && (isProtectedRoute || isAdminRoute)) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  };
}

// Advanced middleware with additional features
export function createAdvancedMiddleware() {
  return async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Skip middleware for API routes, static files, and Next.js internals
    if (
      pathname.startsWith("/api/") ||
      pathname.startsWith("/_next/") ||
      pathname.startsWith("/favicon.ico") ||
      pathname.includes(".")
    ) {
      return NextResponse.next();
    }

    const sessionCookie = getSessionCookie(request);
    const isAuthenticated = !!sessionCookie;

    // Create response object
    const response = NextResponse.next();

    // Add security headers
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

    // Route protection logic
    const isPublicRoute = publicRoutes.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`),
    );
    const isAuthRoute = authRoutes.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`),
    );
    const isProtectedRoute = protectedRoutes.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`),
    );
    const isAdminRoute = adminRoutes.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`),
    );

    // Handle authentication redirects
    if (isAuthenticated && isAuthRoute) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (!isAuthenticated && (isProtectedRoute || isAdminRoute)) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Add authentication status to response headers (optional)
    if (isAuthenticated) {
      response.headers.set("X-User-Authenticated", "true");
    }

    return response;
  };
}

// Configuration for matcher
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files with extensions
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*$).*)",
  ],
};
