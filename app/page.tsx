'use client';

import { Button } from './components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './components/ui/avatar';
import { useSession, signOut } from 'next-auth/react';

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="w-full flex justify-center">
      <div className="w-[1200px] relative">
        <div className="absolute right-4 top-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-16 w-16 rounded-full">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={session?.user?.image ?? ''} alt="@user" />
                  <AvatarFallback>{session?.user?.name?.charAt(0) ?? '?'}</AvatarFallback>
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
        </div>
      </div>
    </div>
  );
}
