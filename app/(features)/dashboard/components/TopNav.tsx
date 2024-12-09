import { SidebarTrigger } from '@/app/components/ui/sidebar';
import { motion } from 'framer-motion';
import { Bell } from 'lucide-react';
import { UserMenu } from '@/app/components/menus/UserMenu';

const TopNav = () => {
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
          <UserMenu />
        </div>
      </div>
    </header>
  );
};

export default TopNav;
