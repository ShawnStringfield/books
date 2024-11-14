// app/auth/page.tsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth/hooks/useAuth';
import { SignIn } from '@/app/components/auth/sign-in';
import { SignOut } from '@/app/components/auth/sign-out';
import { Loader2 } from 'lucide-react';
import type { AuthAction, AuthError } from '@/lib/auth/types';
import { getErrorMessage, normalizeError } from '@/lib/auth/utils/error-utils';

export default function AuthPage(): JSX.Element {
  const [authAction, setAuthAction] = useState<AuthAction>(null);
  const [error, setError] = useState<AuthError | null>(null);
  const { session, signIn, signOut, isLoading } = useAuth();

  const handleSignIn = async (): Promise<void> => {
    setError(null);
    setAuthAction('signin');
    try {
      await signIn('google');
    } catch (err) {
      setAuthAction(null);
      const normalizedError = normalizeError(err);
      setError(normalizedError);
      console.error('Sign in error:', {
        message: normalizedError.message,
        code: normalizedError.code,
        details: normalizedError.cause,
      });
    }
  };

  const handleSignOut = async (): Promise<void> => {
    setError(null);
    setAuthAction('signout');
    try {
      await signOut();
    } catch (err) {
      setAuthAction(null);
      const normalizedError = normalizeError(err);
      setError(normalizedError);
      console.error('Sign out error:', {
        message: normalizedError.message,
        code: normalizedError.code,
        details: normalizedError.cause,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8">
        {session?.isAuthenticated ? (
          <SignOut
            onSignOut={handleSignOut}
            error={
              error && {
                ...error,
                message: getErrorMessage(error),
              }
            }
            authAction={authAction}
          />
        ) : (
          <SignIn
            onSignIn={handleSignIn}
            error={
              error && {
                ...error,
                message: getErrorMessage(error),
              }
            }
            authAction={authAction}
          />
        )}
      </div>
    </div>
  );
}
