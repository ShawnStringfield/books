import React from 'react';
import TopNav from '@/app/(features)/dashboard/components/TopNav';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <TopNav />
      <main>{children}</main>
    </div>
  );
}
