'use client';

import { UserMenu } from '@/app/components/menus/UserMenu';
import { ColorPalette } from '@/app/components/ColorPalette';

export default function Home() {
  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-[1200px] relative">
        <div className="absolute right-4 top-4">
          <UserMenu />
        </div>
      </div>

      {/* Color Palette Section */}
      <div className="w-full max-w-[1200px] mt-8">
        <ColorPalette />
      </div>
    </div>
  );
}
