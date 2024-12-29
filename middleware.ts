import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  console.log("Middleware executing for path:", request.nextUrl.pathname);

  const authToken = request.cookies.get("auth-token");

  // Add paths that should be protected
  const protectedPaths = ["/dashboard", "/profile"];
  const isProtectedPath = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path),
  );

  console.log("Route protection check:", {
    isProtectedPath,
    hasAuthToken: !!authToken,
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

    try {
      // Verify token and get user data from Firebase
      const verifyTokenResponse = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            idToken: authToken.value,
          }),
        },
      );

      if (!verifyTokenResponse.ok) {
        throw new Error("Invalid auth token");
      }

      const userData = await verifyTokenResponse.json();
      const uid = userData.users[0].localId;

      // Get user's onboarding status from Firestore
      const firestoreResponse = await fetch(
        `https://firestore.googleapis.com/v1/projects/${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}/databases/(default)/documents/users/${uid}`,
        {
          headers: {
            Authorization: `Bearer ${authToken.value}`,
          },
        },
      );

      if (!firestoreResponse.ok) {
        throw new Error("Failed to fetch user data");
      }

      const firestoreData = await firestoreResponse.json();
      const isOnboardingComplete =
        firestoreData.fields?.isOnboardingComplete?.booleanValue || false;

      // If authenticated but onboarding not complete, redirect to onboarding
      if (
        !isOnboardingComplete &&
        !request.nextUrl.pathname.startsWith("/profile-onboarding")
      ) {
        console.log("Onboarding not complete, redirecting to onboarding");
        return NextResponse.redirect(
          new URL("/profile-onboarding", request.url),
        );
      }
    } catch (error) {
      console.error("Error verifying auth token:", error);
      const redirectUrl = new URL("/auth/login", request.url);
      redirectUrl.searchParams.set("from", request.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Prevent completed users from accessing onboarding
  if (request.nextUrl.pathname.startsWith("/profile-onboarding") && authToken) {
    try {
      // Verify token and get user data
      const verifyTokenResponse = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            idToken: authToken.value,
          }),
        },
      );

      if (!verifyTokenResponse.ok) {
        throw new Error("Invalid auth token");
      }

      const userData = await verifyTokenResponse.json();
      const uid = userData.users[0].localId;

      // Get user's onboarding status
      const firestoreResponse = await fetch(
        `https://firestore.googleapis.com/v1/projects/${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}/databases/(default)/documents/users/${uid}`,
        {
          headers: {
            Authorization: `Bearer ${authToken.value}`,
          },
        },
      );

      if (!firestoreResponse.ok) {
        throw new Error("Failed to fetch user data");
      }

      const firestoreData = await firestoreResponse.json();
      const isOnboardingComplete =
        firestoreData.fields?.isOnboardingComplete?.booleanValue || false;

      if (isOnboardingComplete) {
        console.log("Onboarding already completed, redirecting to dashboard");
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    } catch (error) {
      console.error("Error checking onboarding status:", error);
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
