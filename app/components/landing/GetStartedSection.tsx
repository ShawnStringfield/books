"use client";

import { Button } from "@/app/components/ui/button";
import { BackgroundBeams } from "@/app/components/ui/background-beams";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function GetStartedSection() {
  return (
    <div className="relative h-[40rem] flex flex-col items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-white/10">
      <div className="relative z-10 text-center space-y-5 px-8">
        <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 to-neutral-900">
          Start Your Reading Journey
        </h2>
        <p className="text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto">
          Join thousands of readers who use our platform to capture and organize
          their reading insights. Transform your reading experience today.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/auth/login">
            <Button size="lg" className="group">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link href="/docs">
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </Link>
        </div>
      </div>
      <BackgroundBeams className="opacity-40" />
    </div>
  );
}
