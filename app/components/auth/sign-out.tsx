import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/app/components/ui/alert';
import type { AuthAction, AuthError } from '@/lib/auth/types';
import { Button } from '@/app/components/ui/button';

interface SignOutProps {
  onSignOut: () => Promise<void>;
  error: AuthError | null;
  authAction: AuthAction;
}

export function SignOut({ onSignOut, error, authAction }: SignOutProps) {
  return (
    <>
      <h2 className="text-center text-3xl font-bold">Sign Out</h2>
      <p className="text-center">Are you sure you want to sign out?</p>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>
            {error.message}
            {error.code && <span className="block text-sm text-gray-500">Error code: {error.code}</span>}
          </AlertDescription>
        </Alert>
      )}

      <div className="flex justify-center space-x-4">
        <Button
          onClick={onSignOut}
          disabled={authAction !== null}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
          aria-busy={authAction === 'signout'}
        >
          {authAction === 'signout' ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing out...
            </>
          ) : (
            'Sign Out'
          )}
        </Button>
        <a
          href="/"
          className={`px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 ${authAction !== null ? 'pointer-events-none opacity-50' : ''}`}
          tabIndex={authAction !== null ? -1 : 0}
          aria-disabled={authAction !== null}
        >
          Cancel
        </a>
      </div>
    </>
  );
}
