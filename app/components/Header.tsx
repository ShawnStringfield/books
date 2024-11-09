'use client';

import { UserMenu } from './UserMenu';

export function Header() {
  return (
    <header className="flex justify-center">
      <div className="mx-auto px-4 py-4">
        <UserMenu />
      </div>
    </header>
  );
}
