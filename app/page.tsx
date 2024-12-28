"use client";

import { HeroSection } from "./components/landing/HeroSection";
import { FeaturesGrid } from "./components/landing/FeaturesGrid";
import { TechnologiesSection } from "./components/landing/TechnologiesSection";
import {
  Code,
  Globe,
  Cpu,
  BookmarkPlus,
  LayoutDashboard,
  Lightbulb,
  Library,
  LineChart,
} from "lucide-react";

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
    {
      title: "Get Started Today",
      description:
        "Join our community of mindful readers and start building your collection of meaningful insights.",
      icon: (
        <BookmarkPlus className="w-full h-full stroke-[1.5] text-mono-surface" />
      ),
      variant: "emphasis",
      onClick: () => (window.location.href = "/auth/login"),
      showArrow: true,
    },
  ];

  const technologies = [
    {
      name: "React",
      description: "The library for web and native user interfaces.",
      logo: <Code className="w-full h-full" />,
    },
    {
      name: "Turbopack",
      description:
        "Incremental bundler optimized for JavaScript and TypeScript.",
      logo: <Cpu className="w-full h-full" />,
    },
    {
      name: "Edge Runtime",
      description: "Deploy globally with Edge Functions and Middleware.",
      logo: <Globe className="w-full h-full" />,
    },
  ];

  return (
    <main className="min-h-screen">
      <HeroSection
        title="Your Reading Companion for Mindful Insights"
        subtitle="Read deeply. Capture meaningfully"
      />
      <FeaturesGrid features={features} />
      <TechnologiesSection technologies={technologies} />
    </main>
  );
}
