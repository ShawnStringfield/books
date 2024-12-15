import { useState } from 'react';

interface EditableBookDescriptionProps {
  description: string;
  bookId: string;
  isEditing: boolean;
  onChange: (value: string) => void;
}

export default function EditableBookDescription({ description, isEditing, onChange }: EditableBookDescriptionProps) {
  const [value, setValue] = useState(description);

  const handleChange = (newValue: string) => {
    setValue(newValue);
    onChange(newValue);
  };

  return (
    <div className="space-y-2">
      <h3 className="font-semibold">About</h3>
      {isEditing ? (
        <textarea
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          className="w-full min-h-[200px] p-2 border rounded-md"
          placeholder="Add a description..."
        />
      ) : (
        <p className="text-gray-600">{description || 'No description available'}</p>
      )}
    </div>
  );
}
