'use client';

import { signIn, useSession } from 'next-auth/react';

export default function SignInPage() {
  const { data: session } = useSession();

  if (session) {
    console.log('session', session.user);
    return <div>Signed in as {session.user?.email}</div>;
  }

  return <button onClick={() => signIn('google')}>Sign in with Google</button>;
}
