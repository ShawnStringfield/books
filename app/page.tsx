'use client';

import { UserMenu } from '@/app/components/menus/UserMenu';

export default function Home() {
  return (
    <div className="w-full flex justify-center">
      <div className="w-[1200px] relative">
        <div className="absolute right-4 top-4">
          <UserMenu />
        </div>
      </div>
    </div>
  );
}
