import React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { PaginationButton } from "./PaginationButton";

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

interface PaginationProps extends React.HTMLAttributes<HTMLElement> {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  className,
  ...props
}) => {
  // Generate the page numbers to display
  const paginationRange = React.useMemo(() => {
    const totalPageNumbers = siblingCount + 5; // siblingCount + first + last + current + 2x ellipses

    if (totalPageNumbers >= totalPages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalPages;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
      return [...leftRange, "...", totalPages];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = Array.from({ length: rightItemCount }, (_, i) => totalPages - rightItemCount + i + 1);
      return [firstPageIndex, "...", ...rightRange];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = Array.from(
        { length: rightSiblingIndex - leftSiblingIndex + 1 },
        (_, i) => leftSiblingIndex + i
      );
      return [firstPageIndex, "...", ...middleRange, "...", lastPageIndex];
    }
    
    return [];
  }, [currentPage, siblingCount, totalPages]);

  if (totalPages < 1) {
    return null;
  }

  return (
    <nav
      role="navigation"
      aria-label="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    >
      <ul className="flex flex-row items-center gap-2 flex-wrap justify-center">
        <li>
          <PaginationButton
            className="w-auto px-4 gap-2 mr-2"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Go to previous page"
          >
            <ChevronLeft className="h-4 w-4 transition-transform duration-220 group-hover:-translate-x-[2px]" />
            <span className="hidden sm:inline">Previous</span>
          </PaginationButton>
        </li>

        {paginationRange.map((page, index) => {
          if (page === "...") {
            return (
              <li key={`dots-${index}`}>
                <span className="flex h-10 min-w-[2.5rem] items-center justify-center text-[#666]">
                  <MoreHorizontal className="h-4 w-4" />
                </span>
              </li>
            );
          }
          return (
            <li key={page}>
              <PaginationButton
                active={currentPage === page}
                onClick={() => onPageChange(page as number)}
                aria-current={currentPage === page ? "page" : undefined}
              >
                {page}
              </PaginationButton>
            </li>
          );
        })}

        <li>
          <PaginationButton
            className="w-auto px-4 gap-2 ml-2"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Go to next page"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="h-4 w-4 transition-transform duration-220 group-hover:translate-x-[2px]" />
          </PaginationButton>
        </li>
      </ul>
    </nav>
  );
};
