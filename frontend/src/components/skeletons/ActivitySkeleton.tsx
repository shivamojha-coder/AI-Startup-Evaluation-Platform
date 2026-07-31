import React from "react";
import { Skeleton } from "../ui/skeleton";

export const ActivitySkeleton: React.FC = () => {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex gap-3">
          <div className="mt-1">
            <Skeleton className="w-2 h-2 rounded-full" />
          </div>
          <div className="flex-1">
            <Skeleton className="h-3 w-[90%] mb-2" />
            <Skeleton className="h-2 w-24" />
          </div>
        </div>
      ))}
    </div>
  );
};
