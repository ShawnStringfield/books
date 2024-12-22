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
  const brandColors = [
    { name: 'Brand Lightest', colorClass: 'bg-brand-lightest', value: 'hsla(204, 54%, 95%, 1.0)' },
    { name: 'Brand Lighter', colorClass: 'bg-brand-lighter', value: 'hsla(204, 54%, 80%, 1.0)' },
    { name: 'Brand Light', colorClass: 'bg-brand-light', value: 'hsla(204, 54%, 65%, 1.0)' },
    { name: 'Brand Default', colorClass: 'bg-brand', value: 'hsla(204, 54%, 52%, 1.0)' },
    { name: 'Brand Dark', colorClass: 'bg-brand-dark', value: 'hsla(204, 54%, 35%, 1.0)' },
    { name: 'Brand Darkest', colorClass: 'bg-brand-darkest', value: 'hsla(204, 54%, 20%, 1.0)' },
  ];

  const slateDarkColors = [
    { name: 'Slate Lightest', colorClass: 'bg-slateDark-lightest', value: 'hsla(215, 33%, 95%, 1.0)' },
    { name: 'Slate Lighter', colorClass: 'bg-slateDark-lighter', value: 'hsla(215, 33%, 80%, 1.0)' },
    { name: 'Slate Light', colorClass: 'bg-slateDark-light', value: 'hsla(215, 33%, 60%, 1.0)' },
    { name: 'Slate Medium', colorClass: 'bg-slateDark-medium', value: 'hsla(215, 33%, 40%, 1.0)' },
    { name: 'Slate Dark', colorClass: 'bg-slateDark-dark', value: 'hsla(215, 33%, 25%, 1.0)' },
    { name: 'Slate Darkest', colorClass: 'bg-slateDark-darkest', value: 'hsla(215, 33%, 17%, 1.0)' },
  ];

  return (
    <section className="p-8 bg-white rounded-xl shadow-sm">
      <ColorSection title="Brand Color Palette" colors={brandColors} />
      <ColorSection title="Slate Dark Color Palette" colors={slateDarkColors} />
    </section>
  );
};

export default ColorPalette;
