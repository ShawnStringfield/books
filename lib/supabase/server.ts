// lib/supabase/server.ts
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/utils/authOptions';

export async function withUserScope() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error('Not authenticated');
  }

  return {
    userId: session.user.id,
  };
}
