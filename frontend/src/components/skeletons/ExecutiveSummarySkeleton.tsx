import React from 'react';
import { Skeleton } from '../ui/skeleton';

export const ExecutiveSummarySkeleton: React.FC = () => {
  const sections = [1, 2, 3, 4, 5]; // Problem, Solution, Market, Business Model, Traction
  return (
    <div className="rounded-3xl bg-[#141414] border border-[rgba(255,255,255,0.08)] p-6 sm:p-8 shadow-2xl space-y-6">
      <Skeleton className="h-7 w-56 mb-6" /> {/* Section Title */}
      <div className="space-y-6">
        {sections.map((i) => (
          <div key={i}>
            <Skeleton className="h-4 w-32 mb-2" />
            <div className="bg-[#1C1C1C] p-4 rounded-xl space-y-2">
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
