'use client';

import React from 'react';
import { useToggleFavorite } from '@/app/hooks/highlights/useHighlights';
import { useBook } from '@/app/hooks/books/useBooks';
import { Card, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Heart } from 'lucide-react';
import type { Highlight } from '@/app/stores/types';
import { formatDistanceToNow } from 'date-fns';

interface HighlightCardProps {
  highlight: Highlight;
}

export default function HighlightCard({ highlight }: HighlightCardProps) {
  const toggleFavorite = useToggleFavorite();
  const { data: book } = useBook(highlight.bookId);

  const handleToggleFavorite = () => {
    toggleFavorite.mutate({
      highlightId: highlight.id,
      isFavorite: !highlight.isFavorite,
    });
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <p className="text-sm text-gray-900 mb-2">{highlight.text}</p>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>{book?.title}</span>
              <span>•</span>
              <span>Page {highlight.page}</span>
              <span>•</span>
              <span>{formatDistanceToNow(new Date(highlight.createdAt), { addSuffix: true })}</span>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={handleToggleFavorite} className={highlight.isFavorite ? 'text-red-500' : 'text-gray-400'}>
            <Heart className="h-4 w-4" fill={highlight.isFavorite ? 'currentColor' : 'none'} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
