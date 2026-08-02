import React from "react";

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

interface PaginationInfoProps extends React.HTMLAttributes<HTMLDivElement> {
  currentPage: number;
  limit: number;
  total: number;
}

export const PaginationInfo: React.FC<PaginationInfoProps> = ({
  currentPage,
  limit,
  total,
  className,
  ...props
}) => {
  if (total === 0) return null;

  const start = (currentPage - 1) * limit + 1;
  const end = Math.min(currentPage * limit, total);

  return (
    <div className={cn("text-[13px] md:text-[14px] text-[rgba(255,255,255,0.55)] font-medium tracking-wide", className)} {...props}>
      {total > limit ? (
        <>Showing <span className="text-[#F97316]">{start}–{end}</span> of <span className="text-[#F97316]">{total}</span> Startups</>
      ) : (
        <>Showing <span className="text-[#F97316]">{total}</span> of <span className="text-[#F97316]">{total}</span> Startups</>
      )}
    </div>
  );
};
