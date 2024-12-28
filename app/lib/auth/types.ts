export type AuthAction = "signin" | "signup" | null;

export interface AuthError {
  code?: string;
  message: string;
}
