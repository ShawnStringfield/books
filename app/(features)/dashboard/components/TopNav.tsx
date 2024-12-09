import { DropdownMenuContent, DropdownMenuSeparator, DropdownMenuLabel, DropdownMenuItem } from '@/app/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar';
import { DropdownMenuTrigger } from '@/app/components/ui/dropdown-menu';
import { DropdownMenu } from '@/app/components/ui/dropdown-menu';
import { SidebarTrigger } from '@/app/components/ui/sidebar';
import { motion } from 'framer-motion';
import { Bell } from 'lucide-react';

interface User {
  name: string;
  email: string;
  avatar?: string;
}

const UserMenu = ({ user }: { user: User }) => (
  <DropdownMenu>
    <DropdownMenuTrigger className="focus:outline-none">
      <Avatar className="h-8 w-8">
        <AvatarImage src={user.avatar} alt={user.name} />
        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
      </Avatar>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="w-56">
      <DropdownMenuLabel>
        <div className="flex flex-col space-y-1">
          <p className="text-sm font-medium">{user.name}</p>
          <p className="text-xs text-gray-500">{user.email}</p>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem>Profile</DropdownMenuItem>
      <DropdownMenuItem>Settings</DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem className="text-red-600">Log out</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

const TopNav = () => {
  const mockUser: User = {
    name: 'John Doe',
    email: 'john@example.com',
  };

  return (
    <header className="h-16 border-b bg-white fixed top-0 right-0 left-0 z-30 pr-8 mx-auto">
      <div className="h-full flex items-center justify-between">
        <motion.button whileTap={{ scale: 0.95 }} className="p-2 hover:bg-gray-100 rounded-lg">
          <SidebarTrigger />
        </motion.button>

        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <Bell className="h-5 w-5" />
          </button>
          <UserMenu user={mockUser} />
        </div>
      </div>
    </header>
  );
};

export default TopNav;
