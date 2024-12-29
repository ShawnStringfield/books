"use client";

import { FC } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/app/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/components/ui/avatar";
import { useAuth } from "@/app/contexts/AuthContext";
import { useRouter } from "next/navigation";

interface UserMenuProps {
  size?: number;
}

export const UserMenu: FC<UserMenuProps> = ({ size = 40 }) => {
  const { user, logout } = useAuth();
  const router = useRouter();

  // Get the Google provider data (first provider)
  const googleData = user?.providerData?.[0];

  // Debug user object
  console.log("Auth Data:", {
    user,
    googleData,
    mainEmail: user?.email,
    providerEmail: googleData?.email,
    mainPhoto: user?.photoURL,
    providerPhoto: googleData?.photoURL,
  });

  // Get user data from provider data if available, fallback to user object
  const displayName =
    googleData?.displayName ||
    user?.displayName ||
    user?.email?.split("@")[0] ||
    "User";
  const email = googleData?.email || user?.email || "";
  const photoURL = googleData?.photoURL || user?.photoURL || "";
  const userInitial = (displayName[0] || "U").toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="focus:outline-none cursor-pointer"
        asChild
      >
        <Avatar style={{ width: `${size}px`, height: `${size}px` }}>
          {photoURL ? (
            <AvatarImage
              src={photoURL}
              alt={displayName}
              className="object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <AvatarFallback className="bg-primary text-primary-foreground">
              {userInitial}
            </AvatarFallback>
          )}
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{displayName}</p>
            {email && (
              <p className="text-xs text-muted-foreground truncate">{email}</p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {user && (
          <DropdownMenuItem onClick={() => router.push("/dashboard")}>
            Dashboard
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={() => router.push("/dashboard/settings")}>
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
