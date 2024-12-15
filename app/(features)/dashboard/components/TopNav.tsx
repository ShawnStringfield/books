'use client';

import { UserMenu } from '@/app/components/menus/UserMenu';
import { usePathname } from 'next/navigation';
import { Button } from '@/app/components/ui/button';
import { HomeIcon } from 'lucide-react';
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
    actions?: NavAction[];
  };
}

const routeConfig: RouteConfig = {
  '/dashboard': {
    actions: [
      {
        label: 'Add Book',
        href: '/dashboard/library/new',
        variant: 'default',
      },
    ],
  },
  '/dashboard/library': {
    actions: [
      {
        label: 'Add Book',
        href: '/dashboard/library/new',
        variant: 'default',
      },
      {
        label: 'Import Books',
        href: '/dashboard/library/import',
        variant: 'outline',
      },
    ],
  },
  '/dashboard/library/': {
    actions: [
      {
        label: 'Add Book',
        href: '/dashboard/library/new',
        variant: 'default',
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

  return (
    <header className="h-16 border-b bg-white fixed top-0 right-0 left-0 z-30 px-8">
      <div className="h-full flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 transition-colors" aria-label="Go to Dashboard">
            <HomeIcon className="w-5 h-5" />
          </Link>
          <Link href="/dashboard/library" className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">
            Library
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          {config?.actions?.map((action, index) =>
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
