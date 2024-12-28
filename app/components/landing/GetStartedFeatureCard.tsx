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
        "group relative rounded-lg border border-gray-800 bg-gray-900 hover:bg-gray-900 hover:border-gray-700 p-8 transition-all duration-200 cursor-pointer min-h-[280px] overflow-hidden",
        className
      )}
    >
      <BackgroundBeams
        className="opacity-40"
        beamColor="#6344F5"
        beamOpacity={0.6}
      />
      <div className="relative z-10">
        <div className="w-5 h-5 mb-4">
          <BookmarkPlus className="w-full h-full stroke-[1.5] text-gray-100" />
        </div>
        <h3 className="text-lg leading-tight font-semibold mb-2 text-gray-50">
          Get Started Today
        </h3>
        <p className="leading-relaxed text-gray-300">
          Join our community of mindful readers and start building your
          collection of meaningful insights.
        </p>
        <div className="absolute bottom-8 right-8">
          <div className="p-2 rounded-full bg-gray-800/50 group-hover:bg-gray-700/50 transition-colors">
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
      </div>
    </div>
  );
}
