interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  isFirst?: boolean;
}

export function FeatureCard({ title, description, icon }: FeatureCardProps) {
  return (
    <div className="group relative bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
      <div className="p-8 relative">
        <div className="w-5 h-5 mb-4 text-mono">{icon}</div>
        <h3 className="text-lg leading-tight font-semibold mb-2">{title}</h3>
        <p className="leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
