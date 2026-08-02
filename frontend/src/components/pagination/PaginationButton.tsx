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
        "group relative inline-flex h-10 min-w-[2.5rem] items-center justify-center rounded-xl border text-sm font-semibold transition-all duration-200 ease-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316] focus-visible:ring-offset-2 focus-visible:ring-offset-[#141414]",
        active
          ? "border-[#F97316] bg-[#F97316] text-white shadow-[0_0_12px_rgba(249,115,22,0.4)] scale-[1.03]"
          : "border-[rgba(255,255,255,0.08)] bg-[#1A1A1A] text-[#FAFAFA] hover:border-[#F97316] hover:text-white hover:-translate-y-[2px] hover:shadow-[0_4px_12px_rgba(249,115,22,0.15)]",
        disabled && "pointer-events-none opacity-40 hover:transform-none hover:shadow-none hover:border-[rgba(255,255,255,0.08)]",
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
