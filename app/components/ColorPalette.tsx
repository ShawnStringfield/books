import React from 'react';

interface ColorBoxProps {
  colorClass: string;
  name: string;
  value: string;
}

const ColorBox: React.FC<ColorBoxProps> = ({ colorClass, name, value }) => (
  <div className="flex flex-col items-center">
    <div className={`w-24 h-24 rounded-lg shadow-md ${colorClass}`} aria-label={`Color sample for ${name}`} />
    <p className="mt-2 text-sm font-medium">{name}</p>
    <p className="text-xs text-gray-500">{value}</p>
  </div>
);

const ColorSection: React.FC<{ title: string; colors: Array<{ name: string; colorClass: string; value: string }> }> = ({ title, colors }) => (
  <div className="mb-12 last:mb-0">
    <h2 className="text-2xl font-heading font-bold mb-6">{title}</h2>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
      {colors.map((color) => (
        <ColorBox key={color.name} colorClass={color.colorClass} name={color.name} value={color.value} />
      ))}
    </div>
  </div>
);

export const ColorPalette: React.FC = () => {
  const baseColors = [
    { name: 'Background', colorClass: 'bg-background', value: 'hsl(var(--background))' },
    { name: 'Foreground', colorClass: 'bg-foreground', value: 'hsl(var(--foreground))' },
  ];

  const brandColors = [
    { name: 'Brand Fill', colorClass: 'bg-brand-fill', value: 'hsla(215, 33%, 95%, 1.0)' },
    { name: 'Brand Stroke Weak', colorClass: 'bg-brand-fillweak', value: 'hsla(215, 33%, 80%, 1.0)' },
    { name: 'Brand Stroke Strong', colorClass: 'bg-brand-fillstrong', value: 'hsla(215, 33%, 60%, 1.0)' },
    { name: 'Brand Text Weak', colorClass: 'bg-brand-textweak', value: 'hsla(215, 33%, 40%, 1.0)' },
    { name: 'Brand Text Strong', colorClass: 'bg-brand-textstrong', value: 'hsla(215, 33%, 25%, 1.0)' },
    { name: 'Brand Default', colorClass: 'bg-brand', value: 'hsla(204, 54%, 52%, 1.0)' },
  ];

  const componentColors = [
    { name: 'Card', colorClass: 'bg-card', value: 'hsl(var(--card))' },
    { name: 'Card Foreground', colorClass: 'bg-card-foreground', value: 'hsl(var(--card-foreground))' },
    { name: 'Popover', colorClass: 'bg-popover', value: 'hsl(var(--popover))' },
    { name: 'Popover Foreground', colorClass: 'bg-popover-foreground', value: 'hsl(var(--popover-foreground))' },
    { name: 'Primary', colorClass: 'bg-primary', value: 'hsl(var(--primary))' },
    { name: 'Primary Foreground', colorClass: 'bg-primary-foreground', value: 'hsl(var(--primary-foreground))' },
    { name: 'Secondary', colorClass: 'bg-secondary', value: 'hsl(var(--secondary))' },
    { name: 'Secondary Foreground', colorClass: 'bg-secondary-foreground', value: 'hsl(var(--secondary-foreground))' },
    { name: 'Muted', colorClass: 'bg-muted', value: 'hsl(var(--muted))' },
    { name: 'Muted Foreground', colorClass: 'bg-muted-foreground', value: 'hsl(var(--muted-foreground))' },
    { name: 'Accent', colorClass: 'bg-accent', value: 'hsl(var(--accent))' },
    { name: 'Accent Foreground', colorClass: 'bg-accent-foreground', value: 'hsl(var(--accent-foreground))' },
    { name: 'Destructive', colorClass: 'bg-destructive', value: 'hsl(var(--destructive))' },
    { name: 'Destructive Foreground', colorClass: 'bg-destructive-foreground', value: 'hsl(var(--destructive-foreground))' },
  ];

  const utilityColors = [
    { name: 'Border', colorClass: 'bg-border', value: 'hsl(var(--border))' },
    { name: 'Input', colorClass: 'bg-input', value: 'hsl(var(--input))' },
    { name: 'Ring', colorClass: 'bg-ring', value: 'hsl(var(--ring))' },
  ];

  const chartColors = [
    { name: 'Chart 1', colorClass: 'bg-chart-1', value: 'hsl(var(--chart-1))' },
    { name: 'Chart 2', colorClass: 'bg-chart-2', value: 'hsl(var(--chart-2))' },
    { name: 'Chart 3', colorClass: 'bg-chart-3', value: 'hsl(var(--chart-3))' },
    { name: 'Chart 4', colorClass: 'bg-chart-4', value: 'hsl(var(--chart-4))' },
    { name: 'Chart 5', colorClass: 'bg-chart-5', value: 'hsl(var(--chart-5))' },
  ];

  const sidebarColors = [
    { name: 'Sidebar', colorClass: 'bg-sidebar', value: 'hsl(var(--sidebar-background))' },
    { name: 'Sidebar Foreground', colorClass: 'bg-sidebar-foreground', value: 'hsl(var(--sidebar-foreground))' },
    { name: 'Sidebar Primary', colorClass: 'bg-sidebar-primary', value: 'hsl(var(--sidebar-primary))' },
    { name: 'Sidebar Primary Foreground', colorClass: 'bg-sidebar-primary-foreground', value: 'hsl(var(--sidebar-primary-foreground))' },
    { name: 'Sidebar Accent', colorClass: 'bg-sidebar-accent', value: 'hsl(var(--sidebar-accent))' },
    { name: 'Sidebar Accent Foreground', colorClass: 'bg-sidebar-accent-foreground', value: 'hsl(var(--sidebar-accent-foreground))' },
    { name: 'Sidebar Border', colorClass: 'bg-sidebar-border', value: 'hsl(var(--sidebar-border))' },
    { name: 'Sidebar Ring', colorClass: 'bg-sidebar-ring', value: 'hsl(var(--sidebar-ring))' },
  ];

  return (
    <section className="p-8 bg-white rounded-xl shadow-sm">
      <ColorSection title="Base Colors" colors={baseColors} />
      <ColorSection title="Brand Colors" colors={brandColors} />
      <ColorSection title="Component Colors" colors={componentColors} />
      <ColorSection title="Utility Colors" colors={utilityColors} />
      <ColorSection title="Chart Colors" colors={chartColors} />
      <ColorSection title="Sidebar Colors" colors={sidebarColors} />
    </section>
  );
};

export default ColorPalette;
