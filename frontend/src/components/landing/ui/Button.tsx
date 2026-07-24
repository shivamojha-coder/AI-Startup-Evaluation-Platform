import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "solid" | "ghost" | "secondary" | "primary" | "pill";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  underline?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "solid",
  size = "md",
  icon,
  underline = true,
  children,
  className = "",
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center font-semibold transition-all duration-200 ease-out focus:outline-none cursor-pointer";
  
  const sizeStyles = {
    sm: "h-9 px-4 text-sm rounded-lg",
    md: "h-[48px] px-7 text-base rounded-[10px]",
    lg: "h-[52px] px-8 text-lg rounded-xl",
  };

  if (variant === "ghost") {
    return (
      <button
        className={`relative inline-flex flex-col items-center justify-center bg-transparent text-[#FAFAFA] font-semibold py-3 px-3 hover:text-white group transition-all duration-200 ${className}`}
        {...props}
      >
        <span className="inline-flex items-center justify-center">
          {icon && <span className="mr-2 flex items-center justify-center">{icon}</span>}
          {children}
        </span>
        {underline && (
          <span className="mt-1.5 h-[2px] w-3/5 bg-[#FE9638] rounded-full group-hover:w-full group-hover:brightness-125 transition-all duration-200" />
        )}
      </button>
    );
  }

  const variantStyles: Record<string, string> = {
    solid: "bg-[#FE9638] text-[#0A0A0A] hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] shadow-[0_4px_16px_rgba(254,150,56,0.2)]",
    primary: "bg-[#FE9638] text-[#0A0A0A] hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] shadow-[0_4px_16px_rgba(254,150,56,0.2)]",
    pill: "bg-[#FAFAFA] text-[#0A0A0A] rounded-full hover:bg-white hover:scale-[1.02] active:scale-[0.98] shadow-sm",
    secondary: "bg-transparent text-[#9A9A9A] border border-[rgba(255,255,255,0.16)] hover:border-[#FE9638] hover:text-[#FAFAFA] rounded-[10px]",
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size] || sizeStyles.md} ${variantStyles[variant] || variantStyles.solid} ${className}`}
      {...props}
    >
      {icon && <span className="mr-2.5 flex items-center justify-center">{icon}</span>}
      {children}
    </button>
  );
};
