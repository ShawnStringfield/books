import { type ReactNode } from "react";
import DashboardLayout from "@/app/components/dashboard/DashboardLayout";
import { cn } from "@/app/utils/cn";

interface BookDetailsLayoutProps {
  children: ReactNode;
  className?: string;
}

export function BookDetailsLayout({
  children,
  className,
}: BookDetailsLayoutProps) {
  return (
    <DashboardLayout>
      <div className={cn("p-6 pb-12 max-w-4xl mx-auto space-y-8", className)}>
        {children}
      </div>
    </DashboardLayout>
  );
}
