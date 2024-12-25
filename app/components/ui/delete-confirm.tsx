import React from 'react';
import { Button } from '@/app/components/ui/button';
import { X } from 'lucide-react';

interface DeleteConfirmProps {
  title?: string;
  description?: string;
  onConfirm: () => void;
  onCancel: () => void;
  cancelText?: string;
  confirmText?: string;
  isLoading?: boolean;
}

export function DeleteConfirm({
  title = 'Delete this item?',
  description = 'This action cannot be undone.',
  onConfirm,
  onCancel,
  cancelText = 'Cancel',
  confirmText = 'Delete',
  isLoading = false,
}: DeleteConfirmProps) {
  return (
    <div className="absolute inset-0 bg-white/95 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="text-center space-y-4">
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        <p className="text-xs text-gray-500">{description}</p>
        <div className="flex items-center justify-center gap-2">
          <Button variant="outline" size="sm" onClick={onCancel} className="text-xs" disabled={isLoading}>
            {cancelText}
          </Button>
          <Button variant="destructive" size="sm" onClick={onConfirm} className="text-xs bg-red-500 hover:bg-red-600" disabled={isLoading}>
            {isLoading ? 'Deleting...' : confirmText}
          </Button>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
        onClick={onCancel}
        disabled={isLoading}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
