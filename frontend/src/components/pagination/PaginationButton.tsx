import React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

interface PaginationButtonProps extends HTMLMotionProps<"button"> {
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
    <motion.button
      layout
      initial={false}
      animate={{ scale: active ? 1.05 : 1 }}
      whileHover={!disabled ? { scale: active ? 1.05 : 1.04 } : undefined}
      whileTap={!disabled ? { scale: 0.96 } : undefined}
      className={cn(
        "inline-flex h-10 min-w-[2.75rem] px-4 items-center justify-center rounded-xl border text-[13px] md:text-[14px] font-medium transition-colors duration-200 ease-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316] focus-visible:ring-offset-2 focus-visible:ring-offset-[#141414]",
        active
          ? "border-[#F97316] bg-[#F97316] text-white shadow-[0_0_12px_rgba(249,115,22,0.4)]"
          : "border-[rgba(255,255,255,0.08)] bg-transparent text-[rgba(255,255,255,0.65)]",
        !active && !disabled && "hover:border-[#F97316] hover:text-white hover:bg-[rgba(249,115,22,0.1)]",
        disabled && "opacity-40 cursor-not-allowed",
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  );
};
