import React from 'react';
import { AppSidebar } from './AppSidebar';
import { SidebarProvider } from '@/app/components/ui/sidebar';
import TopNav from './TopNav';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div>
      <SidebarProvider defaultOpen={false}>
        <TopNav />
        <AppSidebar />
        <main className="mt-8 md:p-4 w-full">{children}</main>
      </SidebarProvider>
    </div>
  );
};

export default DashboardLayout;
