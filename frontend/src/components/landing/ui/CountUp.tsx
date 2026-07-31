"use client";

import React, { useEffect, useState, useRef } from "react";

export interface CountUpProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  separator?: string;
  className?: string;
}

export const CountUp: React.FC<CountUpProps> = ({
  end,
  duration = 1500,
  prefix = "",
  suffix = "",
  separator = ",",
  className = "inline-block font-extrabold text-[#FAFAFA]",
}) => {
  const [count, setCount] = useState<number>(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef<boolean>(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;
            const startTime = performance.now();
            const step = (currentTime: number) => {
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / duration, 1);
              // easeOutQuart
              const easeProgress = 1 - Math.pow(1 - progress, 4);
              const currentVal = Math.floor(easeProgress * end);
              setCount(currentVal);
              if (progress < 1) {
                requestAnimationFrame(step);
              } else {
                setCount(end);
              }
            };
            requestAnimationFrame(step);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [end, duration]);

  const formatNumber = (val: number) => {
    if (!separator) return val.toString();
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
  };

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatNumber(count)}
      {suffix}
    </span>
  );
};
