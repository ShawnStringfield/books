'use client';

import React from 'react';
import { useHighlights } from '@/app/hooks/highlights/useHighlights';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Loader2, Highlighter } from 'lucide-react';
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
      <div className="group rounded-lg border border-mono-subtle/40 bg-white p-2 shadow-sm transition-shadow hover:shadow-md h-[350px] flex flex-col justify-center">
        <div className="text-center space-y-4">
          <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto">
            <Highlighter className="w-6 h-6 text-blue-600" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Recent Highlights</h3>
            <p className="text-sm text-gray-600 max-w-xs mx-auto">No highlights yet. Start reading and highlighting to see them here!</p>
          </div>
        </div>
      </div>
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
