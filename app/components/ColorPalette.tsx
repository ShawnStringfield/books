import React from 'react';

interface ColorBoxProps {
  colorClass: string;
  name: string;
  value: string;
}

const ColorBox: React.FC<ColorBoxProps> = ({ colorClass, name, value }) => (
  <div className="flex flex-col items-center">
    <div className={`w-24 h-24 rounded-lg shadow-md ${colorClass}`} aria-label={`Color sample for ${name}`} />
    <p className="mt-2 text-xs font-medium">{name}</p>
    <p className="text-[12px] text-gray-500">{value}</p>
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
  const brandColors = [
    { name: 'Brand Surface', colorClass: 'bg-brand-surface', value: 'hsla(220, 100%, 97%, 1)' },
    { name: 'Brand Subtle', colorClass: 'bg-brand-subtle', value: 'hsla(220, 100%, 90%, 1)' },
    { name: 'Brand Muted', colorClass: 'bg-brand-muted', value: 'hsla(220, 100%, 80%, 1)' },
    { name: 'Brand Default', colorClass: 'bg-brand-default', value: 'hsla(220, 100%, 46%, 1)' },
    { name: 'Brand Emphasis', colorClass: 'bg-brand-emphasis', value: 'hsla(220, 100%, 37%, 1)' },
    { name: 'Brand Strong', colorClass: 'bg-brand-strong', value: 'hsla(220, 100%, 28%, 1)' },
  ];

  const monoColors = [
    { name: 'Mono Surface', colorClass: 'bg-mono-surface', value: 'hsla(210, 40%, 98%, 1)' },
    { name: 'Mono Divider', colorClass: 'bg-mono-divider', value: 'hsla(210, 40%, 96%, 1)' },
    { name: 'Mono Subtle', colorClass: 'bg-mono-subtle', value: 'hsla(215, 31%, 91%, 1)' },
    { name: 'Mono Muted', colorClass: 'bg-mono-muted', value: 'hsla(215, 25%, 84%, 1)' },
    { name: 'Mono Default', colorClass: 'bg-mono-default', value: 'hsla(215, 16%, 47%, 1)' },
    { name: 'Mono Emphasis', colorClass: 'bg-mono-emphasis', value: 'hsla(215, 25%, 27%, 1)' },
    { name: 'Mono Strong', colorClass: 'bg-mono-strong', value: 'hsla(217, 33%, 17%, 1)' },
  ];

  return (
    <section className="p-8 bg-white rounded-xl shadow-sm">
      <ColorSection title="Brand Colors" colors={brandColors} />
      <ColorSection title="Mono Colors" colors={monoColors} />
    </section>
  );
};

export default ColorPalette;
