import { useAuth as useRealAuth } from "../decorators";

// Re-export the mock useAuth hook
export const useAuth = useRealAuth;

// Mock the AuthProvider component if needed
export const AuthProvider = ({ children }: { children: React.ReactNode }) =>
  children;
