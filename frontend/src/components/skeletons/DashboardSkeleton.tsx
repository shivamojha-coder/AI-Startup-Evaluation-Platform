import React from "react";
import { Skeleton } from "../ui/skeleton";
import { HeroSkeleton } from "./HeroSkeleton";
import { StatsCardSkeleton } from "./StatsCardSkeleton";
import { StartupCardSkeleton } from "./StartupCardSkeleton";
import { ActivitySkeleton } from "./ActivitySkeleton";

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="flex flex-1 flex-col bg-transparent p-6 sm:p-10 text-[#FAFAFA] min-h-screen relative w-full transition-opacity duration-500">
      <div className="mx-auto max-w-[1400px] w-full flex flex-col xl:flex-row gap-8 pb-20">
        
        {/* Main Content Area */}
        <div className="flex-1 space-y-8">
          
          {/* Hero & Stats */}
          <div>
            <HeroSkeleton />
            <StatsCardSkeleton />
          </div>

          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Skeleton className="h-[46px] w-full rounded-xl" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-[46px] w-[140px] rounded-xl" />
              <Skeleton className="h-[46px] w-[140px] rounded-xl" />
            </div>
          </div>

          {/* Startups Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <StartupCardSkeleton key={i} />
            ))}
          </div>
        </div>

        {/* Right Side Activity Panel */}
        <div className="xl:w-80 shrink-0 space-y-6 hidden xl:block">
          <div className="bg-[#141414] border border-[rgba(255,255,255,0.08)] rounded-2xl p-6 sticky top-24">
            <h3 className="font-bold text-[#FAFAFA] mb-4 text-lg border-b border-[rgba(255,255,255,0.05)] pb-3">
              <Skeleton className="h-6 w-32" />
            </h3>
            
            <ActivitySkeleton />

            <h3 className="font-bold text-[#FAFAFA] mb-4 mt-8 text-lg border-b border-[rgba(255,255,255,0.05)] pb-3">
              <Skeleton className="h-6 w-40" />
            </h3>
            
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-7 w-12 rounded-lg" />
              <Skeleton className="h-7 w-20 rounded-lg" />
              <Skeleton className="h-7 w-16 rounded-lg" />
              <Skeleton className="h-7 w-14 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
