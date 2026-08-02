import React from "react";

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

interface PaginationButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

export const PaginationButton: React.FC<PaginationButtonProps> = ({
  children,
  active,
  className,
  disabled,
  ...props
}) => {
  return (
    <button
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-md border text-sm font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#F97316]",
        active
          ? "border-[#F97316] bg-[#F97316] text-white"
          : "border-[rgba(255,255,255,0.08)] bg-transparent text-[#9A9A9A] hover:bg-[rgba(255,255,255,0.05)] hover:text-[#FAFAFA]",
        disabled && "pointer-events-none opacity-50",
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
