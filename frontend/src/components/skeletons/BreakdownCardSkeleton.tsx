import React from 'react';
import { Skeleton } from '../ui/skeleton';

export const BreakdownCardSkeleton: React.FC = () => {
  return (
    <div className="rounded-2xl bg-[#1C1C1C] border border-[rgba(255,255,255,0.08)] p-4">
      <Skeleton className="h-3 w-16 mb-2" /> {/* Category */}
      <Skeleton className="h-8 w-24 mb-3" /> {/* Score */}
      <Skeleton className="h-3 w-full mb-1.5" />
      <Skeleton className="h-3 w-5/6" />
    </div>
  );
};
