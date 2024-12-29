"use client";

import React from "react";
import { UserMenu } from "@/app/components/menus/UserMenu";
import { usePathname } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { HomeIcon, BookOpenIcon, PlusIcon } from "lucide-react";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "@/app/components/ui/sheet";
import { AddBookForm } from "@/app/components/book/AddBookForm";
import { useState } from "react";

interface NavAction {
  label: string;
  onClick?: () => void;
  variant?: "default" | "outline" | "ghost";
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
  "/dashboard": {
    actions: [
      {
        label: "Add Book",
        variant: "ghost",
        icon: <PlusIcon className="w-4 h-4" />,
      },
    ],
  },
  "/dashboard/library": {
    actions: [
      {
        label: "Add Book",
        variant: "ghost",
        icon: <PlusIcon className="w-4 h-4" />,
      },
    ],
  },
};

export default function TopNav() {
  const pathname = usePathname();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Find the most specific matching route, excluding book detail pages
  const currentRoute = Object.keys(routeConfig)
    .filter((route) => {
      // Don't match any routes if we're on a book detail page
      // Book detail pages follow the pattern: /dashboard/library/[id]
      const isBookDetailPage = /^\/dashboard\/library\/[^\/]+$/.test(pathname);
      if (isBookDetailPage) {
        return false;
      }
      return pathname.startsWith(route);
    })
    .sort((a, b) => b.length - a.length)[0];

  const config = currentRoute ? routeConfig[currentRoute] : null;
  const hasActions = config?.actions && config.actions.length > 0;

  return (
    <nav className="border-b bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-6">
            <Link
              href="/dashboard"
              className="text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="Go to Dashboard"
            >
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

          <div className="flex items-center space-x-3">
            {hasActions &&
              (config.actions as NavAction[]).map((action, index) => (
                <ActionButton
                  key={index}
                  action={action}
                  isSheetOpen={isSheetOpen}
                  setIsSheetOpen={setIsSheetOpen}
                />
              ))}
            <UserMenu />
          </div>
        </div>
      </div>
    </nav>
  );
}

// Extract action button logic to a separate component for better maintainability
interface ActionButtonProps {
  action: NavAction;
  isSheetOpen: boolean;
  setIsSheetOpen: (open: boolean) => void;
}

function ActionButton({
  action,
  isSheetOpen,
  setIsSheetOpen,
}: ActionButtonProps) {
  if (action.label === "Add Book") {
    return (
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          <Button
            variant={action.variant || "default"}
            size="sm"
            className="flex items-center space-x-1.5 text-sm py-1.5"
            aria-label={action.iconOnly ? action.label : undefined}
          >
            {action.icon && (
              <span className="bg-brand-subtle p-1 rounded-full hover:bg-mono-surface hover:text-white text-mono transition-colors">
                {action.icon}
              </span>
            )}
            {(!action.iconOnly || action.label === "Add Book") && (
              <span>{action.label}</span>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-full sm:max-w-xl">
          <AddBookForm
            onSuccess={() => setIsSheetOpen(false)}
            onCancel={() => setIsSheetOpen(false)}
          />
        </SheetContent>
      </Sheet>
    );
  }

  if (action.href) {
    return (
      <Link href={action.href}>
        <Button
          variant={action.variant || "default"}
          size="sm"
          className="flex items-center space-x-1.5 text-sm py-1.5"
          aria-label={action.iconOnly ? action.label : undefined}
        >
          {action.icon && action.label === "Add Book" && (
            <span className="bg-slate-300 p-1.5 rounded-full hover:bg-slate-600 hover:text-white text-slate-600 transition-colors">
              {action.icon}
            </span>
          )}
          {(!action.iconOnly || action.label === "Add Book") && (
            <span>{action.label}</span>
          )}
        </Button>
      </Link>
    );
  }

  return (
    <Button
      variant={action.variant || "default"}
      onClick={action.onClick}
      size="sm"
      className="flex items-center space-x-1.5 text-sm py-1.5"
      aria-label={action.iconOnly ? action.label : undefined}
    >
      {action.icon && action.label === "Add Book" && (
        <span className="bg-slate-300 p-1.5 rounded-full hover:bg-slate-600 hover:text-white text-slate-600 transition-colors">
          {action.icon}
        </span>
      )}
      {(!action.iconOnly || action.label === "Add Book") && (
        <span>{action.label}</span>
      )}
    </Button>
  );
}
