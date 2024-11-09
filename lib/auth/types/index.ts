// Core types reexported
export interface User {
  id: string;
  email: string | null | undefined;
  name: string | null | undefined;
  image?: string | null | undefined;
  accessToken?: string;
}

export interface AuthError {
  code: string;
  message: string;
}

export interface Session {
  user: {
    id: string;
    email: string | null;
    name: string | null;
    image: string | null;
    accessToken: string;
  } | null;
  isAuthenticated: boolean;
}

export interface AuthContextType {
  session: Session;
  isLoading: boolean;
  error: AuthError | null;
  signIn: (provider?: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

// Using type for union types and error structure
export type AuthErrorCode = 'SIGN_IN_ERROR' | 'SIGN_OUT_ERROR' | 'SESSION_ERROR' | 'REFRESH_ERROR' | 'NETWORK_ERROR' | 'UNKNOWN_ERROR';

// Event types
export type AuthEventType = 'signIn' | 'signOut' | 'sessionExpired' | 'sessionRefreshed' | 'error';

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
  signOut: BaseEventPayload & {
    user: User;
  };
  sessionExpired: BaseEventPayload & {
    lastActiveTime: number;
  };
  sessionRefreshed: BaseEventPayload & {
    expiresAt: number;
  };
  error: BaseEventPayload & AuthError;
};

// Unified event type with typed payloads
export type AuthEvent<T extends AuthEventType = AuthEventType> = {
  type: T;
  payload: AuthEventPayload[T];
};

// Event listener with optional type parameter for specific events
export type AuthEventListener<T extends AuthEventType = AuthEventType> = (event: AuthEvent<T>) => void | Promise<void>;

// Utility type for mapping event handlers
export type AuthEventHandlers = {
  [K in AuthEventType]?: AuthEventListener<K>;
};

// Context helper types
export interface AuthContextEvents {
  addEventListener: <T extends AuthEventType>(type: T, listener: AuthEventListener<T>) => () => void;
  removeEventListener: <T extends AuthEventType>(type: T, listener: AuthEventListener<T>) => void;
  emit: <T extends AuthEventType>(type: T, payload: AuthEventPayload[T]) => void;
}

export interface AuthContextValue {
  session: Session;
  isLoading: boolean;
  error: AuthError | null;
  signIn: (provider?: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
  addEventListener: (type: AuthEventType, listener: AuthEventListener) => () => void;
  removeEventListener: (type: AuthEventType, listener: AuthEventListener) => void;
}
