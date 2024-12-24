import { FirebaseError } from 'firebase/app';
import type { AuthError } from '@/lib/auth/types';

export function isFirebaseError(error: unknown): error is FirebaseError {
  return error instanceof FirebaseError;
}

export function normalizeError(error: unknown): AuthError {
  if (isFirebaseError(error)) {
    return {
      message: error.message,
      code: error.code,
      cause: error,
    };
  }

  if (typeof error === 'string') {
    return {
      message: error,
      code: 'unknown',
      cause: error,
    };
  }

  return {
    message: error instanceof Error ? error.message : 'An unexpected error occurred',
    code: 'unknown',
    cause: error,
  };
}

export const getErrorMessage = (error: AuthError): string => {
  if (isFirebaseError(error.cause)) {
    switch (error.code) {
      case 'auth/invalid-email':
        return 'The email address is invalid.';
      case 'auth/user-disabled':
        return 'This account has been disabled.';
      case 'auth/user-not-found':
        return 'No account found with this email.';
      case 'auth/wrong-password':
        return 'Incorrect password.';
      case 'auth/email-already-in-use':
        return 'This email is already registered.';
      case 'auth/weak-password':
        return 'The password is too weak.';
      case 'auth/popup-closed-by-user':
        return 'The sign in popup was closed before completing.';
      case 'auth/cancelled-popup-request':
        return 'The sign in was cancelled.';
      case 'auth/operation-not-allowed':
        return 'This sign in method is not enabled.';
      case 'auth/network-request-failed':
        return 'A network error occurred. Please check your connection.';
      default:
        return error.message || 'An unexpected error occurred.';
    }
  }

  return error.message || 'An unexpected error occurred.';
};
