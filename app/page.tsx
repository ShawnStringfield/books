"use client";

import { ColorPalette } from "@/app/components/ColorPalette";
import { HomeHeader } from "@/app/components/home/HomeHeader";

export default function Home() {
  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-[1200px]">
        <HomeHeader />
      </div>

      {/* Color Palette Section */}
      <div className="w-full max-w-[1200px] mt-8">
        <ColorPalette />
      </div>
    </div>
  );
}
