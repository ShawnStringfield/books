import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  console.log("Middleware executing for path:", request.nextUrl.pathname);

  const authToken = request.cookies.get("auth-token");
  const onboardingState = request.cookies.get("user-onboarding-state");

  // Add paths that should be protected
  const protectedPaths = ["/dashboard", "/profile"];
  const isProtectedPath = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path),
  );

  console.log("Route protection check:", {
    isProtectedPath,
    hasAuthToken: !!authToken,
    hasOnboardingState: !!onboardingState,
    path: request.nextUrl.pathname,
  });

  // If trying to access a protected path
  if (isProtectedPath) {
    // Check if user is authenticated
    if (!authToken) {
      console.log("No auth token found, redirecting to login");
      const redirectUrl = new URL("/auth/login", request.url);
      redirectUrl.searchParams.set("from", request.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // If authenticated but no onboarding state, redirect to onboarding
    if (
      !onboardingState &&
      !request.nextUrl.pathname.startsWith("/profile-onboarding")
    ) {
      console.log("No onboarding state found, redirecting to onboarding");
      return NextResponse.redirect(new URL("/profile-onboarding", request.url));
    }
  }

  // Prevent completed users from accessing onboarding
  if (
    request.nextUrl.pathname.startsWith("/profile-onboarding") &&
    onboardingState
  ) {
    try {
      const onboardingData = JSON.parse(onboardingState.value);
      if (onboardingData.isOnboardingComplete) {
        console.log("Onboarding already completed, redirecting to dashboard");
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    } catch (error) {
      console.error("Error parsing onboarding state:", error);
    }
  }

  // If already authenticated and trying to access auth pages
  if (authToken && request.nextUrl.pathname.startsWith("/auth")) {
    console.log(
      "Authenticated user accessing auth page, redirecting to dashboard",
    );
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Allow the request to proceed
  console.log("Middleware check passed, proceeding with request");
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/auth/:path*",
    "/profile-onboarding/:path*", // Added to ensure onboarding routes are handled
  ],
};
