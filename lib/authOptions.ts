import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { SupabaseAdapter } from '@auth/supabase-adapter';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  }),
  secret: process.env.NEXTAUTH_SECRET,

  debug: true,
  callbacks: {
    async signIn({ user, account, profile, email }) {
      console.log('Sign in attempt:', { user, account, profile, email });
      return true;
    },
    async session({ session, user, token }) {
      console.log('Session callback:', { session, user, token });
      return session;
    },
  },
  logger: {
    error(code, metadata) {
      console.error(code, metadata);
    },
    warn(code) {
      console.warn(code);
    },
    debug(code, metadata) {
      console.debug(code, metadata);
    },
  },
};
