import React from 'react';
import { Skeleton } from '../ui/skeleton';

export const ReportHeaderSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
      <div>
        <Skeleton className="h-5 w-32 mb-4" /> {/* Back to Dealflow */}
        <Skeleton className="h-10 w-64 md:w-96" /> {/* Startup Name */}
        <div className="flex gap-2 mt-3">
          <Skeleton className="h-6 w-24 rounded-lg" /> {/* Industry Badge */}
          <Skeleton className="h-6 w-20 rounded-lg" /> {/* Stage Badge */}
        </div>
      </div>
      
      <div className="flex flex-wrap gap-3">
        <Skeleton className="h-10 w-32 rounded-xl" /> {/* Shortlist Button */}
        <Skeleton className="h-10 w-36 rounded-xl" /> {/* Meeting Button */}
      </div>
    </div>
  );
};
