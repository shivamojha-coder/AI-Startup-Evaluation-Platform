import React from "react";
import { Skeleton } from "../ui/skeleton";
import { SpotlightCard } from "../SpotlightCard";

export const StartupCardSkeleton: React.FC = () => {
  return (
    <SpotlightCard className="bg-[#111111] border border-[rgba(255,255,255,0.05)] rounded-2xl p-6 flex flex-col h-full cursor-default">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <Skeleton className="w-16 h-16 rounded-xl" />
          <div>
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2 mb-6">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[90%]" />
        <Skeleton className="h-4 w-[80%]" />
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-6">
        <div className="flex flex-col gap-1">
          <Skeleton className="h-2 w-10" />
          <Skeleton className="h-6 w-24 rounded" />
        </div>
        <div className="flex flex-col gap-1">
          <Skeleton className="h-2 w-10" />
          <Skeleton className="h-6 w-20 rounded" />
        </div>
        <div className="flex flex-col gap-1">
          <Skeleton className="h-2 w-10" />
          <Skeleton className="h-6 w-16 rounded" />
        </div>
      </div>

      {/* Score Breakdown Grid */}
      <div className="mb-5 rounded-xl bg-[#1C1C1C] border border-[rgba(255,255,255,0.05)] p-4 flex flex-col gap-3">
        <div className="flex justify-between items-end border-b border-[rgba(255,255,255,0.05)] pb-3">
          <div>
            <Skeleton className="h-2 w-16 mb-2" />
            <Skeleton className="h-8 w-20" />
          </div>
          <div className="text-right flex flex-col items-end">
            <Skeleton className="h-2 w-12 mb-2" />
            <Skeleton className="h-6 w-24" />
          </div>
        </div>
        
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="flex flex-col items-center">
            <Skeleton className="h-2 w-10 mb-1" />
            <Skeleton className="h-4 w-6" />
          </div>
          <div className="flex flex-col items-center">
            <Skeleton className="h-2 w-10 mb-1" />
            <Skeleton className="h-4 w-6" />
          </div>
          <div className="flex flex-col items-center">
            <Skeleton className="h-2 w-10 mb-1" />
            <Skeleton className="h-4 w-6" />
          </div>
          <div className="flex flex-col items-center">
            <Skeleton className="h-2 w-10 mb-1" />
            <Skeleton className="h-4 w-6" />
          </div>
        </div>
      </div>
      
      {/* Verifications */}
      <div className="flex flex-wrap gap-2 mb-5">
        <Skeleton className="h-6 w-24 rounded" />
        <Skeleton className="h-6 w-28 rounded" />
      </div>

      {/* Bottom Action Row */}
      <div className="mt-auto pt-4 border-t border-[rgba(255,255,255,0.05)] flex items-center justify-between">
        <div className="flex gap-2">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <Skeleton className="h-10 w-28 rounded-lg" />
        </div>
        <Skeleton className="h-6 w-24" />
      </div>
    </SpotlightCard>
  );
};
