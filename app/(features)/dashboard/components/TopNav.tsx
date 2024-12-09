'use client';

import { SidebarTrigger } from '@/app/components/ui/sidebar';
import { motion } from 'framer-motion';
import { UserMenu } from '@/app/components/menus/UserMenu';
import { usePathname } from 'next/navigation';
import { Button } from '@/app/components/ui/button';
import Link from 'next/link';

interface NavAction {
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: 'default' | 'outline' | 'ghost';
  icon?: React.ReactNode;
}

interface RouteConfig {
  [key: string]: {
    title?: string;
    actions?: NavAction[];
  };
}

const routeConfig: RouteConfig = {
  '/dashboard': {
    title: 'Dashboard',
    actions: [
      {
        label: 'Add Book',
        href: '/books/new',
        variant: 'default',
      },
    ],
  },
  '/dashboard/books': {
    title: 'My Library',
    actions: [
      {
        label: 'Add Book',
        href: '/books/new',
        variant: 'default',
      },
      {
        label: 'Import Books',
        href: '/books/import',
        variant: 'outline',
      },
    ],
  },
  // Add more routes as needed
};

const TopNav = () => {
  const pathname = usePathname();

  // Find the most specific matching route
  const currentRoute = Object.keys(routeConfig)
    .filter((route) => pathname.startsWith(route))
    .sort((a, b) => b.length - a.length)[0];

  const config = currentRoute ? routeConfig[currentRoute] : null;

  if (!config) return null;

  return (
    <header className="h-16 border-b bg-white fixed top-0 right-0 left-0 z-30 pr-8">
      <div className="h-full flex items-center">
        <div className="flex-1">
          <motion.button whileTap={{ scale: 0.95 }} className="p-2 hover:bg-gray-100 rounded-lg">
            <SidebarTrigger />
          </motion.button>
        </div>
        <div className="flex-end">
          {config.actions?.map((action, index) =>
            action.href ? (
              <Link key={index} href={action.href}>
                <Button variant={action.variant || 'default'} size="sm" className="mx-2">
                  {action.icon && <span className="mr-2">{action.icon}</span>}
                  {action.label}
                </Button>
              </Link>
            ) : (
              <Button key={index} variant={action.variant || 'default'} onClick={action.onClick} size="sm">
                {action.icon && <span className="mr-2">{action.icon}</span>}
                {action.label}
              </Button>
            )
          )}
        </div>

        <div className="flex items-center space-x-4">
          <UserMenu />
        </div>
      </div>
    </header>
  );
};

export default TopNav;
