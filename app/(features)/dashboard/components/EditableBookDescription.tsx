import { useState } from 'react';
import { Pencil } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { cleanDescription } from '@/app/utils/textUtils';
import { useDashboardStore } from '../stores/useDashboardStore';

interface EditableBookDescriptionProps {
  description: string;
  bookId: string;
}

const EditableBookDescription = ({ description, bookId }: EditableBookDescriptionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState(description);
  const updateBookDescription = useDashboardStore((state) => state.updateBookDescription);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedDescription(description);
  };

  const handleCancel = () => {
    setEditedDescription(description);
    setIsEditing(false);
  };

  const handleSave = () => {
    updateBookDescription(bookId, editedDescription);
    setIsEditing(false);
  };

  return (
    <div className="">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-muted-foreground">About This Book</h3>
        <button onClick={handleEdit} className="p-1 rounded-full hover:bg-gray-100 transition-colors" aria-label="Edit description">
          <Pencil className="w-4 h-4 text-slate-400" />
        </button>
      </div>
      {isEditing ? (
        <div className="space-y-2">
          <textarea
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            className="w-full min-h-[200px] p-2 text-xs text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter book description..."
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={handleCancel} className="text-xs">
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave} className="text-xs">
              Save
            </Button>
          </div>
        </div>
      ) : (
        <p className="text-xs mt-1 text-gray-700 line-clamp-6 sm:line-clamp-none">{cleanDescription(description)}</p>
      )}
    </div>
  );
};

export default EditableBookDescription;
