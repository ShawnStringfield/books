'use client';

import { useState, useLayoutEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';

export default function BooksPage() {
  const [mounted, setMounted] = useState(false);

  useLayoutEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div>Books</div>
      </div>
    </DashboardLayout>
  );
}
