'use client';

import React from 'react';
import { useHighlights } from '@/app/hooks/highlights/useHighlights';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Loader2 } from 'lucide-react';
import { HighlightCard } from './HighlightCard';

interface RecentHighlightsProps {
  limit?: number;
}

export default function RecentHighlights({ limit = 5 }: RecentHighlightsProps) {
  const { data: highlights, isLoading } = useHighlights();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Highlights</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  const recentHighlights = highlights?.slice(0, limit) ?? [];

  if (recentHighlights.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Highlights</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">No highlights yet. Start reading and highlighting to see them here!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Highlights</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentHighlights.map((highlight) => (
          <HighlightCard key={highlight.id} highlight={highlight} />
        ))}
      </CardContent>
    </Card>
  );
}
