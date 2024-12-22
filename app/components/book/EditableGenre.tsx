import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { BookMarked } from 'lucide-react';

// Predefined list of genres from GenresStep
const GENRES = ['Fiction', 'Non-Fiction', 'Mystery', 'Science Fiction', 'Fantasy', 'Romance', 'Thriller', 'Biography', 'Self-Help'];

interface EditableGenreProps {
  genre: string;
  bookId: string;
  isEditing: boolean;
  onChange: (value: string) => void;
}

export default function EditableGenre({ genre, isEditing, onChange }: EditableGenreProps) {
  const [value, setValue] = useState(genre);

  // Update value when genre prop changes
  useEffect(() => {
    setValue(genre);
  }, [genre]);

  const handleChange = (newValue: string) => {
    setValue(newValue);
    onChange(newValue);
  };

  if (!isEditing) {
    return (
      <div className="inline-flex items-center gap-2 text-mono">
        <BookMarked className="h-4 w-4" />
        <span>{genre || 'No genre'}</span>
      </div>
    );
  }

  return (
    <Select value={value || undefined} onValueChange={handleChange}>
      <SelectTrigger className="w-[180px] bg-white">
        <SelectValue placeholder="Select genre">{value || 'Select genre'}</SelectValue>
      </SelectTrigger>
      <SelectContent className="bg-white">
        {GENRES.map((genreOption) => (
          <SelectItem key={genreOption} value={genreOption}>
            {genreOption}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
