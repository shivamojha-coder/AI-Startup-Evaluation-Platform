import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { CountUp } from "../landing/ui/CountUp";

interface ScoreRingProps {
  score: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
}

export const ScoreRing: React.FC<ScoreRingProps> = ({
  score,
  max = 100,
  size = 72,
  strokeWidth = 8,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const radius = (100 - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const targetOffset = circumference - (score / max) * circumference;

  return (
    <div 
      ref={ref} 
      className="flex flex-col items-center justify-center"
      role="img"
      aria-label={`AI Overall Score: ${score} out of ${max}`}
    >
      <div 
        className="relative flex items-center justify-center w-[64px] h-[64px] md:w-[68px] md:h-[68px] lg:w-[72px] lg:h-[72px]"
      >
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full -rotate-90 drop-shadow-[0_0_8px_rgba(249,115,22,0.35)]"
        >
          {/* Background Track */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="#2A2A2A"
            strokeWidth={strokeWidth}
          />
          {/* Animated Progress */}
          <motion.circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="#F97316"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={isInView ? { strokeDashoffset: targetOffset } : { strokeDashoffset: circumference }}
            transition={{ duration: 1, ease: "easeOut" }}
            strokeDasharray={circumference}
          />
        </svg>
        
        {/* Center Text */}
        <div className="absolute inset-0 flex items-center justify-center">
          {isInView && (
            <CountUp end={score} duration={1000} separator="" className="text-xl md:text-2xl font-black text-white" />
          )}
        </div>
      </div>
      
      {/* Label below the ring */}
      <span className="mt-2 block text-[10px] font-bold uppercase text-[#666]">
        Overall Score
      </span>
    </div>
  );
};
