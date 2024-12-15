'use client';

import { UserMenu } from '@/app/components/menus/UserMenu';
import { usePathname } from 'next/navigation';
import { Button } from '@/app/components/ui/button';
import { HomeIcon, PlusIcon, BookOpenIcon } from 'lucide-react';
import Link from 'next/link';
import { Sheet, SheetContent, SheetTrigger } from '@/app/components/ui/sheet';
import { AddBookForm } from './AddBookForm';
import { useState } from 'react';

interface NavAction {
  label: string;
  onClick?: () => void;
  variant?: 'default' | 'outline' | 'ghost';
  icon?: React.ReactNode;
  iconOnly?: boolean;
  href?: string;
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
        variant: 'ghost',
        icon: <PlusIcon className="w-4 h-4" />,
        iconOnly: false,
      },
    ],
  },
  '/dashboard/library': {
    actions: [
      {
        label: 'Add Book',
        variant: 'ghost',
        icon: <PlusIcon className="w-4 h-4" />,
        iconOnly: false,
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
        variant: 'ghost',
        icon: <PlusIcon className="w-4 h-4" />,
        iconOnly: false,
      },
    ],
  },
  // Add more routes as needed
};

export default function TopNav() {
  const pathname = usePathname();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Find the most specific matching route
  const currentRoute = Object.keys(routeConfig)
    .filter((route) => pathname.startsWith(route))
    .sort((a, b) => b.length - a.length)[0];

  const config = currentRoute ? routeConfig[currentRoute] : null;

  return (
    <nav className="border-b bg-white">
      <div className="max-w-3xl mx-auto px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-6">
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 transition-colors" aria-label="Go to Dashboard">
              <HomeIcon className="w-5 h-5" />
            </Link>
            <Link
              href="/dashboard/library"
              className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium flex items-center gap-2"
            >
              <BookOpenIcon className="w-5 h-5" />
              <span className="hidden sm:inline">Library</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {config?.actions?.map((action, index) => {
              if (action.label === 'Add Book') {
                return (
                  <Sheet key={index} open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <SheetTrigger asChild>
                      <Button
                        variant={action.variant || 'default'}
                        size="sm"
                        className="flex items-center space-x-1.5 text-sm py-1.5"
                        aria-label={action.iconOnly ? action.label : undefined}
                      >
                        {action.icon && (
                          <span className="bg-slate-300 p-1.5 rounded-full hover:bg-slate-600 hover:text-white text-slate-600 transition-colors">
                            {action.icon}
                          </span>
                        )}
                        {(!action.iconOnly || action.label === 'Add Book') && <span>{action.label}</span>}
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-full sm:max-w-xl">
                      <AddBookForm onSuccess={() => setIsSheetOpen(false)} onClose={() => setIsSheetOpen(false)} />
                    </SheetContent>
                  </Sheet>
                );
              }

              return action.href ? (
                <Link key={index} href={action.href}>
                  <Button
                    variant={action.variant || 'default'}
                    size="sm"
                    className="flex items-center space-x-1.5 text-sm py-1.5"
                    aria-label={action.iconOnly ? action.label : undefined}
                  >
                    {action.icon && action.label === 'Add Book' && (
                      <span className="bg-slate-300 p-1.5 rounded-full hover:bg-slate-600 hover:text-white text-slate-600 transition-colors">
                        {action.icon}
                      </span>
                    )}
                    {(!action.iconOnly || action.label === 'Add Book') && <span>{action.label}</span>}
                  </Button>
                </Link>
              ) : (
                <Button
                  key={index}
                  variant={action.variant || 'default'}
                  onClick={action.onClick}
                  size="sm"
                  className="flex items-center space-x-1.5 text-sm py-1.5"
                  aria-label={action.iconOnly ? action.label : undefined}
                >
                  {action.icon && action.label === 'Add Book' && (
                    <span className="bg-slate-300 p-1.5 rounded-full hover:bg-slate-600 hover:text-white text-slate-600 transition-colors">
                      {action.icon}
                    </span>
                  )}
                  {(!action.iconOnly || action.label === 'Add Book') && <span>{action.label}</span>}
                </Button>
              );
            })}
          </div>

          <div className="flex items-center space-x-4">
            <UserMenu />
          </div>
        </div>
      </div>
    </nav>
  );
}
