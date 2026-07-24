import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  hoverEffect = true,
  ...props
}) => {
  const baseStyles = "bg-[#141414] border border-[rgba(255,255,255,0.08)] rounded-2xl p-8 transition-all duration-200 ease-out text-[#FAFAFA]";
  const hoverStyles = hoverEffect
    ? "hover:shadow-[0_8px_24px_rgba(254,150,56,0.10)] hover:-translate-y-1 hover:border-[rgba(255,255,255,0.16)]"
    : "";

  return (
    <div className={`${baseStyles} ${hoverStyles} ${className}`} {...props}>
      {children}
    </div>
  );
};
