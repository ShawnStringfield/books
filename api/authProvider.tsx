'use client';

import { SessionProvider } from 'next-auth/react';
import type { Session } from 'next-auth';

interface ProviderProps {
  children: React.ReactNode;
  session: Session | null;
}

export default function AuthProvider({ children, session }: ProviderProps) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
