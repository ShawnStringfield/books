import { LucideIcon } from 'lucide-react';

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
import { BarChart2, Book, Settings, Users } from 'lucide-react';

export function AppSidebar() {
  const NAV: NavItem[] = [
    { label: 'Books', path: '/books', icon: Book },
    { label: 'Reading Groups', path: '/groups', icon: Users },
    { label: 'Statistics', path: '/stats', icon: BarChart2 },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <Sidebar side="left" collapsible="icon">
      <SidebarContent className="pt-16">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                {NAV.map((item) => (
                  <SidebarMenuItem key={item.label}>
                    <motion.button
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
                    </motion.button>
                  </SidebarMenuItem>
                ))}
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
