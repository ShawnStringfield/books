import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE_KEYS = {
  AUTH_TOKEN: "auth-token",
  ONBOARDING_STATE: "user-onboarding-state",
} as const;

const PROTECTED_PATHS = ["/dashboard", "/profile"] as const;
const AUTH_PATHS = ["/auth"] as const;
const ONBOARDING_PATHS = ["/profile-onboarding"] as const;
const PUBLIC_PATHS = ["/", "/about", "/privacy", "/terms"] as const;

const createRedirectResponse = (url: URL) => {
  const response = NextResponse.redirect(url);
  // Prevent caching of redirects
  response.headers.set("x-middleware-cache", "no-cache");
  return response;
};

const addSecurityHeaders = (response: NextResponse) => {
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  return response;
};

export function middleware(request: NextRequest) {
  try {
    const pathname = request.nextUrl.pathname;

    // Skip middleware for public paths and static files
    const isPublicPath = PUBLIC_PATHS.some((path) => pathname === path);
    if (isPublicPath) {
      return addSecurityHeaders(NextResponse.next());
    }

    const authToken = request.cookies.get(COOKIE_KEYS.AUTH_TOKEN);
    const onboardingState = request.cookies.get(COOKIE_KEYS.ONBOARDING_STATE);

    // Create base response with security headers
    const response = addSecurityHeaders(NextResponse.next());

    const isProtectedPath = PROTECTED_PATHS.some((path) =>
      pathname.startsWith(path),
    );
    const isAuthPath = AUTH_PATHS.some((path) => pathname.startsWith(path));
    const isOnboardingPath = ONBOARDING_PATHS.some((path) =>
      pathname.startsWith(path),
    );

    // Handle authentication paths first
    if (isAuthPath) {
      return authToken
        ? createRedirectResponse(new URL("/dashboard", request.url))
        : response;
    }

    // If no auth token and trying to access protected or onboarding paths
    if (!authToken && (isProtectedPath || isOnboardingPath)) {
      const redirectUrl = new URL("/auth/login", request.url);
      redirectUrl.searchParams.set("from", pathname);
      return createRedirectResponse(redirectUrl);
    }

    // Handle onboarding paths
    if (isOnboardingPath) {
      return onboardingState
        ? createRedirectResponse(new URL("/dashboard", request.url))
        : response;
    }

    // Handle protected paths
    if (isProtectedPath && !onboardingState) {
      return createRedirectResponse(
        new URL("/profile-onboarding", request.url),
      );
    }

    return response;
  } catch (error) {
    console.error("Middleware error:", error);
    // In case of error, return response with security headers
    return addSecurityHeaders(NextResponse.next());
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
