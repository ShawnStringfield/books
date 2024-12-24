import { Button } from '@/app/components/ui/button';
import { useState, useCallback, useEffect } from 'react';
import { Highlighter, AlertCircle } from 'lucide-react';
import { useAddHighlight } from '@/app/hooks/highlights/useHighlights';
import { useAuth } from '@/contexts/AuthContext';
import type { BaseHighlight } from '@/app/stores/types';

interface AddHighlightFormProps {
  bookId: string;
  currentPage: number;
  onClose: () => void;
}

const AddHighlightForm = ({ bookId, currentPage, onClose }: AddHighlightFormProps) => {
  const [newHighlight, setNewHighlight] = useState('');
  const [error, setError] = useState<string | null>(null);
  const addHighlightMutation = useAddHighlight();
  const { user } = useAuth();

  // Log authentication state on mount and when it changes
  useEffect(() => {
    console.log('Auth state:', {
      isAuthenticated: !!user,
      userId: user?.uid,
      email: user?.email,
    });
  }, [user]);

  // Reset error when input changes
  useEffect(() => {
    if (error) setError(null);
  }, [newHighlight]);

  const handleAddHighlight = useCallback(async () => {
    try {
      if (!user) {
        console.error('No authenticated user found');
        setError('You must be logged in to add highlights');
        return;
      }

      if (!bookId) {
        console.error('No book ID provided');
        setError('Invalid book ID');
        return;
      }

      if (!newHighlight.trim()) {
        setError('Highlight text cannot be empty');
        return;
      }

      const highlightData: BaseHighlight = {
        bookId,
        text: newHighlight.trim(),
        page: currentPage || 0,
        isFavorite: false,
      };

      console.log('Attempting to add highlight:', {
        highlightData,
        userId: user.uid,
        currentPage,
      });

      setError(null);
      await addHighlightMutation.mutateAsync(highlightData);

      console.log('Highlight added successfully');
      setNewHighlight('');
      onClose();
    } catch (err) {
      console.error('Failed to add highlight:', {
        error: err,
        errorMessage: err instanceof Error ? err.message : 'Unknown error',
        errorStack: err instanceof Error ? err.stack : undefined,
      });
      setError(err instanceof Error ? err.message : 'Failed to add highlight. Please try again.');
    }
  }, [addHighlightMutation, bookId, currentPage, newHighlight, onClose, user]);

  // Log mutation state changes
  useEffect(() => {
    if (addHighlightMutation.isError) {
      console.error('Mutation error:', {
        error: addHighlightMutation.error,
        errorMessage: addHighlightMutation.error instanceof Error ? addHighlightMutation.error.message : 'Unknown error',
      });
    }
  }, [addHighlightMutation.isError, addHighlightMutation.error]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Highlighter className="w-5 h-5 text-slate-500" />
        <h2 className="text-lg font-semibold leading-tight text-slate-500">Add New Highlight</h2>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 text-sm bg-red-50 text-red-600 rounded-lg">
          <AlertCircle className="h-4 w-4" />
          <p>{error}</p>
        </div>
      )}

      <textarea
        value={newHighlight}
        onChange={(e) => setNewHighlight(e.target.value)}
        placeholder="Add a highlight from your current page..."
        className="w-full px-3 py-2 border rounded-lg min-h-[200px] text-[16px] focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0"
        aria-label="New highlight text"
        autoFocus={false}
      />
      <div className="flex gap-2">
        <Button variant="outline" onClick={onClose} className="flex-1" disabled={addHighlightMutation.isPending}>
          Cancel
        </Button>
        <Button
          onClick={handleAddHighlight}
          disabled={!newHighlight.trim() || addHighlightMutation.isPending}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
        >
          {addHighlightMutation.isPending ? 'Adding...' : 'Add Highlight'}
        </Button>
      </div>

      {addHighlightMutation.isError && (
        <div className="flex items-center gap-2 p-3 text-sm bg-red-50 text-red-600 rounded-lg mt-2">
          <AlertCircle className="h-4 w-4" />
          <p>Failed to add highlight: {addHighlightMutation.error instanceof Error ? addHighlightMutation.error.message : 'Unknown error'}</p>
        </div>
      )}
    </div>
  );
};

export default AddHighlightForm;
