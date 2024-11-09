import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';

type ProtectedRouteOptions = {
  redirectUrl?: string;
  requireRoles?: string[];
};

type ProtectedRouteResult = {
  isLoading: boolean;
  isAuthenticated: boolean;
};

export const useProtectedRoute = (options: ProtectedRouteOptions = {}): ProtectedRouteResult => {
  const { redirectUrl = '/auth/login' } = options;
  const { session, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !session) {
      router.push(redirectUrl);
    }
  }, [isLoading, session, router, redirectUrl]);

  return {
    isLoading,
    isAuthenticated: !!session,
  };
};
