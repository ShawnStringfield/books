'use client';

import { FC } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/app/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';

export const UserMenu: FC = () => {
  const { user, logout } = useAuth();

  const userInitial = user?.displayName?.[0] || user?.email?.[0] || 'U';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none cursor-pointer" asChild>
        <Avatar className="h-10 w-10">
          <AvatarImage src={user?.photoURL ?? ''} alt={user?.displayName ?? 'User avatar'} />
          <AvatarFallback>{userInitial}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{user?.displayName}</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
