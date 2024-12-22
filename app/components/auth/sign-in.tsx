import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/app/components/ui/alert';
import type { AuthAction, AuthError } from '@/lib/auth/types';
import { Button } from '@/app/components/ui/button';

interface SignInProps {
  onSignIn: () => Promise<void>;
  error: AuthError | null;
  authAction: AuthAction;
}

export function SignIn({ onSignIn, error, authAction }: SignInProps) {
  return (
    <>
      <h2 className="text-center text-3xl font-bold">Sign In</h2>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>
            {error.message}
            {error.code && <span className="block text-sm text-gray-500">Error code: {error.code}</span>}
          </AlertDescription>
        </Alert>
      )}

      <div className="flex justify-center">
        <Button
          onClick={onSignIn}
          disabled={authAction !== null}
          aria-busy={authAction === 'signin'}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
        >
          {authAction === 'signin' ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            'Sign In'
          )}
        </Button>
      </div>
    </>
  );
}
