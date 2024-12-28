interface Technology {
  name: string;
  description: string;
  logo: React.ReactNode;
}

interface TechnologiesSectionProps {
  technologies: Technology[];
}

export function TechnologiesSection({
  technologies,
}: TechnologiesSectionProps) {
  return (
    <div className="py-24 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">
          Built on a foundation of fast, production-grade tooling
        </h2>
        <p className="text-xl text-gray-600 text-center mb-16 max-w-3xl mx-auto">
          Leverage the power of React and the extensive Next.js ecosystem for
          your applications.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {technologies.map((tech, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-8 rounded-lg bg-white border border-gray-100 hover:border-gray-200 transition-all duration-200"
            >
              <div className="w-16 h-16 mb-6 flex items-center justify-center rounded-2xl bg-gradient-to-b from-white to-gray-50 ring-1 ring-gray-200/50">
                {tech.logo}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                {tech.name}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {tech.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
