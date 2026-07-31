import React from "react";
import { Skeleton } from "../ui/skeleton";

export const HeroSkeleton: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight flex items-center gap-2 mb-2">
        <Skeleton className="h-10 w-64" />
      </h1>
      <p className="mt-2 text-sm">
        <Skeleton className="h-5 w-80" />
      </p>
    </div>
  );
};
