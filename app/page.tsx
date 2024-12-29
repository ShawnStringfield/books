"use client";

import { HeroSection } from "./components/landing/HeroSection";
import { GetStartedFeatureCard } from "./components/landing/GetStartedFeatureCard";
import { FeatureCard } from "./components/landing/FeatureCard";
import { LiveBookDemo } from "./components/landing/LiveBookDemo";
import { BeliefComparison } from "./components/landing/BeliefComparison";
import { GetStartedSection } from "./components/landing/GetStartedSection";
import BetaBanner from "./components/ui/BetaBanner";
import {
  BookmarkPlus,
  LayoutDashboard,
  Lightbulb,
  Library,
  LineChart,
} from "lucide-react";
import { HomeHeader } from "./components/home/HomeHeader";

export default function Home() {
  const features = [
    {
      title: "Focused Highlight Collection",
      description:
        "Capture meaningful passages instantly with our streamlined interface - because one powerful insight can be worth an entire book.",
      icon: <BookmarkPlus className="w-full h-full stroke-[1.5]" />,
    },
    {
      title: "Active Learning Dashboard",
      description:
        "Transform reading from passive to active with a clean view of your current book, meaningful highlights, and focused progress tracking.",
      icon: <LayoutDashboard className="w-full h-full stroke-[1.5]" />,
    },
    {
      title: "Growing Knowledge Base",
      description:
        "Every highlight you save becomes part of your evolving collection - easily revisit and build upon your past readings to deepen your understanding over time.",
      icon: <Lightbulb className="w-full h-full stroke-[1.5]" />,
    },
    {
      title: "Current Reads Management",
      description:
        "Keep your active books organized in one place with quick-access progress updates and highlight capturing.",
      icon: <Library className="w-full h-full stroke-[1.5]" />,
    },
    {
      title: "Progress Without Pressure",
      description:
        "Update your reading journey with a simple interface that focuses on meaningful engagement rather than just completion.",
      icon: <LineChart className="w-full h-full stroke-[1.5]" />,
    },
  ];

  return (
    <main className="min-h-screen">
      <BetaBanner />
      <HomeHeader className="mt-16" />
      <HeroSection
        title="Your Reading Companion for Mindful Insights"
        subtitle="Read deeply. Capture meaningfully"
      />
      <div className="px-4">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-xl font-bold text-center">
            Your Mindful Collection of Reading Insights
          </h3>
          <p className="text-xl text-center mb-8">
            {`Great readers don't finish every book. They collect powerful ideas.`}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
            <GetStartedFeatureCard />
          </div>
        </div>
      </div>

      <div className="mt-16">
        <LiveBookDemo />
      </div>

      <div className="mt-16">
        <GetStartedSection />
      </div>
      <BeliefComparison />
    </main>
  );
}
