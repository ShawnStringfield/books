import React from 'react';
import TopNav from './TopNav';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const DashboardLayout = ({ children, title }: DashboardLayoutProps) => {
  return (
    <div>
      <TopNav title={title} />
      <main className="mt-8 md:p-4 w-full">{children}</main>
    </div>
  );
};

export default DashboardLayout;
