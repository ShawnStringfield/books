import { User as FirebaseUser } from 'firebase/auth';

export type User = FirebaseUser;

export interface AuthError {
  code: string;
  message: string;
  cause?: unknown;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

export type AuthAction = 'signin' | 'signup' | 'signout' | null;

// Event types for loading states
export type AuthEventType = 'signIn' | 'signOut' | 'error';

// Base payload type
export interface BaseEventPayload {
  timestamp: number;
  userId?: string;
}

// Event-specific payload types
export type AuthEventPayload = {
  signIn: BaseEventPayload & {
    user: User;
  };
  signOut: BaseEventPayload;
  error: BaseEventPayload & AuthError;
};

// Event listener type
export type AuthEventListener<T extends AuthEventType = AuthEventType> = (event: AuthEventPayload[T]) => void | Promise<void>;
