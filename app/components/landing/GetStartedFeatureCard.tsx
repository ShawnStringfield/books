"use client";

import { BookmarkPlus } from "lucide-react";
import { BackgroundBeams } from "@/app/components/ui/background-beams";
import { cn } from "@/app/lib/utils";
import { useRouter } from "next/navigation";

interface GetStartedFeatureCardProps {
  className?: string;
}

export function GetStartedFeatureCard({
  className,
}: GetStartedFeatureCardProps) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push("/auth/login")}
      role="button"
      tabIndex={0}
      className={cn(
        "group relative rounded-lg border border-gray-800 bg-mono-strong hover:bg-gray-800 hover:border-gray-700 p-8 transition-all duration-200 overflow-hidden cursor-pointer",
        className
      )}
    >
      <div className="relative z-10">
        <div className="w-5 h-5 mb-4">
          <BookmarkPlus className="w-full h-full stroke-[1.5] text-mono-surface" />
        </div>
        <h3 className="text-lg leading-tight font-semibold mb-2 text-gray-50">
          Get Started Today
        </h3>
        <p className="leading-relaxed text-mono-subtle">
          Join our community of mindful readers and start building your
          collection of meaningful insights.
        </p>
      </div>

      <div className="absolute bottom-4 right-4 z-20">
        <div className="p-2 rounded-full bg-gray-800 group-hover:bg-gray-700 transition-colors">
          <svg
            className="w-4 h-4 text-gray-50"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
      </div>

      <BackgroundBeams className="opacity-100" />
    </div>
  );
}
