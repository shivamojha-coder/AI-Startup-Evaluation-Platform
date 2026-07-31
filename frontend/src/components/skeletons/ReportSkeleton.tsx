import React from 'react';
import { ReportHeaderSkeleton } from './ReportHeaderSkeleton';
import { ScorecardSkeleton } from './ScorecardSkeleton';
import { BreakdownCardSkeleton } from './BreakdownCardSkeleton';
import { ExecutiveSummarySkeleton } from './ExecutiveSummarySkeleton';
import { VerificationSkeleton } from './VerificationSkeleton';
import { QuestionsSkeleton } from './QuestionsSkeleton';
import { RiskAnalysisSkeleton } from './RiskAnalysisSkeleton';
import { Skeleton } from '../ui/skeleton';

export const ReportSkeleton: React.FC<{ isFounder?: boolean }> = ({ isFounder = false }) => {
  return (
    <div className="flex flex-1 bg-transparent text-[#FAFAFA] h-screen overflow-hidden selection:bg-[rgba(254,150,56,0.2)] selection:text-[#FE9638]">
      <div className="max-w-[1600px] w-full mx-auto flex flex-col lg:flex-row h-full">
        <div className="flex-1 w-full p-6 sm:p-10 lg:pr-6 space-y-8 overflow-y-auto custom-scrollbar h-full pb-32">
          
          <ReportHeaderSkeleton />
          
          <ScorecardSkeleton />

          <div className="rounded-3xl bg-[#141414] border border-[rgba(255,255,255,0.08)] p-6 sm:p-8 shadow-2xl space-y-6">
            <Skeleton className="h-7 w-48 mb-2" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <BreakdownCardSkeleton key={i} />
              ))}
            </div>
          </div>

          <ExecutiveSummarySkeleton />

          {!isFounder && <VerificationSkeleton />}

          {!isFounder && <QuestionsSkeleton />}

          <RiskAnalysisSkeleton />

        </div>
      </div>
    </div>
  );
};
