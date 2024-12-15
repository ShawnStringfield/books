import { Home, LucideIcon } from 'lucide-react';

interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
}

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenuItem,
  SidebarMenu,
  SidebarMenuButton,
} from '@/app/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { BarChart2, Book, Settings } from 'lucide-react';

export function AppSidebar() {
  const NAV: NavItem[] = [
    { label: 'Home', path: '/dashboard', icon: Home },
    { label: 'Library', path: '/dashboard/library', icon: Book },
    { label: 'Statistics', path: '/dashboard/stats', icon: BarChart2 },
    { label: 'Settings', path: '/dashboard/settings', icon: Settings },
  ];

  return (
    <Sidebar side="left" collapsible="icon">
      <SidebarContent className="pt-16">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <motion.div
                    key={item.path}
                    whileHover={{ x: 5 }}
                    className={cn('w-full flex items-center space-x-2 rounded-lg mb-1', 'hover:bg-gray-100 transition-colors')}
                  >
                    <SidebarMenuButton asChild>
                      <a href={item.path}>
                        <item.icon />
                        <span>{item.label}</span>
                      </a>
                    </SidebarMenuButton>
                  </motion.div>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
