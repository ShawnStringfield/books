'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import { useState } from 'react';

export default function AuthButton() {
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  console.log(session);

  const handleSignOut = async () => {
    setLoading(true);
    await signOut({ callbackUrl: '/' });
  };

  const handleSignIn = async () => {
    setLoading(true);
    await signIn('google', { callbackUrl: '/' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8">
        {session ? (
          <>
            <h2 className="text-center text-3xl font-bold">Sign Out</h2>
            <p className="text-center">Are you sure you want to sign out?</p>
            <div className="flex justify-center space-x-4">
              <button onClick={handleSignOut} disabled={loading} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                {loading ? 'Signing out...' : 'Sign Out'}
              </button>
              <a href="/" className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
                Cancel
              </a>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-center text-3xl font-bold">Sign In</h2>
            <div className="flex justify-center">
              <button onClick={handleSignIn} disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
