/**
 * A breadcrumb navigation component that shows the current location in a hierarchical structure.
 *
 * @example Basic Usage:
 * ```tsx
 * import { Home, Users } from 'lucide-react';
 *
 * const breadcrumbItems = [
 *   { label: 'Home', path: '/dashboard', icon: <Home className="h-4 w-4" /> },
 *   { label: 'Users', path: '/dashboard/users', icon: <Users className="h-4 w-4" /> },
 *   { label: 'User Details', path: '/dashboard/users/123' }
 * ];
 *
 * <Breadcrumbs items={breadcrumbItems} />
 * ```
 *
 * @example Complete Dashboard Layout:
 * ```tsx
 * // app/(features)/dashboard/layout.tsx
 * import { Home, Users, Settings, FileText } from 'lucide-react';
 * import { Breadcrumbs } from './components/Breadcrumbs';
 *
 * export default function DashboardLayout({ children }) {
 *   // Define your breadcrumb items based on your routing structure
 *   const breadcrumbItems = [
 *     {
 *       label: 'Dashboard',
 *       path: '/dashboard',
 *       icon: <Home className="h-4 w-4" />
 *     },
 *     {
 *       label: 'Users',
 *       path: '/dashboard/users',
 *       icon: <Users className="h-4 w-4" />
 *     },
 *     {
 *       label: 'John Doe',  // Dynamic content
 *       path: '/dashboard/users/123',
 *       icon: <FileText className="h-4 w-4" />
 *     },
 *     {
 *       label: 'Settings',
 *       path: '/dashboard/users/123/settings',
 *       icon: <Settings className="h-4 w-4" />
 *     }
 *   ];
 *
 *   return (
 *     <div className="min-h-screen bg-gray-50">
 *       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 *         <Breadcrumbs items={breadcrumbItems} />
 *         {children}
 *       </div>
 *     </div>
 *   );
 * }
 * ```
 *
 * Features:
 * - Automatically hides the current page from the breadcrumb trail
 * - Supports optional icons for each breadcrumb item
 * - Accessible navigation with proper ARIA labels
 * - Responsive design with hover states
 * - Client-side navigation using Next.js router
 *
 * @note The component will automatically trim the breadcrumb trail to show only
 * the path up to the current page, excluding the current page itself.
 */

'use client';

import { ChevronRight } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { useRouter, usePathname } from 'next/navigation';

/**
 * Represents a single item in the breadcrumb trail
 */
interface BreadcrumbItem {
  /** The text to display for this breadcrumb */
  label: string;
  /** The route path this breadcrumb links to */
  path: string;
  /** Optional icon component to display before the label */
  icon?: React.ReactNode;
}

/**
 * Props for the Breadcrumbs component
 */
interface BreadcrumbsProps {
  /** Array of breadcrumb items to display in the navigation */
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
