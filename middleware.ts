import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get("auth-token");
  const onboardingState = request.cookies.get("user-onboarding-state");

  // Add paths that should be protected
  const protectedPaths = ["/dashboard", "/profile"];
  const isProtectedPath = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path),
  );

  // If trying to access a protected path
  if (isProtectedPath) {
    // Check if user is authenticated
    if (!authToken) {
      const redirectUrl = new URL("/auth/login", request.url);
      redirectUrl.searchParams.set("from", request.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // If authenticated but no onboarding state, redirect to onboarding
    if (
      !onboardingState &&
      !request.nextUrl.pathname.startsWith("/profile-onboarding")
    ) {
      return NextResponse.redirect(new URL("/profile-onboarding", request.url));
    }
  }

  // If already authenticated and trying to access auth pages
  if (authToken && request.nextUrl.pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/auth/:path*",
    // Add other protected routes here
  ],
};
