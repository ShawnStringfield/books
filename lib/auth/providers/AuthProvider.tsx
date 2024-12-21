import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import type { AuthContextType, Session, AuthError, LoadingState, SignInResult, SignInOptions } from '../types';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
  onError?: (error: AuthError) => void;
  sessionRefreshInterval?: number;
}

const initialLoadingState: LoadingState = {
  isInitializing: true,
  isRefreshing: false,
  isSigningIn: false,
  isSigningOut: false,
};

export const AuthProvider = ({
  children,
  onError,
  sessionRefreshInterval = 5 * 60 * 1000, // 5 minutes default
}: AuthProviderProps) => {
  const { data: sessionData, status, update: refreshSession } = useSession();
  const [error, setError] = useState<AuthError | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>(initialLoadingState);

  // Update initializing state based on NextAuth status
  useEffect(() => {
    if (status !== 'loading') {
      setLoadingState((prev: LoadingState) => ({ ...prev, isInitializing: false }));
    }
  }, [status]);

  // Helper to update loading states
  const updateLoadingState = useCallback((key: keyof LoadingState, value: boolean) => {
    setLoadingState((prev: LoadingState) => ({ ...prev, [key]: value }));
  }, []);

  // Convert NextAuth session to our custom session type
  const session: Session = useMemo(() => {
    return {
      user: sessionData?.user
        ? {
            id: sessionData.user.id,
            email: sessionData.user.email,
            name: sessionData.user.name,
            image: sessionData.user.image,
            accessToken: sessionData.user.accessToken,
          }
        : null,
      isAuthenticated: !!sessionData?.user,
    };
  }, [sessionData]);

  // Error handling utility
  const handleError = useCallback(
    (error: unknown, code: AuthError['code']) => {
      const authError: AuthError = {
        code,
        message: error instanceof Error ? error.message : 'An error occurred',
        cause: error,
      };
      setError(authError);
      onError?.(authError);
      throw authError;
    },
    [onError]
  );

  const handleSignIn = useCallback(
    async (provider = 'google', options: SignInOptions = {}): Promise<SignInResult> => {
      try {
        setError(null);
        updateLoadingState('isSigningIn', true);

        const defaultOptions = {
          redirect: true,
          callbackUrl: '/',
        };

        const signInOptions = { ...defaultOptions, ...options };

        const result = await signIn(provider, {
          redirect: signInOptions.redirect,
          callbackUrl: signInOptions.callbackUrl,
        });

        // If redirect is true, signIn will redirect and not return
        // If redirect is false, we get a result
        if (result) {
          if (result.error) {
            throw new Error(result.error);
          }
          return {
            error: null,
            ok: result.ok,
            url: result.url,
          };
        }

        // If no result, it means we're redirecting
        return {
          error: null,
          ok: true,
          url: signInOptions.callbackUrl,
        };
      } catch (error) {
        const authError: AuthError = {
          code: 'SIGN_IN_ERROR',
          message: error instanceof Error ? error.message : 'Failed to sign in',
          cause: error,
        };
        setError(authError);
        onError?.(authError);

        return {
          error: authError.message,
          ok: false,
          url: null,
        };
      } finally {
        updateLoadingState('isSigningIn', false);
      }
    },
    [updateLoadingState, onError]
  );

  const handleSignOut = useCallback(async () => {
    try {
      setError(null);
      updateLoadingState('isSigningOut', true);
      await signOut({ callbackUrl: '/' });
    } catch (error) {
      handleError(error, 'SIGN_OUT_ERROR');
    } finally {
      updateLoadingState('isSigningOut', false);
    }
  }, [handleError, updateLoadingState]);

  const handleRefreshSession = useCallback(async () => {
    try {
      setError(null);
      updateLoadingState('isRefreshing', true);
      await refreshSession();
    } catch (error) {
      handleError(error, 'REFRESH_ERROR');
    } finally {
      updateLoadingState('isRefreshing', false);
    }
  }, [refreshSession, handleError, updateLoadingState]);

  // Periodic session refresh
  useEffect(() => {
    if (!session.user) return;

    const checkSession = async () => {
      try {
        await handleRefreshSession();
      } catch (error) {
        handleError(error, 'SESSION_EXPIRED');
      }
    };

    const interval = setInterval(checkSession, sessionRefreshInterval);
    return () => clearInterval(interval);
  }, [session.user, handleRefreshSession, sessionRefreshInterval, handleError]);

  // Compute overall loading state
  const isLoading = useMemo(() => Object.values(loadingState).some(Boolean), [loadingState]);

  // Context value
  const value = useMemo(
    () => ({
      user: session.user,
      session,
      loadingState,
      isLoading,
      error,
      signIn: handleSignIn,
      signOut: handleSignOut,
      refreshSession: handleRefreshSession,
    }),
    [session, loadingState, isLoading, error, handleSignIn, handleSignOut, handleRefreshSession]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
