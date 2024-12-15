import React from 'react';
import TopNav from './TopNav';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div>
      <TopNav />
      <main className="mt-8 md:p-4 w-full">{children}</main>
    </div>
  );
};

export default DashboardLayout;
