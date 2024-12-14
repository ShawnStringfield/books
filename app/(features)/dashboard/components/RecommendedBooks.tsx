import React from 'react';
import { Book } from '../types/books';

// Utility function to determine status color
const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'reading':
      return 'bg-blue-100 text-blue-800';
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'want to read':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

function BookDetails({ book }: { book: Book }) {
  return (
    <div className="space-y-4 p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold">About This Book</h3>

      {book.description && <p className="text-gray-600 text-sm">{book.description}</p>}

      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">Status:</span>
        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(book.status)}`}>{book.status}</span>
      </div>
    </div>
  );
}

export default BookDetails;
