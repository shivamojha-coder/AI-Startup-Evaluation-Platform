import React from 'react';
import { Skeleton } from '../ui/skeleton';

export const VerificationSkeleton: React.FC = () => {
  return (
    <div className="rounded-3xl bg-[#141414] border border-[rgba(255,255,255,0.08)] p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#38BDF8]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <Skeleton className="h-7 w-48" /> {/* Title */}
      <Skeleton className="h-4 w-3/4 mb-6 max-w-md" /> {/* Description */}
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[#1C1C1C] p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex-1 w-full space-y-2">
                <Skeleton className="h-3 w-16" /> {/* Category */}
                <Skeleton className="h-4 w-full max-w-md" /> {/* Claim */}
                <Skeleton className="h-4 w-3/4 max-w-sm" />
              </div>
              <Skeleton className="shrink-0 rounded-xl h-8 w-24" /> {/* Button */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
