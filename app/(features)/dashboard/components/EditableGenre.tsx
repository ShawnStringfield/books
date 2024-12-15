import { useState } from 'react';
import { Pencil } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { useDashboardStore } from '../stores/useDashboardStore';
import { useEditMode } from '../contexts/EditModeContext';

interface EditableGenreProps {
  genre: string;
  bookId: string;
}

const EditableGenre = ({ genre, bookId }: EditableGenreProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedGenre, setEditedGenre] = useState(genre);
  const updateBookGenre = useDashboardStore((state) => state.updateBookGenre);
  const { showEditControls } = useEditMode();

  const handleEdit = () => {
    setIsEditing(true);
    setEditedGenre(genre);
  };

  const handleCancel = () => {
    setEditedGenre(genre);
    setIsEditing(false);
  };

  const handleSave = () => {
    updateBookGenre(bookId, editedGenre);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <Input value={editedGenre} onChange={(e) => setEditedGenre(e.target.value)} className="h-7 text-sm" placeholder="Enter genre..." />
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleCancel} className="h-7 text-xs">
            Cancel
          </Button>
          <Button size="sm" onClick={handleSave} className="h-7 text-xs">
            Save
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      {showEditControls && (
        <button onClick={handleEdit} className="p-1 rounded-full hover:bg-gray-100 transition-colors" aria-label="Edit genre">
          <Pencil className="w-3 h-3 text-slate-400" />
        </button>
      )}
      <span>{genre || 'Unknown'}</span>
    </div>
  );
};

export default EditableGenre;
