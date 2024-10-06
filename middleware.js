// middleware.js
import { NextResponse } from 'next/server';

// This function will be called on every request.
export function middleware(request) {
  // You can add custom logic here
  console.log(`Requested path: ${request.nextUrl.pathname}`);

  // Example: Redirect user to a login page if not authenticated
  const isAuthenticated = request.cookies.get('auth')?.value;
  if (!isAuthenticated) {
    console.log('User is not authenticated');
  }

  // Allow the request to continue
  return NextResponse.next();
}

// Define routes for which the middleware should apply
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};