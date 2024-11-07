import { withAuth } from 'next-auth/middleware';

// Protect all routes except auth-related ones
export default withAuth;

export const config = {
  matcher: ['/((?!auth/login|api/auth|_next/static|_next/image|favicon.ico).*)'],
};
