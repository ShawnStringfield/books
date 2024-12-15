'use client';

import { ChevronRight } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { useRouter, usePathname } from 'next/navigation';

interface BreadcrumbItem {
  label: string;
  path: string;
  icon?: React.ReactNode;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Filter out the current page and any pages after it
  const visibleItems = items.slice(0, items.findIndex((item) => item.path === pathname) + 1);

  // If we're on the current page, remove it from the breadcrumb trail
  const displayItems = visibleItems.slice(0, -1);

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm -ml-1 pl-[2px] mt-4">
      {displayItems.map((item, index) => (
        <div key={item.path} className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(item.path)}
            className="text-gray-500 hover:text-gray-700 -ml-[9px] flex items-center gap-1.5"
          >
            {item.icon}
            {item.label}
          </Button>
          {index < displayItems.length - 1 && <ChevronRight className="h-4 w-4 text-gray-400 ml-2" />}
        </div>
      ))}
    </nav>
  );
}
