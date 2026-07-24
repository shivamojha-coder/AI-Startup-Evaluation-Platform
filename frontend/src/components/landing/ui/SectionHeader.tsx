import React from "react";

export interface SectionHeaderProps {
  eyebrow?: string;
  headline: React.ReactNode;
  subheadline?: React.ReactNode;
  centered?: boolean;
  dark?: boolean;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  eyebrow,
  headline,
  subheadline,
  centered = true,
  className = "",
}) => {
  return (
    <div className={`mb-16 ${centered ? "text-center max-w-3xl mx-auto" : "max-w-2xl"} ${className}`}>
      {eyebrow && (
        <div className="text-[12px] md:text-[13px] font-semibold tracking-widest uppercase mb-3 text-[#FE9638]">
          {eyebrow}
        </div>
      )}
      <h2 className="text-3xl sm:text-4xl md:text-[44px] font-bold leading-[1.15] tracking-[-0.01em] mb-4 text-[#FAFAFA]">
        {headline}
      </h2>
      {subheadline && (
        <p className="text-base md:text-lg font-normal leading-relaxed text-[#B5B5B5]">
          {subheadline}
        </p>
      )}
    </div>
  );
};
