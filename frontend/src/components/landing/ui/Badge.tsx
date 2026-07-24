import React from "react";

export interface BadgeProps {
  variant?: "brand" | "accent" | "success" | "warning" | "danger" | "neutral";
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = "brand",
  children,
  className = "",
}) => {
  const baseStyles = "inline-flex items-center px-3.5 py-1 rounded-full text-[13px] font-medium tracking-wide uppercase transition-all";

  const variantStyles: Record<string, string> = {
    brand: "bg-[rgba(254,150,56,0.12)] text-[#FE9638] border border-[#FE9638]/30",
    accent: "bg-[rgba(254,150,56,0.12)] text-[#FE9638] border border-[#FE9638]/30",
    success: "bg-[rgba(52,211,153,0.12)] text-[#34D399] border border-[#34D399]/30",
    warning: "bg-[rgba(251,191,36,0.12)] text-[#FBBF24] border border-[#FBBF24]/30",
    danger: "bg-[rgba(248,113,113,0.12)] text-[#F87171] border border-[#F87171]/30",
    neutral: "bg-[#141414] text-[#9A9A9A] border border-[rgba(255,255,255,0.08)]",
  };

  return (
    <span className={`${baseStyles} ${variantStyles[variant] || variantStyles.brand} ${className}`}>
      {children}
    </span>
  );
};
