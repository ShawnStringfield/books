import { BookOpen } from 'lucide-react';

interface ISBNProps {
  isbn?: string;
}

export const ISBN = ({ isbn }: ISBNProps) => {
  if (!isbn) return null;

  return (
    <div className="transition-all duration-300 hover:bg-white hover:shadow-md p-3 sm:p-4 rounded-lg">
      <h3 className="text-sm font-medium text-muted-foreground">ISBN</h3>
      <div className="flex items-center space-x-2">
        <BookOpen className="w-4 h-4 text-blue-600" />
        <span className="text-gray-800 font-medium">ISBN:</span>
        <span className="text-gray-600">{isbn}</span>
      </div>
    </div>
  );
};
