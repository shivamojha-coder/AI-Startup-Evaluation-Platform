import React from 'react';
import { Skeleton } from '../ui/skeleton';

export const RiskAnalysisSkeleton: React.FC = () => {
  return (
    <div className="rounded-3xl bg-[#141414] border border-[rgba(255,255,255,0.08)] p-6 sm:p-8 shadow-2xl space-y-6">
      <Skeleton className="h-7 w-40" /> {/* Title */}
      <div className="grid md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[#1C1C1C] p-4">
            <div className="flex items-center justify-between mb-3">
              <Skeleton className="h-3 w-16" /> {/* Category */}
              <Skeleton className="h-4 w-12 rounded-full" /> {/* Badge */}
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3.5 w-full" />
              <Skeleton className="h-3.5 w-11/12" />
              <Skeleton className="h-3.5 w-4/5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
