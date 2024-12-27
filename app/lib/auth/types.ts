export type AuthAction = "signin" | "signup" | "signout" | null;

export interface AuthError {
  code: string;
  message: string;
  cause?: unknown;
}
