// app/auth/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import { SignIn } from "@/app/components/auth/sign-in";
import { Loader2 } from "lucide-react";
import type { AuthAction, AuthError } from "@/lib/auth/types";
import { getErrorMessage, normalizeError } from "@/lib/auth/utils/error-utils";
import { useRouter, useSearchParams } from "next/navigation";

export default function AuthPage(): JSX.Element {
  const [authAction, setAuthAction] = useState<AuthAction>(null);
  const [error, setError] = useState<AuthError | null>(null);
  const { user, loading, signIn, signUp, signInWithGoogle } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // If user is already authenticated, redirect them
  useEffect(() => {
    if (user && !loading) {
      const redirectTo = searchParams.get("from") || "/";
      router.push(redirectTo);
    }
  }, [user, loading, router, searchParams]);

  const handleRedirectAfterAuth = () => {
    const redirectTo = searchParams.get("from") || "/";
    router.push(redirectTo);
  };

  const handleAuth = async (
    email?: string,
    password?: string
  ): Promise<void> => {
    if (!email || !password) return;

    setError(null);
    setAuthAction("signin");
    try {
      const isSignUp =
        document.forms[0]?.querySelector('button[type="submit"]')
          ?.textContent === "Create Account";

      if (isSignUp) {
        await signUp(email, password);
      } else {
        await signIn(email, password);
      }
      handleRedirectAfterAuth();
    } catch (err) {
      setAuthAction(null);
      const normalizedError = normalizeError(err);
      setError(normalizedError);
      console.error("Authentication error:", {
        message: normalizedError.message,
        code: normalizedError.code,
        details: normalizedError.cause,
      });
    }
  };

  const handleGoogleSignIn = async (): Promise<void> => {
    setError(null);
    setAuthAction("signin");
    try {
      await signInWithGoogle();
      handleRedirectAfterAuth();
    } catch (err) {
      setAuthAction(null);
      const normalizedError = normalizeError(err);
      setError(normalizedError);
      console.error("Google sign in error:", {
        message: normalizedError.message,
        code: normalizedError.code,
        details: normalizedError.cause,
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is already authenticated, show loading while redirect happens
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <SignIn
          onSignIn={handleAuth}
          onGoogleSignIn={handleGoogleSignIn}
          error={
            error && {
              ...error,
              message: getErrorMessage(error),
            }
          }
          authAction={authAction}
        />
      </div>
    </div>
  );
}
