import { useState } from 'react';

interface EditableGenreProps {
  genre: string;
  bookId: string;
  isEditing: boolean;
  onChange: (value: string) => void;
}

export default function EditableGenre({ genre, isEditing, onChange }: EditableGenreProps) {
  const [value, setValue] = useState(genre);

  const handleChange = (newValue: string) => {
    setValue(newValue);
    onChange(newValue);
  };

  return (
    <div className="inline-flex items-center gap-2">
      {isEditing ? (
        <input
          type="text"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          className="w-32 p-1 text-sm border rounded"
          placeholder="Add genre..."
        />
      ) : (
        <span>{genre || 'No genre'}</span>
      )}
    </div>
  );
}
