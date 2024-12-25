export function BookDetailsSkeleton() {
  return (
    <div className="p-6 pb-12 max-w-4xl mx-auto space-y-8 animate-pulse">
      {/* Header */}
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded w-3/4" />
        <div className="h-6 bg-gray-200 rounded w-1/2" />
        <div className="h-4 bg-gray-200 rounded w-1/4" />
      </div>

      {/* Toolbar */}
      <div className="flex gap-2">
        <div className="h-8 bg-gray-200 rounded w-24" />
        <div className="h-8 bg-gray-200 rounded w-24" />
        <div className="h-8 bg-gray-200 rounded w-24" />
      </div>

      {/* Progress Bar */}
      <div className="h-2 bg-gray-200 rounded w-full" />

      {/* Description */}
      <div className="space-y-2">
        <div className="h-6 bg-gray-200 rounded w-1/4" />
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-3/4" />
        </div>
      </div>

      {/* Highlights */}
      <div className="space-y-2">
        <div className="h-6 bg-gray-200 rounded w-1/4" />
        <div className="space-y-4">
          <div className="h-24 bg-gray-200 rounded w-full" />
          <div className="h-24 bg-gray-200 rounded w-full" />
        </div>
      </div>

      {/* Progress Section */}
      <div className="space-y-2 border-t pt-8">
        <div className="h-6 bg-gray-200 rounded w-1/4" />
        <div className="h-4 bg-gray-200 rounded w-full" />
      </div>
    </div>
  );
}
