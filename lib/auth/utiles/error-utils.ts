import type { AuthErrorCode, AuthError } from '@/lib/auth/types';

export function isAuthError(error: unknown): error is AuthError {
  return typeof error === 'object' && error !== null && 'message' in error && typeof (error as AuthError).message === 'string';
}

export function normalizeError(error: unknown): AuthError {
  if (isAuthError(error)) {
    return {
      message: error.message,
      code: error.code as AuthErrorCode,
      cause: error,
    };
  }

  if (typeof error === 'string') {
    return {
      message: error,
      code: 'Default',
      cause: error,
    };
  }

  return {
    message: error instanceof Error ? error.message : 'An unexpected error occurred',
    code: 'Default',
    cause: error,
  };
}

export const getErrorMessage = (error: AuthError): string => {
  switch (error.code) {
    case 'Configuration':
      return 'There was a problem with the authentication configuration.';
    case 'AccessDenied':
      return 'Access was denied. You may not have permission to sign in.';
    case 'Verification':
      return 'The verification code was invalid or has expired.';
    case 'OAuthSignin':
      return 'There was a problem signing in with Google.';
    case 'OAuthCallback':
      return 'There was a problem processing the sign in.';
    case 'OAuthAccountNotLinked':
      return 'This account is already linked to another sign in method.';
    case 'SessionRequired':
      return 'Please sign in to access this page.';
    default:
      return error.message || 'An unexpected error occurred.';
  }
};
