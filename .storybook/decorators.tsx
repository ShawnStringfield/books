import React from "react";
import { Decorator } from "@storybook/react";
import { createContext, useContext } from "react";
import type { User } from "firebase/auth";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

// Create a mock auth context with the correct type
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

// Create a decorator that provides the mock auth context
export const withAuth: Decorator = (Story, context) => {
  const mockAuth = context.parameters.mockData?.auth || {
    user: null,
    loading: false,
    signIn: async () => {},
    signUp: async () => {},
    logout: async () => {},
    signInWithGoogle: async () => {},
    resetPassword: async () => {},
  };

  return (
    <AuthContext.Provider value={mockAuth}>
      <Story />
    </AuthContext.Provider>
  );
};

// Export the mock useAuth hook for components to use
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
