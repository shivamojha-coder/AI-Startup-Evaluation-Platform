import React from 'react';
import { Skeleton } from '../ui/skeleton';

export const ScorecardSkeleton: React.FC = () => {
  return (
    <div className="rounded-3xl bg-[#141414] border border-[rgba(255,255,255,0.08)] p-6 sm:p-8 shadow-2xl space-y-6 border-t-4 border-t-[#FE9638]">
      <Skeleton className="h-7 w-40" /> {/* Section Title */}
      <div className="flex items-center gap-6">
        <Skeleton className="h-16 w-32" /> {/* Overall Score */}
        <Skeleton className="h-10 w-full max-w-md" /> {/* Description */}
      </div>
    </div>
  );
};
