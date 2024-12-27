import { AuthError } from "../types";
import { FirebaseError } from "firebase/app";

export function normalizeError(error: unknown): AuthError {
  if (error instanceof FirebaseError) {
    return {
      code: error.code,
      message: error.message,
      cause: error,
    };
  }

  if (error instanceof Error) {
    return {
      code: "unknown",
      message: error.message,
      cause: error,
    };
  }

  return {
    code: "unknown",
    message: "An unknown error occurred",
    cause: error,
  };
}

export function getErrorMessage(error: AuthError): string {
  // Map Firebase error codes to user-friendly messages
  switch (error.code) {
    case "auth/user-not-found":
    case "auth/wrong-password":
      return "Invalid email or password";
    case "auth/email-already-in-use":
      return "An account with this email already exists";
    case "auth/weak-password":
      return "Password should be at least 6 characters";
    case "auth/invalid-email":
      return "Please enter a valid email address";
    case "auth/popup-closed-by-user":
      return "Sign in was cancelled";
    case "auth/network-request-failed":
      return "Network error. Please check your connection";
    case "auth/too-many-requests":
      return "Too many attempts. Please try again later";
    case "auth/operation-not-allowed":
      return "This sign in method is not enabled";
    default:
      return error.message || "An error occurred during authentication";
  }
}
