import Link from "next/link";

interface HeroSectionProps {
  title: string;
  subtitle: string;
}

export function HeroSection({ title, subtitle }: HeroSectionProps) {
  return (
    <div className="text-center mb-48 mt-16">
      <h1 className="text-5xl md:text-6xl lg:text-6xl font-bold tracking-tight pb-8 p-16">
        {title}
      </h1>

      <p className="text-xl md:text-3xl mb-12">{subtitle}</p>

      <div className="">
        <Link
          href="/auth/login"
          className="px-8 py-3 bg-mono-strong text-white rounded-full font-medium hover:bg-mono transition-colors"
        >
          <span>Get Started</span>
        </Link>
      </div>
    </div>
  );
}
