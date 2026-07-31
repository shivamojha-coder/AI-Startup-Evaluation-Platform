import React from "react";
import { Skeleton } from "../ui/skeleton";

export const StatsCardSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-[#141414] border border-[rgba(255,255,255,0.08)] rounded-2xl p-4 flex flex-col">
          <Skeleton className="h-3 w-24 mb-2" />
          <Skeleton className="h-8 w-16 mt-1" />
        </div>
      ))}
    </div>
  );
};
