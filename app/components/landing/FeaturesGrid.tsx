import { FeatureCard } from "./FeatureCard";

interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface FeaturesGridProps {
  features: Feature[];
}

export function FeaturesGrid({ features }: FeaturesGridProps) {
  return (
    <div className="px-4">
      <div className="max-w-7xl mx-auto">
        <h3 className="text-xl font-bold text-center">
          Your Mindful Collection of Reading Insights
        </h3>
        <p className="text-xl  text-center mb-8">
          {`Great readers don't finish every book. They collect powerful ideas.`}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} isFirst={index === 0} />
          ))}
        </div>
      </div>
    </div>
  );
}
