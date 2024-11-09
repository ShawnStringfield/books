'use client';

import { createContext, useCallback, useMemo } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { Session, AuthContextType } from '@/lib/auth/types/index';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: sessionData, status, update: refreshSession } = useSession();

  const isLoading = status === 'loading';

  const session: Session = useMemo(
    () => ({
      user: sessionData?.user
        ? {
            id: sessionData.user.id as string,
            email: sessionData.user.email,
            name: sessionData.user.name,
            image: sessionData.user.image,
            accessToken: sessionData.user.accessToken as string,
          }
        : null,
      isAuthenticated: !!sessionData?.user,
    }),
    [sessionData]
  );

  const handleSignIn = useCallback(async (provider = 'google') => {
    try {
      await signIn(provider, { callbackUrl: '/' });
    } catch (error) {
      console.error('Sign in error:', error);
      throw { message: 'Failed to sign in', code: 'SIGN_IN_ERROR' };
    }
  }, []);

  const handleSignOut = useCallback(async () => {
    try {
      await signOut({ callbackUrl: '/' });
    } catch (error) {
      console.error('Sign out error:', error);
      throw { message: 'Failed to sign out', code: 'SIGN_OUT_ERROR' };
    }
  }, []);

  const handleRefreshSession = useCallback(async () => {
    try {
      await refreshSession();
    } catch (error) {
      console.error('Session refresh error:', error);
      throw { message: 'Failed to refresh session', code: 'REFRESH_ERROR' };
    }
  }, [refreshSession]);

  const value = useMemo(
    () => ({
      session,
      isLoading,
      error: null,
      signIn: handleSignIn,
      signOut: handleSignOut,
      refreshSession: handleRefreshSession,
    }),
    [session, isLoading, handleSignIn, handleSignOut, handleRefreshSession]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
