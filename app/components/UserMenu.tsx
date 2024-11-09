'use client';

import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useSession, signOut } from 'next-auth/react';
import { Session } from 'next-auth';

export function UserMenu() {
  const { data: session } = useSession() as { data: Session | null };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-16 w-16 rounded-full flex items-center justify-center">
          <Avatar className="h-16 w-16">
            <AvatarImage src={session?.user?.image ?? ''} alt="@user" />
            <AvatarFallback>
              {session?.user?.name
                ?.split(' ')
                .map((n) => n.charAt(0))
                .join('') ?? '?'}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {session && (
          <>
            <DropdownMenuItem className="font-medium">{session.user?.name}</DropdownMenuItem>
            <DropdownMenuItem onClick={() => signOut()}>Sign out</DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
