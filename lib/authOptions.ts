import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { SupabaseAdapter } from '@auth/supabase-adapter';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      authorization: {
        params: {
          scope: 'openid email profile',
        },
      },
    }),
  ],
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  }),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  debug: true,
  pages: {
    signIn: '/auth/login',
    signOut: '/auth/signout',
    error: '/auth/error', // Error code passed in query string as ?error=
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token,
          userId: user.id,
        };
      }
      return token;
    },
    async session({ session, user, token }) {
      console.log('Session callback:', { session, user, token });
      return {
        ...session,
        user: {
          ...session.user,
          id: token.userId, // From your JWT token
          accessToken: token.accessToken, // From your JWT token
        },
      };
    },
  },
  logger: {
    error(code, metadata) {
      // Log errors to your error monitoring service
      if (process.env.NODE_ENV === 'production') {
        // Example with Sentry
        // Sentry.captureException(new Error(code), {
        //   extra: { metadata },
        // });
      }
      console.error('[Auth] Error:', { code, metadata });
    },
    warn(code) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('[Auth] Warning:', code);
      }
    },
    debug(code, metadata) {
      if (process.env.NODE_ENV !== 'production') {
        console.debug('[Auth] Debug:', { code, metadata });
      }
    },
  },
};
