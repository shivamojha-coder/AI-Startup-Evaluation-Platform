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
    <div className={cn("text-sm text-[#9A9A9A]", className)} {...props}>
      Showing <span className="font-medium text-[#FAFAFA]">{start}</span> to <span className="font-medium text-[#FAFAFA]">{end}</span> of{" "}
      <span className="font-medium text-[#FAFAFA]">{total}</span> startups
    </div>
  );
};
