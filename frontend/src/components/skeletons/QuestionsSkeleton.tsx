import React from 'react';
import { Skeleton } from '../ui/skeleton';

export const QuestionsSkeleton: React.FC = () => {
  return (
    <div className="rounded-3xl bg-[#141414] border border-[rgba(255,255,255,0.08)] p-6 sm:p-8 shadow-2xl space-y-6">
      <Skeleton className="h-7 w-48" /> {/* Title */}
      <Skeleton className="h-4 w-3/4 mb-4 max-w-md" /> {/* Description */}
      <div className="space-y-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="rounded-xl bg-[#1C1C1C] border border-[rgba(255,255,255,0.08)] p-4">
            <Skeleton className="h-3 w-20 mb-2" /> {/* Category */}
            <Skeleton className="h-4 w-full" /> {/* Question text */}
          </div>
        ))}
      </div>
    </div>
  );
};
