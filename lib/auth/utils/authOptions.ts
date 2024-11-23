import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

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
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
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
          email: user.email,
          name: user.name,
          picture: user.image,
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
          email: token.email,
          name: token.name,
          picture: token.picture,
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
