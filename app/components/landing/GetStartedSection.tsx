"use client";

import { Button } from "@/app/components/ui/button";
import { BackgroundBeams } from "@/app/components/ui/background-beams";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function GetStartedSection() {
  return (
    <div className="relative h-[20rem] flex flex-col items-center justify-center overflow-hidden  border border-gray-200 bg-white/10">
      <div className="relative z-10 text-center space-y-5 px-8">
        <h2 className="inline-block text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-mono-emphasis via-mono to-mono-emphasis leading-tight">
          Start Your Reading Journey
        </h2>
        <p className="text-lg md:text-xl  max-w-2xl mx-auto">
          Transform how you read, one highlight at a time.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/auth/login">
            <Button size="lg" className="group">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
      <BackgroundBeams className="opacity-40" />
    </div>
  );
}
